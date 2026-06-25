import React, { useState, useMemo } from 'react';
import { AnalyzeKeywordsResponse } from '@/lib/keyword/types';
import KeywordPrimaryCard from './KeywordPrimaryCard';
import KeywordRelatedRow from './KeywordRelatedRow';

interface Props {
  data: AnalyzeKeywordsResponse;
}

export default function KeywordResultCard({ data }: Props) {
  const [showAll, setShowAll] = useState(false);
  const related = data.related || [];
  
  const sortedRelated = useMemo(() => {
    return [...related].sort((a, b) => b.writabilityScore - a.writabilityScore);
  }, [related]);
  
  const displayedRelated = showAll ? sortedRelated : sortedRelated.slice(0, 5);

  return (
    <div className="flex flex-col gap-4 w-full">
      <KeywordPrimaryCard data={data.primary} />
      
      {sortedRelated.length > 0 && (
        <div className="bg-surface-card rounded-lg shadow-card border border-surface-divider/30 overflow-hidden font-myungjo pl-2">
          <div className="bg-surface-main/50 py-3 px-6 border-b border-surface-divider/30 font-myungjo flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-3 min-w-[120px] flex-1 min-w-0">
              <h4 className="text-14 font-bold text-text-primary m-0 truncate">연관 키워드</h4>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-12 text-text-secondary pr-2">
              <span className="w-28 text-right">검색량</span>
              <span className="w-16 text-center">경쟁도</span>
              <span className="w-24 text-center">트렌드</span>
              <span className="w-24 text-center">글쓰기 점수</span>
            </div>
            <div className="hidden sm:flex shrink-0 w-36 pl-2 justify-end"></div>
          </div>
          <div className="flex flex-col">
            {displayedRelated.map((item, idx) => (
              <KeywordRelatedRow key={idx} data={item} />
            ))}
          </div>
          
          {sortedRelated.length > 5 && (
            <div className="py-2 border-t border-surface-divider/20 bg-surface-main/30 flex justify-center">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="text-13 text-text-secondary hover:text-brand-ink transition-colors font-medium px-4 py-1"
              >
                {showAll ? '접기' : `더 보기 (${sortedRelated.length - 5}개)`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
