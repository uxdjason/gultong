import fs from 'fs';
import path from 'path';

// @ts-ignore - Next.js 환경 설정 우회를 위해 모듈 직접 로드
import { analyzeKoreanText, AnalyzerResult } from '../src/lib/korean_analyzer';

const AI_DIR = path.join(__dirname, '../reference/ai-writing-examples');
const HUMAN_DIR = path.join(__dirname, '../reference/human-writing-examples');

function readFilesFromDir(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.txt'));
  return files.map(f => fs.readFileSync(path.join(dirPath, f), 'utf-8'));
}

async function main() {
  console.log('데이터 로딩 중...');
  const aiTexts = readFilesFromDir(AI_DIR);
  const humanTexts = readFilesFromDir(HUMAN_DIR);
  
  const aiValidCount = aiTexts.filter(t => t.length >= 30).length;
  const humanValidCount = humanTexts.filter(t => t.length >= 30).length;

  // 텍스트 분석 결과를 미리 캐싱 (속도 최적화)
  console.log('텍스트 사전 분석 중...');
  const aiResults = aiTexts.filter(t => t.length >= 30).map(t => analyzeKoreanText(t));
  const humanResults = humanTexts.filter(t => t.length >= 30).map(t => analyzeKoreanText(t));

  const avgAiSuspicion = aiResults.reduce((sum, r) => sum + r.compositeSuspicionIndex, 0) / aiValidCount;
  const avgHumanSuspicion = humanResults.reduce((sum, r) => sum + r.compositeSuspicionIndex, 0) / humanValidCount;

  const aiMetrics = aiResults.reduce((acc, r) => ({
    burstiness: acc.burstiness + r.burstinessScore,
    density: acc.density + r.aiVocabularyDensity,
    structural: acc.structural + r.structuralRigidity,
    conjunction: acc.conjunction + r.conjunctionDensity
  }), { burstiness: 0, density: 0, structural: 0, conjunction: 0 });

  const humanMetrics = humanResults.reduce((acc, r) => ({
    burstiness: acc.burstiness + r.burstinessScore,
    density: acc.density + r.aiVocabularyDensity,
    structural: acc.structural + r.structuralRigidity,
    conjunction: acc.conjunction + r.conjunctionDensity
  }), { burstiness: 0, density: 0, structural: 0, conjunction: 0 });

  console.log('\n========================================');
  console.log('📊 벤치마크 리포트 (korean_analyzer.ts 1차 엔진)');
  console.log('========================================');
  console.log(`총 테스트 수: AI ${aiValidCount}개, Human ${humanValidCount}개`);
  console.log(`AI 평균 의심 지수: ${avgAiSuspicion.toFixed(3)}`);
  console.log(`Human 평균 의심 지수: ${avgHumanSuspicion.toFixed(3)}`);
  console.log('----------------------------------------');
  console.log(`[지표별 평균 비교]`);
  console.log(`어휘 밀도 (높을수록 AI): AI ${(aiMetrics.density/aiValidCount).toFixed(3)} vs Human ${(humanMetrics.density/humanValidCount).toFixed(3)}`);
  console.log(`구조적 기계성 (높을수록 AI): AI ${(aiMetrics.structural/aiValidCount).toFixed(3)} vs Human ${(humanMetrics.structural/humanValidCount).toFixed(3)}`);
  console.log(`접속어 밀도 (높을수록 AI): AI ${(aiMetrics.conjunction/aiValidCount).toFixed(3)} vs Human ${(humanMetrics.conjunction/humanValidCount).toFixed(3)}`);
  console.log(`문장 분산도 (낮을수록 AI): AI ${(aiMetrics.burstiness/aiValidCount).toFixed(3)} vs Human ${(humanMetrics.burstiness/humanValidCount).toFixed(3)}`);
  console.log('----------------------------------------');

  // 최적 임계값 탐색
  let bestThreshold = 0;
  let bestF1 = 0;
  let bestMetrics: any = {};

  for (let t = 0.20; t <= 0.80; t += 0.01) {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    aiResults.forEach(r => r.compositeSuspicionIndex >= t ? tp++ : fn++);
    humanResults.forEach(r => r.compositeSuspicionIndex >= t ? fp++ : tn++);

    const precision = tp / (tp + fp || 1);
    const recall = tp / (tp + fn || 1);
    const f1Score = 2 * (precision * recall) / (precision + recall || 1);
    const accuracy = (tp + tn) / (aiValidCount + humanValidCount);

    if (f1Score > bestF1) {
      bestF1 = f1Score;
      bestThreshold = t;
      bestMetrics = { tp, fp, tn, fn, precision, recall, f1Score, accuracy };
    }
  }

  console.log(`[최적 임계값(Threshold) 탐색 결과: ${bestThreshold.toFixed(2)}]`);
  console.log(`정확도 (Accuracy): ${(bestMetrics.accuracy * 100).toFixed(2)}%`);
  console.log(`정밀도 (Precision): ${(bestMetrics.precision * 100).toFixed(2)}%  (AI라고 찍은 것 중 진짜 AI의 비율)`);
  console.log(`재현율 (Recall): ${(bestMetrics.recall * 100).toFixed(2)}%     (전체 AI 중 잡아낸 비율)`);
  console.log(`F1 Score: ${(bestMetrics.f1Score * 100).toFixed(2)}%`);
  console.log('----------------------------------------');
  console.log(`혼동 행렬 (Confusion Matrix):`);
  console.log(`  TP (AI->AI): ${bestMetrics.tp}  |  FP (Human->AI): ${bestMetrics.fp}`);
  console.log(`  FN (AI->Human): ${bestMetrics.fn} |  TN (Human->Human): ${bestMetrics.tn}`);
  console.log('========================================');
}

main().catch(console.error);
