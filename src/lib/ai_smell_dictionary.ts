/**
 * AI 냄새 사전 (ai_smell_dictionary.ts)
 * 출처: AI-smell-dictionary-260417.md
 *
 * 한국어 텍스트에서 AI 작성 흔적을 탐지하기 위한 패턴 모음.
 * 카테고리별로 분류하여 어느 유형의 AI 흔적이 강한지 세부 분석 가능.
 */

export interface DictionaryPattern {
  pattern: RegExp;
  category: string;
  weight: number; // 1.0 = 기본, 1.5 = 강한 신호, 2.0 = 매우 강한 신호
  label: string;  // 사용자에게 보여줄 표현
  ignoreInGenres?: string[]; // 이 패턴을 검사에서 무시할 장르 (예: ['academic'])
}

/** 1. 상투적 어휘 (Cliché Vocabulary) */
const CLICHE_VOCABULARY: DictionaryPattern[] = [
  { pattern: /결론적으로\s*말하자면/g, category: 'cliche', weight: 1.5, label: '결론적으로 말하자면', ignoreInGenres: ['academic'] },
  { pattern: /요약하자면|요약하면|종합해\s*보면/g, category: 'cliche', weight: 1.5, label: '요약/종합 상투어', ignoreInGenres: ['academic'] },
  { pattern: /궁극적으로/g, category: 'cliche', weight: 1.0, label: '궁극적으로', ignoreInGenres: ['academic'] },
  { pattern: /무엇보다도/g, category: 'cliche', weight: 1.0, label: '무엇보다도' },
  { pattern: /흥미롭게도/g, category: 'cliche', weight: 1.5, label: '흥미롭게도', ignoreInGenres: ['academic'] },
  { pattern: /다양한\s*측면에서|여러\s*관점에서/g, category: 'cliche', weight: 1.0, label: '다양한 측면/관점', ignoreInGenres: ['academic'] },
  { pattern: /균형\s*잡힌/g, category: 'cliche', weight: 1.0, label: '균형 잡힌' },
  { pattern: /심층적으로\s*분석하면/g, category: 'cliche', weight: 1.5, label: '심층적으로 분석하면', ignoreInGenres: ['academic'] },
  { pattern: /핵심적인\s*요소|중추적인\s*역할/g, category: 'cliche', weight: 1.0, label: '핵심적 요소/중추적 역할' },
  { pattern: /중요한\s*역할을/g, category: 'cliche', weight: 1.0, label: '중요한 역할을' },
  { pattern: /필수적인/g, category: 'cliche', weight: 0.8, label: '필수적인' },
  { pattern: /긍정적인\s*영향을\s*미칩니다/g, category: 'cliche', weight: 1.5, label: '긍정적인 영향을 미칩니다' },
  { pattern: /지속적인\s*노력이\s*필요합니다/g, category: 'cliche', weight: 1.5, label: '지속적인 노력이 필요합니다' },
  { pattern: /효과적인\s*방법|강력한\s*도구/g, category: 'cliche', weight: 1.0, label: '효과적인 방법/강력한 도구' },
  { pattern: /더불어/g, category: 'cliche', weight: 0.8, label: '더불어' },
  { pattern: /뿐만\s*아니라|그뿐만\s*아니라/g, category: 'cliche', weight: 0.8, label: '뿐만 아니라' },
  { pattern: /이와\s*함께/g, category: 'cliche', weight: 0.8, label: '이와 함께' },
  { pattern: /이러한\s*맥락에서/g, category: 'cliche', weight: 1.5, label: '이러한 맥락에서' },
  { pattern: /명심해야\s*할\s*점은/g, category: 'cliche', weight: 1.5, label: '명심해야 할 점은' },
  { pattern: /주의가\s*필요합니다/g, category: 'cliche', weight: 1.0, label: '주의가 필요합니다' },
  { pattern: /아무리\s*강조해도\s*지나치지\s*않습니다/g, category: 'cliche', weight: 2.0, label: '아무리 강조해도 지나치지 않습니다' },
  { pattern: /새로운\s*지평을\s*엽니다/g, category: 'cliche', weight: 2.0, label: '새로운 지평을 엽니다' },
  { pattern: /끊임없이\s*진화하고\s*있습니다/g, category: 'cliche', weight: 2.0, label: '끊임없이 진화하고 있습니다' },
  { pattern: /전례\s*없는/g, category: 'cliche', weight: 1.0, label: '전례 없는' },
  { pattern: /무한한\s*가능성/g, category: 'cliche', weight: 1.5, label: '무한한 가능성' },
  { pattern: /혁신적인/g, category: 'cliche', weight: 0.8, label: '혁신적인' },
  { pattern: /양날의\s*검/g, category: 'cliche', weight: 2.0, label: '양날의 검' },
  { pattern: /자세히\s*탐구해\s*보겠습니다/g, category: 'cliche', weight: 2.0, label: '자세히 탐구해 보겠습니다' },
  { pattern: /함께\s*뛰어들어\s*봅시다/g, category: 'cliche', weight: 2.0, label: '함께 뛰어들어 봅시다' },
  { pattern: /이는\s*중요한\s*시사점을\s*제공합니다/g, category: 'cliche', weight: 2.0, label: '중요한 시사점을 제공합니다' },
  // 자주 누락되는 고빈도 AI 패턴 추가
  { pattern: /결국/g, category: 'cliche', weight: 0.8, label: '결국 (AI 결론 상투어)' },
  { pattern: /전반적인/g, category: 'cliche', weight: 0.8, label: '전반적인' },
  { pattern: /전반적으로/g, category: 'cliche', weight: 0.8, label: '전반적으로' },
  { pattern: /다양한\s*영양소|다양한\s*식품|다양한\s*방법|다양한\s*효과/g, category: 'cliche', weight: 1.0, label: '다양한 ~ (무반사 수식)' },
  { pattern: /긍정적인\s*효과|긍정적인\s*영향/g, category: 'cliche', weight: 1.0, label: '긍정적인 효과/영향' },
  { pattern: /도움이\s*됩니다/g, category: 'cliche', weight: 0.8, label: '도움이 됩니다 (과용)' },
  { pattern: /도움을\s*줍니다|도움을\s*줄\s*수\s*있습니다/g, category: 'cliche', weight: 0.8, label: '도움을 줍니다' },
  { pattern: /건강한\s*생활\s*방식|건강한\s*식습관/g, category: 'cliche', weight: 1.0, label: '건강한 생활방식/식습관 (AI 건보형)' },
  { pattern: /중요한\s*역할을\s*합니다|중요한\s*역할을\s*할\s*수\s*있습니다/g, category: 'cliche', weight: 1.0, label: '중요한 역할을 합니다' },
  { pattern: /~에\s*대한\s*이해를\s*높이/g, category: 'cliche', weight: 1.5, label: '~에 대한 이해를 높이' },
  { pattern: /몇\s*가지\s*팁|몇\s*가지\s*방법|몇\s*가지\s*실용적인/g, category: 'cliche', weight: 1.5, label: '몇 가지 팁/방법' },
  { pattern: /소개합니다|소개해\s*드리/g, category: 'cliche', weight: 0.8, label: '소개합니다/소개해 드리' },
  // 애드센스/블로그 특화 AI 패턴 (300개 데이터 추출 결과)
  { pattern: /데\s*도움을/g, category: 'cliche', weight: 1.5, label: '~하는 데 도움을' },
  { pattern: /건강을\s*위한|건강을\s*유지하는/g, category: 'cliche', weight: 1.5, label: '건강을 위한/유지하는' },
  { pattern: /있습니다\s*이는|수\s*있습니다\s*이는/g, category: 'cliche', weight: 1.5, label: '~있습니다. 이는 (기계적 문장 연결)' },
  { pattern: /줄\s*수\s*있습니다/g, category: 'cliche', weight: 1.0, label: '~줄 수 있습니다 (확률적 서술)' },
  { pattern: /마지막\s*생각/g, category: 'cliche', weight: 2.0, label: '마지막 생각 (번역투 소제목)' },
  { pattern: /중\s*하나입니다/g, category: 'cliche', weight: 1.0, label: '~중 하나입니다' },
  { pattern: /전반적인\s*건강을/g, category: 'cliche', weight: 1.5, label: '전반적인 건강을' },
  { pattern: /공유해\s*주세요/g, category: 'cliche', weight: 1.0, label: '공유해 주세요 (기계적 맺음말)' },
  { pattern: /향상시킬\s*수/g, category: 'cliche', weight: 1.0, label: '향상시킬 수' },
  { pattern: /삶의\s*질을/g, category: 'cliche', weight: 1.5, label: '삶의 질을' },
  { pattern: /있게\s*해줍니다/g, category: 'cliche', weight: 1.0, label: '~있게 해줍니다' },
  { pattern: /예를\s*들어/g, category: 'cliche', weight: 0.5, label: '예를 들어 (과도한 예시)' },
  { pattern: /도움이\s*됩니다/g, category: 'cliche', weight: 1.0, label: '도움이 됩니다' },
];

