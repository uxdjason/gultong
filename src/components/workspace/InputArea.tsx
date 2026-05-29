'use client';

import { useRef, useCallback } from 'react';
import SymbolIcon from '@/components/icons/SymbolIcon';
import { useWorkspaceStore, FEATURE_META } from '@/stores/workspace';

interface InputAreaProps {
  onSubmit?: (value: string) => void;
}

/**
 * InputArea — 입력 박스
 * Figma: 전체 너비 사용, 높이 자동, 최소 160px
 * bg: surface.card, border: 0.5px rgba(70,48,17,0.2), border-radius: 16px
 * shadow: card
 *
 * 메뉴 미선택: disabled (반투명) + "메뉴 선택을 먼저 해주세요." placeholder
 * 메뉴 선택 후: 기능별 placeholder, Cmd/Ctrl+Enter 제출
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
        if (inputValue.trim() && onSubmit) {
          onSubmit(inputValue.trim());
        }
      }
    },
    [inputValue, onSubmit]
  );

  const handleSubmit = () => {
    if (inputValue.trim() && onSubmit) {
      onSubmit(inputValue.trim());
    }
  };

  return (
    <div
      className="relative w-full bg-surface-card"
      style={{
        border: '0.5px solid rgba(70, 48, 17, 0.2)',
        borderRadius: 16,
        boxShadow: '0px 0px 4px rgba(70, 48, 17, 0.1)',
        opacity: isDisabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* 텍스트 영역 */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder={placeholder}
        rows={4}
        className="workspace-input w-full resize-none bg-transparent font-myungjo text-text-primary outline-none"
        style={{
          fontSize: 16,
          lineHeight: '24px',
          padding: '16px 24px 56px 24px',
          display: 'block',
        }}
        aria-label="글 작업 입력"
      />

      {/* 하단 바: + 버튼 + 제출 버튼 */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '0 16px 16px 16px' }}
      >
        {/* + 버튼 (파일 첨부 — Stage 1~6 구현) */}
        <button
          className="flex items-center justify-center hover:opacity-60 transition-opacity"
          aria-label="파일 첨부"
          onClick={() => {}}
          type="button"
        >
          <SymbolIcon name="add_24dp" color="#737373" size={24} />
        </button>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isDisabled}
          type="button"
          className="font-myungjo flex items-center justify-center transition-all"
          style={{
            fontSize: 14,
            height: 32,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 4,
            backgroundColor: inputValue.trim() && !isDisabled ? '#490D0E' : 'transparent',
            color: inputValue.trim() && !isDisabled ? '#FEFEFE' : '#737373',
            border: '0.5px solid rgba(70, 48, 17, 0.2)',
            cursor: !inputValue.trim() || isDisabled ? 'default' : 'pointer',
          }}
          aria-label="작업 시작"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
