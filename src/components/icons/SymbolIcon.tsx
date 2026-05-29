'use client';

/**
 * SymbolIcon — Material Symbols SVG를 mask-image로 렌더링.
 * SVG는 fill=#1F1F1F 하드코딩이므로 직접 색상 변경 불가.
 * mask-image + background-color 조합으로 토큰 색상 적용.
 *
 * 사용 예:
 *   <SymbolIcon name="search_24dp" color="#505050" size={24} />
 *   <SymbolIcon name="add_circle_24dp" className="text-text-secondary" />
 */

interface SymbolIconProps {
  /** public/images/ 아래 SVG 파일명 (확장자 제외, _1F1F1F_FILL0_wght400_GRAD0_opsz24 포함) */
  name: string;
  /** 아이콘 색상 (CSS color 값 또는 Tailwind var). className으로도 제어 가능. */
  color?: string;
  /** 아이콘 크기 (px). 기본 24. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

// SVG 파일명 전체를 받아도 되고, 짧은 이름(예: "search_24dp")을 받아도 됨
function resolveIconPath(name: string): string {
  // 이미 full 파일명인 경우
  if (name.includes('_1F1F1F_')) {
    return `/images/${name}.svg`;
  }
  // 짧은 이름: suffix 자동 추가
  return `/images/${name}_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg`;
}

export default function SymbolIcon({
  name,
  color = '#505050',
  size = 24,
  className = '',
  style,
  'aria-label': ariaLabel,
}: SymbolIconProps) {
  const iconPath = resolveIconPath(name);

  return (
    <span
      role="img"
      aria-label={ariaLabel ?? name}
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: color,
        maskImage: `url(${iconPath})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(${iconPath})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        ...style,
      }}
    />
  );
}
