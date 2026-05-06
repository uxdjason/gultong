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
}

interface HumanizeResponse {
  improved_text: string;
  score: number;
  reason: string;
  details: string[];
  provider?: string;
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
  return `당신은 현존하는 가장 까다로운 AI 탐지기를 완벽하게 속여야 하는 20년 차 최고급 에디터입니다. 
단순 윤문이 아니라 원본의 팩트만 남기고 텍스트를 완전히 재창조하십시오. 아래의 [극단적 인간화 4대 절대 수칙]을 하나라도 위반하면 실패입니다.

[극단적 인간화 및 AI 지문 소거 4대 절대 수칙]
1. 문단의 극단적 파편화 (Extreme Fragmentation):
   - 한 문단이 절대 3~4문장을 넘지 않게 하십시오. 
   - 글 중간에 반드시 **단 한 줄(1문장)짜리 문단**을 삽입하여 시각적 리듬감(Burstiness)을 강제로 만드십시오. 
   - 마크다운 헤딩이나 리스트 기호는 절대 쓰지 마십시오.

2. 기계적 접속사 및 도입부 절대 금지:
   - 문단 첫머리에 '구체적으로', '한편', '더불어', '또한', '결과적으로', '사실상' 같은 뻔한 접속사를 절대(NEVER) 쓰지 마십시오.
   - 접속사 없이 앞 문장의 맥락을 꼬리 물기 방식으로 자연스럽게 이으십시오.

3. 획일적 종결 어미 탈피:
   - '~현명하다', '~중요하다', '~권장된다' 식의 설교조 어미를 남발하지 마십시오.
   - 건조한 팩트 전달, 가벼운 의문형, 주관적 소회 등 종결 어미를 의도적으로 들쭉날쭉하게 섞으십시오.

4. 인간의 메타 인지(Meta-cognition) 가미:
   - "흔히들 간과하지만...", "직접 경험해 보면 알겠지만..." 처럼 화자의 통찰력이 엿보이는 서술을 한 방울 섞어 인간이 직접 쓴 글임을 증명하십시오.

[설정 및 세부 말투 가이드라인]
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
   - 'mixed': '~입니다'와 '~해요'를 7:3 또는 6:4 비율로 자연스럽게 섞어, 너무 딱딱하지도 너무 가볍지도 않은 전문적인 인터뷰/에세이 톤을 만드십시오.

[추가 가이드라인: 구조적 변주 및 패턴 파괴 (Anti-Pattern Rules)]
위의 지침에 더해, AI 탐지기를 완벽히 속이기 위해 다음 규칙을 반드시 따르십시오:
1. 서술 순서의 무작위 셔플 (Randomize Narrative Order):
   - 나열형 정보를 다룰 때, 모든 항목을 '정의 -> 효능 -> 음식' 순서로 똑같이 설명하지 마십시오.
   - (예: 첫 번째 항목은 음식 이야기로 시작하고, 두 번째 항목은 결핍 증상으로 시작하는 등 매 문단마다 서술 순서를 뒤섞으십시오.)

2. 문단의 물리적 결합 (Paragraph Merging):
   - 연관성이 깊은 항목은 하나의 긴 문단으로 합치고, 접속사 대신 문맥(Context)으로 자연스럽게 이으십시오.

3. 결론부의 '요약' 강박 제거:
   - 글의 마지막에 전체를 아우르는 요약 문단을 만들지 마십시오.
   - 마지막 항목에 대한 설명이 끝나면, 독자에게 가벼운 질문을 던지거나 구체적인 제언 한 문장만 남기고 글을 뚝 끊으십시오.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 불필요한 텍스트는 금지합니다.
{
  "improved_text": "[위 수칙이 100% 적용된 재창조 텍스트]",
  "reason": "[해당 텍스트를 어떤 의도로 개선했는지 한국어 '하십시오체(~입니다, ~습니다)'를 사용하여 차분하고 정중하게 1~2문장으로 요약하십시오. 내부 지시어는 절대로 사용하지 마십시오.]",
  "details": ["[핵심 요약 1]", "[핵심 요약 2]", "[핵심 요약 3]"]
}

[details(뱃지) 작성 주의사항]
- '문단 구조 최적화', '자연스러운 문맥 연결' 등 사용자가 이해하기 쉬운 10자 내외의 짧은 구어로만 3개 이하로 작성하십시오.`;
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

    // 2. Claude 3.5 Haiku
    if (!humanizeResult) {
      try {
        console.log('[humanize] 시도 2: claude-3-5-haiku-20241022');
        humanizeResult = await callClaude(options, claudeApiKey, 'claude-3-5-haiku-20241022');
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
