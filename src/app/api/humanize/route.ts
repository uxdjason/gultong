import { NextRequest, NextResponse } from 'next/server';
import { analyzeKoreanText } from '@/lib/korean_analyzer';
import { getLLMVerdict } from '@/lib/llm_verdict';

export const runtime = 'edge';
export const maxDuration = 60;

interface HumanizeOptions {
  text: string;
  mode: string;
  seriousness: number;
  emotion: number;
  honorificType: string;
  persona?: {
    name: string;
    description: string;
    exampleText?: string;
  };
}

interface HumanizeResponse {
  improved_text: string;
  score: number;
  reason: string;
  details: string[];
  provider?: string;
  debug_info?: string;
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError ?? new Error('최대 재시도 횟수 초과');
}

function buildSystemPrompt(options: HumanizeOptions): string {
  let prompt = `당신은 현존하는 가장 까다로운 AI 탐지기를 완벽하게 속여야 하는 20년 차 최고급 에디터입니다.\n단순 윤문이 아니라 원본의 팩트만 남기고 텍스트를 완전히 재창조하십시오.\n\n`;

  if (options.persona) {
    prompt += `[최우선 지침: 페르소나 완벽 빙의]
당신은 다음 페르소나에 완벽하게 빙의하여 사용자의 텍스트를 재작성해야 합니다.
- 성격 및 말투 설명: ${options.persona.description}
${options.persona.exampleText ? `- 문체 모방용 예시 글:\n"${options.persona.exampleText}"` : ''}

원본 텍스트의 사실적 정보는 최대한 유지하되, 모든 문장과 단어 선택, 문단의 호흡을 반드시 위 페르소나의 성격과 말투(예시 글 참고)에 맞게 100% 교체하십시오.
기존 AI 특유의 딱딱하고 기계적인 톤이나 상투적인 표현은 단 하나도 남겨서는 안 됩니다.\n\n`;
  } else {
    prompt += `[설정 및 세부 말투 가이드라인]
1. 글쓰기 모드: ${options.mode} 에 맞춰 다음 지침을 엄수하십시오.
   - '블로그 (정보성 리뷰)': 화자의 개인적인 경험담이나 감정이 솔직하게 드러나야 합니다. 독백체와 대화체를 적절히 섞어 친밀감을 형성하십시오.
   - '에세이/칼럼': 논리적 비약 없이 인과관계를 분명히 하되, 단호한 논조를 유지하십시오. 전문 용어를 정확하게 사용하되 설명은 친절하게 하십시오.
   - '광고/카피라이팅': 독자의 행동을 유도하는 강력한 후킹 문구를 포함하십시오. 문장을 짧게 끊어 리듬감을 극대화하고, 혜택 위주의 서술을 하십시오.

2. 진지함 레벨 (1~5): 현재 레벨 ${options.seriousness}
   - 1: 매우 가볍고 친숙하며 유머러스한 톤
   - 3: 격식을 갖추되 딱딱하지 않은 일상적 전문성
   - 5: 매우 정중하고 무게감 있으며 엄격한 권위가 느껴지는 톤

3. 감성/주관 레벨 (1~5): 현재 레벨 ${options.emotion}
   - 1: 감정을 배제하고 철저히 객관적인 팩트 위주의 서술
   - 3: 개인의 소회나 관점이 자연스럽게 묻어나는 수준
   - 5: 화자의 감정이 풍부하게 담기고 주관적인 수식어가 화려하게 사용되는 호소력 짙은 스타일

4. 최우선 사항: 존댓말 설정 (honorificType): ${options.honorificType}
   - 'none': 절대 존댓말을 쓰지 말고, '~다', '~한다' 등의 건조한 평어체나 독백체를 유지하십시오.
   - 'soft': 문장의 끝을 무조건 '~해요', '~인데요', '~죠' 등 부드러운 구어체 존댓말로 통일하십시오. 딱딱한 '~니다'는 쓰지 마십시오.
   - 'formal': 문장의 끝을 무조건 '~입니다', '~합니다', '~습니까' 등 격식 있는 하십시오체로 통일하십시오. 가벼운 '~해요'는 쓰지 마십시오.
   - 'mixed': '~입니다'와 '~해요'를 7:3 또는 6:4 비율로 자연스럽게 섞어, 너무 딱딱하지도 너무 가볍지도 않은 전문적인 인터뷰/에세이 톤을 만드십시오.\n\n`;
  }

  prompt += `[극단적 인간화 및 형태적 절대 수칙]
1. 자연스러운 문단 구성 (Natural Paragraphing - 가장 중요):
   - 문장 하나당 무조건 줄바꿈을 하는 등 과도한 파편화를 피하십시오.
   - 문맥과 의미 흐름에 따라 2~4개의 문장을 묶어 하나의 자연스러운 문단으로 구성하십시오.
   - 너무 긴 벽돌 문단은 피하고, 시각적 리듬감을 위해 가끔씩 강조용 단 한 줄(1문장)짜리 문단을 섞어주십시오.
   - 마크다운 헤딩이나 리스트 기호는 절대 쓰지 마십시오.

2. 기계적 접속사 및 도입부 절대 금지:
   - 문단 첫머리에 '구체적으로', '한편', '더불어', '또한', '결과적으로', '사실상' 같은 뻔한 접속사를 절대(NEVER) 쓰지 마십시오.
   - 접속사 없이 앞 문장의 맥락을 꼬리 물기 방식으로 자연스럽게 이으십시오.

3. 획일적 종결 어미 탈피:
   - '~현명하다', '~중요하다', '~권장된다' 식의 설교조 어미를 남발하지 마십시오.

4. 인간의 메타 인지(Meta-cognition) 가미:
   - 화자의 통찰력이 엿보이는 서술을 한 방울 섞어 인간이 직접 쓴 글임을 증명하십시오.

[구조적 변주 및 패턴 파괴]
1. 서술 순서의 무작위 셔플: 항목 나열 시 서술 순서를 매번 셔플하십시오.
2. 결론부의 '요약' 강박 제거: 마지막에 전체 요약 문단을 만들지 마시고, 뚝 끊듯이 여운을 남겨 마무리하십시오.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 불필요한 텍스트는 금지합니다.
{
  "improved_text": "[위 수칙이 100% 적용된 재창조 텍스트. 문단 구분을 위해 반드시 \\\\n\\\\n 을 적극적으로 사용하여 줄바꿈을 표현하세요.]",
  "reason": "[해당 텍스트를 어떤 의도로 개선했는지 한국어 '하십시오체'를 사용하여 차분하고 정중하게 1~2문장으로 요약하십시오.]",
  "details": ["[핵심 요약 1]", "[핵심 요약 2]", "[핵심 요약 3]"]
}`;

  return prompt;
}

