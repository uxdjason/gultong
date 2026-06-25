import React, { useState, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/stores/workspace';
import SymbolIcon from '@/components/icons/SymbolIcon';

interface Props {
  keyword: string;
  variant?: 'primary' | 'ghost';
}

export default function WriteWithKeywordMenu({ keyword, variant = 'primary' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const startFeatureWithKeyword = useWorkspaceStore((s) => s.startFeatureWithKeyword);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (featureId: 'blog' | 'affiliate' | 'product') => {
    startFeatureWithKeyword(featureId, keyword);
    setIsOpen(false);
  };

  const buttonClass = variant === 'primary'
    ? "bg-brand-ink text-text-inverse hover:bg-brand-ink/90 shadow-sm"
    : "bg-transparent text-text-secondary hover:bg-brand-paper/50 hover:text-brand-ink";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-14 font-myungjo transition-colors whitespace-nowrap ${buttonClass}`}
      >
        이 키워드로 글 쓰기
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-card bg-surface-card ring-1 ring-surface-divider z-10 font-myungjo">
          <div className="py-1">
            <button
              onClick={() => handleSelect('blog')}
              className="w-full text-left px-4 py-2 text-14 text-text-primary hover:bg-surface-main transition-colors"
            >
              수익형 블로그
            </button>
            <button
              onClick={() => handleSelect('affiliate')}
              className="w-full text-left px-4 py-2 text-14 text-text-primary hover:bg-surface-main transition-colors"
            >
              제휴 마케팅 · 체험단
            </button>
            <button
              onClick={() => handleSelect('product')}
              className="w-full text-left px-4 py-2 text-14 text-text-primary hover:bg-surface-main transition-colors"
            >
              제품 상세페이지
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
