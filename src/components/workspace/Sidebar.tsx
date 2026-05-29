'use client';

import Image from 'next/image';
import SymbolIcon from '@/components/icons/SymbolIcon';
import SidebarSection from './SidebarSection';
import SidebarItem from './SidebarItem';
import UserAccountFooter from './UserAccountFooter';
import { useWorkspaceStore } from '@/stores/workspace';

// 더미 데이터 (Stage 8에서 D1으로 교체)
const PINNED_ITEMS: { id: string; label: string }[] = [
  { id: 'p1', label: '여우와 호랑이는 뱀 네 마리를 쫓아가...' },
  { id: 'p2', label: '너구리는 사자 앞에서 노래를 부르다...' },
  { id: 'p3', label: '여우와 호랑이는 뱀 네 마리를 쫓아가...' },
];
const RECENT_ITEMS: { id: string; label: string }[] = [
  { id: 'r1', label: '여우와 호랑이는 뱀 네 마리를 쫓아가...' },
  { id: 'r2', label: '너구리는 사자 앞에서 노래를 부르다...' },
  { id: 'r3', label: '여우와 호랑이는 뱀 네 마리를 쫓아가...' },
  { id: 'r4', label: '너구리는 사자 앞에서 노래를 부르다...' },
];

interface SidebarProps {
  userEmail?: string;
  userPlan?: string;
  userAvatarUrl?: string;
  onNewWork?: () => void;
  onSearch?: () => void;
  onHistory?: () => void;
  onPersona?: () => void;
  onSettingsClick?: () => void;
}

const NAV_ITEMS = [
  { id: 'new', label: '새 글 작업을 시작해요', icon: 'add_circle_24dp' },
  { id: 'search', label: '검색해요', icon: 'search_24dp' },
  { id: 'history', label: '이전 글 작업들', icon: 'stacks_24dp' },
  { id: 'persona', label: '페르소나 저장소', icon: 'person_celebrate_24dp' },
];

export default function Sidebar({
  userEmail,
  userPlan,
  userAvatarUrl,
  onNewWork,
  onSearch,
  onHistory,
  onPersona,
  onSettingsClick,
}: SidebarProps) {
  const { sidebarCollapsed, setSidebarCollapsed, resetWorkspace } = useWorkspaceStore();

  const navHandlers: Record<string, (() => void) | undefined> = {
    new: () => { resetWorkspace(); onNewWork?.(); },
    search: onSearch,
    history: onHistory,
    persona: onPersona,
  };

  const COLLAPSED_WIDTH = 56;
  const EXPANDED_WIDTH = 300;

  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 bg-surface-sidebar transition-all duration-200"
      style={{
        width: sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        borderRight: '0.5px solid rgba(70, 48, 17, 0.2)',
        overflow: 'hidden',
      }}
    >
      {/* ── 헤더: 로고 + 워드마크 + collapse 버튼 ── */}
      <div
        className="flex items-center flex-shrink-0 px-4"
        style={{ height: 64, borderBottom: '0.5px solid rgba(70, 48, 17, 0.2)' }}
      >
        {/* 로고 심볼 */}
        <div className="flex-shrink-0" style={{ width: 40, height: 40 }}>
          <Image
            src="/images/gultong_logo_260515.png"
            alt="글통 로고"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* 워드마크 (확장 상태에서만 표시) */}
        {!sidebarCollapsed && (
          <span
            className="font-myungjo font-bold text-text-primary ml-3 whitespace-nowrap"
            style={{ fontSize: 20, lineHeight: '24px' }}
          >
            글통 Gultong
          </span>
        )}

        {/* 사이드바 토글 버튼 — 항상 오른쪽 끝 */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="ml-auto flex items-center justify-center hover:opacity-60 transition-opacity flex-shrink-0"
          aria-label={sidebarCollapsed ? '사이드바 열기' : '사이드바 닫기'}
        >
          <SymbolIcon name="dock_to_right_24dp" color="#505050" size={24} />
        </button>
      </div>

      {/* ── 1차 메뉴 4종 ── */}
      <nav className="flex flex-col flex-shrink-0 px-2 pt-6 gap-4">
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            icon={<SymbolIcon name={item.icon} color="#333333" size={24} />}
            collapsed={sidebarCollapsed}
            onClick={navHandlers[item.id]}
          />
        ))}
      </nav>

      {/* 확장 상태에서만 섹션 표시 */}
      {!sidebarCollapsed && (
        <>
          {/* ── 고정 작업들 ── */}
          <div className="flex-shrink-0 px-2 mt-6">
            <SidebarSection
              label="고정 작업들"
              icon={<SymbolIcon name="keep_24dp" color="#505050" size={16} />}
              emptyMessage={PINNED_ITEMS.length === 0 ? '고정 작업이 없습니다' : undefined}
            >
              {PINNED_ITEMS.map((item) => (
                <SidebarItem key={item.id} label={item.label} />
              ))}
            </SidebarSection>
          </div>

          {/* ── 이전 작업들 (스크롤 가능) ── */}
          <div className="flex-1 overflow-y-auto px-2 mt-6 min-h-0">
            <SidebarSection
              label="이전 작업들"
              icon={<SymbolIcon name="history_2_24dp" color="#505050" size={16} />}
              emptyMessage={RECENT_ITEMS.length === 0 ? '이전 작업이 없습니다' : undefined}
            >
              {RECENT_ITEMS.map((item) => (
                <SidebarItem key={item.id} label={item.label} />
              ))}
            </SidebarSection>
          </div>
        </>
      )}

      {/* 스페이서 (collapsed 상태) */}
      {sidebarCollapsed && <div className="flex-1" />}

      {/* ── 계정 푸터 ── */}
      <UserAccountFooter
        email={userEmail}
        plan={userPlan}
        avatarUrl={userAvatarUrl}
        onSettingsClick={onSettingsClick}
        collapsed={sidebarCollapsed}
      />
    </aside>
  );
}
