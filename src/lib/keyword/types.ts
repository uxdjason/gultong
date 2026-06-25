export type Intent = 'info' | 'commercial' | 'transactional';
export type Competition = '낮음' | '보통' | '높음';
export type Trend = '상승' | '유지' | '하락';
export type Badge = '급상승' | '블루오션' | '계절성' | null;
export type KeywordSource = 'cache' | 'fresh' | 'estimated' | 'naver';

export interface KeywordScore {
  keyword: string;
  searchVolume: number;          // 월간 PC+모바일 합계
  searchVolumePc: number;
  searchVolumeMobile: number;
  documentVolume: number;        // 발행 문서 수
  competition: Competition;
  competitionRatio: number;      // documentVolume / searchVolume * 100
  trendDirection: Trend;
  trendScore: number;            // 0~100, 최근 3개월 상승 정도
  intent: Intent;
  writabilityScore: number;      // 글통 고유 0~100
  totalScore: number;            // 가중 종합 0~100
  badge: Badge;
  aiInsight: string;             // LLM 3문장 인사이트
  relatedKeywords: string[];     // 최대 N개(이름만; 점수는 related 배열에)
  source: KeywordSource;
  fetchedAt: string;             // ISO8601
}

// POST /api/keywords/analyze
export interface AnalyzeKeywordsRequest {
  seedKeyword: string;
  options?: {
    includeRelated?: boolean;    // 기본 true
    relatedCount?: number;       // 기본 8, 최대 20
  };
}

export interface AnalyzeKeywordsResponse {
  primary: KeywordScore;
  related: KeywordScore[];
  creditsUsed: number;
}
