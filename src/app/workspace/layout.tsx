import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '글통 Workspace',
  description: '키워드 찾기부터 글 생성, AI 탐지, 윤문까지 — 한 화면에서 완결하는 글쓰기 워크스페이스',
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Workspace는 body 높이 100%를 사용 (스크롤 없는 레이아웃)
  return <>{children}</>;
}
