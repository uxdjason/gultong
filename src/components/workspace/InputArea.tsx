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
  const placeholder = '분석할 시드 키워드를 입력해 주세요.';

  const submit = useCallback(() => {
    if (inputValue.trim() && onSubmit && !isDisabled) {
      onSubmit(inputValue.trim());
    }
  }, [inputValue, onSubmit, isDisabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        submit();
      }
    },
    [submit]
  );

  return (
    <div className="text-area-container" style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        placeholder={placeholder}
        rows={3}
        className="workspace-input py-4 pr-14"
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          resize: 'none',
          outline: 'none',
          width: '100%',
          flexGrow: 1,
          minHeight: '80px',
        }}
        aria-label="글 작업 입력"
      />

      <button
        onClick={(e) => { e.preventDefault(); submit(); }}
        disabled={isDisabled || !inputValue.trim()}
        className={`absolute right-4 bottom-4 w-8 h-8 rounded flex items-center justify-center transition-colors ${
          !isDisabled && inputValue.trim() 
            ? 'bg-brand-ink text-white hover:bg-brand-ink/90' 
            : 'bg-surface-divider/20 text-text-tertiary cursor-not-allowed'
        }`}
        aria-label="제출"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
          <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/>
        </svg>
      </button>
    </div>
  );
}
