'use client';

import { useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/workspace';
import WorkspacePromptHeading from './WorkspacePromptHeading';
import InputArea from './InputArea';
import FeatureMenuChip from './FeatureMenuChip';

/**
 * WorkspaceStream — 메인 콘텐츠 스크롤 영역 (§4.7 세로 스크롤 모델)
 *
 * 초기 상태 (stream 비어있음):
 *   수직 중앙 정렬로 헤딩 → 기능 칩 → 입력창 표시
 *   Figma 기준: 전체 영역에서 콘텐츠가 약 1/3 지점에 위치
 *
 * 작업 진행 후:
 *   위에서 아래로 블록이 쌓이는 ChatGPT 스타일 스트림
 */
export default function WorkspaceStream() {
  const { selectedFeature, streamBlocks } = useWorkspaceStore();
  const streamEndRef = useRef<HTMLDivElement>(null);

  // 새 블록 추가 시 자동 스크롤
  useEffect(() => {
    if (streamBlocks.length > 0) {
      streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamBlocks.length]);

  const isEmpty = streamBlocks.length === 0;

  return (
    <div className="flex-1 overflow-y-auto bg-surface-main">
      {isEmpty ? (
        /* ── 초기 상태: 헤딩 → 칩 → 입력창 수직 중앙 ── */
        <div
          className="flex flex-col items-center justify-center min-h-full"
          style={{ padding: '48px 40px' }}
        >
          <div
            className="flex flex-col items-center w-full"
            style={{ maxWidth: 840, gap: 32 }}
          >
            {/* 헤딩 */}
            <WorkspacePromptHeading />

            {/* 기능 칩 행 */}
            <FeatureMenuChip inline />

            {/* 입력 박스 */}
            <InputArea
              onSubmit={(value) => {
                // Stage 1~6에서 각 기능별 API 호출 구현
                console.log('Submit:', selectedFeature, value);
              }}
            />
          </div>
        </div>
      ) : (
        /* ── 작업 진행 후: 세로 스크롤 스트림 ── */
        <div
          className="flex flex-col mx-auto"
          style={{
            maxWidth: 840,
            padding: '48px 40px',
            gap: 32,
          }}
        >
          {/* 상단: 헤딩 + 칩 (sticky처럼 항상 보이는 역할) */}
          <WorkspacePromptHeading />
          <FeatureMenuChip inline />
          <InputArea
            onSubmit={(value) => {
              console.log('Submit:', selectedFeature, value);
            }}
          />

          {/* 스트림 블록들 (Stage 1~6에서 추가) */}
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
