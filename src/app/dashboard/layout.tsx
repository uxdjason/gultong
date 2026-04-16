import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '글통 대시보드 - 텍스트 휴머나이저',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <nav className="gnb" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="logo" style={{ color: 'var(--primary-color)' }}>글통.</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize:'13px' }}>단일 텍스트</button>
            <button className="btn-outline" style={{ padding: '6px 12px', fontSize:'13px', border:'none', backgroundColor:'transparent', color:'var(--text-muted)' }}>대량 변환 <span style={{fontSize:'10px', backgroundColor:'#e0e7ff', color:'var(--primary-color)', padding:'2px 6px', borderRadius:'10px', marginLeft:'4px'}}>PRO</span></button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color:'var(--text-muted)' }}>남은 크레딧: <strong>3 / 10</strong></span>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>✨ PRO 업그레이드</button>
        </div>
      </nav>
      {children}
    </div>
  )
}