/** 2-1. 번역투 어미·조사 */
const TRANSLATION_PATTERNS: DictionaryPattern[] = [
  { pattern: /함에\s*있어서/g, category: 'translation', weight: 1.5, label: '~함에 있어서', ignoreInGenres: ['academic'] },
  { pattern: /에\s*있어\s*중요한/g, category: 'translation', weight: 1.5, label: '~에 있어 중요한', ignoreInGenres: ['academic'] },
  { pattern: /라는\s*점에서/g, category: 'translation', weight: 1.0, label: '~라는 점에서', ignoreInGenres: ['academic'] },
  { pattern: /을\s*바탕으로\s*한|를\s*바탕으로\s*한/g, category: 'translation', weight: 1.0, label: '~을 바탕으로 한', ignoreInGenres: ['academic'] },
  { pattern: /로\s*인한\s*결과로/g, category: 'translation', weight: 1.5, label: '~로 인한 결과로', ignoreInGenres: ['academic'] },
  { pattern: /됨으로써/g, category: 'translation', weight: 1.5, label: '~됨으로써', ignoreInGenres: ['academic'] },
  { pattern: /에\s*대하여/g, category: 'translation', weight: 0.8, label: '~에 대하여', ignoreInGenres: ['academic'] },
  { pattern: /의\s*일환으로/g, category: 'translation', weight: 1.0, label: '~의 일환으로', ignoreInGenres: ['academic'] },
  { pattern: /에\s*기여합니다|에\s*기여할\s*수\s*있습니다/g, category: 'translation', weight: 1.0, label: '~에 기여합니다' },
];

