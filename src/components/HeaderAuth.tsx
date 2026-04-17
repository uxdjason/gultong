import Link from 'next/link';

export default function HeaderAuth() {
  return (
    <nav className="gnb gnb-auth">
      <div className="flex-row-center gap-32">
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '22px', fontWeight: 800, textDecoration: 'none', color: '#111827' }}>
          <img src="/images/gultong_logo_260416.svg" alt="글통 로고" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
          <span>글통<span style={{ color: 'var(--primary-color)' }}>.</span></span>
        </Link>
      </div>
      
      <div className="flex-row-center gap-24">
        <div className="flex-row-center cursor-pointer font-bold-14 text-muted gap-8">
           <span style={{ fontSize: '16px' }}>🎭</span> Persona Lab
        </div>
        <div className="divider-v"></div>
        <span className="font-14 text-muted">남은 크레딧: <strong style={{ color: '#111827' }}>3 / 10</strong></span>
        <button className="btn-primary flex-row-center gap-8" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}>
          ✨ PRO 업그레이드
        </button>
        <div className="avatar"></div>
      </div>
    </nav>
  );
}
