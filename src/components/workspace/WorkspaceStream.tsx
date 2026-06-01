'use client';

import { useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/workspace';
import FeatureMenuChip from './FeatureMenuChip';
import InputArea from './InputArea';

export default function WorkspaceStream() {
  const { selectedFeature, streamBlocks } = useWorkspaceStore();
  const streamEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamBlocks.length > 0) {
      streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamBlocks.length]);

  const isEmpty = streamBlocks.length === 0;

  return (
    <div className="main-block-default overflow-y-auto w-full h-full">
      <div className="main-text-block">어떤 글 작업을 새로 시작할까요?</div>
      
      <div className="menu-container">
        {/* We use FeatureMenuChip to render the .button-default chips */}
        <FeatureMenuChip inline />
      </div>

      <InputArea
        onSubmit={(value) => {
          console.log('Submit:', selectedFeature, value);
        }}
      />

      {/* 스트림 블록들 (Stage 1~6에서 추가) */}
      {!isEmpty && (
        <div className="w-full max-w-[840px] mx-auto flex flex-col gap-8 mt-8 pb-12">
          {streamBlocks.map((block) => (
            <div
              key={block.id}
              className="w-full bg-surface-card rounded-lg p-6"
              style={{ boxShadow: '0px 0px 4px rgba(70, 48, 17, 0.1)' }}
            >
              <div className="font-myungjo text-text-primary" style={{ fontSize: 16 }}>
                {block.content}
              </div>
            </div>
          ))}
          <div ref={streamEndRef} />
        </div>
      )}
    </div>
  );
}