/** 2-2. 피동·당위 어미 남발 */
const PASSIVE_PATTERNS: DictionaryPattern[] = [
  { pattern: /하게\s*됩니다/g, category: 'passive', weight: 1.0, label: '~하게 됩니다', ignoreInGenres: ['academic'] },
  { pattern: /해야\s*할\s*것입니다/g, category: 'passive', weight: 1.5, label: '~해야 할 것입니다', ignoreInGenres: ['academic'] },
  { pattern: /인\s*것으로\s*보입니다/g, category: 'passive', weight: 1.5, label: '~인 것으로 보입니다', ignoreInGenres: ['academic'] },
  { pattern: /여겨집니다/g, category: 'passive', weight: 1.5, label: '~여겨집니다', ignoreInGenres: ['academic'] },
  { pattern: /되어집니다/g, category: 'passive', weight: 2.0, label: '~되어집니다 (이중피동)', ignoreInGenres: ['academic'] },
  { pattern: /라고\s*할\s*수\s*있습니다/g, category: 'passive', weight: 1.0, label: '~라고 할 수 있습니다', ignoreInGenres: ['academic'] },
  { pattern: /일\s*가능성이\s*있습니다/g, category: 'passive', weight: 1.0, label: '~일 가능성이 있습니다', ignoreInGenres: ['academic'] },
  { pattern: /것이\s*중요합니다/g, category: 'passive', weight: 1.0, label: '~것이 중요합니다 (당위)', ignoreInGenres: ['academic'] },
  { pattern: /해야\s*합니다/g, category: 'passive', weight: 0.8, label: '~해야 합니다 (당위)', ignoreInGenres: ['academic'] },
  { pattern: /필요합니다/g, category: 'passive', weight: 0.8, label: '필요합니다 (당위)', ignoreInGenres: ['academic'] },
];

