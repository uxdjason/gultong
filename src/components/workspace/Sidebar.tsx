'use client';

import Image from 'next/image';
import SymbolIcon from '@/components/icons/SymbolIcon';
import SidebarItem from './SidebarItem';
import SidebarSection from './SidebarSection';
import UserAccountFooter from './UserAccountFooter';
import { useWorkspaceStore } from '@/stores/workspace';

// 더미 고정 작업 (Stage 8에서 D1으로 교체)
const PINNED_ITEMS: { id: string; label: string }[] = [];

// 더미 이전 작업 (Stage 8에서 D1으로 교체)
const RECENT_ITEMS: { id: string; label: string }[] = [];

interface SidebarProps {
  userEmail?: string;
  userPlan?: string;
  userAvatarUrl?: string;
  onNewWork?: () => void;
  onSearch?: () => void;
  onHistory?: () => void;
  onPersona?: () => void;
  onSettingsClick?: () => void;
  onToggleCollapse?: () => void;
}

/**
 * Sidebar — Figma PNG 정밀 수치 적용
 * 너비: 300px, 배경: surface.sidebar (#F8F8FA)
 * 우측 테두리: 0.5px rgba(70,48,17,0.2)
 *
 * 로고: 40×40 심볼(left:16, top:16) + 워드마크 20px Bold (left:72, top:24)
 * collapse: 24×24 (left:260, top:24)
 * 1차 메뉴 4종: top 96/136/176/216px (40px 간격)
 * 트렌딩 메뉴: Stage 9에서 추가 (현재 미포함)
 * 계정 푸터: height:72px
 */
export default function Sidebar({
  userEmail,
  userPlan,
  userAvatarUrl,
  onNewWork,
  onSearch,
  onHistory,
  onPersona,
  onSettingsClick,
  onToggleCollapse,
}: SidebarProps) {
  const { resetWorkspace } = useWorkspaceStore();

  const handleNewWork = () => {
    resetWorkspace();
    onNewWork?.();
  };

  return (
    <aside
      className="flex flex-col bg-surface-sidebar h-full flex-shrink-0"
      style={{
        width: 300,
        borderRight: '0.5px solid rgba(70, 48, 17, 0.2)',
      }}
    >
      {/* ── 헤더: 로고 + collapse 버튼 ── */}
      <div className="relative flex-shrink-0" style={{ height: 64 }}>
        {/* 로고 심볼 */}
        <div
          className="absolute"
          style={{ left: 16, top: 16, width: 40, height: 40 }}
        >
          <Image
            src="/images/gultong_logo_260515.png"
            alt="글통 로고"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* 로고 워드마크 */}
        <span
          className="absolute font-myungjo font-bold text-text-primary"
          style={{ left: 68, top: 20, fontSize: 20, lineHeight: '24px' }}
        >
          글통
        </span>

        {/* 사이드바 접기 버튼 */}
        <button
          onClick={onToggleCollapse}
          className="absolute flex items-center justify-center hover:opacity-70 transition-opacity"
          style={{ left: 260, top: 20, width: 24, height: 24 }}
          aria-label="사이드바 접기"
        >
          <SymbolIcon name="dock_to_right_24dp" color="#505050" size={24} />
        </button>
      </div>

      {/* ── 1차 메뉴 4종 (top 96/136/176/216px → 헤더 64px 기준 상대 위치) ── */}
      <nav className="flex-shrink-0 px-2" style={{ paddingTop: 32 }}>
        <SidebarItem
          label="새 글 작업을 시작해요"
          icon={<SymbolIcon name="add_circle_24dp" color="#333333" size={24} />}
          onClick={handleNewWork}
        />
        <SidebarItem
          label="검색해요"
          icon={<SymbolIcon name="search_24dp" color="#333333" size={24} />}
          onClick={onSearch}
        />
        <SidebarItem
          label="이전 글 작업들"
          icon={<SymbolIcon name="stacks_24dp" color="#333333" size={24} />}
          onClick={onHistory}
        />
        <SidebarItem
          label="페르소나 저장소"
          icon={<SymbolIcon name="person_celebrate_24dp" color="#333333" size={24} />}
          onClick={onPersona}
        />
      </nav>

      {/* ── 구분선 ── */}
      <div
        className="flex-shrink-0 mx-4 my-4"
        style={{ height: '0.5px', backgroundColor: 'rgba(70, 48, 17, 0.2)' }}
      />

      {/* ── 고정 작업들 ── */}
      <div className="flex-shrink-0 px-2">
        <SidebarSection
          label="고정 작업들"
          emptyMessage="고정 작업이 없습니다"
        >
          {PINNED_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={<SymbolIcon name="keep_24dp" color="#505050" size={24} />}
            />
          ))}
        </SidebarSection>
      </div>

      {/* ── 이전 작업들 (스크롤 가능 영역) ── */}
      <div className="flex-1 overflow-y-auto px-2 mt-4 min-h-0">
        <SidebarSection
          label="이전 작업들"
          emptyMessage="이전 작업이 없습니다"
        >
          {RECENT_ITEMS.map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={<SymbolIcon name="history_2_24dp" color="#505050" size={24} />}
            />
          ))}
        </SidebarSection>
      </div>

      {/* ── 계정 푸터 ── */}
      <UserAccountFooter
        email={userEmail}
        plan={userPlan}
        avatarUrl={userAvatarUrl}
        onSettingsClick={onSettingsClick}
      />
    </aside>
  );
}
