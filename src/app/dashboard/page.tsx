export default function DashboardPage() {
  return (
    <main style={{ padding: '24px', display: 'flex', gap: '24px', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      
      {/* Left Panel: Input & Controls */}
      <section style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px', overflowY: 'auto' }}>
        <div className="card" style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px' }}>원본 텍스트 입력 (AI 초안)</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>0 / 5,000자</span>
          </div>
          <textarea 
            placeholder="AI가 작성한 원고를 이곳에 붙여넣으세요. 기계적인 문투를 지우고 자연스러운 문장으로 변환합니다."
            style={{ width: '100%', flex: '1', minHeight: '300px', padding: '16px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-main)', resize: 'none', outline: 'none' }}
          ></textarea>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>상세 변환 설정</h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: '1' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>작성 모드</label>
              <select style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none', fontSize: '14px' }}>
                <option>블로그 (정보성)</option>
                <option>블로그 (리뷰)</option>
              </select>
            </div>
            <div style={{ flex: '1' }}>
               <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>종결어미 (높임말)</label>
              <select style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none', fontSize: '14px' }}>
                <option>해요체 (~해요)</option>
                <option>평어체 (~다)</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>
            ✨ 텍스트 휴머나이징 시작
          </button>
        </div>
      </section>

      {/* Right Panel: Output & Analysis */}
      <section style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        
        {/* Analysis Card */}
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '24px' }}>AI 감지 회피 분석 결과</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', textAlign: 'center' }}>
             <div>
               <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>BEFORE SCORE</p>
               <h2 style={{ color: 'var(--error-color)', fontSize: '32px' }}>35 <span style={{ fontSize: '16px', color: 'var(--text-light)' }}>/100</span></h2>
               <p style={{ fontSize: '12px', color: 'var(--error-color)', fontWeight: 600, marginTop: '4px' }}>AI 탐지 확률 매우 높음</p>
             </div>
             <div><span style={{color: 'var(--border-color)', fontSize: '24px'}}>&raquo;</span></div>
             <div>
               <p style={{ fontSize: '12px', color: 'var(--primary-color)', marginBottom: '8px', fontWeight: 600 }}>GULTONG SCORE</p>
               <h2 style={{ color: 'var(--primary-color)', fontSize: '32px' }}>92 <span style={{ fontSize: '16px', color: 'var(--text-light)' }}>/100</span></h2>
               <p style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 600, marginTop: '4px' }}>인간 작성 확률 99.9%</p>
             </div>
          </div>
        </div>

        {/* Result Text Sub-panel */}
        <div className="card" style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
             <h3 style={{ fontSize: '16px' }}>변환된 결과물</h3>
             <button style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '13px', fontWeight: 600 }}>📋 전체 복사하기</button>
          </div>
          <div style={{ flex: '1', backgroundColor: '#fafafa', borderRadius: 'var(--border-radius)', pading: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
             <textarea 
               value="평소 블로그 포스팅을 할 때 가장 고민되는 부분이 바로 '어투'인데요. GPT를 쓰다 보면 특유의 딱딱함 때문에 고민이 많으셨죠? \n\n이번에 소개해드릴 방법은 그런 기계적인 느낌을 싹 지워주는 꿀팁입니다..."
               readOnly
               style={{ width: '100%', height: '100%', padding: '16px', border: 'none', backgroundColor: 'transparent', resize: 'none', outline: 'none', fontSize: '14px', lineHeight: '1.8' }}
             />
          </div>
        </div>
      </section>

    </main>
  )
}
