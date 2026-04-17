"use client";

import { useState, useEffect } from 'react';

import type { DetectionResult } from '@/app/api/analyze/route';

// 워크플로우 상태 정의
type WorkflowState = 'initial' | 'inspected' | 'direct_improve' | 'improved';

interface ImprovementResult {
  id: number;
  text: string;
  score: number;
  timestamp: string;
  report: string;
}

// 배지 한국어 설명
const BADGE_LABELS: Record<NonNullable<DetectionResult['badge']>, string> = {
  human: '인간이 작성한 글일 가능성이 높습니다',
  likely_human: '인간이 작성했을 가능성이 있습니다',
  mixed: 'AI 보조 혹은 AI 주도 작성으로 보입니다',
  likely_ai: 'AI가 작성했을 가능성이 높습니다',
  ai: 'AI가 작성한 글일 가능성이 매우 높습니다',
};

// 신호 레벨 텍스트 - 각 항목은 AI 탐지 신호의 심각도를 나타냄
// low = AI 신호 거의 없음, mid = 약간 있음, high = 심각
const SIGNAL_LABELS: Record<string, { low: string; mid: string; high: string }> = {
  burstiness:  { low: '심각', mid: '약간 있음', high: '거의 없음' }, // dangerValue가 높을수록 획일적
  lexical:     { low: '거의 없음', mid: '약간 있음', high: '심각' },
  structural:  { low: '거의 없음', mid: '약간 있음', high: '심각' },
  conjunction: { low: '거의 없음', mid: '약간 있음', high: '심각' },
};

// 신호 레벨 색상 - low: 빨강(AI 신호 강함), high: 초록(AI 신호 약함)은
// burstiness만 반전된 해석이므로 별도 처리
const SIGNAL_COLORS = {
  burstiness: { low: '#dc2626', mid: '#d97706', high: '#16a34a' },
  default:    { low: '#16a34a', mid: '#d97706', high: '#dc2626' },
};

function getSignalLevel(v: number): 'low' | 'mid' | 'high' {
  if (v < 0.3) return 'low';
  if (v < 0.65) return 'mid';
  return 'high';
}

