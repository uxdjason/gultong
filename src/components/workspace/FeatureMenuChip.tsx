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
  inline?: boolean;
}

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
    <>
      {FEATURES.map((featureId) => {
        const { label } = FEATURE_META[featureId];
        const isSelected = selectedFeature === featureId;

        return (
          <button
            key={featureId}
            id={`feature-chip-${featureId}`}
            onClick={(e) => { e.preventDefault(); handleClick(featureId); }}
            className="button-default w-inline-block"
            style={{
              backgroundColor: isSelected ? '#490D0E' : '',
              color: isSelected ? '#FEFEFE' : '',
            }}
            role="radio"
            aria-checked={isSelected}
          >
            <div>{label}</div>
          </button>
        );
      })}
    </>
  );
}
