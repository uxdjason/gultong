'use client';

import React from 'react';

interface SidebarSectionProps {
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  emptyMessage?: string;
}

/**
 * SidebarSection — 사이드바 섹션 헤더 + 아이콘
 * Figma: 핀 아이콘 + "고정 작업들" / 시계 아이콘 + "이전 작업들"
 */
export default function SidebarSection({
  label,
  icon,
  children,
  emptyMessage,
}: SidebarSectionProps) {
  const isEmpty = !children || React.Children.count(children) === 0;

  return (
    <div className="flex flex-col gap-1">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 px-2 mb-1">
        {icon && (
          <span className="flex-shrink-0 flex items-center">{icon}</span>
        )}
        <span className="font-myungjo text-[14px] font-normal text-text-secondary">
          {label}
        </span>
      </div>

      {/* 항목들 또는 빈 상태 */}
      {isEmpty && emptyMessage ? (
        <p className="font-myungjo text-[13px] text-text-tertiary px-2 py-1">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
