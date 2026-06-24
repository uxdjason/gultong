import React from 'react';
import { Badge } from '@/lib/keyword/types';

interface KeywordBadgeProps {
  type: Badge | '추정치';
}

export default function KeywordBadge({ type }: KeywordBadgeProps) {
  if (!type) return null;

  let bgClass = 'bg-surface-main';
  let textClass = 'text-text-secondary';
  
  switch (type) {
    case '블루오션':
      bgClass = 'bg-state-success/10';
      textClass = 'text-state-success';
      break;
    case '급상승':
      bgClass = 'bg-state-danger/10';
      textClass = 'text-state-danger';
      break;
    case '계절성':
      bgClass = 'bg-state-info/10';
      textClass = 'text-state-info';
      break;
    case '추정치':
      bgClass = 'bg-surface-main';
      textClass = 'text-text-tertiary';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium font-myungjo ${bgClass} ${textClass}`}>
      {type}
    </span>
  );
}
