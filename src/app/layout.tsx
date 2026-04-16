import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '글통 (Gultong) - SEO 안전 보장 한국어 텍스트 휴머나이저',
  description: '검색 엔진의 AI 탐지를 피하고 당신만의 문체로 재조립하는 한국어 AI 글쓰기 윤문 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