/** 2-3. 한자어계 접미사 과용 */
const SINO_SUFFIX_PATTERNS: DictionaryPattern[] = [
  { pattern: /전문적[인이]|효율적[인이]|체계적[인이]|합리적[인이]|지속적[인이]|핵심적[인이]|실용적[인이]|효과적[인이]/g, category: 'sino_suffix', weight: 0.5, label: '-적(的) 접미사 남발' },
  { pattern: /최적화|효율화|체계화|자동화/g, category: 'sino_suffix', weight: 0.5, label: '-화(化) 접미사 남발' },
  { pattern: /중요성|필요성|가능성|효율성|지속성|건강성|유익성/g, category: 'sino_suffix', weight: 0.5, label: '-성(性) 접미사 남발' },
];

/** 2-4. 명사화 선호 */
const NOMINALIZATION_PATTERNS: DictionaryPattern[] = [
  { pattern: /검토를\s*진행/g, category: 'nominalization', weight: 1.0, label: '검토를 진행하다' },
  { pattern: /분석을\s*수행/g, category: 'nominalization', weight: 1.0, label: '분석을 수행하다' },
  { pattern: /지원을\s*제공/g, category: 'nominalization', weight: 1.0, label: '지원을 제공하다' },
  { pattern: /을\s*수행하다|를\s*수행하다/g, category: 'nominalization', weight: 0.8, label: '~을 수행하다' },
  { pattern: /을\s*제공하다|를\s*제공하다/g, category: 'nominalization', weight: 0.8, label: '~을 제공하다' },
];

/** 3. 구조·문체 습관 (Structural Patterns) */
const STRUCTURAL_PATTERNS: DictionaryPattern[] = [
  { pattern: /에\s*대해\s*살펴보겠습니다|에\s*대해서\s*살펴보겠습니다/g, category: 'structural', weight: 2.0, label: '~에 대해 살펴보겠습니다' },
  { pattern: /첫째[,，]|첫\s*번째[,，]/g, category: 'structural', weight: 1.0, label: '첫째/첫 번째 열거' },
  { pattern: /둘째[,，]|두\s*번째[,，]/g, category: 'structural', weight: 1.0, label: '둘째/두 번째 열거' },
  { pattern: /셋째[,，]|세\s*번째[,，]/g, category: 'structural', weight: 1.0, label: '셋째/세 번째 열거' },
  { pattern: /따라서.*할\s*수\s*있습니다/g, category: 'structural', weight: 1.5, label: '따라서 ~할 수 있습니다' },
  { pattern: /예를\s*들어\s*회사에서/g, category: 'structural', weight: 2.0, label: '예를 들어 회사에서 (범용 사례)' },
  // AI 정보성 글 특유의 구조 패턴 추가
  { pattern: /다음과\s*같은\s*몇\s*가지|다음과\s*같습니다/g, category: 'structural', weight: 1.5, label: '다음과 같은 ~ 구조' },
  { pattern: /여기\s*[가-힣]+\s*몇\s*가지/g, category: 'structural', weight: 1.5, label: '여기 ~ 몇 가지' },
  { pattern: /장점과\s*단점|장단점/g, category: 'structural', weight: 1.0, label: '장점과 단점 (AI 균형형)' },
];

