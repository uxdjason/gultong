import { AnalyzeKeywordsResponse } from './types';

// 임시 in-memory 캐시 (Edge isolate 런타임 수명 동안만 유지)
// Stage 1b에서 Cloudflare KV 바인딩으로 교체 권장
const mockCache = new Map<string, { data: AnalyzeKeywordsResponse; expiresAt: number }>();

export async function getCachedAnalysis(seed: string): Promise<AnalyzeKeywordsResponse | null> {
  const normalized = seed.trim().toLowerCase();
  const entry = mockCache.get(normalized);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  return null;
}

export async function setCachedAnalysis(seed: string, data: AnalyzeKeywordsResponse): Promise<void> {
  const normalized = seed.trim().toLowerCase();
  // 1시간 TTL
  mockCache.set(normalized, { data, expiresAt: Date.now() + 60 * 60 * 1000 });
}
