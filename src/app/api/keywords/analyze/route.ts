import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeKeywordsRequest, AnalyzeKeywordsResponse, KeywordScore, KeywordSource, Intent } from '@/lib/keyword/types';
import { expandKeyword } from '@/lib/keyword/expander';
import { fetchMetrics } from '@/lib/keyword/datasource';
import { calculateWritability, calculateTotalScore, assignBadge } from '@/lib/keyword/scorer';
import { getCachedAnalysis, setCachedAnalysis } from '@/lib/keyword/cache';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AnalyzeKeywordsRequest;
    const seed = body.seedKeyword?.trim();
    if (!seed) {
      return NextResponse.json({ error: 'seedKeyword is required' }, { status: 400 });
    }

    // 1. 캐시 확인
    const cached = await getCachedAnalysis(seed);
    if (cached) {
      return NextResponse.json({ ...cached, creditsUsed: 0 }); // 캐시 적중 시 크레딧 미차감
    }

    const claudeKey = process.env.CLAUDE_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const naverSaCustomerId = process.env.NAVER_SA_CUSTOMER_ID;
    const naverSaAccessLicence = process.env.NAVER_SA_ACCESS_LICENCE;
    const naverSaSecretKey = process.env.NAVER_SA_SECRET_KEY;
    const naverClientId = process.env.NAVER_CLIENT_ID;
    const naverClientSecret = process.env.NAVER_CLIENT_SECRET;

    // 2. Data-Driven 선(先) 데이터 확보 로직 (Naver API)
    let candidatesText = '';
    let preFetchedMetrics: Record<string, any> = {};

    if (naverSaCustomerId && naverSaAccessLicence && naverSaSecretKey && naverClientId && naverClientSecret) {
      try {
        const { fetchNaverSaMetrics, fetchNaverDatalabTrend } = await import('@/lib/keyword/datasource');
        const saResults = await fetchNaverSaMetrics([seed], naverSaCustomerId, naverSaAccessLicence, naverSaSecretKey);

        // 시드 키워드 제외하고 후보군 추출
        const relatedKeys = Object.keys(saResults).filter(k => k !== seed);

        // 임시 스코어링으로 Top 20 추출 (trend=50 가정)
        const scoredCandidates = relatedKeys.map(kw => {
          const m = saResults[kw];
          const tempScore = calculateWritability({ ...m, trendDirection: '유지', trendScore: 50, intent: 'info' });
          return { kw, m, tempScore };
        });

        // 점수 높은 순 정렬, 상위 20개 추출
        scoredCandidates.sort((a, b) => b.tempScore - a.tempScore);
        const top20 = scoredCandidates.slice(0, 20).map(c => c.kw);

        // Top 20 + seed 에 대해 트렌드 데이터 조회
        const keywordsToFetchTrend = [seed, ...top20];
        const datalabResults = await fetchNaverDatalabTrend(keywordsToFetchTrend, naverClientId, naverClientSecret);

        // preFetchedMetrics 조립
        for (const kw of keywordsToFetchTrend) {
          if (saResults[kw] && saResults[kw].searchVolume > 10) {
            const sa = saResults[kw];
            const dl = datalabResults[kw] || { trendScore: 50, trendDirection: '유지' };
            preFetchedMetrics[kw] = { ...sa, ...dl, source: 'naver' };
          }
        }

        // LLM에게 전달할 candidatesText 생성
        candidatesText = top20.map(kw => {
          const m = preFetchedMetrics[kw] || { searchVolume: 10, competition: '보통', trendScore: 50, trendDirection: '유지' };
          return `- ${kw} (검색량: ${m.searchVolume}, 경쟁도: ${m.competition})`;
        }).join('\n');

      } catch (err) {
        console.warn('[route] Data-driven pre-fetch failed:', err);
      }
    }

    // 3. 확장 및 인사이트 생성 (LLM 큐레이션)
    const expansion = await expandKeyword(seed, candidatesText, claudeKey, geminiKey);
    const relatedList = expansion.result.related.slice(0, body.options?.relatedCount ?? 8);
    const aiInsight = expansion.result.aiInsight;

    // 4. 지표 조회 보완 (LLM이 후보군 외의 단어를 선택했거나 Pre-fetch 실패 시)
    const keywordsToFetch = [seed, ...relatedList.map(r => r.keyword)].filter(k => !preFetchedMetrics[k]);
    if (keywordsToFetch.length > 0) {
      const extraMetrics = await fetchMetrics(keywordsToFetch, {
        claudeApiKey: claudeKey,
        geminiApiKey: geminiKey,
        naverSaCustomerId,
        naverSaAccessLicence,
        naverSaSecretKey,
        naverClientId,
        naverClientSecret
      });
      preFetchedMetrics = { ...preFetchedMetrics, ...extraMetrics };
    }

    // 5. 스코어링 및 결과 조합
    const createKeywordScore = (kw: string, intent: Intent): KeywordScore => {
      const m = preFetchedMetrics[kw] || {
        searchVolume: 10,
        searchVolumePc: 5,
        searchVolumeMobile: 5,
        competition: '보통',
        trendDirection: '유지',
        trendScore: 50,
        source: 'estimated'
      };

      const writabilityScore = calculateWritability({ ...m, intent });
      const compRatio = m.competition === '낮음' ? 30 : m.competition === '보통' ? 60 : 90;
      const totalScore = calculateTotalScore(writabilityScore, m.trendScore, compRatio);
      const badge = assignBadge(m);

      return {
        keyword: kw,
        searchVolume: m.searchVolume,
        searchVolumePc: m.searchVolumePc ?? Math.round(m.searchVolume * 0.3),
        searchVolumeMobile: m.searchVolumeMobile ?? Math.round(m.searchVolume * 0.7),
        documentVolume: Math.round(m.searchVolume * (compRatio / 100)),
        competition: m.competition,
        competitionRatio: compRatio,
        trendDirection: m.trendDirection,
        trendScore: m.trendScore,
        intent,
        writabilityScore,
        totalScore,
        badge,
        aiInsight: kw === seed ? aiInsight : '',
        relatedKeywords: kw === seed ? relatedList.map(r => r.keyword) : [],
        source: m.source,
        fetchedAt: new Date().toISOString()
      };
    };

    const primaryScore = createKeywordScore(seed, expansion.result.seedIntent || 'info');

    if (primaryScore.source === 'estimated') {
      const estimatedWarning = `\n\n📌 수익화 전략: 이 키워드는 광고 입찰 데이터가 제공되지 않아 AI가 화제성을 바탕으로 유추한 추정치입니다. 이러한 정보/이슈성 키워드는 개별 클릭 단가(CPC)는 낮을 수 있으나, 충분한 검색 트래픽이 발생하는 키워드라면 방문자 수 기반의 수익 전략에는 알맞을 수 있습니다.`;
      primaryScore.aiInsight += estimatedWarning;
    }

    if (primaryScore.writabilityScore < 50) {
      const warningText = `\n\n📌 팁: 현재 분석 결과 이 키워드의 종합 글쓰기 점수는 ${primaryScore.writabilityScore}점으로 다소 낮게 평가되었습니다. 검색량이 부족하거나 경쟁이 치열할 수 있으므로, 단독 키워드보다는 아래 추천되는 연관 키워드를 함께 활용하는 전략을 권장합니다.`;
      primaryScore.aiInsight += warningText;
    }

    const relatedScores = relatedList.map(r => createKeywordScore(r.keyword, r.intent));

    const responseData: AnalyzeKeywordsResponse = {
      primary: primaryScore,
      related: relatedScores,
      creditsUsed: 1
    };

    // 5. 캐시 저장
    await setCachedAnalysis(seed, responseData);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('[Keyword API Error]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : '알 수 없는 오류' }, { status: 500 });
  }
}
