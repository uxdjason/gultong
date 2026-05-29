import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '글통 — 리다이렉트 중',
};

/**
 * /dashboard → /workspace 리다이렉트 (§5.3 기획서 결정)
 * 기존 /api/analyze, /api/humanize API는 변경 없이 유지.
 * 이 레이아웃은 Stage 10 (Landing 재설계) 때 삭제 검토.
 */
export default function DashboardLayout({
  children: _children,
}: {
  children: React.ReactNode;
}) {
  redirect('/workspace');
}
