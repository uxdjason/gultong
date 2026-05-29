'use client';

import React from 'react';

interface SidebarSectionProps {
  label: string;
  children: React.ReactNode;
  emptyMessage?: string;
}

/**
 * SidebarSection — 사이드바 내 그룹 (예: "고정 작업들", "이전 작업들")
 * 라벨: 14px, text-text-secondary, left: 40px (§8 Stage 0 Figma 수치)
 */
export default function SidebarSection({
  label,
  children,
  emptyMessage,
}: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-0">
      <span
        className="font-myungjo text-[14px] font-normal text-text-secondary pl-10 mb-1"
        style={{ paddingLeft: 40 }}
      >
        {label}
      </span>
      {React.Children.count(children) === 0 && emptyMessage ? (
        <p className="font-myungjo text-[13px] text-text-tertiary px-4 py-2">
          {emptyMessage}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
