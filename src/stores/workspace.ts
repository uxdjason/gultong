import { create } from 'zustand';

// 6개 기능 메뉴 ID (§3.1 기능 일람표)
export type FeatureId =
  | 'keyword'       // 키워드 찾기
  | 'blog'          // 수익형 블로그
  | 'affiliate'     // 제휴 마케팅 · 체험단
  | 'product'       // 제품 상세페이지
  | 'detect'        // AI 글 탐지
  | 'humanize';     // AI 흔적 지우기 · 윤문

// 기능별 Placeholder 스크립트 (§4.4 인터랙션 스크립트)
export const FEATURE_META: Record<FeatureId, { label: string; placeholder: string }> = {
  keyword: {
    label: '키워드 찾기',
    placeholder: '분석할 시드 키워드를 입력해 주세요. (예: 겨울 캠핑 텐트)',
  },
  blog: {
    label: '수익형 블로그',
    placeholder: '어떤 키워드로 블로그 글을 쓸까요? (Stage 1 결과 자동 채움 가능)',
  },
  affiliate: {
    label: '제휴 마케팅 · 체험단',
    placeholder: '업체 가이드라인을 붙여넣거나, 체험할 제품/서비스 키워드를 입력해 주세요.',
  },
  product: {
    label: '제품 상세페이지',
    placeholder: '상품 정보를 입력해 주세요. (상품명, 핵심 스펙 3가지, 가격대, 타깃 고객)',
  },
  detect: {
    label: 'AI 글 탐지',
    placeholder: '검사할 텍스트를 붙여넣어 주세요. (1,000자 이상 권장)',
  },
  humanize: {
    label: 'AI 흔적 지우기 · 윤문',
    placeholder: '윤문할 텍스트를 붙여넣어 주세요.',
  },
};

// 스트림 블록 타입 (§4.7 세로 스크롤 모델)
export type BlockType = 'input' | 'chipgroup' | 'result' | 'loading' | 'error' | 'aborted';

export interface StreamBlock {
  id: string;
  type: BlockType;
  featureId: FeatureId;
  content?: string;
  payload?: unknown;
  turn: number;
}

// 진행 중인 작업 타입
export interface InProgressJob {
  featureId: FeatureId;
  turn: number;
  status: 'idle' | 'streaming' | 'done' | 'error';
}

interface WorkspaceState {
  // 현재 선택된 기능
  selectedFeature: FeatureId | null;
  // 세로 스크롤 스트림 블록들
  streamBlocks: StreamBlock[];
  // 현재 입력 값
  inputValue: string;
  // 진행 중인 작업
  inProgressJob: InProgressJob | null;
  // 사이드바 접힘 여부 (태블릿/모바일)
  sidebarCollapsed: boolean;
  // 다음 기능으로 넘겨줄 키워드
  prefillKeyword: string | null;

  // Actions
  setSelectedFeature: (featureId: FeatureId | null) => void;
  setInputValue: (value: string) => void;
  addStreamBlock: (block: StreamBlock) => void;
  clearStreamBlocks: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setInProgressJob: (job: InProgressJob | null) => void;
  resetWorkspace: () => void;
  setPrefillKeyword: (keyword: string | null) => void;
  startFeatureWithKeyword: (featureId: FeatureId, keyword: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedFeature: null,
  streamBlocks: [],
  inputValue: '',
  inProgressJob: null,
  sidebarCollapsed: false,
  prefillKeyword: null,

  setSelectedFeature: (featureId) =>
    set({ selectedFeature: featureId, inputValue: '' }),

  setInputValue: (value) => set({ inputValue: value }),

  addStreamBlock: (block) =>
    set((state) => ({ streamBlocks: [...state.streamBlocks, block] })),

  clearStreamBlocks: () => set({ streamBlocks: [] }),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setInProgressJob: (job) => set({ inProgressJob: job }),

  resetWorkspace: () =>
    set({
      selectedFeature: null,
      streamBlocks: [],
      inputValue: '',
      inProgressJob: null,
      prefillKeyword: null,
    }),

  setPrefillKeyword: (keyword) => set({ prefillKeyword: keyword }),

  startFeatureWithKeyword: (featureId, keyword) =>
    set({ selectedFeature: featureId, prefillKeyword: keyword, inputValue: keyword }),
}));
