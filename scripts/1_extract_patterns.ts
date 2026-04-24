import fs from 'fs';
import path from 'path';

const AI_DIR = path.join(__dirname, '../reference/ai-writing-examples');
const HUMAN_DIR = path.join(__dirname, '../reference/human-writing-examples');
const OUTPUT_FILE = path.join(__dirname, 'pattern_results.json');

function readFilesFromDir(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    console.error(`디렉토리가 존재하지 않습니다: ${dirPath}`);
    return [];
  }
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.txt'));
  return files.map(f => fs.readFileSync(path.join(dirPath, f), 'utf-8'));
}

// 간단한 형태소/어절 분리 (공백 및 구두점 기준)
function tokenize(text: string): string[] {
  return text
    .replace(/[^\w\s가-힣]/g, ' ') // 구두점 제거
    .split(/\s+/)
    .filter(w => w.length > 0);
}

// N-gram 생성
function generateNGrams(tokens: string[], n: number): string[] {
  const nGrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    nGrams.push(tokens.slice(i, i + n).join(' '));
  }
  return nGrams;
}

function countFrequencies(texts: string[], maxN: number = 3) {
  const freqs: Record<string, number> = {};
  
  texts.forEach(text => {
    const tokens = tokenize(text);
    // 1-gram부터 maxN-gram까지 추출 (의미 있는 구를 찾기 위해 주로 2~4 gram이 유용)
    for (let n = 2; n <= maxN; n++) {
      const nGrams = generateNGrams(tokens, n);
      // 한 문서에서 여러 번 나와도 1번(Document Frequency)으로 칠지, 
      // Term Frequency로 칠지 결정. 여기서는 Term Frequency(전체 등장 횟수) 사용
      nGrams.forEach(gram => {
        freqs[gram] = (freqs[gram] || 0) + 1;
      });
    }
  });
  
  return freqs;
}

async function main() {
  console.log('데이터 로딩 중...');
  const aiTexts = readFilesFromDir(AI_DIR);
  const humanTexts = readFilesFromDir(HUMAN_DIR);
  
  console.log(`AI 샘플: ${aiTexts.length}개, 휴먼 샘플: ${humanTexts.length}개`);
  
  if (aiTexts.length === 0 || humanTexts.length === 0) {
    console.error('데이터가 부족합니다.');
    return;
  }

  console.log('N-gram 빈도 계산 중...');
  const aiFreqs = countFrequencies(aiTexts, 4);
  const humanFreqs = countFrequencies(humanTexts, 4);
  
  // AI에서 많이 나오지만 Human에서 안 나오는 패턴 추출
  const results: Array<{ gram: string, aiCount: number, humanCount: number, ratio: number }> = [];
  
  for (const gram in aiFreqs) {
    const aiCount = aiFreqs[gram];
    // 최소 등장 횟수 필터링 (예: 150개 문서 중 최소 10번 이상 등장)
    if (aiCount >= 10) {
      const humanCount = humanFreqs[gram] || 0;
      // ratio 계산 (humanCount가 0일 경우 대비해 +1 스무딩 적용)
      const ratio = aiCount / (humanCount + 1);
      results.push({ gram, aiCount, humanCount, ratio });
    }
  }
  
  // Ratio가 높은 순으로 정렬
  results.sort((a, b) => b.ratio - a.ratio);
  
  // 상위 200개만 저장
  const topResults = results.slice(0, 200);
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topResults, null, 2), 'utf-8');
  console.log(`\n분석 완료! 상위 200개 패턴이 ${OUTPUT_FILE}에 저장되었습니다.`);
  
  console.log('\n--- AI 의심 패턴 Top 15 ---');
  topResults.slice(0, 15).forEach((r, i) => {
    console.log(`${i+1}. "${r.gram}" (AI: ${r.aiCount}회, Human: ${r.humanCount}회, 비율: ${r.ratio.toFixed(2)})`);
  });
}

main().catch(console.error);
