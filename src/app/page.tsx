export default function LandingPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* 1. Hero Section */}
      <section className="container text-center" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#e0e7ff', color: 'var(--primary-color)', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>
          ● AI 감지 우회율 99.9% 달성
        </div>
        <h1>
          챗GPT로 쓴 글,<br />
          블로그 <span style={{ color: 'var(--error-color)' }}>'저품질'</span> 누락이 두려우신가요?
        </h1>
        <p className="text-muted mt-4" style={{ fontSize: '1.25rem' }}>
          검색 엔진을 완벽하게 우회하는 한국어 특화 휴머나이저.<br />
          AI의 기계적인 구조를 부수고 당신만의 문체로 재조립합니다.
        </p>
        
        <div className="mt-8">
          <button className="btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>
            지금 무료로 텍스트 변환해보기
          </button>
          <p className="text-muted" style={{ fontSize: '14px', marginTop: '12px' }}>
            ✓ 가입 없이 1,000자 무료 테스트 가능
          </p>
        </div>
        
        {/* Mockup Image Area */}
        <div className="mt-8 card" style={{ maxWidth: '900px', margin: '40px auto 0', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-lg)' }}>
          <span className="text-light">서비스 UI 목업 플레이스홀더</span>
        </div>
      </section>

      {/* 2. Pain Points Section */}
      <section className="container mt-8">
        <h2 className="text-center mb-8">
          AI로 10초 만에 쓴 글,<br />
          고치는 데 30분 걸리고 계시지 않습니까?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="card">
            <h3 style={{ color: 'var(--error-color)', marginBottom: '12px' }}>검색 누락 공포</h3>
            <p className="text-muted">AI 탐지 알고리즘에 걸려 힘들게 키운 블로그가 저품질에 빠질까 불안합니다.</p>
          </div>
          <div className="card">
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>이중 작업의 피로감</h3>
            <p className="text-muted">어색한 번역투와 기계적 템플릿을 지우느라 오히려 시간이 더 듭니다.</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#8b5cf6', marginBottom: '12px' }}>퍼스널 브랜딩 상실</h3>
            <p className="text-muted">내 블로그만의 고유한 말투와 개성이 천편일률적인 AI 문체에 묻혀버렸습니다.</p>
          </div>
        </div>
      </section>

    </main>
  )
}