/** 5. 반복·과잉 패턴 */
const REDUNDANCY_PATTERNS: DictionaryPattern[] = [
  { pattern: /하는\s*것이\s*중요합니다/g, category: 'redundancy', weight: 1.0, label: '~하는 것이 중요합니다' },
  { pattern: /또한/g, category: 'redundancy', weight: 0.5, label: '또한 (과용)' },
  { pattern: /한편/g, category: 'redundancy', weight: 0.5, label: '한편 (과용)' },
  { pattern: /더\s*나아가/g, category: 'redundancy', weight: 1.0, label: '더 나아가' },
  { pattern: /이러한/g, category: 'redundancy', weight: 0.5, label: '이러한 (지시관형사 남용)' },
  { pattern: /결론적으로|요약하면/g, category: 'redundancy', weight: 1.5, label: '결론적으로/요약하면' },
  { pattern: /란\s*.*을\s*의미합니다|란\s*.*를\s*의미합니다/g, category: 'redundancy', weight: 1.5, label: '~란 ~을 의미합니다 (불필요한 정의)' },
  { pattern: /많은\s*경우|일반적으로/g, category: 'redundancy', weight: 0.5, label: '모호한 표현 (많은 경우/일반적으로)' },
  { pattern: /따라서/g, category: 'redundancy', weight: 0.5, label: '따라서 (과용)' },
  { pattern: /그러므로/g, category: 'redundancy', weight: 0.5, label: '그러므로 (과용)' },
  { pattern: /뿐만\s*아니라/g, category: 'redundancy', weight: 0.5, label: '뿐만 아니라 (반복)' },
  { pattern: /그\s*뿐만\s*아니라/g, category: 'redundancy', weight: 0.8, label: '그 뿐만 아니라 (반복)' },
  { pattern: /아무래도/g, category: 'redundancy', weight: 0.5, label: '아무래도 (AI 완충어)' },
  { pattern: /안타깝게도/g, category: 'redundancy', weight: 1.0, label: '안타깝게도 (AI 공감 시도)' },
];

/** 7. 한국어 화자와의 불일치 */
const KO_DIVERGENCE_PATTERNS: DictionaryPattern[] = [
  { pattern: /에\s*대해\s*살펴보겠습니다|에\s*관해\s*살펴보겠습니다/g, category: 'ko_divergence', weight: 2.0, label: '발표체 서술 (~에 대해 살펴보겠습니다)' },
  { pattern: /효율성|생산성|중요성/g, category: 'ko_divergence', weight: 0.5, label: '추상 명사 반복 (효율성/생산성/중요성)' },
  { pattern: /이\s*글을\s*읽는\s*모든\s*분|이\s*글을\s*통해/g, category: 'ko_divergence', weight: 1.5, label: '독자 호명 (AI 맺음 표현)' },
  { pattern: /마음으로\s*바랍니다|진심으로\s*바랍니다/g, category: 'ko_divergence', weight: 1.5, label: '인위적 감성 맺음' },
];

/** 전체 패턴 목록 (통합 export) */
export const ALL_PATTERNS: DictionaryPattern[] = [
  ...CLICHE_VOCABULARY,
  ...TRANSLATION_PATTERNS,
  ...PASSIVE_PATTERNS,
  ...SINO_SUFFIX_PATTERNS,
  ...NOMINALIZATION_PATTERNS,
  ...STRUCTURAL_PATTERNS,
  ...REDUNDANCY_PATTERNS,
  ...KO_DIVERGENCE_PATTERNS,
];

/** 카테고리별 패턴 맵 */
export const PATTERN_CATEGORIES = {
  cliche: CLICHE_VOCABULARY,
  translation: TRANSLATION_PATTERNS,
  passive: PASSIVE_PATTERNS,
  sino_suffix: SINO_SUFFIX_PATTERNS,
  nominalization: NOMINALIZATION_PATTERNS,
  structural: STRUCTURAL_PATTERNS,
  redundancy: REDUNDANCY_PATTERNS,
  ko_divergence: KO_DIVERGENCE_PATTERNS,
} as const;
