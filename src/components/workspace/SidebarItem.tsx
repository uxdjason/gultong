'use client';

import React from 'react';

interface SidebarItemProps {
  label: string;
  iconName?: string; // SymbolIcon name (없으면 이모지 사용)
  icon?: React.ReactNode; // 직접 아이콘 JSX 전달
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * SidebarItem — 사이드바 단일 항목 행
 * 높이: 32px (기획서 §8 Stage 0 Task 수치)
 * 아이콘 left: 16px, 텍스트 left: 48px (아이콘 16 + 24 + 8 = 48)
 */
export default function SidebarItem({
  label,
  icon,
  isActive = false,
  onClick,
  className = '',
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-2 w-full px-4 h-8 rounded-sm transition-colors duration-150',
        'font-myungjo text-[16px] font-normal text-left',
        isActive
          ? 'bg-surface-divider/10 text-text-primary'
          : 'text-text-primary hover:bg-surface-divider/10',
        className,
      ].join(' ')}
      style={{ minHeight: 32 }}
    >
      {icon && (
        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6">
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}
