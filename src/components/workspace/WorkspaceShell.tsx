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
 * CSS Grid: grid-cols-[300px_1fr], height: 100vh
 * Figma 1440×900 기준 레이아웃
 *
 * 좌측: Sidebar (300px, 고정)
 * 우측: flex-col (TopBar 48px + WorkspaceStream 나머지)
 *
 * 태블릿(768~1279px): 사이드바 접힘
 * 모바일(<768px): 사이드바 오버레이 (추후 구현)
 */
export default function WorkspaceShell({
  userEmail,
  userPlan,
  userAvatarUrl,
  creditBalance = 0,
}: WorkspaceShellProps) {
  const { sidebarCollapsed, setSidebarCollapsed } = useWorkspaceStore();

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ── 사이드바 ── */}
      {!sidebarCollapsed && (
        <Sidebar
          userEmail={userEmail}
          userPlan={userPlan}
          userAvatarUrl={userAvatarUrl}
          onToggleCollapse={() => setSidebarCollapsed(true)}
          onNewWork={() => {}}
          onSearch={() => {}}
          onHistory={() => {}}
          onPersona={() => {}}
          onSettingsClick={() => {}}
        />
      )}

      {/* ── 메인 영역 (TopBar + WorkspaceStream) ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 접힌 상태일 때 사이드바 열기 버튼 */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-4 top-3 z-20 flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label="사이드바 열기"
          >
            <span
              style={{
                display: 'inline-block',
                width: 24,
                height: 24,
                backgroundColor: '#505050',
                maskImage: `url(/images/menu_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg)`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskImage: `url(/images/menu_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg)`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
              }}
            />
          </button>
        )}

        <TopBar
          creditBalance={creditBalance}
          onChargeClick={() => {}}
          onUpgradeClick={() => {}}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <WorkspaceStream />
      </div>
    </div>
  );
}
