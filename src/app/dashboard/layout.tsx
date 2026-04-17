import type { Metadata } from 'next'
import HeaderAuth from '../../components/HeaderAuth'

export const metadata: Metadata = {
  title: '글통 대시보드 - 텍스트 휴머나이저',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <HeaderAuth />
      {children}
    </div>
  )
}
