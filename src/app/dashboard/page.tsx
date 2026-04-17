"use client";

import { useState, useEffect } from 'react';

// 워크플로우 상태 정의
type WorkflowState = 'initial' | 'inspected' | 'direct_improve' | 'improved';

interface ImprovementResult {
  id: number;
  text: string;
  score: number;
  timestamp: string;
  report: string;
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [workflowState, setWorkflowState] = useState<WorkflowState>('initial');
  const [originalText, setOriginalText] = useState('');

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
  const handleInspect = () => {
    if (!originalText.trim()) return;
    setWorkflowState('inspected');
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
                  readOnly={workflowState !== 'initial'}
                  placeholder="AI가 작성한 텍스트를 이곳에 붙여넣으세요..."
                  className="font-15 w-full"
                  style={{
                    minHeight: workflowState === 'initial' ? '240px' : '100px',
                    borderRadius: '12px',
                    border: workflowState === 'initial' ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: workflowState === 'initial' ? '#fff' : 'transparent',
                    color: '#111827',
                    resize: 'none',
                    outline: 'none',
                    padding: workflowState === 'initial' ? '16px' : '0'
                  }}
                ></textarea>

                {workflowState === 'initial' && (
                  <div className="flex-row justify-end gap-12 m-t-16 pt-16" style={{ borderTop: '1px solid #f3f4f6' }}>
                    <button onClick={handleDirectImprove} className="btn-outline font-bold-14" style={{ borderRadius: '8px', padding: '10px 20px' }}>
                      ⚡️ 검사 없이 바로 개선하기
                    </button>
                    <button onClick={handleInspect} className="btn-primary font-bold-14" style={{ borderRadius: '8px', padding: '10px 20px' }}>
                      📊 텍스트 검사하기
                    </button>
                  </div>
                )}
              </div>

              {/* === Step 2 Box: 검사 결과 박스 (inspected 상태에서만 보임) === */}
              {workflowState === 'inspected' && (
                <div className="card p-24" style={{ borderLeft: '4px solid var(--error-color)' }}>
                  <h3 className="font-bold-15 m-b-16">🤖 AI 탐지 분석 결과</h3>
                  <div className="flex-row items-center gap-32">
                    <div className="text-center">
                      <h2 className="text-error" style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>35<span className="font-16 text-light">/100</span></h2>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold-14 text-error m-b-8">AI 작성 확률이 매우 높습니다.</p>
                      <p className="font-13 text-muted" style={{ lineHeight: 1.6 }}>기계적인 문장 구조와 잦은 접속사 사용 패턴이 감지되었습니다. 인터넷에 그대로 발행할 경우 검색 엔진 로직에 의해 스팸 분류될 가능성이 있습니다.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* === Step 3 Box: 개선 설정 및 액션 버튼 === */}
              {workflowState !== 'initial' && (
                <div className="card p-32" style={{ border: '2px solid var(--primary-color)' }}>
                  <h3 className="font-bold-18 m-b-8">인간처럼 글 개선하기</h3>
                  <p className="font-13 text-muted m-b-24">AI 특유의 글 쓰기 특징들을 지우고 보다 인간이 작성한 글처럼 보이도록 개선합니다.</p>

                  <div className="flex-row gap-24 m-b-24">
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

                  <div className="flex-row gap-40 m-b-32">
                    <div className="flex-1">
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
                    <div className="flex-1">
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
                  <div className="flex-row justify-between items-center m-b-32 p-16" style={{ backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
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
