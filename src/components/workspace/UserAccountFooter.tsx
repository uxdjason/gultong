'use client';

import Image from 'next/image';
import SymbolIcon from '@/components/icons/SymbolIcon';

interface UserAccountFooterProps {
  email?: string;
  plan?: string;
  avatarUrl?: string;
  onSettingsClick?: () => void;
  collapsed?: boolean;
}

/**
 * UserAccountFooter — 사이드바 하단 계정·플랜·설정
 * Figma: 아바타(40×40) + 이메일(12px) + 플랜(14px) + 설정 아이콘
 * 왼쪽 px-4 (16px) 여백 확보
 */
export default function UserAccountFooter({
  email = '로그인하세요',
  plan = '',
  avatarUrl,
  onSettingsClick,
  collapsed = false,
}: UserAccountFooterProps) {
  // 이메일에서 이니셜 추출 (최대 2글자)
  const initials = email
    ? email.split('@')[0].slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      className="flex items-center flex-shrink-0"
      style={{
        height: 72,
        borderTop: '0.5px solid rgba(70, 48, 17, 0.2)',
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {/* 아바타 */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full font-myungjo text-text-inverse font-bold overflow-hidden"
        style={{ width: 40, height: 40, backgroundColor: '#333333', fontSize: 14 }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={email}
            width={40}
            height={40}
            className="object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* 이메일 + 플랜 (확장 상태에서만) */}
      {!collapsed && (
        <div className="flex flex-col flex-1 min-w-0 ml-3">
          <span className="font-myungjo text-[12px] text-text-primary truncate leading-tight">
            {email}
          </span>
          {plan && (
            <span className="font-myungjo text-[14px] text-text-secondary leading-tight">
              {plan}
            </span>
          )}
        </div>
      )}

      {/* 설정 아이콘 (확장 상태에서만) */}
      {!collapsed && (
        <button
          onClick={onSettingsClick}
          className="flex-shrink-0 flex items-center justify-center ml-2 hover:opacity-60 transition-opacity"
          aria-label="설정"
        >
          <SymbolIcon name="settings_24dp" color="#505050" size={24} />
        </button>
      )}
    </div>
  );
}
