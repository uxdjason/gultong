import React from 'react';
import { KeywordScore } from '@/lib/keyword/types';
import WritabilityGauge from './WritabilityGauge';
import KeywordBadge from './KeywordBadge';
import WriteWithKeywordMenu from './WriteWithKeywordMenu';

interface Props {
  data: KeywordScore;
}

export default function KeywordPrimaryCard({ data }: Props) {
  const formatNum = (n: number) => new Intl.NumberFormat('ko-KR').format(n);
  
  const compColor = data.competition === '높음' ? 'text-state-danger font-bold' : data.competition === '낮음' ? 'text-state-success font-bold' : 'text-text-primary font-bold';
  
  const trendIcon = data.trendDirection === '상승' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-state-success inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
  ) : data.trendDirection === '하락' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-state-danger inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-state-info inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  );

  const trendText = data.trendDirection === '상승' ? <span className="text-state-success font-bold ml-1">상승 중</span> : data.trendDirection === '하락' ? <span className="text-state-danger font-bold ml-1">하락 중</span> : <span className="text-state-info font-bold ml-1">유지 중</span>;

  return (
    <div className="bg-surface-card rounded-lg p-6 shadow-card flex flex-col gap-4 font-myungjo relative border border-surface-divider/30">
      {/* Header: Keyword and Badges */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-24 font-bold text-text-primary m-0 leading-none">{data.keyword}</h3>
            {data.badge && <KeywordBadge type={data.badge} />}
          </div>
          <div className="flex items-center gap-3 text-14 text-text-secondary flex-wrap mt-1">
            <span>검색량 <strong className="font-semibold text-text-primary">약 {formatNum(data.searchVolume)}</strong> {data.source === 'estimated' && <span className="text-12 text-text-tertiary ml-1">(추정치)</span>}</span>
            <span className="text-surface-divider">|</span>
            <span>경쟁도 <strong className={compColor}>{data.competition}</strong></span>
            <span className="text-surface-divider">|</span>
            <span className="flex items-center gap-0.5">
              트렌드 {trendIcon}{trendText}
            </span>
          </div>
        </div>
        
        {/* Score Gauge */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <WritabilityGauge score={data.writabilityScore} size={64} />
          <span className="text-12 font-bold text-text-primary mt-1">{data.writabilityScore} / 100점</span>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-surface-main rounded-md p-4 mt-2 border border-surface-divider/20">
        <p className="text-14 text-text-primary leading-relaxed m-0">
          {data.aiInsight}
        </p>
      </div>

      {/* Write CTA */}
      <div className="flex justify-end mt-2">
        <WriteWithKeywordMenu keyword={data.keyword} />
      </div>
    </div>
  );
}
