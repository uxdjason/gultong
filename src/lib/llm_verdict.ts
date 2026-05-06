import { AnalyzerResult } from '@/lib/korean_analyzer';

export interface LLMResponse {
  stepByStepAnalysis: {
    toneAndStyle: string;
    structuralFeatures: string;
    quantitativeInterpretation: string;
  };
  humanScore: number;
  summary: string;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }
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

export function buildSystemPrompt(analysis: AnalyzerResult, genre: string): string {
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

export function parseJSONResponse(rawText: string): LLMResponse | null {
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
      if (result && typeof result.humanScore === 'number') {
        return result as LLMResponse;
      }
    } catch {
      // 다음 파싱 방법 시도
    }
  }
  return null;
}

export async function callClaudeForFinalVerdict(
  originalText: string,
  analysis: AnalyzerResult,
  apiKey: string,
  genre: string
): Promise<LLMResponse> {
  const systemPrompt = buildSystemPrompt(analysis, genre);
  const model = 'claude-haiku-4-5-20251001'; // Claude Haiku 4.5: 속도/비용 최적

  console.log(`[analyze] Claude 호출 시작: ${model}`);

  const requestBody = {
    model,
    max_tokens: 1024,
    temperature: 0.1,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `[분석 대상 원본 텍스트]\\n"${originalText}"`
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

export async function callGeminiForFinalVerdict(
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
        text: `${systemPrompt}\\n\\n[분석 대상 원본 텍스트]\\n"${originalText}"`
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

export async function getLLMVerdict(
  originalText: string,
  analysis: AnalyzerResult,
  claudeApiKey: string | undefined,
  geminiApiKey: string | undefined,
  genre: string
): Promise<{ verdict: LLMResponse; provider: 'claude' | 'gemini' }> {

  let lastError: Error | null = null;

  // 1순위: Claude
  if (claudeApiKey) {
    try {
      const verdict = await callClaudeForFinalVerdict(originalText, analysis, claudeApiKey, genre);
      return { verdict, provider: 'claude' };
    } catch (claudeError) {
      lastError = claudeError instanceof Error ? claudeError : new Error(String(claudeError));
      console.warn(`[analyze] Claude 실패, Gemini fallback 시도: ${lastError.message}`);
    }
  } else {
    console.warn('[analyze] CLAUDE_API_KEY 없음. Gemini로 직접 진행.');
  }

  // Fallback: Gemini
  if (geminiApiKey) {
    const verdict = await callGeminiForFinalVerdict(originalText, analysis, geminiApiKey, genre);
    if (lastError) {
      (verdict as any).debug_info = `Claude Fallback Reason: ${lastError.message}`;
    }
    return { verdict, provider: 'gemini' };
  }

  throw new Error('사용 가능한 API 키가 없습니다. CLAUDE_API_KEY 또는 GEMINI_API_KEY를 설정하세요.');
}
