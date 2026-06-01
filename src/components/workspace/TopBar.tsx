'use client';

interface TopBarProps {
  creditBalance?: number;
  onChargeClick?: () => void;
  onUpgradeClick?: () => void;
  onMenuClick?: () => void;
}

export default function TopBar({
  creditBalance = 0,
  onChargeClick,
  onUpgradeClick,
  onMenuClick,
}: TopBarProps) {
  const formatted = creditBalance.toLocaleString('ko-KR');

  return (
    <div className="top-bar">
      <div className="credit-section">
        <div className="text-block-3">{formatted} 크레딧 남았어요.</div>
        <a 
          href="#" 
          className="top-bar-button w-inline-block"
          onClick={(e) => { e.preventDefault(); onChargeClick?.(); }}
        >
          <div>충전</div>
        </a>
      </div>
      <div className="top-bar-right">
        <a 
          href="#" 
          className="top-bar-button w-inline-block"
          onClick={(e) => { e.preventDefault(); onUpgradeClick?.(); }}
        >
          <div>업그레이드</div>
        </a>
        <a 
          href="#" 
          className="link-icon w-inline-block"
          onClick={(e) => { e.preventDefault(); onMenuClick?.(); }}
        >
          <div className="svg-icon-24 w-embed">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"></path>
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}
