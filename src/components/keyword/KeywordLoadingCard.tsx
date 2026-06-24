import React from 'react';

export default function KeywordLoadingCard() {
  return (
    <div className="bg-surface-card rounded-lg p-6 shadow-card flex flex-col gap-4 w-full border border-surface-divider/30 animate-pulse">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-8 bg-surface-divider/10 rounded w-48"></div>
          <div className="h-4 bg-surface-divider/10 rounded w-64"></div>
        </div>
        <div className="h-16 w-16 bg-surface-divider/10 rounded-full shrink-0"></div>
      </div>
      <div className="h-20 bg-surface-divider/10 rounded-md mt-2"></div>
      <div className="flex justify-end mt-2">
        <div className="h-8 bg-surface-divider/10 rounded w-32"></div>
      </div>
    </div>
  );
}
