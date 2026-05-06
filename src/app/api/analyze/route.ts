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
import { getLLMVerdict } from '@/lib/llm_verdict';

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
