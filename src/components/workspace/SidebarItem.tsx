'use client';

import React from 'react';

interface SidebarItemProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SidebarItem({
  label,
  icon,
  isActive = false,
  collapsed = false,
  onClick,
  className = '',
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={[
        'flex items-center w-full rounded-sm transition-colors duration-150',
        'font-myungjo text-[16px] font-normal text-left',
        collapsed ? 'justify-center px-0' : 'gap-3 px-2',
        isActive
          ? 'text-text-primary bg-black/5'
          : 'text-text-primary hover:bg-black/5',
        className,
      ].join(' ')}
      style={{ height: 32 }}
    >
      {icon && (
        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6">
          {icon}
        </span>
      )}
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
