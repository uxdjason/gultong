import Link from 'next/link';

export default function Header() {
  return (
    <nav className="gnb" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(249, 251, 255, 0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(229, 231, 235, 0.5)' }}>
      <div className="container" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '24px', color: '#111827', cursor: 'pointer' }}>
          <img src="/images/gultong_logo_260416.svg" alt="글통 로고" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <span>글통<span style={{ color: 'var(--primary-color)' }}>.</span></span>
        </Link>
        <div className="gnb-menu" style={{ gap: '40px' }}>
          <a href="#features" style={{ color: '#4b5563', fontWeight: 600, fontSize: '15px' }}>핵심 기능</a>
          <a href="#pricing" style={{ color: '#4b5563', fontWeight: 600, fontSize: '15px' }}>요금 안내</a>
          <a href="#use-case" style={{ color: '#4b5563', fontWeight: 600, fontSize: '15px' }}>적용 사례</a>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#4b5563', fontSize: '15px', fontWeight: 600 }}>로그인</Link>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: '14px', padding: '10px 20px', borderRadius: '8px' }}>무료로 시작하기</Link>
        </div>
      </div>
    </nav>
  );
}
