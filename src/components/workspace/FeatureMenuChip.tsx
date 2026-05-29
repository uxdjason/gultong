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

interface FeatureMenuChipProps {
  /** true일 때: 콘텐츠 흐름 안에서 가로 중앙 정렬 (기본 상태) */
  inline?: boolean;
}

/**
 * FeatureMenuChip × 6
 * Figma 기준: 가로로 한 줄, 칩 높이 32px, border-radius 4px, border 0.5px
 * 메인 콘텐츠 흐름 안에 배치 (sticky 아님)
 */
export default function FeatureMenuChip({ inline = false }: FeatureMenuChipProps) {
  const { selectedFeature, setSelectedFeature, clearStreamBlocks, setInputValue } =
    useWorkspaceStore();

  const handleClick = (featureId: FeatureId) => {
    if (selectedFeature === featureId) {
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
      className={`flex items-center flex-wrap gap-2 ${inline ? 'justify-center' : ''}`}
      role="radiogroup"
      aria-label="글 작업 기능 선택"
    >
      {FEATURES.map((featureId) => {
        const { label } = FEATURE_META[featureId];
        const isSelected = selectedFeature === featureId;

        return (
          <button
            key={featureId}
            id={`feature-chip-${featureId}`}
            onClick={() => handleClick(featureId)}
            className="font-myungjo transition-all duration-150 hover:opacity-75 flex items-center justify-center"
            style={{
              height: 32,
              paddingLeft: 16,
              paddingRight: 16,
              borderRadius: 4,
              border: '0.5px solid rgba(70, 48, 17, 0.2)',
              backgroundColor: isSelected ? '#490D0E' : 'transparent',
              color: isSelected ? '#FEFEFE' : '#505050',
              fontSize: 14,
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
