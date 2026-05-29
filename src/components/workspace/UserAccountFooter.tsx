'use client';

import Image from 'next/image';
import SymbolIcon from '@/components/icons/SymbolIcon';

interface UserAccountFooterProps {
  /** 로그인된 사용자 이메일 */
  email?: string;
  /** 현재 플랜 이름 */
  plan?: string;
  /** 아바타 이미지 URL (없으면 이니셜 표시) */
  avatarUrl?: string;
  /** 설정 버튼 클릭 핸들러 */
  onSettingsClick?: () => void;
}

/**
 * UserAccountFooter — 사이드바 하단 계정·플랜·설정
 * Figma 수치: height: 72px, top: 828px
 * 아바타: 40×40, #333333 배경
 * 이메일: 12px, 플랜: 14px text-text-secondary
 * 설정 아이콘: right-aligned (left: 260px 기준)
 */
export default function UserAccountFooter({
  email = '로그인하세요',
  plan = '',
  avatarUrl,
  onSettingsClick,
}: UserAccountFooterProps) {
  const initials = email ? email.slice(0, 2).toUpperCase() : '?';

  return (
    <div
      className="flex items-center gap-3 px-4 border-t"
      style={{
        height: 72,
        borderTopColor: 'rgba(70, 48, 17, 0.2)',
        borderTopWidth: '0.5px',
      }}
    >
      {/* 아바타 */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full font-myungjo text-text-inverse font-bold"
        style={{ width: 40, height: 40, backgroundColor: '#333333', fontSize: 14 }}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={email} width={40} height={40} className="rounded-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* 이메일 + 플랜 */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-myungjo text-[12px] text-text-primary truncate leading-tight">
          {email}
        </span>
        {plan && (
          <span className="font-myungjo text-[14px] text-text-secondary leading-tight">
            {plan}
          </span>
        )}
      </div>

      {/* 설정 아이콘 */}
      <button
        onClick={onSettingsClick}
        className="flex-shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity"
        aria-label="설정"
      >
        <SymbolIcon name="settings_24dp" color="#505050" size={24} />
      </button>
    </div>
  );
}
