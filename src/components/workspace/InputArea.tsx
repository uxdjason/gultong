'use client';

import { useRef, useCallback } from 'react';
import { useWorkspaceStore, FEATURE_META } from '@/stores/workspace';

interface InputAreaProps {
  onSubmit?: (value: string) => void;
}

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

  return (
    <div 
      className="text-area-container" 
      style={{
        opacity: isDisabled ? 0.5 : 1,
        transition: 'opacity 0.2s',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder={placeholder}
        rows={4}
        className="workspace-input w-full resize-none bg-transparent outline-none"
        style={{
          border: 'none',
          padding: '24px 24px 64px 24px',
          width: '100%',
          flexGrow: 1,
        }}
        aria-label="글 작업 입력"
      />

      <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px' }}>
        <button
          className="link-icon w-inline-block"
          onClick={() => {}}
          type="button"
          aria-label="파일 첨부"
        >
          <div className="svg-icon-24 w-embed">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
