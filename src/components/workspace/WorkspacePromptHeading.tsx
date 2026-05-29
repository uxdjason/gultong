'use client';

import { useWorkspaceStore, FEATURE_META } from '@/stores/workspace';

/**
 * WorkspacePromptHeading — 메인 영역 상단 헤딩
 * Figma 수치: 24px Regular, center-aligned, top:306px 기준
 * 메뉴 미선택: "어떤 글 작업을 새로 시작할까요?"
 * 메뉴 선택 후: "{기능명} 작업을 시작해볼까요?"
 */
export default function WorkspacePromptHeading() {
  const { selectedFeature } = useWorkspaceStore();

  const headingText = selectedFeature
    ? `${FEATURE_META[selectedFeature].label} 작업을 시작해볼까요?`
    : '어떤 글 작업을 새로 시작할까요?';

  return (
    <h1
      className="font-myungjo font-normal text-text-primary text-center"
      style={{ fontSize: 28, lineHeight: '40px', letterSpacing: '-0.01em' }}
    >
      {headingText}
    </h1>
  );
}
