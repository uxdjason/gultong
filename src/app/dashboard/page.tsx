export default function DashboardPage() {
  return (
    <main style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '24px', width: '100%', height: 'calc(100vh - 64px)' }}>
      
      {/* Top Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
           <button style={{ backgroundColor: '#fff', border: '1px solid #d1d5db', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#111827', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>단일 텍스트</button>
           <button style={{ backgroundColor: 'transparent', border: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>대량 변환 <span style={{ backgroundColor: '#e0e7ff', color: 'var(--primary-color)', fontSize: '10px', padding: '2px 4px', borderRadius: '4px', marginLeft: '4px' }}>PRO</span></button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel: Input & Controls */}
        <section style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '4px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '-8px', padding: '0 4px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>원본 텍스트 입력 (AI 초안)</h3>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>0 / 5,000자</span>
          </div>
          
          <textarea 
            placeholder="AI가 작성한 원고를 이곳에 붙여넣으세요. 기계적인 문투를 지우고 자연스러운 문장으로 변환합니다."
            style={{ width: '100%', flex: '1', minHeight: '300px', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', backgroundColor: '#fff', fontSize: '15px', color: '#111827', resize: 'none', outline: 'none', boxShadow: 'var(--shadow-sm)' }}
          ></textarea>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px', padding: '0 4px' }}>상세 변환 설정</h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>작성 모드</label>
                <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', outline: 'none', fontSize: '14px', color: '#111827', appearance: 'none' }}>
                  <option>블로그 (정보성)</option>
                  <option>블로그 (리뷰)</option>
                </select>
              </div>
              <div style={{ flex: '1' }}>
                 <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '8px' }}>종결어미 (높임말)</label>
                <select style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: '#fff', outline: 'none', fontSize: '14px', color: '#111827', appearance: 'none' }}>
                  <option>해요체 (~해요)</option>
                  <option>평어체 (~다)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '13px', color: '#4b5563' }}>진지함/격식 수준</span>
                 <span style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 700 }}>Lv. 3</span>
               </div>
               <input type="range" min="1" max="5" defaultValue="3" style={{ width: '100%', cursor: 'pointer' }} />
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                 <span style={{ fontSize: '11px', color: '#9ca3af' }}>캐주얼</span>
                 <span style={{ fontSize: '11px', color: '#9ca3af' }}>매우 격식</span>
               </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '13px', color: '#4b5563' }}>감성/주관성 개입</span>
                 <span style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 700 }}>Lv. 2</span>
               </div>
               <input type="range" min="1" max="5" defaultValue="2" style={{ width: '100%', cursor: 'pointer' }} />
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                 <span style={{ fontSize: '11px', color: '#9ca3af' }}>객관적/건조함</span>
                 <span style={{ fontSize: '11px', color: '#9ca3af' }}>매우 주관적</span>
               </div>
            </div>

            <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>내 페르소나 적용</span>
                  <span style={{ backgroundColor: 'var(--primary-color)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>PRO</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>나의 실제 문체를 학습한 모델을 불러옵니다.</div>
              </div>
              <button style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', color: '#9ca3af', cursor: 'not-allowed' }}>선택되지 않음 🔒</button>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: '12px' }}>
              ✨ 텍스트 휴머나이징 시작
            </button>
          </div>
        </section>

        {/* Right Panel: Output & Analysis */}
        <section style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingLeft: '4px' }}>
          
          {/* Analysis Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>AI 감지 회피 분석 결과</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>불용어 제거 완료</span>
                <span style={{ backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>문체 융합 성공</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center', marginBottom: '24px' }}>
               <div>
                 <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px', fontWeight: 700 }}>BEFORE SCORE</p>
                 <h2 style={{ color: 'var(--error-color)', fontSize: '36px', fontWeight: 800 }}>35 <span style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 600 }}>/100</span></h2>
                 <p style={{ fontSize: '12px', color: 'var(--error-color)', fontWeight: 700, marginTop: '4px' }}>AI 탐지 확률 매우 높음</p>
               </div>
               <div><span style={{color: '#d1d5db', fontSize: '32px'}}>&raquo;</span></div>
               <div>
                 <p style={{ fontSize: '11px', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: 700 }}>GULTONG SCORE</p>
                 <h2 style={{ color: 'var(--primary-color)', fontSize: '36px', fontWeight: 800 }}>92 <span style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 600 }}>/100</span></h2>
                 <p style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 700, marginTop: '4px' }}>인간 작성 확률 99.9%</p>
               </div>
            </div>

            <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px' }}>
               <div style={{ color: 'var(--primary-color)' }}>ℹ️</div>
               <div>
                 <h4 style={{ fontSize: '13px', color: 'var(--primary-color)', fontWeight: 700, marginBottom: '4px' }}>AI 분석 리포트</h4>
                 <p style={{ fontSize: '12px', color: '#1e3a8a', lineHeight: 1.6 }}>기존 원고의 '첫째, 둘째'식의 나열식 구조를 구어체 흐름으로 재조립했습니다. 불필요한 관형사를 제거하고 문장 간의 의미적 연결성을 강화하여 검색 엔진 우회율을 극대화했습니다.</p>
               </div>
            </div>
          </div>

          {/* Result Text Sub-panel */}
          <div className="card" style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
               <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>변환된 결과물</h3>
               <button style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>📋 전체 복사하기</button>
            </div>
            <div style={{ flex: '1', backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', position: 'relative' }}>
               <textarea 
                 defaultValue={`평소 블로그 포스팅을 할 때 가장 고민되는 부분이 바로 '어투'인데요. GPT를 쓰다 보면 특유의 딱딱함 때문에 고민이 많으셨죠?\n\n이번에 소개해드릴 방법은 그런 기계적인 느낌을 싹 지워주는 꿀팁입니다. 단순히 단어를 바꾸는 게 아니라 전체적인 문장의 흐름을...`}
                 readOnly
                 style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent', resize: 'none', outline: 'none', fontSize: '15px', color: '#111827', lineHeight: '1.8' }}
               />
            </div>
          </div>

           {/* History Stack */}
           <div style={{ marginTop: '12px' }}>
             <h4 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', padding: '0 4px' }}>최근 변환 히스토리</h4>
             <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <div style={{ width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>📄</div>
                 <div>
                   <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>네이버 블로그_건강식품_포스팅_1.txt</div>
                   <div style={{ fontSize: '11px', color: '#9ca3af' }}>방금 전 · 1,245자</div>
                 </div>
               </div>
               <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '14px' }}>94점 &gt;</div>
             </div>
             
             <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer', opacity: 0.7 }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <div style={{ width: '24px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>📄</div>
                 <div>
                   <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '2px' }}>인스타그램_협찬_광고_가이드.docx</div>
                   <div style={{ fontSize: '11px', color: '#9ca3af' }}>2시간 전 · 450자</div>
                 </div>
               </div>
               <div style={{ color: '#4b5563', fontWeight: 700, fontSize: '14px' }}>88점 &gt;</div>
             </div>
             
             <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '16px' }}>
               <span style={{ fontSize: '12px', color: '#6b7280', cursor: 'pointer' }}>전체 히스토리 보기</span>
             </div>
           </div>

        </section>

      </div>
    </main>
  )
}
