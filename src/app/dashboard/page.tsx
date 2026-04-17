export default function DashboardPage() {
  return (
    <main className="flex-col flex-1 gap-24 w-full p-24" style={{ height: 'calc(100vh - 64px)' }}>
      
      {/* Top Switcher */}
      <div className="flex-row justify-center">
        <div style={{ display: 'inline-flex', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
           <button style={{ backgroundColor: '#fff', border: '1px solid #d1d5db', padding: '6px 16px', borderRadius: '6px' }} className="font-bold-13">단일 텍스트</button>
           <button style={{ backgroundColor: 'transparent', border: 'none', padding: '6px 16px', borderRadius: '6px' }} className="font-bold-13 text-muted">대량 변환 <span style={{ backgroundColor: '#e0e7ff', color: 'var(--primary-color)', padding: '2px 4px', borderRadius: '4px', marginLeft: '4px' }} className="font-11">PRO</span></button>
        </div>
      </div>

      <div className="flex-row flex-1 overflow-hidden gap-24">
        {/* Left Panel: Input & Controls */}
        <section className="flex-col flex-1 overflow-y-auto pr-4 gap-16">
          
          <div className="flex-row justify-between items-end px-4" style={{ marginBottom: '-8px' }}>
            <h3 className="font-bold-15">원본 텍스트 입력 (AI 초안)</h3>
            <span className="font-13" style={{ color: '#9ca3af' }}>0 / 5,000자</span>
          </div>
          
          <textarea 
            placeholder="AI가 작성한 원고를 이곳에 붙여넣으세요. 기계적인 문투를 지우고 자연스러운 문장으로 변환합니다."
            className="flex-1 p-24 font-15"
            style={{ width: '100%', minHeight: '300px', borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#fff', color: '#111827', resize: 'none', outline: 'none', boxShadow: 'var(--shadow-sm)' }}
          ></textarea>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <h3 className="font-bold-15 m-b-16 px-4">상세 변환 설정</h3>
            
            <div className="flex-row gap-16 m-b-24">
              <div className="flex-1">
                <label className="font-13 text-muted m-b-8" style={{ display: 'block' }}>작성 모드</label>
                <select className="w-full p-16 font-14" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', outline: 'none', color: '#111827', appearance: 'none' }}>
                  <option>블로그 (정보성)</option>
                  <option>블로그 (리뷰)</option>
                </select>
              </div>
              <div className="flex-1">
                 <label className="font-13 text-muted m-b-8" style={{ display: 'block' }}>종결어미 (높임말)</label>
                <select className="w-full font-14" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', outline: 'none', color: '#111827', appearance: 'none' }}>
                  <option>해요체 (~해요)</option>
                  <option>평어체 (~다)</option>
                </select>
              </div>
            </div>

            <div className="m-b-24">
               <div className="flex-row justify-between m-b-8">
                 <span className="font-13 text-muted">진지함/격식 수준</span>
                 <span className="font-bold-13 text-primary">Lv. 3</span>
               </div>
               <input type="range" min="1" max="5" defaultValue="3" className="w-full cursor-pointer" />
               <div className="flex-row justify-between m-t-8">
                 <span className="font-11" style={{ color: '#9ca3af' }}>캐주얼</span>
                 <span className="font-11" style={{ color: '#9ca3af' }}>매우 격식</span>
               </div>
            </div>

            <div className="m-b-32">
               <div className="flex-row justify-between m-b-8">
                 <span className="font-13 text-muted">감성/주관성 개입</span>
                 <span className="font-bold-13 text-primary">Lv. 2</span>
               </div>
               <input type="range" min="1" max="5" defaultValue="2" className="w-full cursor-pointer" />
               <div className="flex-row justify-between m-t-8">
                 <span className="font-11" style={{ color: '#9ca3af' }}>객관적/건조함</span>
                 <span className="font-11" style={{ color: '#9ca3af' }}>매우 주관적</span>
               </div>
            </div>

            <div className="flex-row justify-between items-center m-b-24 bg-gray-light p-16" style={{ borderRadius: '12px' }}>
              <div>
                <div className="flex-row items-center gap-8 m-b-8">
                  <span className="font-bold-14">내 페르소나 적용</span>
                  <span style={{ backgroundColor: 'var(--primary-color)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }} className="font-bold-11">PRO</span>
                </div>
                <div className="font-12" style={{ color: '#6b7280' }}>나의 실제 문체를 학습한 모델을 불러옵니다.</div>
              </div>
              <button style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 16px', color: '#9ca3af' }} className="font-13 cursor-pointer">선택되지 않음 🔒</button>
            </div>

            <button className="btn-primary w-full p-16" style={{ fontSize: '16px', borderRadius: '12px' }}>
              ✨ 텍스트 휴머나이징 시작
            </button>
          </div>
        </section>

        {/* Right Panel: Output & Analysis */}
        <section className="flex-col flex-1 overflow-y-auto pl-4 gap-16">
          
          {/* Analysis Card */}
          <div className="card p-24">
            <div className="flex-row justify-between items-center m-b-24">
              <h3 className="font-bold-15">AI 감지 회피 분석 결과</h3>
              <div className="flex-row gap-8 font-bold-11">
                <span className="badge-small badge-success">불용어 제거 완료</span>
                <span className="badge-small badge-primary" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>문체 융합 성공</span>
              </div>
            </div>

            <div className="flex-row items-center justify-around text-center m-b-24">
               <div>
                 <p className="font-bold-11 m-b-8" style={{ color: '#6b7280' }}>BEFORE SCORE</p>
                 <h2 className="text-error" style={{ fontSize: '36px', fontWeight: 800 }}>35 <span className="font-bold-16" style={{ color: '#9ca3af' }}>/100</span></h2>
                 <p className="font-bold-12 text-error m-t-8">AI 탐지 확률 매우 높음</p>
               </div>
               <div><span style={{color: '#d1d5db', fontSize: '32px'}}>&raquo;</span></div>
               <div>
                 <p className="font-bold-11 text-primary m-b-8">GULTONG SCORE</p>
                 <h2 className="text-primary" style={{ fontSize: '36px', fontWeight: 800 }}>92 <span className="font-bold-16" style={{ color: '#9ca3af' }}>/100</span></h2>
                 <p className="font-bold-12 text-primary m-t-8">인간 작성 확률 99.9%</p>
               </div>
            </div>

            <div className="flex-row gap-12 p-16" style={{ backgroundColor: '#eff6ff', borderRadius: '8px' }}>
               <div className="text-primary">ℹ️</div>
               <div>
                 <h4 className="font-bold-13 text-primary m-b-8">AI 분석 리포트</h4>
                 <p className="font-12" style={{ color: '#1e3a8a', lineHeight: 1.6 }}>기존 원고의 '첫째, 둘째'식의 나열식 구조를 구어체 흐름으로 재조립했습니다. 불필요한 관형사를 제거하고 문장 간의 의미적 연결성을 강화하여 검색 엔진 우회율을 극대화했습니다.</p>
               </div>
            </div>
          </div>

          {/* Result Text Sub-panel */}
          <div className="card p-24 flex-1 flex-col">
            <div className="flex-row justify-between items-center m-b-16">
               <h3 className="font-bold-15">변환된 결과물</h3>
               <button className="flex-row items-center gap-8 text-primary font-bold-13 cursor-pointer" style={{ backgroundColor: 'transparent', border: 'none' }}>📋 전체 복사하기</button>
            </div>
            <div className="flex-1 bg-gray-light p-24" style={{ borderRadius: '12px', border: '1px solid #e5e7eb', position: 'relative' }}>
               <textarea 
                 defaultValue={`평소 블로그 포스팅을 할 때 가장 고민되는 부분이 바로 '어투'인데요. GPT를 쓰다 보면 특유의 딱딱함 때문에 고민이 많으셨죠?\n\n이번에 소개해드릴 방법은 그런 기계적인 느낌을 싹 지워주는 꿀팁입니다. 단순히 단어를 바꾸는 게 아니라 전체적인 문장의 흐름을...`}
                 readOnly
                 className="w-full h-full font-15"
                 style={{ border: 'none', backgroundColor: 'transparent', resize: 'none', outline: 'none', color: '#111827', lineHeight: '1.8' }}
               />
            </div>
          </div>

           {/* History Stack */}
           <div className="m-t-16">
             <h4 className="font-13 text-muted m-b-16 px-4">최근 변환 히스토리</h4>
             
             <div className="card p-16 flex-row justify-between items-center m-b-8 cursor-pointer">
               <div className="flex-row items-center gap-12">
                 <div className="flex-row items-center justify-center font-12" style={{ width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>📄</div>
                 <div>
                   <div className="font-bold-14 m-b-8" style={{ color: '#111827', marginBottom: '2px' }}>네이버 블로그_건강식품_포스팅_1.txt</div>
                   <div className="font-11" style={{ color: '#9ca3af' }}>방금 전 · 1,245자</div>
                 </div>
               </div>
               <div className="text-primary font-bold-14">94점 &gt;</div>
             </div>
             
             <div className="card p-16 flex-row justify-between items-center m-b-8 cursor-pointer" style={{ opacity: 0.7 }}>
               <div className="flex-row items-center gap-12">
                 <div className="flex-row items-center justify-center font-12" style={{ width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>📄</div>
                 <div>
                   <div className="font-bold-14 m-b-8" style={{ color: '#111827', marginBottom: '2px' }}>인스타그램_협찬_광고_가이드.docx</div>
                   <div className="font-11" style={{ color: '#9ca3af' }}>2시간 전 · 450자</div>
                 </div>
               </div>
               <div className="font-bold-14 text-muted">88점 &gt;</div>
             </div>
             
             <div className="text-center m-t-16 m-b-16">
               <span className="font-12 text-muted cursor-pointer">전체 히스토리 보기</span>
             </div>
           </div>

        </section>

      </div>
    </main>
  )
}
