import { Competition, Trend } from './types';
import { fetchWithRetry, parseJSONGeneric } from '@/lib/llm_verdict';

export interface KeywordMetrics {
  searchVolume: number;
  competition: Competition;
  trendDirection: Trend;
  trendScore: number;
}

const SYSTEM_PROMPT = `당신은 네이버 검색광고 API를 모방하는 데이터 추정기입니다.
다음 주어진 키워드들의 월간 검색량(PC+모바일), 경쟁도, 트렌드 방향, 트렌드 점수를 상식과 최신 동향을 바탕으로 '추정'하여 JSON 객체로 반환하세요.

응답 형식 (JSON):
{
  "키워드1": {
    "searchVolume": 15000,
    "competition": "높음" | "보통" | "낮음",
    "trendDirection": "상승" | "유지" | "하락",
    "trendScore": 75
  },
  "키워드2": { ... }
}

- searchVolume: 월간 통합 검색량 (0 ~ 1,000,000 사이의 숫자). 특정 숫자(예: 45000)로 통일하지 말고, 각 키워드의 실제 인기도에 맞게 다양하고 현실적인 값을 추정하세요.
- trendScore: 최근 3개월간 트렌드 상승 강도 (0~100)
- 결과는 반드시 위 JSON 형식만 출력해야 합니다.`;

async function callClaudeForMetrics(keywords: string[], apiKey: string): Promise<Record<string, KeywordMetrics>> {
  const model = 'claude-haiku-4-5-20251001';
  
  const requestBody = {
    model,
    max_tokens: 1024,
    temperature: 0.1,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `분석할 키워드 목록:\n${keywords.join('\n')}`
      }
    ]
  };

  const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) throw new Error(`Claude API 오류 (${response.status})`);
  const data = await response.json() as any;
  const rawText = data.content?.[0]?.text?.trim();
  const parsed = parseJSONGeneric<Record<string, KeywordMetrics>>(rawText || '');
  if (!parsed) throw new Error('Claude JSON 파싱 실패');
  return parsed;
}

async function callGeminiForMetrics(keywords: string[], apiKey: string): Promise<Record<string, KeywordMetrics>> {
  const model = 'gemini-2.5-flash';
  
  const requestBody = {
    contents: [{
      parts: [{
        text: `${SYSTEM_PROMPT}\n\n분석할 키워드 목록:\n${keywords.join('\n')}`
      }]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      maxOutputTokens: 1024,
    }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) throw new Error(`Gemini API 오류 (${response.status})`);
  const data = await response.json() as any;
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  const parsed = parseJSONGeneric<Record<string, KeywordMetrics>>(rawText || '');
  if (!parsed) throw new Error('Gemini JSON 파싱 실패');
  return parsed;
}

export async function fetchMetrics(
  keywords: string[],
  claudeApiKey?: string,
  geminiApiKey?: string
): Promise<Record<string, KeywordMetrics>> {
  if (keywords.length === 0) return {};

  let lastError: Error | null = null;
  if (claudeApiKey) {
    try {
      return await callClaudeForMetrics(keywords, claudeApiKey);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[datasource] Claude 실패: ${lastError.message}`);
    }
  }

  if (geminiApiKey) {
    try {
      return await callGeminiForMetrics(keywords, geminiApiKey);
    } catch (err) {
      console.warn(`[datasource] Gemini 실패:`, err);
      throw err;
    }
  }
  
  throw new Error('API 키가 없습니다.');
}
