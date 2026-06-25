'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useWorkspaceStore, StreamBlock } from '@/stores/workspace';
import FeatureMenuChip from './FeatureMenuChip';
import InputArea from './InputArea';
import KeywordResultCard from '@/components/keyword/KeywordResultCard';
import KeywordLoadingCard from '@/components/keyword/KeywordLoadingCard';
import { AnalyzeKeywordsResponse } from '@/lib/keyword/types';

function renderStreamBlock(block: StreamBlock) {
  if (block.type === 'input') {
    return (
      <div className="w-full flex justify-end">
        <div className="bg-surface-card px-6 py-3 rounded-2xl rounded-tr-sm font-myungjo text-16 text-text-primary shadow-sm border border-surface-divider/20 max-w-[80%] inline-block whitespace-pre-wrap">
          {block.content}
        </div>
      </div>
    );
  }

  if (block.type === 'loading' && block.featureId === 'keyword') {
    return <KeywordLoadingCard />;
  }

  if (block.type === 'result' && block.featureId === 'keyword' && block.payload) {
    return <KeywordResultCard data={block.payload as AnalyzeKeywordsResponse} />;
  }

  if (block.type === 'error') {
    return (
      <div className="w-full bg-state-danger/10 border border-state-danger/20 rounded-lg p-6 flex flex-col gap-2">
        <span className="text-14 font-bold text-state-danger font-myungjo">오류 발생</span>
        <span className="text-14 text-state-danger font-myungjo">{block.content}</span>
      </div>
    );
  }

  if (block.type === 'aborted') {
    return (
      <div className="w-full bg-surface-card rounded-lg p-6 shadow-card border border-surface-divider/20 flex flex-col gap-2">
        <span className="font-myungjo text-text-primary text-16 whitespace-pre-wrap">{block.content}</span>
      </div>
    );
  }

  // fallback for generic or text
  return (
    <div className="w-full bg-surface-card rounded-lg p-6 shadow-card border border-surface-divider/20">
      <div className="font-myungjo text-text-primary text-16 whitespace-pre-wrap">
        {block.content || '지원하지 않는 블록 타입입니다.'}
      </div>
    </div>
  );
}

export default function WorkspaceStream() {
  const { selectedFeature, streamBlocks, addStreamBlock, setInputValue, inputValue } = useWorkspaceStore();
  const streamEndRef = useRef<HTMLDivElement>(null);
  const [turn, setTurn] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    if (streamBlocks.length > 0) {
      streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamBlocks]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = async (value: string) => {
    if (!selectedFeature) return;

    const inputBlock: StreamBlock = {
      id: Date.now().toString() + '-input',
      type: 'input',
      featureId: selectedFeature,
      content: value,
      turn
    };
    addStreamBlock(inputBlock);
    setInputValue('');

    if (selectedFeature === 'keyword') {
      const loadingId = Date.now().toString() + '-loading';
      const loadingBlock: StreamBlock = {
        id: loadingId,
        type: 'loading',
        featureId: selectedFeature,
        turn
      };
      addStreamBlock(loadingBlock);
      
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      setIsWorking(true);

      try {
        const res = await fetch('/api/keywords/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seedKeyword: value }),
          signal: abortController.signal
        });

        const data = await res.json();

        useWorkspaceStore.setState(state => ({
          streamBlocks: state.streamBlocks.filter(b => b.id !== loadingId)
        }));

        if (!res.ok) {
          throw new Error(data.error || '알 수 없는 오류');
        }

        const resultBlock: StreamBlock = {
          id: Date.now().toString() + '-result',
          type: 'result',
          featureId: selectedFeature,
          payload: data,
          turn
        };
        addStreamBlock(resultBlock);

      } catch (err: any) {
        useWorkspaceStore.setState(state => ({
          streamBlocks: state.streamBlocks.filter(b => b.id !== loadingId)
        }));
        
        if (err.name === 'AbortError') {
          const abortedBlock: StreamBlock = {
            id: Date.now().toString() + '-aborted',
            type: 'aborted',
            featureId: selectedFeature,
            content: '작업이 중단되었습니다.',
            turn
          };
          addStreamBlock(abortedBlock);
        } else {
          const errorBlock: StreamBlock = {
            id: Date.now().toString() + '-error',
            type: 'error',
            featureId: selectedFeature,
            content: err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.',
            turn
          };
          addStreamBlock(errorBlock);
        }
      } finally {
        setIsWorking(false);
        abortControllerRef.current = null;
      }
    }

    setTurn(t => t + 1);
  };

  const isEmpty = streamBlocks.length === 0;

  return (
    <>
      {isEmpty ? (
        <div className="main-block-default">
          <div className="main-text-block">어떤 글 작업을 새로 시작할까요?</div>
          <div className="menu-container">
            <FeatureMenuChip inline />
          </div>
          <div className="w-full max-w-[840px] mx-auto">
            <InputArea onSubmit={handleSubmit} isWorking={isWorking} onStop={handleStop} />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col relative pt-[80px]">
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-8 pb-40 md:pb-48" aria-live="polite">
            <div className="max-w-[840px] mx-auto w-full flex flex-col gap-6">
              {streamBlocks.map((block, index) => {
                const isLastInTurn = index === streamBlocks.length - 1 || streamBlocks[index + 1].turn !== block.turn;
                const isFinalState = block.type === 'result' || block.type === 'error' || block.type === 'aborted';
                const ts = parseInt(block.id.split('-')[0]);
                const timestamp = new Date(ts || Date.now()).toLocaleString('ko-KR', { 
                  month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                });

                return (
                  <React.Fragment key={block.id}>
                    <div className="w-full">
                      {renderStreamBlock(block)}
                    </div>
                    {isLastInTurn && isFinalState && (
                      <div className="flex justify-center mt-2 mb-8">
                        <span className="text-12 text-text-tertiary font-myungjo opacity-60">
                          {timestamp}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              <div ref={streamEndRef} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-8 bg-surface-main shadow-[0_-10px_20px_rgba(249,249,251,0.9)]">
            <div className="max-w-[840px] mx-auto">
              <InputArea onSubmit={handleSubmit} isWorking={isWorking} onStop={handleStop} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
