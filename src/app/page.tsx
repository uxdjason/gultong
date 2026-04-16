import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>

      {/* Navigation */}
      <Header />

      {/* 1. Hero Section */}
      <section className="container text-center hero-section">
        <div className="badge-rounded badge-primary m-b-24">
          ● AI 감지 우회율 99.9% 달성
        </div>
        <h1 className="hero-title">
          챗 GPT로 쓴 글,<br />
          블로그 <span className="text-error">'저품질'</span> 누락이 두려우신가요?
        </h1>
        <p className="text-muted hero-subtitle">
          검색 엔진을 완벽하게 우회하는 한국어 특화 휴머나이저.<br />
          AI의 기계적인 구조를 부수고 당신만의 문체로 재조립합니다.
        </p>

        <div className="m-t-40" style={{ marginTop: '40px' }}>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '18px', padding: '18px 40px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(43, 93, 229, 0.4)' }}>
            지금 무료로 텍스트 변환해보기
          </Link>
          <p className="text-main font-bold-14 m-t-16" style={{ marginTop: '16px', fontWeight: 500 }}>
            ✓ 요금 결제 없이 1,000자 무료 테스트 가능
          </p>
        </div>

        {/* Mockup Image Area */}
        <div className="card" style={{ maxWidth: '960px', margin: '60px auto 0', padding: '20px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div className="mockup-grid">
            <div className="flex-col-card bg-gray-light text-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#6b7280' }}>Original AI Text</span>
              </div>
              <div className="p-15 text-muted" style={{ flexGrow: 1 }}>
                최근 AI 기술의 발전으로 인해 많은 기업들이 자동화된 콘텐츠 생성을 도입하고 있습니다. 특히 챗GPT와 같은 대규모 언어 모델을 활용하여 블로그 포스팅이나 마케팅 문구를 작성하는 사례가 증가하고 있습니다. 하지만 이러한 AI 생성 콘텐츠는 종종 기계적인 뉘앙스를 풍기며, 검색 엔진의 필터링 시스템에 의해 저품질로 분류될 위험이 존재합니다. 따라서 사람이 직접 작성한 것과 같은 자연스러운 문체로의 변환이 필수적으로 요구되는 시점입니다.
              </div>
              <div className="m-t-30">
                <div className="badge badge-error">AI 작성 확률 98%</div>
              </div>
            </div>

            {/* Center Arrow Icon */}
            <div className="mockup-arrow">
              <span>&raquo;</span>
            </div>

            <div className="flex-col-card bg-green-light text-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span className="font-bold-15 text-primary">Humanized by Gultong</span>
              </div>
              <div className="p-15" style={{ color: '#1e3a8a', flexGrow: 1 }}>
                요즘 AI 기술이 진짜 무섭게 발전하면서 블로그 글이나 광고 문구를 챗GPT로 뽑아내는 곳들이 엄청 많아졌죠. 효율만 보면 당연히 솔깃할 수밖에 없는데요, 문제는 이 AI 텍스트 특유의 뻣뻣하고 어색한 말투입니다. 네이버나 구글 같은 검색 포털도 바보가 아니기 때문에 기계가 쓴 글은 귀신같이 찾아내어 노출을 깎아내리곤 하죠. 기껏 쓴 글이 저품질 채널로 찍히지 않으려면 결국 내 말투, 내 감성이 묻어나도록 한 번 더 만져주는 과정이 무조건 필요해요.
              </div>
              <div className="m-t-30">
                <div className="badge badge-success">사람이 쓴 글 확률 99.9%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pain Points Section */}
      <section className="container section-padding-bottom">
        <h2 className="text-center mb-8 section-title">
          AI로 10초 만에 쓴 글,<br />고치는 데 30분 걸리고 계시지 않습니까?
        </h2>
        <div style={{ width: '60px', height: '4px', backgroundColor: '#ef4444', margin: '0 auto 60px' }}></div>

        <div className="grid-3-cols">
          <div className="card">
            <div className="icon-box icon-box-lg icon-error">🚨</div>
            <h3 className="font-bold-22 m-b-16 text-main">검색 누락 공포</h3>
            <p className="text-muted p-17">AI 탐지 알고리즘에 걸려 힘들게 키운 블로그가 저품질에 빠질까 불안합니다.</p>
          </div>
          <div className="card">
            <div className="icon-box icon-box-lg icon-warning">🕒</div>
            <h3 className="font-bold-22 m-b-16 text-main">이중 작업의 피로감</h3>
            <p className="text-muted p-17">어색한 번역투와 기계적 템플릿을 지우느라 오히려 시간이 더 듭니다.</p>
          </div>
          <div className="card">
            <div className="icon-box icon-box-lg icon-primary">👤</div>
            <h3 className="font-bold-22 m-b-16 text-main">퍼스널 브랜딩 상실</h3>
            <p className="text-muted p-17">내 블로그만의 고유한 말투와 개성이 천편일률적인 AI 문체에 묻혀버렸습니다.</p>
          </div>
        </div>
      </section>

      {/* 3. Core Features */}
      <section id="features" className="section-padding bg-white" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '80px' }}>
            <span className="section-label">CORE FEATURES</span>
            <h2 className="section-title">글통 하나로 검색 노출 방어와<br />생산성 극대화를 동시에</h2>
          </div>

          <div className="grid-2-cols m-b-100" style={{ marginBottom: '100px' }}>
            <div className="card" style={{ backgroundColor: '#f8fafc', padding: '40px', minHeight: '350px', position: 'relative' }}>
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
                <div className="font-bold-14 text-error m-b-12">✕ 기존 AI</div>
                <p className="text-muted p-15">1. 첫째로 중요한 것은... 2. 둘째로 고려할 점은... 3. 결론적으로...</p>
              </div>
              <div className="text-center text-primary m-b-20 font-bold-24">&darr;</div>
              <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '20px', border: '1px solid #bfdbfe' }}>
                <div className="font-bold-14 text-primary m-b-12">✓ 글통 변환 후</div>
                <p className="p-15" style={{ color: '#1e3a8a' }}>가장 먼저 살펴봐야 할 부분이 있습니다. 바로... 이어서 놓치기 쉬운 포인트도 함께 짚어볼 텐데요...</p>
              </div>
            </div>
            <div>
              <div className="icon-box icon-box-lg icon-blue">🛡️</div>
              <h3 className="font-bold-28 m-b-16">SEO 안전 보장 휴머나이저</h3>
              <p className="text-primary font-bold-18 m-b-20">"기계적인 목차(Listicle) 완벽 해체"</p>
              <p className="text-muted p-18">단순한 단어 교체가 아닙니다. 검색 엔진이 '인간의 창작물'로 인식하도록 정보의 배치와 구조를 유기적으로 융합(Semantic Blending)합니다.</p>
            </div>
          </div>

          <div className="grid-2-cols m-b-100" style={{ marginBottom: '100px' }}>
            <div style={{ order: 1 }}>
              <div className="icon-box icon-box-lg icon-purple">🎭</div>
              <h3 className="font-bold-28 m-b-16">내 문체 복제 (Persona Cloning)</h3>
              <p className="text-purple font-bold-18 m-b-20">"나보다 더 나처럼 쓰는 AI"</p>
              <p className="text-muted p-18">과거에 직접 작성한 원고를 학습시킵니다. 평소의 띄어쓰기 습관, 자주 쓰는 어휘, 특유의 문장 호흡을 그대로 결과물에 입혀냅니다.</p>
            </div>
            <div className="card" style={{ backgroundColor: '#faf5ff', padding: '40px', minHeight: '350px', order: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#7e22ce' }}>나</div>
                  <div style={{ height: '8px', width: '100px', backgroundColor: '#e9d5ff', borderRadius: '4px' }}></div>
                </div>
                <div className="p-15" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', fontStyle: 'italic', color: '#4b5563' }}>
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

          <div className="grid-2-cols">
            <div className="card" style={{ backgroundColor: '#f0fdfa', padding: '40px', minHeight: '350px' }}>
              <div className="file-row" style={{ border: '1px solid #ccfbf1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📄</span> <span className="font-bold-15 text-muted">marketing_texts.csv</span>
                </div>
                <div className="badge-small badge-teal">100 rows</div>
              </div>
              <div className="file-row" style={{ border: '1px solid #ccfbf1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-bold-15" style={{ color: '#9ca3af' }}>블로그_포스팅_1.txt</span>
                </div>
                <div className="font-bold-14 text-success">✓ 완료</div>
              </div>
              <div className="file-row" style={{ border: '1px solid var(--primary-color)', boxShadow: '0 0 0 2px rgba(43,93,229,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-bold-15 text-primary">인스타그램_원고_모음.txt</span>
                </div>
                <div className="font-bold-14 text-primary">↻ 변환 중...</div>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: '14px' }}>🚀 일괄 변환 시작</button>
            </div>
            <div>
              <div className="icon-box icon-box-lg icon-teal">📦</div>
              <h3 className="font-bold-28 m-b-16">대량 일괄 처리 (Bulk Process)</h3>
              <p className="text-teal font-bold-18 m-b-20">"수십 개의 마케팅 원고도 원클릭으로"</p>
              <p className="text-muted p-18">여러 개의 텍스트 파일이나 CSV를 한 번에 업로드하세요. 실무자들의 퇴근 시간을 획기적으로 앞당겨 드립니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technology (Dark Section) */}
      <section style={{ backgroundColor: '#0f172a', paddingTop: '120px', paddingBottom: '120px', color: '#fff' }}>
        <div className="container">
          <div className="text-center m-b-80">
            <span className="font-bold-14" style={{ color: '#93c5fd', letterSpacing: '1px' }}>TECHNOLOGY</span>
            <h2 className="section-title text-white">해외 AI 탐지기들은 한국어를 모르지만,<br />글통은 행간을 읽어 문맥을 이해합니다.</h2>
            <p className="font-20 m-t-24" style={{ color: '#94a3b8' }}>압도적인 한국어 자연어 처리 기술력</p>
          </div>
          <div className="grid-2-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            <div className="bg-dark">
              <div className="icon-box icon-box-lg icon-light-blue">🛡️</div>
              <h3 className="font-bold-24 m-b-16 text-white">탐지기가 내장된 적대적 생성</h3>
              <p className="p-18" style={{ color: '#94a3b8' }}>내부의 강력한 10단계 AI 탐지 엔진을 100% 통과할 때까지 스스로 글을 재건축합니다. 단순 회피가 아닌, 구조적 완벽함을 추구합니다.</p>
            </div>
            <div className="bg-dark">
              <div className="icon-box icon-box-lg icon-light-purple">🇰🇷</div>
              <h3 className="font-bold-24 m-b-16 text-white">한국어 뉘앙스 특화</h3>
              <p className="p-18" style={{ color: '#94a3b8' }}>한국어 특유의 자연스러운 조사 생략, 구어체 혼용, 지식인 글쓰기 패턴(한자어 병기)을 정밀하게 구현합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Target Audience */}
      <section id="use-case" className="container text-center section-padding-bottom" style={{ paddingTop: '120px' }}>
        <h2 className="font-bold-28 m-b-16">콘텐츠로 수익을 창출하는 모든 실무자를 위해</h2>
        <p className="text-muted m-b-60 font-18">누구에게 가장 필요할까요?</p>

        <div className="grid-target">
          <div className="card" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="icon-box icon-box-xl icon-green">📊</div>
            <h3 className="font-bold-22">네이버 블로그 / 티스토리<br />수익형 블로거</h3>
          </div>
          <div className="card" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="icon-box icon-box-xl icon-primary">🚀</div>
            <h3 className="font-bold-22">바이럴 마케터 및<br />광고 대행사 AE</h3>
          </div>
          <div className="card" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="icon-box icon-box-xl icon-pink">✍️</div>
            <h3 className="font-bold-22">웹 기사 및 원고 대필<br />프리랜서 작가</h3>
          </div>
        </div>
      </section>

      {/* 6. Pricing */}
      <section id="pricing" className="section-padding-bottom bg-gray-light" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="text-center m-b-60">
            <h2 className="section-title m-b-16">월 커피 두 잔 가격으로 확실한 트래픽 방어</h2>
            <p className="text-muted p-18">합리적인 가격으로 글통의 모든 기능을 누려보세요.</p>
          </div>

          <div className="grid-pricing">
            {/* Free Plan */}
            <div className="card pricing-card">
              <h3 className="font-bold-24 m-b-16">Free 플랜</h3>
              <p className="text-muted m-b-40 font-15">서비스 체험용</p>
              <div className="m-b-40" style={{ fontSize: '40px', fontWeight: 800 }}>무료</div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px' }}><span className="text-success">✓</span> 단일 텍스트 변환</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px' }}><span className="text-success">✓</span> 1회 1,000자 제한</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px' }}><span className="text-success">✓</span> 일 3회 한정</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px' }}><span className="text-error">✕</span> 내 문체 복제 기능</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px' }}><span className="text-error">✕</span> 대량 일괄 처리</li>
              </ul>

              <Link href="/dashboard" className="btn-outline" style={{ width: '100%', textAlign: 'center', display: 'block' }}>무료로 시작하기</Link>
            </div>

            {/* Pro Plan */}
            <div className="card pricing-card" style={{ border: '2px solid var(--primary-color)', position: 'relative', boxShadow: '0 20px 25px -5px rgba(43,93,229,0.1)' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--primary-color)', color: '#fff', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>실무자용 적극 추천</div>

              <h3 className="font-bold-24 m-b-16">Pro 플랜</h3>
              <p className="text-muted m-b-40 font-15">압도적인 생산성 확보</p>
              <div className="m-b-40" style={{ fontSize: '40px', fontWeight: 800 }}>10,000 <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: 500 }}>원 / 월</span></div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span className="text-success">✓</span> 글자 수 및 횟수 무제한</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span className="text-success">✓</span> '내 문체 복제' 무제한</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span className="text-success">✓</span> 대량 일괄 처리 무제한</li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: '#111827', fontSize: '15px', fontWeight: 600 }}><span className="text-success">✓</span> 서버 우선 처리 지원</li>
              </ul>

              <Link href="/dashboard" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Pro 시작하기</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA & Footer */}
      <section style={{ backgroundColor: 'var(--primary-color)', padding: '100px 0', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-title text-white">더 이상 AI 원고 수정에<br />귀중한 시간을 낭비하지 마세요.</h2>
          <p className="p-18 m-b-40 m-t-24" style={{ color: '#bfdbfe' }}>지금 바로 글통의 압도적인 한국어 휴머나이징을 경험해 보세요.</p>
          <Link href="/dashboard" style={{ backgroundColor: '#fff', color: 'var(--primary-color)', padding: '16px 32px', borderRadius: '12px', fontWeight: 700, fontSize: '18px', display: 'inline-block' }}>무료로 시작하기</Link>
        </div>
      </section>

      <Footer />

    </main>
  )
}