const BADGE_COLORS: Record<NonNullable<DetectionResult['badge']>, string> = {
  human: '#16a34a',
  likely_human: '#65a30d',
  mixed: '#d97706',
  likely_ai: '#ea580c',
  ai: '#dc2626',
};

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [workflowState, setWorkflowState] = useState<WorkflowState>('initial');
  const [originalText, setOriginalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  // 개선 이력 스택
  const [resultsStack, setResultsStack] = useState<ImprovementResult[]>([]);

  // 반응형 감지
  useEffect(() => {
    const checkIsMobile = () => {
      const mobileWidth = window.innerWidth <= 768;
      setIsMobile(mobileWidth);
      if (mobileWidth) {
        setIsSidebarOpen(false); // 모바일 진입 시 자동 닫힘
      } else if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // 태블릿(아이패드 세로 등) 좁은 뷰포트에서도 닫힘
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 액션 핸들러
  const handleInspect = async () => {
    if (!originalText.trim() || isLoading) return;
    setIsLoading(true);
    setAnalysisError(null);
    setDetectionResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? '분석 중 오류가 발생했습니다.');
      }

      setDetectionResult(data as DetectionResult);
      setWorkflowState('inspected');
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류';
      setAnalysisError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectImprove = () => {
    if (!originalText.trim()) return;
    setWorkflowState('direct_improve');
  };

  const handleImprove = () => {
    // 임시 더미 데이터로 새 결과 추가
    const newResult: ImprovementResult = {
      id: Date.now(),
      text: "평소 블로그 포스팅을 할 때 가장 고민되는 부분이 바로 '어투'인데요. GPT를 쓰다 보면 특유의 딱딱함 때문에 고민이 많으셨죠?\n\n이번에 소개해드릴 방법은 그런 기계적인 느낌을 싹 지워주는 꿀팁입니다. 단순히 단어를 바꾸는 게 아니라 전체적인 문장의 흐름을 구어체로 재구성하여 훨씬 자연스럽게 읽히도록 만들었습니다.",
      score: Math.floor(Math.random() * (99 - 85) + 85), // 85~99점 사이
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      report: "기존 원고의 나열식 구조를 구어체 흐름으로 재조립했습니다. 불필요한 관형사를 제거하고 문장 간의 의미적 연결성을 강화하여 검색 엔진 우회율을 극대화했습니다."
    };

    // 최신 결과가 배열의 맨 앞에 오도록 (Top-down stack)
    setResultsStack(prev => [newResult, ...prev]);
    setWorkflowState('improved');
  };

  const resetWorkflow = () => {
    setWorkflowState('initial');
    setOriginalText('');
    setResultsStack([]);
    setDetectionResult(null);
    setAnalysisError(null);
    setIsLoading(false);
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="flex-row" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* 2. Left Panel (Side Bar) */}
        {!isSidebarOpen && isMobile ? null : (
        <aside
          style={{
            position: isMobile ? 'absolute' : 'relative',
            left: 0,
            top: 0,
            bottom: 0,
            width: isSidebarOpen ? '280px' : '64px',
            transition: 'width 0.3s ease, transform 0.3s ease',
            backgroundColor: '#ffffff',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 30,
            boxShadow: isMobile ? 'var(--shadow-lg)' : 'none'
          }}
        >
          <div className="flex-col p-16 h-full" style={{ width: isSidebarOpen ? '280px' : '64px', minWidth: isSidebarOpen ? '280px' : '64px' }}>
            {/* 상단 컨트롤 영역 */}
            {/* 상단 컨트롤 영역 */}
            <div className="flex-row items-center m-b-16" style={{ width: '100%', justifyContent: isSidebarOpen ? 'flex-end' : 'center' }}>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ backgroundColor: 'transparent', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer' }}
                className="hover:bg-gray-100"
              >
                {isSidebarOpen ? '◀' : '▶'}
              </button>
            </div>

            {/* 메인 메뉴 (HeaderAuth에서 이동됨) */}
            {isSidebarOpen ? (
              <div className="flex-col gap-8 m-b-24">
                <div style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '12px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }} className="font-14 flex-row items-center gap-12">
                  <span>📝</span> 단일 텍스트 작업
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer' }} className="font-14 text-muted flex-row items-center justify-between hover:bg-gray-50">
                  <div className="flex-row items-center gap-12"><span>🎭</span> 나의 페르소나 저장소</div>
                  <span style={{ backgroundColor: '#e0e7ff', color: 'var(--primary-color)', padding: '2px 6px', borderRadius: '4px' }} className="font-11 font-bold">PRO</span>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer' }} className="font-14 text-muted flex-row items-center justify-between hover:bg-gray-50">
                  <div className="flex-row items-center gap-12"><span>📚</span> 대량 변환 작업</div>
                  <span style={{ backgroundColor: '#e0e7ff', color: 'var(--primary-color)', padding: '2px 6px', borderRadius: '4px' }} className="font-11 font-bold">PRO</span>
                </div>
              </div>
            ) : (
              <div className="flex-col gap-12 m-b-24 items-center">
                <div style={{ backgroundColor: '#f3f4f6', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="단일 텍스트 작업">📝</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:bg-gray-50" title="나의 페르소나 저장소 (PRO)">🎭</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="hover:bg-gray-50" title="대량 변환 작업 (PRO)">📚</div>
              </div>
            )}

            {/* 새로운 작업 버튼 */}
            <button
              onClick={resetWorkflow}
              className="btn-primary flex-row-center justify-center m-b-24"
              style={{ padding: isSidebarOpen ? '12px' : '12px 0', borderRadius: '12px', fontSize: '15px', fontWeight: 700, width: '100%' }}
            >
              {isSidebarOpen ? <><span style={{ fontSize: '18px', marginRight: '6px' }}>+</span> 새로운 작업</> : <span style={{ fontSize: '18px' }}>+</span>}
            </button>

            {/* 작업 기록 */}
            {isSidebarOpen && (
              <div className="flex-col flex-1 overflow-y-auto">
                <span className="font-bold-12 text-light m-b-12 px-4">최근 작업 기록</span>

                <div className="flex-row items-center gap-12 p-8 m-b-4 cursor-pointer hover:bg-gray-100" style={{ borderRadius: '8px', transition: 'background-color 0.2s' }}>
                  <div className="font-14 text-muted" style={{ paddingLeft: '4px' }}>💬</div>
                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span className="font-14" style={{ color: '#374151' }}>건강식품 블로그 포스팅 초안</span>
                  </div>
                </div>

                <div className="flex-row items-center gap-12 p-8 m-b-4 cursor-pointer hover:bg-gray-100" style={{ borderRadius: '8px', transition: 'background-color 0.2s' }}>
                  <div className="font-14 text-muted" style={{ paddingLeft: '4px' }}>💬</div>
                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span className="font-14" style={{ color: '#374151' }}>협찬 광고 가이드 초안</span>
                  </div>
                </div>
              </div>
            )}

            {!isSidebarOpen && (
              <div className="flex-col items-center gap-16 mt-4">
                <div className="flex-row-center justify-center font-14 text-muted hover:bg-gray-100" title="건강식품 블로그 포스팅 초안" style={{ width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>💬</div>
                <div className="flex-row-center justify-center font-14 text-muted hover:bg-gray-100" title="협찬 광고 가이드 초안" style={{ width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>💬</div>
              </div>
            )}
          </div>
        </aside>
        )}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-color)', position: 'relative' }}>
          
          {/* 모바일에서 사이드바가 닫혀있을 때 열 수 있는 햄버거 버튼 */}
          {isMobile && !isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{ position: 'absolute', left: '16px', top: '16px', zIndex: 10, backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#4b5563' }}
            >
              ▶ 메뉴보기
            </button>
          )}

          <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '64px 20px 80px' : '40px 20px 120px' }}>

            <div className="flex-col gap-24">

              {/* === Step 1 Box: 원본 텍스트 박스 === */}
              <div className="card" style={{ padding: '24px', border: workflowState !== 'initial' ? '1px solid transparent' : '1px solid var(--border-color)', backgroundColor: workflowState !== 'initial' ? '#f9fafb' : '#ffffff' }}>
                <div className="flex-row justify-between items-center m-b-16">
                  <h3 className="font-bold-15 text-muted">원본 텍스트 입력</h3>
                  {workflowState === 'initial' && <span className="font-12 text-light">{originalText.length} / 5,000자</span>}
                </div>

                <textarea
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  readOnly={workflowState !== 'initial' || isLoading}
                  placeholder="AI가 작성한 텍스트를 이곳에 붙여넣으세요..."
                  className="font-15 w-full"
                  style={{
                    minHeight: '240px',
                    borderRadius: '12px',
                    border: (workflowState === 'initial' && !isLoading) ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: (workflowState === 'initial' && !isLoading) ? '#fff' : 'transparent',
                    color: '#111827',
                    resize: 'none',
                    outline: 'none',
                    padding: (workflowState === 'initial' && !isLoading) ? '16px' : '0'
                  }}
                ></textarea>

                {workflowState === 'initial' && (
                  <div className="flex-row justify-end gap-12 m-t-16 pt-16" style={{ borderTop: '1px solid #f3f4f6' }}>
                    <button onClick={handleDirectImprove} className="btn-outline font-bold-14" style={{ borderRadius: '8px', padding: '10px 20px' }}>
                      ⚡️ 검사 없이 바로 개선하기
                    </button>
                    <button
                      onClick={handleInspect}
                      disabled={isLoading || originalText.trim().length < 30}
                      className="btn-primary font-bold-14"
                      style={{ borderRadius: '8px', padding: '10px 20px', opacity: isLoading || originalText.trim().length < 30 ? 0.6 : 1, cursor: isLoading || originalText.trim().length < 30 ? 'not-allowed' : 'pointer' }}
                    >
                      {isLoading ? <>⏳ 분석 중...</> : '📊 텍스트 검사하기'}
                    </button>
                  </div>
                )}

                {/* 로딩 상태 표시 */}
                {isLoading && (
                  <div className="flex-row-center gap-12 m-t-16 p-16" style={{ backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <div style={{ width: '20px', height: '20px', border: '3px solid #0ea5e9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }}></div>
                    <span className="font-14" style={{ color: '#0369a1' }}>한국어 분석 엔진 구동 중...</span>
                  </div>
                )}

                {/* 오류 메시지 */}
                {analysisError && (
                  <div className="flex-row gap-12 m-t-16 p-16" style={{ backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
                    <span style={{ fontSize: '18px' }}>⚠️</span>
                    <span className="font-14" style={{ color: '#dc2626' }}>{analysisError}</span>
                  </div>
                )}
              </div>

              {/* === Step 2 Box: 검사 결과 박스 === */}
              {workflowState === 'inspected' && detectionResult && (() => {
                const badgeColor = BADGE_COLORS[detectionResult.badge];
                const badgeLabel = BADGE_LABELS[detectionResult.badge];
                const a = detectionResult.rawAnalysis;

                const signals = [
                  { label: '문장 길이의 회일성', dangerValue: 1 - a.burstinessScore, key: 'burstiness' },
                  { label: 'AI 특유 어휘의 빈번한 사용', dangerValue: a.aiVocabularyDensity, key: 'lexical' },
                  { label: '구조적 패턴의 반복', dangerValue: a.structuralRigidity, key: 'structural' },
                  { label: '접속어의 과도한 반복 사용', dangerValue: a.conjunctionDensity, key: 'conjunction' },
                ];

                return (
                  <div className="card" style={{ padding: '36px', border: `1.5px solid ${badgeColor}` }}>

                    {/* 점수 헤더 */}
                    <div className="flex-row items-center gap-32" style={{ marginBottom: '32px' }}>
                      <div style={{ textAlign: 'center', minWidth: '130px' }}>
                        <div style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1, color: badgeColor }}>
                          {detectionResult.humanScore}%
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginTop: '8px' }}>
                          인간 작성 확률
                        </div>
                      </div>

                      <div style={{ width: '1px', backgroundColor: '#e5e7eb', alignSelf: 'stretch' }}></div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: badgeColor, marginBottom: '10px' }}>🔍 분석 결과</div>
                        <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#374151', marginBottom: '12px' }}>{detectionResult.summary}</p>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>{badgeLabel}</div>
                      </div>
                    </div>

                    {/* AI 탐지 신호 */}
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '28px', marginBottom: '28px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>AI 탐지 신호</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>아래 항목이 심각할수록 AI 작성 가능성이 높아집니다</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {signals.map(({ label, dangerValue, key }) => {
                          const level = getSignalLevel(dangerValue);
                          const signalText = SIGNAL_LABELS[key][level];
                          const colorMap = key === 'burstiness' ? SIGNAL_COLORS.burstiness : SIGNAL_COLORS.default;
                          const dotColor = colorMap[level];
                          return (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '14px', color: '#374151' }}>{label}</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: dotColor, display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '16px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: dotColor, display: 'inline-block' }}></span>
                                {signalText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 탐지된 AI 어휘 */}
                    {detectionResult.detectedKeywords.length > 0 && (
                      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280', marginBottom: '14px' }}>탐지된 AI 특유 표현</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {detectionResult.detectedKeywords.map(kw => (
                            <span key={kw} style={{ fontSize: '13px', backgroundColor: '#fef9ec', border: '1px solid #fde68a', borderRadius: '6px', padding: '4px 12px', color: '#92400e' }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* === Step 3 Box: 개선 설정 및 액션 버튼 === */}
              {workflowState !== 'initial' && (
                <div className="card" style={{ padding: '40px', border: '2px solid var(--primary-color)' }}>
                  <h3 className="font-bold-18" style={{ marginBottom: '10px' }}>인간처럼 글 개선하기</h3>
                  <p className="font-13 text-muted" style={{ marginBottom: '36px' }}>AI 특유의 글 쓰기 특징들을 지우고 보다 인간이 작성한 글처럼 보이도록 개선합니다.</p>

                  <div className="flex-row gap-24" style={{ marginBottom: '32px' }}>
                    <div className="flex-1">
                      <label className="font-bold-13 text-muted m-b-8" style={{ display: 'block' }}>작성 모드</label>
                      <select className="w-full font-14" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none' }}>
                        <option>블로그 (정보성 리뷰)</option>
                        <option>에세이/칼럼</option>
                        <option>광고/카피라이팅</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="font-bold-13 text-muted m-b-8" style={{ display: 'block' }}>존댓말 옵션</label>
                      <select className="w-full font-14" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', outline: 'none' }}>
                        <option>해요체 (~해요)</option>
                        <option>합쇼체 (~합니다)</option>
                        <option>평어체 (~다)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '36px' }}>
                    <div>
                      <div className="flex-row justify-between m-b-8">
                        <span className="font-bold-13 text-muted">진지함 레벨</span>
                        <span className="font-bold-13 text-primary">Lv. 3</span>
                      </div>
                      <input type="range" min="1" max="5" defaultValue="3" className="w-full" />
                      <div className="flex-row justify-between m-t-4">
                        <span className="font-11 text-light">캐주얼</span>
                        <span className="font-11 text-light">격식</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex-row justify-between m-b-8">
                        <span className="font-bold-13 text-muted">감성/주관 레벨</span>
                        <span className="font-bold-13 text-primary">Lv. 4</span>
                      </div>
                      <input type="range" min="1" max="5" defaultValue="4" className="w-full" />
                      <div className="flex-row justify-between m-t-4">
                        <span className="font-11 text-light">객관적</span>
                        <span className="font-11 text-light">주관적</span>
                      </div>
                    </div>
                  </div>

                  {/* 페르소나 적용 영역 */}
                  <div className="flex-row justify-between items-center p-16" style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', marginBottom: '36px' }}>
                    <div>
                      <div className="flex-row items-center gap-8 m-b-4">
                        <span className="font-bold-14">내 페르소나 적용</span>
                        <span style={{ backgroundColor: 'var(--primary-color)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }} className="font-bold-11">PRO</span>
                      </div>
                      <div className="font-12 text-muted">내 페르소나 적용 시 위 레벨 설정보다 우선순위를 가집니다.</div>
                    </div>
                    <button style={{ backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 16px', color: '#9ca3af' }} className="font-bold-13">
                      내 페르소나 사용 🔒
                    </button>
                  </div>

                  <button onClick={handleImprove} className="btn-primary w-full justify-center p-16 font-bold-16" style={{ borderRadius: '12px' }}>
                    ✨ {workflowState === 'improved' ? '글 다시 개선하기' : '위 설정으로 글 개선하기'}
                  </button>
                </div>
              )}

              {/* === Step 4 Box: 개선 결과 스택 === */}
              {resultsStack.map((result, index) => (
                <div key={result.id} className="card p-24" style={{
                  border: index === 0 ? '2px solid var(--success-color)' : '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  opacity: index === 0 ? 1 : 0.7,
                  marginTop: index === 0 ? '0' : '-8px',
                  boxShadow: index === 0 ? 'var(--shadow-md)' : 'none'
                }}>
                  <div className="flex-row justify-between items-center m-b-16 pb-16" style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <div className="flex-row items-center gap-12">
                      <h3 className="font-bold-16 text-success">개선된 텍스트</h3>
                      <span className="badge-small badge-success font-11">인간 작성 확률 99%</span>
                      <span className="font-12 text-light ml-2">{result.timestamp}</span>
                    </div>
                    <button className="flex-row items-center gap-8 text-primary font-bold-13 cursor-pointer" style={{ backgroundColor: 'transparent', padding: '4px 8px' }}>
                      📋 복사하기
                    </button>
                  </div>

                  <div className="flex-1 p-24 bg-gray-light m-b-16" style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p className="font-15" style={{ color: '#111827', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                      {result.text}
                    </p>
                  </div>

                  <div className="flex-row gap-12 p-16" style={{ backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div className="text-success" style={{ fontSize: '20px' }}>💡</div>
                    <div>
                      <h4 className="font-bold-13 text-success m-b-4">개선 엔진 리포트 (Gultong Score: 92/100)</h4>
                      <p className="font-13 text-muted">{result.report}</p>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
