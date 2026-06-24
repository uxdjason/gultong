import React from 'react';
import { KeywordScore } from '@/lib/keyword/types';
import WriteWithKeywordMenu from './WriteWithKeywordMenu';

interface Props {
  data: KeywordScore;
}

export default function KeywordRelatedRow({ data }: Props) {
  const formatNumKorean = (n: number) => {
    if (n >= 10000) {
      const man = Math.floor(n / 10000);
      const chun = Math.floor((n % 10000) / 1000);
      if (chun > 0) return `${man}만 ${chun}천`;
      return `${man}만`;
    }
    if (n >= 1000) {
      const chun = Math.floor(n / 1000);
      const baek = Math.floor((n % 1000) / 100);
      if (baek > 0) return `${chun}천 ${baek}백`;
      return `${chun}천`;
    }
    return n.toString();
  };

  const compColor = data.competition === '높음' ? 'text-state-danger font-bold' : data.competition === '낮음' ? 'text-state-success font-bold' : 'text-text-primary';

  const trendIcon = data.trendDirection === '상승' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-state-success inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
  ) : data.trendDirection === '하락' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-state-danger inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-state-info inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  );

  const trendText = data.trendDirection === '상승' ? <span className="text-state-success font-bold ml-1">상승 중</span> : data.trendDirection === '하락' ? <span className="text-state-danger font-bold ml-1">하락 중</span> : <span className="text-state-info font-bold ml-1">유지 중</span>;

  let scoreColor = 'bg-state-danger';
  if (data.writabilityScore >= 75) scoreColor = 'bg-state-success';
  else if (data.writabilityScore >= 50) scoreColor = 'bg-state-warning';

  return (
    <div className="flex items-center justify-between py-3 px-6 hover:bg-surface-main/50 transition-colors border-b border-surface-divider/20 last:border-0 font-myungjo group">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-3 min-w-[120px] flex-1">
          <span className={`w-3 h-3 rounded-full shrink-0 ${scoreColor}`}></span>
          <span className="text-15 font-bold text-text-primary truncate">{data.keyword}</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-4 text-13 text-text-secondary pr-2">
          <span className="w-28 text-right">약 {formatNumKorean(data.searchVolume)}</span>
          <span className={`w-16 text-center ${compColor}`}>{data.competition}</span>
          <span className="w-24 text-center flex items-center justify-center">{trendIcon}{trendText}</span>
          <span className="w-24 text-center font-bold text-text-primary">{data.writabilityScore} / 100점</span>
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100 shrink-0 w-36 flex justify-end">
        <WriteWithKeywordMenu keyword={data.keyword} variant="ghost" />
      </div>
    </div>
  );
}
