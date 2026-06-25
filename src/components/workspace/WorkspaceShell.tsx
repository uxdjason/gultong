'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import WorkspaceStream from './WorkspaceStream';
import { useWorkspaceStore } from '@/stores/workspace';

interface WorkspaceShellProps {
  userEmail?: string;
  userPlan?: string;
  userAvatarUrl?: string;
  creditBalance?: number;
}

/**
 * WorkspaceShell — 최상위 Workspace 레이아웃
 *
 * 좌: Sidebar (300px 확장 / 56px 축소 — 아이콘 only)
 * 우: flex-col (TopBar 48px + WorkspaceStream 나머지)
 *
 * 사이드바 토글: 같은 dock_to_right 아이콘으로 열기/닫기
 * 축소 시 완전히 사라지지 않고 아이콘만 보이는 56px 너비로 유지
 */
export default function WorkspaceShell({
  userEmail,
  userPlan,
  userAvatarUrl,
  creditBalance = 0,
}: WorkspaceShellProps) {
  const { } = useWorkspaceStore();

  return (
    <div className="body-workspace">
      <Sidebar
        userEmail={userEmail}
        userPlan={userPlan}
        userAvatarUrl={userAvatarUrl}
        onNewWork={() => {}}
        onSearch={() => {}}
        onHistory={() => {}}
        onPersona={() => {}}
        onSettingsClick={() => {}}
      />
      <div className="main flex-1 min-w-0">
        <TopBar
          creditBalance={creditBalance}
          onChargeClick={() => {}}
          onUpgradeClick={() => {}}
          onMenuClick={() => {}}
        />
        <WorkspaceStream />
      </div>
    </div>
  );
}
