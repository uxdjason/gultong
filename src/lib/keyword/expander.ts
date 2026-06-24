import { Intent } from './types';
import { fetchWithRetry, parseJSONGeneric } from '@/lib/llm_verdict';

export interface KeywordExpansionResult {
  aiInsight: string;
  related: Array<{
    keyword: string;
    intent: Intent;
  }>;
}

const SYSTEM_PROMPT = `당신은 SEO 및 블로그 키워드 분석 전문가입니다.
사용자가 입력한 시드 키워드에 대해 다음 2가지를 분석하여 JSON으로 반환하세요.

1. aiInsight: 이 키워드로 수익형 블로그나 체험단 글을 쓸 때의 전략적 조언과 가능성을 3문장으로 작성하세요. 
   - 반드시 키워드의 정확한 대중적/사전적 의미(예: '비비빅'은 아이스크림)를 파악하고, 절대 없는 사실을 지어내지 마세요(Hallucination 금지).
   - 무조건 수익창출에 유리하다고만 하지 말고, 대표 키워드라서 경쟁이 치열할 것으로 예상된다면 "세부/연관 키워드를 공략하라"는 식의 현실적이고 객관적인 조언을 포함하세요.
   - 반드시 모든 문장은 '-입니다.', '-합니다.' 와 같이 정중한 경어체로 끝맺으세요. '-다.'와 같은 평어체는 절대 사용하지 마세요.
2. related: 연관 키워드를 8개 추출하고, 각 키워드의 검색 의도(intent)를 'info', 'commercial', 'transactional' 중 하나로 분류하세요.
   - info: 단순 정보 탐색 (예: 캠핑장 추천, 텐트 치는 법)
   - commercial: 구매 전 정보 탐색 (예: 텐트 브랜드, 가성비 텐트)
   - transactional: 직접적인 구매/행동 의도 (예: 텐트 가격, 텐트 렌탈)

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명 텍스트는 절대 포함하지 마세요:
{
  "aiInsight": "[3문장의 조언]",
  "related": [
    { "keyword": "연관키워드1", "intent": "info" },
    { "keyword": "연관키워드2", "intent": "commercial" }
  ]
}`;

export async function callClaudeForExpansion(
  seedKeyword: string,
  apiKey: string
): Promise<KeywordExpansionResult> {
  const model = 'claude-haiku-4-5-20251001';

  console.log(`[keyword] Claude 호출 (expander): ${model}`);

  const requestBody = {
    model,
    max_tokens: 1024,
    temperature: 0.2,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `시드 키워드: "${seedKeyword}"`
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = (errorData as any).error?.message ?? '알 수 없는 오류';
    throw new Error(`Claude API 오류 (${response.status}): ${errMsg}`);
  }

  const data = await response.json() as any;
  const rawText = data.content?.[0]?.text?.trim();
  if (!rawText) throw new Error('Claude API 응답 형식 오류: content 없음');

  const parsed = parseJSONGeneric<KeywordExpansionResult>(rawText);
  if (!parsed || !parsed.aiInsight || !Array.isArray(parsed.related)) {
    throw new Error(`Claude 응답 JSON 파싱 실패 또는 스키마 불일치. 원본: ${rawText}`);
  }

  return parsed;
}

export async function callGeminiForExpansion(
  seedKeyword: string,
  apiKey: string
): Promise<KeywordExpansionResult> {
  const model = 'gemini-2.5-flash';

  console.log(`[keyword] Gemini fallback 호출 (expander): ${model}`);

  const requestBody = {
    contents: [{
      parts: [{
        text: `${SYSTEM_PROMPT}\n\n시드 키워드: "${seedKeyword}"`
      }]
    }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          aiInsight: { type: 'STRING' },
          related: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                keyword: { type: 'STRING' },
                intent: { type: 'STRING', enum: ['info', 'commercial', 'transactional'] }
              },
              required: ['keyword', 'intent']
            }
          }
        },
        required: ['aiInsight', 'related']
      },
      maxOutputTokens: 1024
    }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API 오류 (${response.status}): ${(errorData as any).error?.message ?? '알 수 없는 오류'}`);
  }

  const data = await response.json() as any;
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error(`Gemini API 응답 형식 오류: candidates 없음.`);
  }

  const rawText = data.candidates[0].content.parts[0].text.trim();
  const parsed = parseJSONGeneric<KeywordExpansionResult>(rawText);

  if (!parsed || !parsed.aiInsight || !Array.isArray(parsed.related)) {
    throw new Error(`Gemini 응답 JSON 파싱 실패 또는 스키마 불일치. 원본: ${rawText}`);
  }

  return parsed as KeywordExpansionResult;
}

export async function expandKeyword(
  seedKeyword: string,
  claudeApiKey?: string,
  geminiApiKey?: string
): Promise<{ result: KeywordExpansionResult; provider: 'claude' | 'gemini' }> {
  let lastError: Error | null = null;

  if (claudeApiKey) {
    try {
      const result = await callClaudeForExpansion(seedKeyword, claudeApiKey);
      return { result, provider: 'claude' };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[keyword] Claude expander 실패, Gemini fallback 시도: ${lastError.message}`);
    }
  } else {
    console.warn('[keyword] CLAUDE_API_KEY 없음. Gemini로 직접 진행.');
  }

  if (geminiApiKey) {
    const result = await callGeminiForExpansion(seedKeyword, geminiApiKey);
    return { result, provider: 'gemini' };
  }

  throw new Error('사용 가능한 API 키가 없습니다. CLAUDE_API_KEY 또는 GEMINI_API_KEY를 설정하세요.');
}
