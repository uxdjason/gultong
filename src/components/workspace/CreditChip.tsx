'use client';

import SymbolIcon from '@/components/icons/SymbolIcon';

interface CreditChipProps {
  balance?: number;
  onChargeClick?: () => void;
}

/**
 * CreditChip — 크레딧 잔액 표시 + 충전 버튼
 * Figma 수치:
 *   - 크레딧 텍스트: 14px, text-text-secondary
 *   - 충전 버튼: w:40px h:32px, border 0.5px, rounded-sm
 */
export default function CreditChip({ balance = 0, onChargeClick }: CreditChipProps) {
  const formattedBalance = balance.toLocaleString('ko-KR');

  return (
    <div className="flex items-center gap-2">
      <span className="font-myungjo text-[14px] text-text-secondary">
        {formattedBalance} 크레딧 남았어요.
      </span>
      <button
        onClick={onChargeClick}
        className="font-myungjo text-[12px] text-text-secondary flex items-center justify-center hover:bg-surface-divider/10 transition-colors"
        style={{
          width: 40,
          height: 32,
          border: '0.5px solid rgba(70, 48, 17, 0.2)',
          borderRadius: 4,
        }}
        aria-label="크레딧 충전"
      >
        충전
      </button>
    </div>
  );
}
