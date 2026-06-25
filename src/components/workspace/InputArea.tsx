'use client';

import { useRef, useCallback, useState } from 'react';
import { useWorkspaceStore, FEATURE_META } from '@/stores/workspace';

interface InputAreaProps {
  onSubmit?: (value: string) => void;
  isWorking?: boolean;
  onStop?: () => void;
}

export default function InputArea({ onSubmit, isWorking, onStop }: InputAreaProps) {
  const { selectedFeature, inputValue, setInputValue } = useWorkspaceStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = !selectedFeature;
  const placeholder = isWorking 
    ? '분석 중입니다. 잠시 기다려주세요.' 
    : '분석할 시드 키워드를 입력해 주세요.';

  const [validationError, setValidationError] = useState<string | null>(null);

  const submit = useCallback(() => {
    if (isDisabled || isWorking) return;
    const val = inputValue.trim();
    
    if (!val) {
      setValidationError('키워드를 입력해 주세요.');
      return;
    }
    
    if (val.length > 40) {
      setValidationError('키워드는 40자 이내로 짧게 입력해 주세요 (예: 겨울 캠핑 텐트)');
      return;
    }
    
    setValidationError(null);
    if (onSubmit) {
      onSubmit(val);
    }
  }, [inputValue, onSubmit, isDisabled, isWorking]);

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
    <div className="flex flex-col gap-2 relative w-full">
      <div className="text-area-container bg-surface-card" style={{ position: 'relative', height: '120px', padding: '0' }}>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (validationError) setValidationError(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isWorking}
          placeholder={placeholder}
          rows={3}
          className="workspace-input p-4 pr-14 font-myungjo text-16"
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

        {isWorking ? (
          <button
            onClick={(e) => { e.preventDefault(); onStop?.(); }}
            className="absolute right-4 bottom-4 w-8 h-8 rounded flex items-center justify-center transition-colors bg-state-danger text-white hover:bg-state-danger/90"
            aria-label="중지"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" fill="currentColor">
              <path d="M6 6h12v12H6z"/>
            </svg>
          </button>
        ) : (
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
        )}
      </div>
      {validationError && (
        <div className="text-14 text-state-danger font-myungjo pl-2">
          * {validationError}
        </div>
      )}
    </div>
  );
}
