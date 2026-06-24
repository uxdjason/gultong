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

    // 2. 확장 및 인사이트 생성 (LLM)
    const expansion = await expandKeyword(seed, claudeKey, geminiKey);
    const relatedList = expansion.result.related.slice(0, body.options?.relatedCount ?? 8);
    const aiInsight = expansion.result.aiInsight;

    // 3. 지표 조회 (MVP: LLM 추정)
    const keywordsToFetch = [seed, ...relatedList.map(r => r.keyword)];
    const metricsMap = await fetchMetrics(keywordsToFetch, claudeKey, geminiKey);

    // 4. 스코어링 및 결과 조합
    const createKeywordScore = (kw: string, intent: Intent): KeywordScore => {
      const m = metricsMap[kw] || {
        searchVolume: 1000,
        competition: '보통',
        trendDirection: '유지',
        trendScore: 50
      };

      const writabilityScore = calculateWritability({ ...m, intent });
      const compRatio = m.competition === '낮음' ? 30 : m.competition === '보통' ? 60 : 90;
      const totalScore = calculateTotalScore(writabilityScore, m.trendScore, compRatio);
      const badge = assignBadge(m);

      return {
        keyword: kw,
        searchVolume: m.searchVolume,
        searchVolumePc: Math.round(m.searchVolume * 0.3),
        searchVolumeMobile: Math.round(m.searchVolume * 0.7),
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
        source: 'estimated', // MVP
        fetchedAt: new Date().toISOString()
      };
    };

    const primaryScore = createKeywordScore(seed, 'info'); // Seed는 기본 info로 잡되 aiInsight로 커버
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