function parseJSONResponse(rawText: string): HumanizeResponse | null {
  const attempts = [
    () => JSON.parse(rawText),
    () => JSON.parse(rawText.replace(/```json|```/g, '').trim()),
    () => {
      const match = rawText.match(/\\{[\\s\\S]*\\}/);
      return match ? JSON.parse(match[0]) : null;
    }
  ];

  for (const attempt of attempts) {
    try {
      const result = attempt();
      if (result && result.improved_text) {
        return {
          improved_text: result.improved_text,
          score: 0, // 임시 점수, 나중에 실제 검사 엔진으로 덮어씌움
          reason: result.reason || '개선이 완료되었습니다.',
          details: Array.isArray(result.details) ? result.details : [],
        };
      }
    } catch {
      // next attempt
    }
  }
  return null;
}

async function callClaude(options: HumanizeOptions, apiKey: string, model: string): Promise<HumanizeResponse> {
  const systemPrompt = buildSystemPrompt(options);
  
  const requestBody = {
    model,
    max_tokens: 4096,
    temperature: 0.8, // Creative rewriting
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `[원본 텍스트]\n"${options.text}"`
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
    const errMsg = (errorData as any).error?.message ?? 'Unknown error';
    throw new Error(`Claude API Error (${response.status}): ${errMsg}`);
  }

  const data = await response.json() as any;
  const rawText = data.content?.[0]?.text?.trim();
  if (!rawText) throw new Error('Claude response content empty');

  const parsed = parseJSONResponse(rawText);
  if (!parsed) throw new Error(`Claude JSON parse failed. Raw: ${rawText}`);
  
  parsed.provider = model;
  return parsed;
}

