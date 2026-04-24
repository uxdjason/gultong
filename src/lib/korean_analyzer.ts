/**
 * korean_analyzer.ts
 * 글통 자체 한국어 AI 텍스트 정량 분석 엔진
 *
 * 이 모듈은 순수 TypeScript로 동작하며 외부 AI API를 사용하지 않습니다.
 * 텍스트의 수학적/구조적 특성을 정량화하여 LLM의 최종 판단을 위한
 * 신뢰도 높은 1차 데이터를 생성합니다.
 */

import { ALL_PATTERNS } from './ai_smell_dictionary';

// =====================
// 타입 정의
// =====================

export interface AnalyzerResult {
  textLength: number;                    // 전체 글자 수
  sentenceCount: number;                 // 문장 수
  avgSentenceLength: number;             // 평균 문장 길이

  // 핵심 지표 1: 문장 호흡 분산도 (높을수록 인간적, 0~1)
  burstinessScore: number;

  // 핵심 지표 2: AI 어휘 밀도 (높을수록 AI적, 0~1)
  aiVocabularyDensity: number;

  // 핵심 지표 3: 구조적 기계성 (높을수록 AI적, 0~1)
  structuralRigidity: number;

  // 핵심 지표 4: 반복 접속 어구 밀도 (높을수록 AI적, 0~1)
  conjunctionDensity: number;

  // 탐지된 AI 어휘 목록 (LLM에 전달)
  detectedAiKeywords: string[];

  // 카테고리별 탐지 횟수
  categoryHits: Record<string, number>;

  // 종합 AI 의심 지수 (0~1, 높을수록 AI 의심)
  compositeSuspicionIndex: number;
}

// =====================
// 핵심 알고리즘 1: 문장 호흡 분산도 (Burstiness)
// =====================

/**
 * 문장 길이의 분산도를 계산합니다.
 * AI는 균일한 문장 길이를, 인간은 큰 편차를 보입니다.
 *
 * @returns 0~1 사이의 값. 높을수록 인간적(분산이 큼)
 */
function calculateBurstiness(text: string): { score: number; lengths: number[]; avg: number } {
  const rawSentences = text
    .split(/[.?!。？！\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  if (rawSentences.length < 2) {
    return { score: 0.5, lengths: [], avg: 0 };
  }

  const lengths = rawSentences.map(s => s.length);
  const n = lengths.length;
  const mean = lengths.reduce((sum, l) => sum + l, 0) / n;
  const variance = lengths.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 0;

  // CV 0.8 이상이면 매우 인간적(score=1.0)
  const normalizedScore = Math.min(cv / 0.8, 1.0);

  return { score: normalizedScore, lengths, avg: mean };
}

// =====================
// 핵심 알고리즘 2: AI 어휘 밀도 분석 (Lexical Analysis)
// =====================

interface LexicalResult {
  density: number;
  detectedKeywords: string[];
  categoryHits: Record<string, number>;
  weightedHitCount: number;
}

/**
 * AI 냄새 사전의 패턴을 기반으로 어휘 밀도를 계산합니다.
 *
 * [핵심 수정] 분모를 wordCount 대신 절대 기준값(15)으로 변경.
 * 이유: wordCount 기반 정규화는 긴 텍스트(1500단어+)에서
 * 수십 개의 AI 패턴이 발견되어도 밀도가 0.01로 계산되는 문제가 있었음.
 * 15 weighted hits = density 1.0 (명백한 AI 수준)
 * 5 weighted hits = density 0.33 (약간 의심)
 */
function analyzeLexicalDensity(text: string, genre: string): LexicalResult {
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount === 0) return { density: 0, detectedKeywords: [], categoryHits: {}, weightedHitCount: 0 };

  let weightedHitCount = 0;
  const detectedKeywords: string[] = [];
  const categoryHits: Record<string, number> = {};

  for (const patternDef of ALL_PATTERNS) {
    if (patternDef.ignoreInGenres && patternDef.ignoreInGenres.includes(genre)) {
      continue; // 해당 장르에서는 무시
    }

    const regex = new RegExp(patternDef.pattern.source, patternDef.pattern.flags);
    const matches = text.match(regex);

    if (matches && matches.length > 0) {
      const hitMultiplier = 1 + Math.log(matches.length);
      weightedHitCount += patternDef.weight * hitMultiplier;

      if (!detectedKeywords.includes(patternDef.label)) {
        detectedKeywords.push(patternDef.label);
      }

      categoryHits[patternDef.category] = (categoryHits[patternDef.category] || 0) + matches.length;
    }
  }

  // 절대 기준값 정규화: 15 hits = density 1.0
  const density = Math.min(weightedHitCount / 15, 1.0);

  return { density, detectedKeywords, categoryHits, weightedHitCount };
}

// =====================
// 핵심 알고리즘 3: 구조적 기계성 (Structural Rigidity)
// =====================

/**
 * 소제목, 리스트 기호, 번호 매기기 등 AI 특유의 구조적 패턴을 탐지합니다.
 *
 * [핵심 추가] 한국어 콜론형 목록('연어: 오메가-3의...') 탐지 추가.
 */
function calculateStructuralRigidity(text: string): number {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return 0;

  let markerCount = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    const isMarker =
      /^#{1,6}\s/.test(trimmed) ||                     // 마크다운 소제목
      /^[-*•]\s/.test(trimmed) ||                      // 리스트 기호
      /^\d+[.)]\s/.test(trimmed) ||                    // 번호 매기기
      /^[가나다라마바사아자차카타파하][.)\s]/.test(trimmed) || // 한글 번호
      /^(첫째|둘째|셋째|넷째|다섯째)[,，\s]/.test(trimmed) ||
      /^(첫\s*번째|두\s*번째|세\s*번째)[,，\s]/.test(trimmed) ||
      /^\[.*\]/.test(trimmed) ||                       // 마크다운 링크/배지
      /^[가-힣]{1,10}:\s/.test(trimmed);               // 콜론형 한국어 목록 (연어: 설명...)

    if (isMarker) markerCount++;
  }

  const ratio = markerCount / lines.length;
  return Math.min(ratio / 0.3, 1.0);
}

