'use client';

import SymbolIcon from '@/components/icons/SymbolIcon';

interface TopBarProps {
  creditBalance?: number;
  onChargeClick?: () => void;
  onUpgradeClick?: () => void;
  onMenuClick?: () => void;
}

/**
 * TopBar — Figma 기준
 * height: 48px, border-bottom: 0.5px rgba(70,48,17,0.2)
 * 좌측: 빈 공간
 * 우측: "{n} 크레딧 남았어요." → 충전(버튼) → 업그레이드(버튼) → ≡(menu icon)
 */
export default function TopBar({
  creditBalance = 0,
  onChargeClick,
  onUpgradeClick,
  onMenuClick,
}: TopBarProps) {
  const formatted = creditBalance.toLocaleString('ko-KR');

  return (
    <header
      className="flex items-center justify-end flex-shrink-0 bg-surface-card"
      style={{
        height: 48,
        borderBottom: '0.5px solid rgba(70, 48, 17, 0.2)',
        paddingLeft: 24,
        paddingRight: 24,
        gap: 12,
      }}
    >
      {/* 크레딧 텍스트 */}
      <span
        className="font-myungjo text-text-secondary"
        style={{ fontSize: 14 }}
      >
        {formatted} 크레딧 남았어요.
      </span>

      {/* 충전 버튼 */}
      <button
        onClick={onChargeClick}
        className="font-myungjo text-text-secondary flex items-center justify-center hover:bg-black/5 transition-colors"
        style={{
          fontSize: 14,
          height: 32,
          paddingLeft: 12,
          paddingRight: 12,
          border: '0.5px solid rgba(70, 48, 17, 0.2)',
          borderRadius: 4,
          whiteSpace: 'nowrap',
        }}
      >
        충전
      </button>

      {/* 구분 공간 */}
      <div style={{ flex: 1 }} />

      {/* 업그레이드 버튼 */}
      <button
        onClick={onUpgradeClick}
        className="font-myungjo text-text-secondary flex items-center justify-center hover:bg-black/5 transition-colors"
        style={{
          fontSize: 14,
          height: 32,
          paddingLeft: 12,
          paddingRight: 12,
          border: '0.5px solid rgba(70, 48, 17, 0.2)',
          borderRadius: 4,
          whiteSpace: 'nowrap',
        }}
      >
        업그레이드
      </button>

      {/* 메뉴 아이콘 */}
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center hover:opacity-60 transition-opacity"
        aria-label="메뉴"
      >
        <SymbolIcon name="menu_24dp" color="#333333" size={24} />
      </button>
    </header>
  );
}
