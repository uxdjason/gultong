import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '글통 (Gultong) - 수익형 글쓰기 AI 파트너',
  description: '키워드 찾기부터 글 생성, AI 탐지 검사, 윤문까지 — 돈 되는 글을 한 화면에서 완결합니다.',
  icons: {
    icon: '/images/gultong_favicon_260515.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="font-myungjo h-full">
        {children}
      </body>
    </html>
  );
}
