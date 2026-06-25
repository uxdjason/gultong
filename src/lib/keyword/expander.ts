import { Intent } from './types';
import { fetchWithRetry, parseJSONGeneric } from '@/lib/llm_verdict';

export interface KeywordExpansionResult {
  aiInsight: string;
  seedIntent: Intent;
  related: Array<{
    keyword: string;
    intent: Intent;
  }>;
}

const getSystemPrompt = (candidatesText: string) => `당신은 SEO 및 블로그 키워드 분석 전문가입니다.
사용자가 입력한 시드 키워드에 대해 다음 3가지를 분석하여 JSON으로 반환하세요.

1. seedIntent: 시드 키워드 자체의 검색 의도를 'info', 'commercial', 'transactional' 중 하나로 분류하세요.
2. aiInsight: 이 키워드로 수익형 블로그나 체험단 글을 쓸 때의 전략적 조언과 가능성을 3문장으로 작성하세요. 
   - 반드시 키워드의 정확한 대중적/사전적 의미를 파악하세요. 특히 키워드가 최근 유행하는 대중문화(노래 제목, 걸그룹/아이돌 등), 신조어, 줄임말(예: 랜플=랜덤플레이댄스)일 가능성을 최우선으로 고려하세요.
   - 고유명사(특정 상호명, 지명, 식당, 지역 명소, '녹두거리' 같은 로컬 상권 명칭 등)의 경우 이름만 보고 위치나 업종을 절대 지레짐작하지 마세요. (예: '성미당'은 빵집이 아니라 전주 비빔밥 맛집이며, '녹두거리'는 대전이 아니라 서울대 인근 대학동입니다.) 자신의 지식에 확신이 없다면 구체적인 지역명이나 업종을 단정지어 설명하지 말고, 범용적인 표현을 사용하세요(Hallucination 절대 금지).
   - 일반 명사나 부사(예: "갑자기")로 보이더라도 실제로는 유명한 곡명이나 트렌드일 수 있으므로 문맥을 주의 깊게 판단하세요.
   - 무조건 수익창출에 유리하다고만 하지 말고, 대표 키워드라서 경쟁이 치열할 것으로 예상된다면 "세부/연관 키워드를 공략하라"는 식의 현실적이고 객관적인 조언을 포함하세요.
   - 반드시 모든 문장은 '-입니다.', '-합니다.' 와 같이 정중한 경어체로 끝맺으세요. '-다.'와 같은 평어체는 절대 사용하지 마세요.
${candidatesText && candidatesText.trim() !== '' ? 
`3. related: 아래 제공된 [데이터 기반 검증된 연관 키워드 후보군] 목록에서, 블로그 유입에 가장 적합한 키워드를 **정확히 8개만 중복 없이 선택**하고, 각각의 검색 의도(intent)를 'info', 'commercial', 'transactional' 중 하나로 분류하세요.
   - 반드시 제공된 후보군 목록 안에 있는 단어만 사용해야 합니다. 절대 임의의 단어를 지어내지 마세요.
   - 검색량이 너무 낮거나 경쟁이 심한 것보다는 블로거가 쓰기 좋은 '중소형 황금 키워드' 위주로 선별하세요.

[데이터 기반 검증된 연관 키워드 후보군]
${candidatesText}` 
: 
`3. related: 연관 키워드를 **정확히 중복 없이 8개 추출**하고, 각 키워드의 검색 의도(intent)를 'info', 'commercial', 'transactional' 중 하나로 분류하세요.
   - 단순히 시드 키워드에 단어를 덧붙인 1차원적인 연관어를 피하세요. 월 검색량이 거의 없는 지나치게 길고 지엽적인 문장형 키워드는 절대 피하세요.
   - 대신 어느 정도 대중적인 수요가 보장되면서도 메인 키워드보다 경쟁이 덜한 '중소형 황금 키워드(Middle-tail)'를 당신의 지식을 바탕으로 제안해야 합니다.`}

반드시 아래 JSON 형식으로만 응답하세요:
{
  "seedIntent": "info",
  "aiInsight": "[3문장의 조언]",
  "related": [
    { "keyword": "후보군에있는단어1", "intent": "info" },
    { "keyword": "후보군에있는단어2", "intent": "commercial" }
  ]
}`;

export async function callClaudeForExpansion(
  seedKeyword: string,
  candidatesText: string,
  apiKey: string
): Promise<KeywordExpansionResult> {
  const model = 'claude-sonnet-4-6';

  console.log(`[keyword] Claude 호출 (expander): ${model}`);

  const requestBody = {
    model,
    max_tokens: 1024,
    temperature: 0.2,
    system: getSystemPrompt(candidatesText),
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
  candidatesText: string,
  apiKey: string
): Promise<KeywordExpansionResult> {
  const model = 'gemini-2.5-flash';

  console.log(`[keyword] Gemini fallback 호출 (expander): ${model}`);

  const requestBody = {
    contents: [{
      parts: [{
        text: `${getSystemPrompt(candidatesText)}\n\n시드 키워드: "${seedKeyword}"`
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
  candidatesText: string,
  claudeApiKey?: string,
  geminiApiKey?: string
): Promise<{ result: KeywordExpansionResult; provider: 'claude' | 'gemini' }> {
  let lastError: Error | null = null;

  if (claudeApiKey) {
    try {
      const result = await callClaudeForExpansion(seedKeyword, candidatesText, claudeApiKey);
      return { result, provider: 'claude' };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[keyword] Claude expander 실패, Gemini fallback 시도: ${lastError.message}`);
    }
  } else {
    console.warn('[keyword] CLAUDE_API_KEY 없음. Gemini로 직접 진행.');
  }

  if (geminiApiKey) {
    const result = await callGeminiForExpansion(seedKeyword, candidatesText, geminiApiKey);
    return { result, provider: 'gemini' };
  }

  throw new Error('사용 가능한 API 키가 없습니다. CLAUDE_API_KEY 또는 GEMINI_API_KEY를 설정하세요.');
}
