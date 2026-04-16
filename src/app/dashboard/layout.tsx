import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '글통 대시보드 - 텍스트 휴머나이저',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="gnb" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', height: '64px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" className="logo" style={{ color: 'var(--primary-color)', fontSize: '22px', fontWeight: 800, textDecoration: 'none' }}>글통.</Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#4b5563', fontSize: '14px', fontWeight: 600 }}>
             <span style={{ fontSize: '16px' }}>🎭</span> Persona Lab
          </div>
          <div style={{ height: '24px', width: '1px', backgroundColor: '#e5e7eb' }}></div>
          <span style={{ fontSize: '14px', color:'#4b5563' }}>남은 크레딧: <strong style={{ color: '#111827' }}>3 / 10</strong></span>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>✨ PRO 업그레이드</button>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e5e7eb', cursor: 'pointer' }}></div>
        </div>
      </nav>
      {children}
    </div>
  )
}