// =====================
// 핵심 알고리즘 4: 접속어 과잉 밀도 (Conjunction Density)
// =====================

/**
 * AI가 자주 남용하는 접속 부사의 밀도를 계산합니다.
 *
 * [핵심 수정] 임계값을 5/100단어 → 1.5/100단어로 낮춤.
 * AI 텍스트는 보통 100단어당 1~2개의 접속어를 사용하는데
 * 기존 임계값(5/100)이 너무 높아 모두 "이상 없음"으로 처리됨.
 */
function calculateConjunctionDensity(text: string): number {
  const conjunctionPatterns = [
    /또한/g, /한편/g, /더불어/g, /더\s*나아가/g,
    /그뿐만\s*아니라/g, /뿐만\s*아니라/g,
    /이와\s*함께/g, /이를\s*통해/g, /따라서/g,
    /그러므로/g, /결론적으로/g, /요약하면/g,
    /그\s*뿐만\s*아니라/g, /아울러/g, /더불어서/g,
  ];

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount === 0) return 0;

  let conjunctionCount = 0;
  for (const pattern of conjunctionPatterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    const matches = text.match(regex);
    if (matches) conjunctionCount += matches.length;
  }

  // 100단어당 1.5개 = score 1.0 (AI 수준)
  const rate = conjunctionCount / (wordCount / 100);
  return Math.min(rate / 1.5, 1.0);
}

// =====================
// 종합 지수 계산
// =====================

/**
 * 4가지 지표를 가중 평균하여 종합 AI 의심 지수를 산출합니다.
 *
 * 가중치 설계 근거:
 * 가중치 설계 근거 (300개 벤치마크 결과 기반 최적화):
 * - 구조적 기계성(45%): AI vs 인간 구분의 가장 강력하고 확실한 지표 (AI 평균 0.468 vs 인간 0.177)
 * - AI 어휘 밀도(45%): 두 번째로 확실한 지표 (AI 평균 0.455 vs 인간 0.338)
 * - Burstiness(10%): 미세한 차이만 보임 (AI 0.625 vs 인간 0.666)
 * - 접속어 밀도(0%): 오히려 인간이 접속어를 더 많이 사용하여 변별력이 없으므로 제외
 */
function calculateCompositeSuspicionIndex(
  burstinessScore: number,
  aiVocabularyDensity: number,
  structuralRigidity: number,
  conjunctionDensity: number,
): number {
  const burstinessAI = 1 - burstinessScore;

  const weighted =
    aiVocabularyDensity * 0.45 +
    structuralRigidity * 0.45 +
    burstinessAI * 0.10;

  return Math.min(Math.max(weighted, 0), 1);
}

// =====================
// 메인 분석 함수 (Public API)
// =====================

/**
 * 한국어 텍스트를 종합 분석하여 정량화된 결과를 반환합니다.
 */
export function analyzeKoreanText(text: string, genre: string = 'general'): AnalyzerResult {
  const trimmedText = text.trim();
  const textLength = trimmedText.length;

  const { score: burstinessScore, lengths, avg: avgSentenceLength } = calculateBurstiness(trimmedText);
  const { density: aiVocabularyDensity, detectedKeywords, categoryHits, weightedHitCount } = analyzeLexicalDensity(trimmedText, genre);
  let structuralRigidity = calculateStructuralRigidity(trimmedText);
  const conjunctionDensity = calculateConjunctionDensity(trimmedText);

  // 장르별 특수 보정
  if (genre === 'academic') {
    // 학술 문서는 서론/본론/결론, 번호 매기기 등의 구조가 자연스러우므로 구조적 기계성 의심도를 대폭 낮춤
    structuralRigidity = structuralRigidity * 0.3; 
  }

  const sentenceCount = lengths.length;

  const compositeSuspicionIndex = calculateCompositeSuspicionIndex(
    burstinessScore,
    aiVocabularyDensity,
    structuralRigidity,
    conjunctionDensity,
  );

  console.log(`[analyzer] weightedHits=${weightedHitCount.toFixed(2)}, density=${aiVocabularyDensity}, burstiness=${burstinessScore}, structural=${structuralRigidity}, conjunction=${conjunctionDensity}, suspicion=${compositeSuspicionIndex}`);

  return {
    textLength,
    sentenceCount,
    avgSentenceLength: Math.round(avgSentenceLength),
    burstinessScore: Math.round(burstinessScore * 100) / 100,
    aiVocabularyDensity: Math.round(aiVocabularyDensity * 100) / 100,
    structuralRigidity: Math.round(structuralRigidity * 100) / 100,
    conjunctionDensity: Math.round(conjunctionDensity * 100) / 100,
    detectedAiKeywords: detectedKeywords.slice(0, 12),
    categoryHits,
    compositeSuspicionIndex: Math.round(compositeSuspicionIndex * 100) / 100,
  };
}
