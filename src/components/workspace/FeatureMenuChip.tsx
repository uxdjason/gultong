'use client';

import { useWorkspaceStore, FEATURE_META, type FeatureId } from '@/stores/workspace';

const FEATURES: FeatureId[] = [
  'keyword',
  'blog',
  'affiliate',
  'product',
  'detect',
  'humanize',
];

/**
 * FeatureMenuChip × 6 — Figma 수치
 * height: 32px, border-radius: 4px (rounded-sm)
 * border: 0.5px solid rgba(70,48,17,0.2)
 * font: 12px, color: text-text-secondary
 * 선택 상태: brand.ink 배경, text-text-inverse
 */
export default function FeatureMenuChip() {
  const { selectedFeature, setSelectedFeature, clearStreamBlocks, setInputValue } =
    useWorkspaceStore();

  const handleClick = (featureId: FeatureId) => {
    if (selectedFeature === featureId) {
      // 같은 칩 재클릭 시 선택 해제
      setSelectedFeature(null);
      clearStreamBlocks();
      setInputValue('');
    } else {
      setSelectedFeature(featureId);
      clearStreamBlocks();
      setInputValue('');
    }
  };

  return (
    <div
      className="flex items-center gap-2 px-6 bg-surface-main"
      style={{
        paddingTop: 12,
        paddingBottom: 12,
        borderBottom: '0.5px solid rgba(70, 48, 17, 0.2)',
        flexWrap: 'wrap',
      }}
    >
      {FEATURES.map((featureId) => {
        const { label } = FEATURE_META[featureId];
        const isSelected = selectedFeature === featureId;

        return (
          <button
            key={featureId}
            id={`feature-chip-${featureId}`}
            onClick={() => handleClick(featureId)}
            className="font-myungjo text-[12px] transition-all duration-150 hover:opacity-80 flex items-center justify-center px-3"
            style={{
              height: 32,
              borderRadius: 4,
              border: '0.5px solid rgba(70, 48, 17, 0.2)',
              backgroundColor: isSelected ? '#490D0E' : 'transparent',
              color: isSelected ? '#FEFEFE' : '#505050',
              whiteSpace: 'nowrap',
            }}
            role="radio"
            aria-checked={isSelected}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
