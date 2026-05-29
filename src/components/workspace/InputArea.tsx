'use client';

import { useRef, useCallback } from 'react';
import SymbolIcon from '@/components/icons/SymbolIcon';
import { useWorkspaceStore, FEATURE_META } from '@/stores/workspace';

interface InputAreaProps {
  onSubmit?: (value: string) => void;
}

/**
 * InputArea — 입력 박스
 * Figma Frame 334 수치: width:640px, height:160px
 * bg: surface.card (#FFFFFF), border: 0.5px rgba(70,48,17,0.2), border-radius: 16px
 * shadow: 0 0 4px rgba(70,48,17,0.1)
 * placeholder: left:24px, top:16px, 16px, color: text-text-tertiary
 * + 버튼: left:24px, top:120px (24×24, add_24dp)
 *
 * 메뉴 미선택 시: disabled 상태 + "메뉴 선택을 먼저 해주세요." placeholder
 * 메뉴 선택 후: 기능별 §4.4 placeholder로 전환, 활성화
 */
export default function InputArea({ onSubmit }: InputAreaProps) {
  const { selectedFeature, inputValue, setInputValue } = useWorkspaceStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = !selectedFeature;
  const placeholder = selectedFeature
    ? FEATURE_META[selectedFeature].placeholder
    : '메뉴 선택을 먼저 해주세요.';

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (inputValue.trim()) {
          onSubmit?.(inputValue.trim());
        }
      }
    },
    [inputValue, onSubmit]
  );

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit?.(inputValue.trim());
    }
  };

  return (
    <div
      className="relative mx-auto bg-surface-card"
      style={{
        width: 640,
        minHeight: 160,
        maxWidth: '100%',
        border: '0.5px solid rgba(70, 48, 17, 0.2)',
        borderRadius: 16,
        boxShadow: '0px 0px 4px rgba(70, 48, 17, 0.1)',
        opacity: isDisabled ? 0.5 : 1,
        pointerEvents: isDisabled ? 'none' : 'auto',
      }}
    >
      {/* 텍스트 입력 영역 */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder={placeholder}
        rows={4}
        className="workspace-input w-full resize-none bg-transparent font-myungjo text-[16px] text-text-primary outline-none"
        style={{
          padding: '16px 24px',
          paddingBottom: 48, // + 버튼 위 여백
          lineHeight: '24px',
        }}
        aria-label="글 작업 입력"
      />

      {/* 하단 액션 바 */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6"
        style={{ height: 48 }}
      >
        {/* + 버튼 (파일 첨부 등 — 현재는 빈 액션) */}
        <button
          className="flex items-center justify-center hover:opacity-70 transition-opacity"
          aria-label="파일 첨부"
          onClick={() => {/* Stage 1~6에서 구현 */}}
        >
          <SymbolIcon name="add_24dp" color="#737373" size={24} />
        </button>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          className="font-myungjo text-[12px] flex items-center justify-center transition-all"
          style={{
            height: 32,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 4,
            backgroundColor: inputValue.trim() ? '#490D0E' : 'transparent',
            color: inputValue.trim() ? '#FEFEFE' : '#737373',
            border: '0.5px solid rgba(70, 48, 17, 0.2)',
          }}
          aria-label="작업 시작"
        >
          시작하기
        </button>
      </div>

    </div>
  );
}