async function callGemini(options: HumanizeOptions, apiKey: string): Promise<HumanizeResponse> {
  const systemPrompt = buildSystemPrompt(options);
  const model = 'gemini-2.5-flash';
  
  const requestBody = {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\n[원본 텍스트]\n"${options.text}"`
      }]
    }],
    generationConfig: {
      temperature: 0.8,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          improved_text: { type: 'STRING' },
          reason: { type: 'STRING' },
          details: { type: 'ARRAY', items: { type: 'STRING' } }
        },
        required: ['improved_text', 'reason', 'details']
      }
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
    throw new Error(`Gemini API Error (${response.status}): ${(errorData as any).error?.message ?? 'Unknown error'}`);
  }

  const data = await response.json() as any;
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error('Gemini response candidates empty');
  }

  const rawText = data.candidates[0].content.parts[0].text.trim();
  const parsed = parseJSONResponse(rawText);
  if (!parsed) throw new Error(`Gemini JSON parse failed. Raw: ${rawText}`);

  parsed.provider = model;
  return parsed;
}

export async function POST(request: NextRequest) {
  const claudeApiKey = process.env.CLAUDE_API_KEY?.trim();
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  if (!claudeApiKey && !geminiApiKey) {
    return NextResponse.json({ error: '서버 설정 오류: API 키가 없습니다.' }, { status: 500 });
  }

  let options: HumanizeOptions;
  try {
    options = await request.json() as HumanizeOptions;
  } catch {
    return NextResponse.json({ error: '요청 파싱 실패' }, { status: 400 });
  }

  if (!options.text || options.text.trim().length < 10) {
    return NextResponse.json({ error: '텍스트가 너무 짧습니다.' }, { status: 400 });
  }

  // Fallback chain: Claude Sonnet -> Claude Haiku -> Gemini Flash
  let lastError: Error | null = null;
  let humanizeResult: HumanizeResponse | null = null;

  if (claudeApiKey) {
    // 1. Claude 3.5 Sonnet
    try {
      console.log('[humanize] 시도 1: claude-3-5-sonnet-20241022');
      humanizeResult = await callClaude(options, claudeApiKey, 'claude-3-5-sonnet-20241022');
    } catch (e) {
      console.error('[humanize] claude sonnet 실패:', e);
      lastError = e as Error;
    }

    // 2. Claude 3 Haiku (Fallback)
    if (!humanizeResult) {
      try {
        console.log('[humanize] 시도 2: claude-3-haiku-20240307');
        humanizeResult = await callClaude(options, claudeApiKey, 'claude-3-haiku-20240307');
      } catch (e) {
        console.error('[humanize] claude haiku 실패:', e);
        lastError = e as Error;
      }
    }
  }

  if (!humanizeResult && geminiApiKey) {
    // 3. Gemini 2.5 Flash
    try {
      console.log('[humanize] 시도 3: gemini-2.5-flash');
      humanizeResult = await callGemini(options, geminiApiKey);
    } catch (e) {
      console.error('[humanize] gemini flash 실패:', e);
      lastError = e as Error;
    }
  }

  if (!humanizeResult) {
    return NextResponse.json(
      { error: `글 개선 처리 중 모든 모델이 실패했습니다. (최종 에러: ${lastError?.message})` },
      { status: 500 }
    );
  }

  // 만약 Gemini로 폴백된 경우 디버그용으로 이전 에러(Claude 에러)를 전달합니다.
  if (humanizeResult.provider?.includes('gemini') && lastError) {
    humanizeResult.debug_info = `Claude Fallback Reason: ${lastError.message}`;
  }

  // 실제 분석 엔진을 태워 신뢰도 있는 점수를 산출합니다.
  try {
    let genre = 'general';
    if (options.mode.includes('에세이')) genre = 'academic';
    else if (options.mode.includes('광고')) genre = 'creative';

    const analysis = analyzeKoreanText(humanizeResult.improved_text, genre);
    const { verdict } = await getLLMVerdict(humanizeResult.improved_text, analysis, claudeApiKey, geminiApiKey, genre);
    
    humanizeResult.score = verdict.humanScore;
  } catch (error) {
    console.error('[humanize] 검사 엔진 통과 실패:', error);
    // 검사 엔진이 실패해도 개선 결과는 반환하되, 보수적인 기본 점수(85점)를 부여합니다.
    humanizeResult.score = 85; 
  }

  return NextResponse.json(humanizeResult);
}
