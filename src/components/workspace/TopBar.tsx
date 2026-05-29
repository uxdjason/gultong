'use client';

import CreditChip from './CreditChip';
import SymbolIcon from '@/components/icons/SymbolIcon';

interface TopBarProps {
  creditBalance?: number;
  onChargeClick?: () => void;
  onUpgradeClick?: () => void;
  onMenuClick?: () => void;
}

/**
 * TopBar — 탑바
 * Figma 수치:
 *   - height: 48px
 *   - border-bottom: 0.5px rgba(70,48,17,0.2)
 *   - 크레딧 텍스트: left:777px, top:15px (→ left 기준 정렬)
 *   - 충전 버튼: right:478px, top:8px (→ CreditChip 내부 처리)
 *   - 업그레이드 버튼: w:67px, h:32px, right:64px, top:8px
 *   - 메뉴 아이콘: right aligned (right:16px equiv)
 */
export default function TopBar({
  creditBalance = 0,
  onChargeClick,
  onUpgradeClick,
  onMenuClick,
}: TopBarProps) {
  return (
    <header
      className="flex items-center justify-between flex-shrink-0 px-6 bg-surface-card"
      style={{
        height: 48,
        borderBottom: '0.5px solid rgba(70, 48, 17, 0.2)',
      }}
    >
      {/* 좌측 여백 (추후 브레드크럼 등 배치 가능) */}
      <div />

      {/* 우측: 크레딧 + 업그레이드 + 메뉴 */}
      <div className="flex items-center gap-3">
        <CreditChip balance={creditBalance} onChargeClick={onChargeClick} />

        {/* 업그레이드 버튼 */}
        <button
          onClick={onUpgradeClick}
          className="font-myungjo text-[12px] text-text-secondary flex items-center justify-center hover:bg-surface-divider/10 transition-colors"
          style={{
            width: 67,
            height: 32,
            border: '0.5px solid rgba(70, 48, 17, 0.2)',
            borderRadius: 4,
          }}
          aria-label="플랜 업그레이드"
        >
          업그레이드
        </button>

        {/* 메뉴 아이콘 */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="메뉴"
        >
          <SymbolIcon name="menu_24dp" color="#505050" size={24} />
        </button>
      </div>
    </header>
  );
}
