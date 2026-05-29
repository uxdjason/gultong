'use client';

import { useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/workspace';
import WorkspacePromptHeading from './WorkspacePromptHeading';
import InputArea from './InputArea';
import FeatureMenuChip from './FeatureMenuChip';

/**
 * WorkspaceStream — 세로 스크롤 스트림 컨테이너 (§4.7)
 * ChatGPT/Gemini 유사 UX: 기능 실행마다 블록이 아래에 추가
 * 메뉴 칩 행: sticky top-0
 * 스트림 영역: overflow-y-auto, 새 블록 추가 시 auto-scroll
 */
export default function WorkspaceStream() {
  const { selectedFeature, streamBlocks } = useWorkspaceStore();
  const streamEndRef = useRef<HTMLDivElement>(null);

  // 새 블록 추가 시 자동 스크롤 (§4.7)
  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamBlocks.length]);

  const showHeadingAndInput = streamBlocks.length === 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-surface-main">
      {/* 메뉴 칩 행 — sticky */}
      <div
        className="sticky top-0 z-10"
        role="radiogroup"
        aria-label="글 작업 기능 선택"
      >
        <FeatureMenuChip />
      </div>

      {/* 스트림 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex flex-col gap-8 py-8 mx-auto"
          style={{
            // 데스크탑: 양쪽 여백, 최대 너비 제한
            paddingLeft: 'max(200px, calc((100% - 640px) / 2))',
            paddingRight: 'max(200px, calc((100% - 640px) / 2))',
            maxWidth: 1140,
          }}
        >
          {/* 초기 상태: 헤딩 + 입력창 */}
          {showHeadingAndInput && (
            <>
              <WorkspacePromptHeading />
              <InputArea
                onSubmit={(value) => {
                  // Stage 1~6에서 각 기능별 API 호출 구현
                  console.log('Submit:', selectedFeature, value);
                }}
              />
            </>
          )}

          {/* 스트림 블록들 (Stage 1~6에서 추가) */}
          {streamBlocks.map((block) => (
            <div key={block.id} className="w-full">
              {/* 블록 타입별 렌더링 — 추후 각 Stage에서 구현 */}
              <div className="font-myungjo text-text-primary text-[16px]">
                {block.content}
              </div>
            </div>
          ))}

          {/* 스트림 끝 마커 (auto-scroll target) */}
          <div ref={streamEndRef} />
        </div>
      </div>
    </div>
  );
}
