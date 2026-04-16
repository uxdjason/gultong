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
        <nav className="gnb">
          <div className="container gnb-container">
            <div className="logo">
              글통.
            </div>
            <div className="gnb-menu">
              <a href="#features" className="text-muted" style={{fontWeight: 500}}>핵심 기능</a>
              <a href="#pricing" className="text-muted" style={{fontWeight: 500}}>요금 안내</a>
              <a href="#use-case" className="text-muted" style={{fontWeight: 500}}>적용 사례 (블로그)</a>
            </div>
            <div className="gnb-actions">
              <span className="text-muted" style={{ fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>로그인</span>
              <button className="btn-primary" style={{ fontSize: '14px', padding: '10px 16px' }}>무료로 시작하기</button>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
