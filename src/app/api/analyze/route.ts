/**
 * /api/analyze/route.ts
 * 글통 AI 탐지 엔진 - API Route Handler (Next.js Server-Side)
 *
 * 보안: API 키는 절대 클라이언트에 노출되지 않습니다.
 * 흐름: 1차 자체 분석(korean_analyzer) → 2차 Claude 최종 판단 (실패 시 Gemini fallback)
 * 우선순위: Claude 3.5 Haiku (기본) → Gemini 2.5 Flash (fallback)
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeKoreanText, AnalyzerResult } from '@/lib/korean_analyzer';

// =====================
// 타입 정의
// =====================

export interface DetectionResult {
  humanScore: number;            // 0~100 (높을수록 인간 작성)
  aiScore: number;               // 100 - humanScore
  badge: 'human' | 'likely_human' | 'mixed' | 'likely_ai' | 'ai';
  summary: string;               // 사용자에게 보여줄 한국어 분석 코멘트
  detectedKeywords: string[];    // 탐지된 AI 어휘 목록
  rawAnalysis: AnalyzerResult;   // 자체 엔진 정량 데이터 (디버깅/표시용)
  llmProvider?: 'claude' | 'gemini'; // 실제로 사용된 LLM 제공자
  stepByStepAnalysis?: {         // CoT 사고 과정
    toneAndStyle: string;
    structuralFeatures: string;
    quantitativeInterpretation: string;
  };
}

// LLM 응답 공통 인터페이스
interface LLMResponse {
  stepByStepAnalysis: {
    toneAndStyle: string;
    structuralFeatures: string;
    quantitativeInterpretation: string;
  };
  humanScore: number;
  summary: string;
}

// =====================
// 배지 결정 로직
// =====================

function determineBadge(humanScore: number): DetectionResult['badge'] {
  if (humanScore >= 80) return 'human';
  if (humanScore >= 60) return 'likely_human';
  if (humanScore >= 40) return 'mixed';
  if (humanScore >= 20) return 'likely_ai';
  return 'ai';
}

// =====================
// 지수 백오프 재시도 로직
// =====================

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // 성공 또는 클라이언트 오류(4xx)는 즉시 반환 (429는 재시도)
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }

      // 5xx 또는 429(Rate Limit)는 재시도
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error('최대 재시도 횟수 초과');
}

// =====================
// 공통 프롬프트 생성 로직
// =====================

function buildSystemPrompt(analysis: AnalyzerResult, genre: string): string {
  let genreInstruction = '';
  if (genre === 'academic') {
    genreInstruction = `
[특별 지침: 학술/전문 문서]
사용자가 입력한 글은 과거 논문, 보고서, 번역서 등 학술적인 목적으로 작성된 전문 문서입니다.
따라서 문어체, 형식적인 접속사('따라서', '그러므로', '이러한'), 번역투, 서론-본론-결론의 엄격한 구조가 매우 자연스럽게 나타납니다.
**절대 형식적이고 딱딱하다는 이유만으로 AI라고 판단하지 마십시오.** (인간 학자들도 그렇게 씁니다.)
오직 '정보의 환각(Hallucination)', '알맹이 없는 동어반복', '기계적인 클리셰' 만을 근거로 판별하십시오.`;
  } else if (genre === 'creative') {
    genreInstruction = `
[특별 지침: 문학/창작물]
사용자가 입력한 글은 시, 소설, 수필 등의 창작물입니다.
인간 특유의 비선형적인 감정선과 은유를 파악하십시오. AI의 기계적이고 상투적인 과장된 비유(클리셰)와 명확히 구분하십시오.`;
  } else {
    genreInstruction = `
[특별 지침: 일반/블로그]
정보 전달 목적의 일반적인 웹 글입니다. 기계적인 리스트 나열, 무의미한 길이 늘이기, 번역투의 상투어 남용을 엄격하게 감점하십시오.`;
  }

  return `당신은 글통 서비스의 AI 텍스트 최종 판정관입니다.
우리 자체 한국어 분석 엔진이 이미 아래의 정량적 팩트를 계산해 두었습니다.
이 데이터를 절대적인 근거로 삼아 최종 점수만 도출하세요.
${genreInstruction}

[1차 정량 분석 결과 - 자체 엔진 산출]
- 총 글자 수: ${analysis.textLength}자
- 문장 수: ${analysis.sentenceCount}개, 평균 문장 길이: ${analysis.avgSentenceLength}자
- 문장 호흡 분산도(Burstiness): ${analysis.burstinessScore} / 1.0 (높을수록 인간적. 문장 길이가 불규칙함)
- AI 어휘 출현 밀도: ${analysis.aiVocabularyDensity} / 1.0 (높을수록 AI적. 상투어, 번역투 과용)
- 구조적 기계성 점수: ${analysis.structuralRigidity} / 1.0 (높을수록 AI적. 기계적인 병렬 구조, 리스트 과용)
- 접속어 과용 밀도: ${analysis.conjunctionDensity} / 1.0 (높을수록 AI적. '또한', '반면' 등 과용)
- 종합 AI 의심 지수: ${analysis.compositeSuspicionIndex} / 1.0
- 탐지된 AI 특유 표현: ${analysis.detectedAiKeywords.length > 0 ? analysis.detectedAiKeywords.join(', ') : '없음'}
- 카테고리별 탐지: ${JSON.stringify(analysis.categoryHits)}

[판정 기준]
- 종합 AI 의심 지수 0.7 이상 → humanScore 30 이하
- 종합 AI 의심 지수 0.5~0.7 → humanScore 30~50
- 종합 AI 의심 지수 0.3~0.5 → humanScore 50~70
- 종합 AI 의심 지수 0.3 이하 → humanScore 70 이상

[분석 지침 - Chain of Thought (사고의 사슬)]
반드시 점수를 내리기 전에 다음 3가지 관점에서 단계별로 사고(분석)하십시오. (응답 속도를 위해 각 항목은 반드시 1문장으로 핵심만 짧게 작성하세요)
1. toneAndStyle (어조/문체): 주관적 감정이 있는가, 기계적인가? (1문장)
2. structuralFeatures (구조적 특징): 완벽한 병렬 나열, 소제목 남용이 있는가? (1문장)
3. quantitativeInterpretation (정량적 해석): 위 1차 정량 분석 결과와 실제 텍스트가 일치하는가? (1문장)

위 지침을 바탕으로 교차 검증하여 최종 판정을 내리세요.
단, 텍스트가 너무 짧거나(100자 미만) 분석 데이터가 불충분한 경우 불확실성을 반영하세요.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외에 다른 텍스트는 절대 포함하지 마세요:
{
  "stepByStepAnalysis": {
    "toneAndStyle": "[어조와 문체에 대한 분석 내용]",
    "structuralFeatures": "[구조적 특징에 대한 분석 내용]",
    "quantitativeInterpretation": "[정량적 데이터와 텍스트의 대조 해석]"
  },
  "humanScore": [0~100 사이의 정수. 높을수록 인간 작성 가능성이 높음],
  "summary": "[위 사고 과정을 종합한 최종 평가 이유를 한국어로 2~3문장. 정중하고 전문적인 어조. 내부 기술 용어 노출 금지]"
}`;
}

// =====================
// JSON 파싱 공통 유틸
// =====================

function parseJSONResponse(rawText: string): LLMResponse | null {
  const attempts = [
    () => JSON.parse(rawText),
    () => JSON.parse(rawText.replace(/```json|```/g, '').trim()),
    () => {
      const match = rawText.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    }
  ];

  for (const attempt of attempts) {
    try {
      const result = attempt();
      if (result && typeof result.humanScore === 'number') {
        return result as LLMResponse;
      }
    } catch {
      // 다음 파싱 방법 시도
    }
  }
  return null;
}

// =====================
// [1순위] Claude API 호출 로직
// Claude 3.5 Haiku: 가성비 최우수, 문서 분석 특화
// =====================

async function callClaudeForFinalVerdict(
  originalText: string,
  analysis: AnalyzerResult,
  apiKey: string,
  genre: string
): Promise<LLMResponse> {
  const systemPrompt = buildSystemPrompt(analysis, genre);
  const model = 'claude-haiku-4-5'; // Claude 3.5 Haiku: 속도/비용/성능 균형 최적

  console.log(`[analyze] Claude 호출 시작: ${model}`);

  const requestBody = {
    model,
    max_tokens: 1024,
    temperature: 0.1,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `[분석 대상 원본 텍스트]\n"${originalText}"`
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
    const errMsg = (errorData as { error?: { message?: string } }).error?.message ?? '알 수 없는 오류';
    throw new Error(`Claude API 오류 (${response.status}): ${errMsg}`);
  }

  const data = await response.json() as {
    content?: Array<{ type: string; text: string }>;
  };

  const rawText = data.content?.[0]?.text?.trim();
  if (!rawText) {
    throw new Error('Claude API 응답 형식 오류: content 없음');
  }

  const parsed = parseJSONResponse(rawText);
  if (!parsed) {
    throw new Error(`Claude 응답 JSON 파싱 실패. 원본: ${rawText}`);
  }

  console.log(`[analyze] Claude 판정 완료: humanScore=${parsed.humanScore}`);
  return {
    stepByStepAnalysis: parsed.stepByStepAnalysis ?? {
      toneAndStyle: '',
      structuralFeatures: '',
      quantitativeInterpretation: ''
    },
    humanScore: Math.min(Math.max(Math.round(parsed.humanScore), 0), 100),
    summary: parsed.summary ?? '분석을 완료했습니다.',
  };
}

// =====================
// [Fallback] Gemini API 호출 로직
// =====================

async function callGeminiForFinalVerdict(
  originalText: string,
  analysis: AnalyzerResult,
  apiKey: string,
  genre: string
): Promise<LLMResponse> {
  const systemPrompt = buildSystemPrompt(analysis, genre);
  const model = 'gemini-2.5-flash';

  console.log(`[analyze] Gemini fallback 호출: ${model}`);

  const requestBody = {
    contents: [{
      parts: [{
        text: `${systemPrompt}\n\n[분석 대상 원본 텍스트]\n"${originalText}"`
      }]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          stepByStepAnalysis: {
            type: 'OBJECT',
            properties: {
              toneAndStyle: { type: 'STRING' },
              structuralFeatures: { type: 'STRING' },
              quantitativeInterpretation: { type: 'STRING' }
            },
            required: ['toneAndStyle', 'structuralFeatures', 'quantitativeInterpretation']
          },
          humanScore: { type: 'INTEGER' },
          summary: { type: 'STRING' }
        },
        required: ['stepByStepAnalysis', 'humanScore', 'summary']
      },
      maxOutputTokens: 1024,
      thinkingConfig: {
        thinkingBudget: 0
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
    throw new Error(
      `Gemini API 오류 (${response.status}): ${(errorData as { error?: { message?: string } }).error?.message ?? '알 수 없는 오류'}`
    );
  }

  const data = await response.json() as {
    candidates?: Array<{ content: { parts: Array<{ text: string }> } }>
  };

  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error(`Gemini API 응답 형식 오류: candidates 없음.`);
  }

  const rawText = data.candidates[0].content.parts[0].text.trim();
  const parsed = parseJSONResponse(rawText);

  if (!parsed) {
    throw new Error(`Gemini 응답 JSON 파싱 실패. 원본: ${rawText}`);
  }

  console.log(`[analyze] Gemini 판정 완료: humanScore=${parsed.humanScore}`);
  return {
    stepByStepAnalysis: parsed.stepByStepAnalysis ?? {
      toneAndStyle: '',
      structuralFeatures: '',
      quantitativeInterpretation: ''
    },
    humanScore: Math.min(Math.max(Math.round(parsed.humanScore), 0), 100),
    summary: parsed.summary ?? '분석을 완료했습니다.',
  };
}

// =====================
// LLM 라우터: Claude → Gemini fallback
// =====================

async function getLLMVerdict(
  originalText: string,
  analysis: AnalyzerResult,
  claudeApiKey: string | undefined,
  geminiApiKey: string | undefined,
  genre: string
): Promise<{ verdict: LLMResponse; provider: 'claude' | 'gemini' }> {

  // 1순위: Claude
  if (claudeApiKey) {
    try {
      const verdict = await callClaudeForFinalVerdict(originalText, analysis, claudeApiKey, genre);
      return { verdict, provider: 'claude' };
    } catch (claudeError) {
      const msg = claudeError instanceof Error ? claudeError.message : String(claudeError);
      console.warn(`[analyze] Claude 실패, Gemini fallback 시도: ${msg}`);
    }
  } else {
    console.warn('[analyze] CLAUDE_API_KEY 없음. Gemini로 직접 진행.');
  }

  // Fallback: Gemini
  if (geminiApiKey) {
    const verdict = await callGeminiForFinalVerdict(originalText, analysis, geminiApiKey, genre);
    return { verdict, provider: 'gemini' };
  }

  throw new Error('사용 가능한 API 키가 없습니다. CLAUDE_API_KEY 또는 GEMINI_API_KEY를 설정하세요.');
}

// =====================
// Route Handler
// =====================

export const runtime = 'edge'; // Cloudflare Pages 호환성 보장
export const maxDuration = 60; // Vercel/Cloudflare 환경 타임아웃 60초 연장

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. API 키 확인
  const claudeApiKey = process.env.CLAUDE_API_KEY?.trim();
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

  if (!claudeApiKey && !geminiApiKey) {
    console.error('[analyze] CLAUDE_API_KEY와 GEMINI_API_KEY 모두 설정되지 않았습니다.');
    return NextResponse.json(
      { error: '서버 설정 오류: API 키가 없습니다.' },
      { status: 500 }
    );
  }

  // 2. 요청 파싱
  let text: string;
  let genre: string = 'general';
  try {
    const body = await request.json() as { text?: string, genre?: string };
    text = body.text?.trim() ?? '';
    genre = body.genre ?? 'general';
  } catch {
    return NextResponse.json(
      { error: '요청 형식 오류: JSON 파싱 실패' },
      { status: 400 }
    );
  }

  // 3. 입력 유효성 검사
  if (!text) {
    return NextResponse.json(
      { error: '텍스트가 비어있습니다.' },
      { status: 400 }
    );
  }
  if (text.length < 30) {
    return NextResponse.json(
      { error: '텍스트가 너무 짧습니다. (최소 30자 이상)' },
      { status: 400 }
    );
  }
  if (text.length > 10000) {
    return NextResponse.json(
      { error: '텍스트가 너무 깁니다. (최대 10,000자)' },
      { status: 400 }
    );
  }

  try {
    // 4. 1차: 자체 한국어 분석 엔진 실행
    const analysis = analyzeKoreanText(text, genre);
    console.log('[analyze] 자체 분석 완료:', {
      textLength: analysis.textLength,
      burstiness: analysis.burstinessScore,
      lexical: analysis.aiVocabularyDensity,
      structural: analysis.structuralRigidity,
      suspicion: analysis.compositeSuspicionIndex,
    });

    // 5. 2차: LLM 라우터 호출 (Claude 1순위 → Gemini fallback)
    const { verdict, provider } = await getLLMVerdict(
      text,
      analysis,
      claudeApiKey,
      geminiApiKey,
      genre
    );

    console.log(`[analyze] 최종 판정 제공자: ${provider}, humanScore: ${verdict.humanScore}`);

    // 6. 결과 조합 및 반환
    const humanScore = verdict.humanScore;
    const result: DetectionResult = {
      humanScore,
      aiScore: 100 - humanScore,
      badge: determineBadge(humanScore),
      summary: verdict.summary,
      detectedKeywords: analysis.detectedAiKeywords,
      rawAnalysis: analysis,
      llmProvider: provider,
      stepByStepAnalysis: verdict.stepByStepAnalysis,
    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('[analyze] 처리 중 오류:', message);
    return NextResponse.json(
      { error: `분석 처리 중 오류가 발생했습니다: ${message}` },
      { status: 500 }
    );
  }
}
