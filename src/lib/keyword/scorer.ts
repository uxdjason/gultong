import { Badge, Competition, Intent, Trend } from './types';

interface ScorerInput {
  searchVolume: number;
  documentVolume: number;
  competition: Competition;
  trendDirection: Trend;
  trendScore: number;
  intent: Intent;
  isSeasonal?: boolean; // MVP에서 계절성 판단을 위해
}

export function calculateWritability(d: Omit<ScorerInput, 'documentVolume' | 'isSeasonal'>): number {
  let s = 0;
  // 1) 검색량 sweet spot: 월 1만~5만이 최적 (40점)
  if (d.searchVolume >= 10000 && d.searchVolume <= 50000) s += 40;
  else if (d.searchVolume > 50000) s += 35;
  else if (d.searchVolume >= 1000) s += 35;
  else if (d.searchVolume >= 500) s += 25;
  else if (d.searchVolume >= 100) s += 15;
  else s += 5;

  // 2) 경쟁도 (30점)
  s += d.competition === '낮음' ? 30 : d.competition === '보통' ? 18 : 5;

  // 3) 트렌드 방향 (15점)
  s += d.trendDirection === '상승' ? 15 : d.trendDirection === '유지' ? 8 : 0;

  // 4) 의도 (15점) — 수익형은 commercial/transactional 가산
  s += d.intent === 'transactional' ? 15 : d.intent === 'commercial' ? 12 : 6;

  return Math.min(s, 100);
}

export function calculateTotalScore(
  writabilityScore: number,
  trendScore: number,
  competitionRatio: number
): number {
  // totalScore = writabilityScore*0.6 + trendScore*0.25 + (100 - competitionRatio)*0.15
  // competitionRatio는 보통 0~100 이상일 수 있으므로 최소 0 보장
  const ratioScore = Math.max(0, 100 - competitionRatio);
  const total = writabilityScore * 0.6 + trendScore * 0.25 + ratioScore * 0.15;
  return Math.min(Math.round(total), 100);
}

export function assignBadge(d: {
  searchVolume: number;
  competition: Competition;
  trendDirection: Trend;
  trendScore: number;
  isSeasonal?: boolean;
}): Badge {
  // 둘 이상 해당 시 우선순위: 블루오션 > 급상승 > 계절성
  if (d.competition === '낮음' && d.searchVolume >= 5000) {
    return '블루오션';
  }
  if (d.trendScore >= 80 && d.trendDirection === '상승') {
    return '급상승';
  }
  if (d.trendScore >= 60 && d.isSeasonal) {
    return '계절성';
  }
  return null;
}
