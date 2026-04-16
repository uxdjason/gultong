import Link from 'next/link';

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      
      {/* Navigation */}
      <nav className="gnb" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(249, 251, 255, 0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(229, 231, 235, 0.5)' }}>
        <div className="container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '24px', color: '#111827' }}>
            <img src="/images/gultong_logo_260416.svg" alt="글통 로고" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
            <span>글통<span style={{ color: 'var(--primary-color)' }}>.</span></span>
          </div>
          <div className="gnb-menu" style={{ gap: '40px' }}>
            <a href="#features" style={{color: '#4b5563', fontWeight: 600, fontSize: '15px'}}>핵심 기능</a>
            <a href="#pricing" style={{color: '#4b5563', fontWeight: 600, fontSize: '15px'}}>요금 안내</a>
            <a href="#use-case" style={{color: '#4b5563', fontWeight: 600, fontSize: '15px'}}>적용 사례</a>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ color: '#4b5563', fontSize: '15px', fontWeight: 600 }}>로그인</Link>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px', borderRadius: '8px' }}>무료로 시작하기</Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="container text-center" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#e0e7ff', color: 'var(--primary-color)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, marginBottom: '24px' }}>
          ● AI 감지 우회율 99.9% 달성
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.3 }}>
          챗GPT로 쓴 글,<br />
          블로그 <span style={{ color: 'var(--error-color)' }}>'저품질'</span> 누락이 두려우신가요?
        </h1>
        <p className="text-muted mt-4" style={{ fontSize: '1.25rem', marginTop: '24px', fontWeight: 500 }}>
          검색 엔진을 완벽하게 우회하는 한국어 특화 휴머나이저.<br />
          AI의 기계적인 구조를 부수고 당신만의 문체로 재조립합니다.
        </p>
        
        <div style={{ marginTop: '40px' }}>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '18px', padding: '18px 40px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(43, 93, 229, 0.4)' }}>
            지금 무료로 텍스트 변환해보기
          </Link>
          <p className="text-main" style={{ fontSize: '14px', marginTop: '16px', fontWeight: 500 }}>
            ✓ 가입 없이 1,000자 무료 테스트 가능
          </p>
        </div>
        
        {/* Mockup Image Area */}
        <div className="card" style={{ maxWidth: '960px', margin: '60px auto 0', height: 'auto', backgroundColor: '#fff', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-lg)', padding: '20px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: '16px', padding: '24px', textAlign: 'left', border: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>Original AI Text</span>
              </div>
              <div style={{ width: '100%', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ width: '90%', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ width: '95%', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '32px' }}></div>
              <div style={{ width: '100%', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ width: '85%', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ marginTop: '40px', backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }}>AI 작성 확률 98%</div>
            </div>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 10px rgba(43,93,229,0.3)' }}>
              <span style={{ fontSize: '24px' }}>&raquo;</span>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f0fdf4', borderRadius: '16px', padding: '24px', textAlign: 'left', border: '1px solid #dcfce7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-color)' }}>Humanized by Gultong</span>
              </div>
              <div style={{ width: '95%', height: '16px', backgroundColor: '#bfdbfe', opacity: 0.5, borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ width: '100%', height: '16px', backgroundColor: '#bfdbfe', opacity: 0.5, borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ width: '80%', height: '16px', backgroundColor: '#bfdbfe', opacity: 0.5, borderRadius: '8px', marginBottom: '32px' }}></div>
              <div style={{ width: '90%', height: '16px', backgroundColor: '#bfdbfe', opacity: 0.5, borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ width: '85%', height: '16px', backgroundColor: '#bfdbfe', opacity: 0.5, borderRadius: '8px', marginBottom: '12px' }}></div>
              <div style={{ marginTop: '40px', backgroundColor: '#d1fae5', color: '#059669', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, display: 'inline-block' }}>사람이 쓴 글 확률 99.9%</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pain Points Section */}
      <section className="container" style={{ paddingBottom: '120px' }}>
        <h2 className="text-center mb-8" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          AI로 10초 만에 쓴 글,<br />고치는 데 30분 걸리고 계시지 않습니까?
        </h2>
        <div style={{ width: '60px', height: '4px', backgroundColor: '#ef4444', margin: '0 auto 60px' }}></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="card" style={{ padding: '40px 32px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fee2e2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#ef4444', fontSize: '24px' }}>🚨</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>검색 누락 공포</h3>
            <p className="text-muted" style={{ fontSize: '15px' }}>AI 탐지 알고리즘에 걸려 힘들게 키운 블로그가 저품질에 빠질까 불안합니다.</p>
          </div>
          <div className="card" style={{ padding: '40px 32px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#ffedd5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#f97316', fontSize: '24px' }}>🕒</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>이중 작업의 피로감</h3>
            <p className="text-muted" style={{ fontSize: '15px' }}>어색한 번역투와 기계적 템플릿을 지우느라 오히려 시간이 더 듭니다.</p>
          </div>
          <div className="card" style={{ padding: '40px 32px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary-color)', fontSize: '24px' }}>👤</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>퍼스널 브랜딩 상실</h3>
            <p className="text-muted" style={{ fontSize: '15px' }}>내 블로그만의 고유한 말투와 개성이 천편일률적인 AI 문체에 묻혀버렸습니다.</p>
          </div>
        </div>
      </section>

      {/* 3. Core Features */}
      <section id="features" style={{ backgroundColor: '#ffffff', paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '80px' }}>
            <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '14px', letterSpacing: '1px' }}>CORE FEATURES</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '16px' }}>글통 하나로 검색 노출 방어와<br />생산성 극대화를 동시에</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '100px' }}>
            <div className="card" style={{ backgroundColor: '#f8fafc', padding: '40px', minHeight: '350px', position: 'relative' }}>
               <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, marginBottom: '12px' }}>✕ 기존 AI</div>
                  <p className="text-muted" style={{ fontSize: '14px' }}>1. 첫째로 중요한 것은... 2. 둘째로 고려할 점은... 3. 결론적으로...</p>
               </div>
               <div style={{ textAlign: 'center', color: 'var(--primary-color)', fontSize: '24px', marginBottom: '20px' }}>&darr;</div>
               <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '20px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 600, marginBottom: '12px' }}>✓ 글통 변환 후</div>
                  <p style={{ fontSize: '14px', color: '#1e3a8a' }}>가장 먼저 살펴봐야 할 부분이 있습니다. 바로... 이어서 놓치기 쉬운 포인트도 함께 짚어볼 텐데요...</p>
               </div>
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary-color)', fontSize: '24px' }}>🛡️</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>SEO 안전 보장 휴머나이저</h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: 600, marginBottom: '16px' }}>"기계적인 목차(Listicle) 완벽 해체"</p>
              <p className="text-muted" style={{ fontSize: '16px', lineHeight: 1.8 }}>단순한 단어 교체가 아닙니다. 검색 엔진이 '인간의 창작물'로 인식하도록 정보의 배치와 구조를 유기적으로 융합(Semantic Blending)합니다.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '100px' }}>
             <div style={{ order: 1 }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f3e8ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#9333ea', fontSize: '24px' }}>🎭</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>내 문체 복제 (Persona Cloning)</h3>
              <p style={{ color: '#9333ea', fontWeight: 600, marginBottom: '16px' }}>"나보다 더 나처럼 쓰는 AI"</p>
              <p className="text-muted" style={{ fontSize: '16px', lineHeight: 1.8 }}>과거에 직접 작성한 원고를 학습시킵니다. 평소의 띄어쓰기 습관, 자주 쓰는 어휘, 특유의 문장 호흡을 그대로 결과물에 입혀냅니다.</p>
            </div>
            <div className="card" style={{ backgroundColor: '#faf5ff', padding: '40px', minHeight: '350px', order: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#7e22ce' }}>나</div>
                    <div style={{ height: '8px', width: '100px', backgroundColor: '#e9d5ff', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', fontStyle: 'italic', color: '#4b5563', fontSize: '15px' }}>
                    "진짜 제가 쓴 줄 알았어요 ㅋㅋ 평소에 'ㅎㅎ' 나 '~거든요' 자주 쓰는데 그걸 똑같이 따라하네요 대박입니다."
                  </div>
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9333ea', fontWeight: 600 }}>
                    <span>STYLE MATCH RATE</span>
                    <span>99%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#f3e8ff', borderRadius: '4px', marginTop: '8px' }}>
                    <div style={{ height: '100%', width: '99%', backgroundColor: '#a855f7', borderRadius: '4px' }}></div>
                  </div>
               </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div className="card" style={{ backgroundColor: '#f0fdfa', padding: '40px', minHeight: '350px' }}>
               <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #ccfbf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{ fontSize: '20px' }}>📄</span> <span style={{ fontSize: '14px', fontWeight: 500, color:'#4b5563' }}>marketing_texts.csv</span>
                 </div>
                 <div style={{ backgroundColor: '#ccfbf1', color: '#0f766e', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>100 rows</div>
               </div>
               <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #ccfbf1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color:'#9ca3af' }}>블로그_포스팅_1.txt</span>
                 </div>
                 <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>✓ 완료</div>
               </div>
               <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid var(--primary-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', boxShadow: '0 0 0 2px rgba(43,93,229,0.2)' }}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color:'var(--primary-color)' }}>인스타그램_원고_모음.txt</span>
                 </div>
                 <div style={{ color: 'var(--primary-color)', fontSize: '12px', fontWeight: 600 }}>↻ 변환 중...</div>
               </div>
               <button className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>🚀 일괄 변환 시작</button>
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#ccfbf1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#0d9488', fontSize: '24px' }}>📦</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>대량 일괄 처리 (Bulk Process)</h3>
              <p style={{ color: '#0d9488', fontWeight: 600, marginBottom: '16px' }}>"수십 개의 마케팅 원고도 원클릭으로"</p>
              <p className="text-muted" style={{ fontSize: '16px', lineHeight: 1.8 }}>여러 개의 텍스트 파일이나 CSV를 한 번에 업로드하세요. 실무자들의 퇴근 시간을 획기적으로 앞당겨 드립니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technology (Dark Section) */}
      <section style={{ backgroundColor: '#0f172a', padding: '120px 0', color: '#fff' }}>
        <div className="container">
           <div className="text-center" style={{ marginBottom: '80px' }}>
            <span style={{ color: '#93c5fd', fontWeight: 700, fontSize: '14px', letterSpacing: '1px' }}>TECHNOLOGY</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '16px', color: '#fff' }}>글로벌 AI 탐지기가 한국어를 모를 때,<br />글통은 화용론까지 이해합니다.</h2>
            <p style={{ color: '#94a3b8', marginTop: '24px', fontSize: '18px' }}>압도적인 한국어 자연어 처리 기술력</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '40px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(56,189,248,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#38bdf8', fontSize: '24px' }}>🛡️</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>탐지기가 내장된 적대적 생성</h3>
              <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.8 }}>내부의 강력한 10단계 AI 탐지 엔진을 100% 통과할 때까지 스스로 글을 재건축합니다. 단순 회피가 아닌, 구조적 완벽함을 추구합니다.</p>
            </div>
             <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '24px', padding: '40px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(167,139,250,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#a78bfa', fontSize: '24px' }}>🇰🇷</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#fff' }}>한국어 뉘앙스 특화</h3>
              <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.8 }}>한국어 특유의 자연스러운 조사 생략, 구어체 혼용, 지식인 글쓰기 패턴(한자어 병기)을 정밀하게 구현합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Target Audience */}
      <section id="use-case" className="container text-center" style={{ padding: '120px 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>콘텐츠로 수익을 창출하는 모든 실무자를 위해</h2>
        <p className="text-muted" style={{ marginBottom: '60px' }}>누구에게 가장 필요할까요?</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="card bg-white" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#16a34a', fontSize: '32px' }}>📊</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>네이버 블로그 / 티스토리<br/>수익형 블로거</h3>
          </div>
          <div className="card bg-white" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary-color)', fontSize: '32px' }}>🚀</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>바이럴 마케터 및<br/>광고 대행사 AE</h3>
          </div>
          <div className="card bg-white" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: '#db2777', fontSize: '32px' }}>✍️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>웹 기사 및 원고 대필<br/>프리랜서 작가</h3>
          </div>
        </div>
      </section>

      {/* 6. Pricing */}
      <section id="pricing" style={{ backgroundColor: '#f9fafb', padding: '120px 0' }}>
         <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>월 커피 두 잔 가격으로 확실한 트래픽 방어</h2>
            <p className="text-muted" style={{ fontSize: '18px' }}>합리적인 가격으로 글통의 모든 기능을 누려보세요.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
             {/* Free Plan */}
             <div className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Free 플랜</h3>
               <p className="text-muted" style={{ fontSize: '14px', marginBottom: '32px' }}>서비스 체험용</p>
               <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '32px' }}>무료</div>
               
               <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#4b5563', fontSize: '15px' }}><span style={{ color: '#10b981' }}>✓</span> 단일 텍스트 변환</li>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#4b5563', fontSize: '15px' }}><span style={{ color: '#10b981' }}>✓</span> 1회 1,000자 제한</li>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#4b5563', fontSize: '15px' }}><span style={{ color: '#10b981' }}>✓</span> 일 3회 한정</li>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#9ca3af', fontSize: '15px', textDecoration: 'line-through' }}><span>✕</span> 내 문체 복제 기능</li>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#9ca3af', fontSize: '15px', textDecoration: 'line-through' }}><span>✕</span> 대량 일괄 처리</li>
               </ul>

               <Link href="/dashboard" className="btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>무료로 시작하기</Link>
             </div>

             {/* Pro Plan */}
             <div className="card" style={{ padding: '40px', border: '2px solid var(--primary-color)', position: 'relative', boxShadow: '0 20px 25px -5px rgba(43,93,229,0.1)', display: 'flex', flexDirection: 'column' }}>
               <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>실무자용 적극 추천</div>
               
               <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Pro 플랜</h3>
               <p className="text-muted" style={{ fontSize: '14px', marginBottom: '32px' }}>압도적인 생산성 확보</p>
               <div style={{ fontSize: '40px', fontWeight: 800, marginBottom: '32px' }}>10,000 <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500 }}>원 / 월</span></div>
               
               <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span style={{ color: 'var(--primary-color)' }}>✓</span> 글자 수 및 횟수 무제한</li>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span style={{ color: 'var(--primary-color)' }}>✓</span> '내 문체 복제' 무제한</li>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span style={{ color: 'var(--primary-color)' }}>✓</span> 대량 일괄 처리 무제한</li>
                 <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span style={{ color: 'var(--primary-color)' }}>✓</span> 서버 우선 처리 지원</li>
               </ul>

               <Link href="/dashboard" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Pro 시작하기</Link>
             </div>
          </div>
         </div>
      </section>

      {/* 7. Bottom CTA & Footer */}
      <section style={{ backgroundColor: 'var(--primary-color)', padding: '100px 0', color: '#fff', textAlign: 'center' }}>
         <div className="container">
           <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', color: '#fff' }}>더 이상 AI 원고 수정에<br/>귀중한 시간을 낭비하지 마세요.</h2>
           <p style={{ fontSize: '18px', color: '#bfdbfe', marginBottom: '40px' }}>지금 바로 글통의 압도적인 한국어 휴머나이징을 경험해 보세요.</p>
           <Link href="/dashboard" style={{ backgroundColor: '#fff', color: 'var(--primary-color)', padding: '16px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', display: 'inline-block' }}>글통 Pro 14일 무료 체험 시작하기</Link>
         </div>
      </section>

      <footer style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '60px 0 40px' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <div>
              <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '20px', fontWeight: 800, color: '#111827' }}>
                <img src="/images/gultong_logo_260416.svg" alt="글통 로고" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                <span>글통<span style={{ color: 'var(--primary-color)' }}>.</span></span>
              </div>
              <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.8' }}>
                사업자명: 글통 주식회사 | 대표자: 홍길동<br/>
                사업자등록번호: 123-45-67890<br/>
                통신판매업신고: 제2023-서울강남-0000호
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, color: '#111827' }}>정책 및 지원</h4>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '12px', cursor: 'pointer' }}>이용약관</p>
              <p style={{ fontSize: '13px', marginBottom: '12px', cursor: 'pointer', fontWeight: 600, color: '#111827' }}>개인정보처리방침</p>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '12px', cursor: 'pointer' }}>고객센터 이메일 문의</p>
            </div>
             <div>
              <h4 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, color: '#111827' }}>추천 블로그 글</h4>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '12px', cursor: 'pointer' }}>블로그 저품질 피하는 법</p>
              <p className="text-muted" style={{ fontSize: '13px', marginBottom: '12px', cursor: 'pointer' }}>챗GPT 번역투 교정 팁</p>
            </div>
          </div>
          <div className="container text-muted" style={{ fontSize: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginTop: '40px' }}>
            © 2024 Gultong. All rights reserved.
          </div>
      </footer>

    </main>
  )
}
