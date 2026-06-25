import { Competition, Trend, KeywordSource } from './types';
import { fetchWithRetry, parseJSONGeneric } from '@/lib/llm_verdict';

export interface KeywordMetrics {
  searchVolume: number;
  competition: Competition;
  trendDirection: Trend;
  trendScore: number;
}

export interface ExtendedKeywordMetrics extends KeywordMetrics {
  searchVolumePc?: number;
  searchVolumeMobile?: number;
  source: KeywordSource;
}

export interface FetchMetricsOptions {
  claudeApiKey?: string;
  geminiApiKey?: string;
  naverSaCustomerId?: string;
  naverSaAccessLicence?: string;
  naverSaSecretKey?: string;
  naverClientId?: string;
  naverClientSecret?: string;
}

const SYSTEM_PROMPT = `당신은 네이버 검색광고 API를 모방하는 데이터 추정기입니다.
다음 주어진 키워드들의 월간 검색량(PC+모바일), 경쟁도, 트렌드 방향, 트렌드 점수를 상식과 최신 동향을 바탕으로 '추정'하여 JSON 객체로 반환하세요.

응답 형식 (JSON):
{
  "키워드1": {
    "searchVolume": 15000,
    "competition": "높음" | "보통" | "낮음",
    "trendDirection": "상승" | "유지" | "하락",
    "trendScore": 75
  },
  "키워드2": { ... }
}

- searchVolume: 월간 통합 검색량 (0 ~ 1,000,000 사이의 숫자). 특정 숫자(예: 45000)로 통일하지 말고, 각 키워드의 실제 인기도에 맞게 다양하고 현실적인 값을 추정하세요.
- trendScore: 최근 3개월간 트렌드 상승 강도 (0~100)
- 결과는 반드시 위 JSON 형식만 출력해야 합니다.`;

async function callClaudeForMetrics(keywords: string[], apiKey: string): Promise<Record<string, KeywordMetrics>> {
  const model = 'claude-sonnet-4-6';
  
  const requestBody = {
    model,
    max_tokens: 1024,
    temperature: 0.1,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `분석할 키워드 목록:\n${keywords.join('\n')}`
      }
    ]
  };

  const response = await fetchWithRetry('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) throw new Error(`Claude API 오류 (${response.status})`);
  const data = await response.json() as any;
  const rawText = data.content?.[0]?.text?.trim();
  const parsed = parseJSONGeneric<Record<string, KeywordMetrics>>(rawText || '');
  if (!parsed) throw new Error('Claude JSON 파싱 실패');
  return parsed;
}

async function callGeminiForMetrics(keywords: string[], apiKey: string): Promise<Record<string, KeywordMetrics>> {
  const model = 'gemini-2.5-flash';
  
  const requestBody = {
    contents: [{
      parts: [{
        text: `${SYSTEM_PROMPT}\n\n분석할 키워드 목록:\n${keywords.join('\n')}`
      }]
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      maxOutputTokens: 1024,
    }
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) throw new Error(`Gemini API 오류 (${response.status})`);
  const data = await response.json() as any;
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  const parsed = parseJSONGeneric<Record<string, KeywordMetrics>>(rawText || '');
  if (!parsed) throw new Error('Gemini JSON 파싱 실패');
  return parsed;
}

async function generateSignature(timestamp: string, method: string, path: string, secretKey: string) {
  const message = `${timestamp}.${method}.${path}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return btoa(String.fromCharCode.apply(null, signatureArray));
}

export async function fetchNaverSaMetrics(
  keywords: string[],
  customerId: string,
  accessLicence: string,
  secretKey: string
): Promise<Record<string, { searchVolume: number, searchVolumePc: number, searchVolumeMobile: number, competition: Competition }>> {
  const results: Record<string, any> = {};
  
  for (let i = 0; i < keywords.length; i += 5) {
    const chunk = keywords.slice(i, i + 5);
    const hintKeywords = chunk.map(k => encodeURIComponent(k.replace(/\s+/g, ''))).join(',');
    const path = '/keywordstool';
    const method = 'GET';
    const timestamp = Date.now().toString();
    const signature = await generateSignature(timestamp, method, path, secretKey);
    
    const url = `https://api.naver.com${path}?hintKeywords=${hintKeywords}&showDetail=1`;
    
    const response = await fetchWithRetry(url, {
      method,
      headers: {
        'X-Timestamp': timestamp,
        'X-API-KEY': accessLicence,
        'X-Customer': customerId,
        'X-Signature': signature,
      }
    });

    if (!response.ok) {
      console.warn(`[datasource] Naver SA API error: ${response.status}`);
      throw new Error(`Naver SA API error: ${response.status}`);
    }

    const data = await response.json() as any;
    if (data.keywordList && Array.isArray(data.keywordList)) {
      for (const item of data.keywordList) {
        const noSpaceKw = item.relKeyword.replace(/\s+/g, '');
        const originalKw = chunk.find(k => k.replace(/\s+/g, '') === noSpaceKw);
        const kw = originalKw || item.relKeyword;
        
        const parseCnt = (val: string | number) => {
          if (typeof val === 'string' && val.includes('<')) return 5;
          return Number(val) || 0;
        };

        const pc = parseCnt(item.monthlyPcQcCnt);
        const mobile = parseCnt(item.monthlyMobileQcCnt);
        const total = pc + mobile;
        
        let comp: Competition = '보통';
        if (item.compIdx === '높음') comp = '높음';
        else if (item.compIdx === '중간') comp = '보통';
        else if (item.compIdx === '낮음') comp = '낮음';

        results[kw] = {
          searchVolume: total,
          searchVolumePc: pc,
          searchVolumeMobile: mobile,
          competition: comp
        };
      }
    }
  }
  return results;
}

export async function fetchNaverDatalabTrend(
  keywords: string[],
  clientId: string,
  clientSecret: string
): Promise<Record<string, { trendScore: number, trendDirection: Trend }>> {
  const results: Record<string, { trendScore: number, trendDirection: Trend }> = {};
  
  for (let i = 0; i < keywords.length; i += 5) {
    const chunk = keywords.slice(i, i + 5);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const requestBody = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      timeUnit: 'month',
      keywordGroups: chunk.map(kw => ({
        groupName: kw,
        keywords: [kw]
      }))
    };

    const response = await fetchWithRetry('https://openapi.naver.com/v1/datalab/search', {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.warn(`[datasource] Naver DataLab API error: ${response.status}`);
      throw new Error(`Naver DataLab API error: ${response.status}`);
    }

    const data = await response.json() as any;
    if (data.results && Array.isArray(data.results)) {
      for (const group of data.results) {
        const kw = group.title;
        const trendData = group.data || [];
        
        let trendScore = 50;
        let trendDirection: Trend = '유지';
        
        if (trendData.length >= 2) {
          const last = trendData[trendData.length - 1].ratio;
          const prev = trendData[trendData.length - 2].ratio;
          
          if (last > prev * 1.2) {
            trendDirection = '상승';
            trendScore = Math.min(100, 50 + (last - prev));
          } else if (last < prev * 0.8) {
            trendDirection = '하락';
            trendScore = Math.max(0, 50 - (prev - last));
          } else {
            trendDirection = '유지';
            trendScore = 50;
          }
        }
        
        results[kw] = { trendScore: Math.round(trendScore), trendDirection };
      }
    }
  }
  
  return results;
}

export async function fetchMetrics(
  keywords: string[],
  options: FetchMetricsOptions
): Promise<Record<string, ExtendedKeywordMetrics>> {
  if (keywords.length === 0) return {};

  const {
    claudeApiKey, geminiApiKey,
    naverSaCustomerId, naverSaAccessLicence, naverSaSecretKey,
    naverClientId, naverClientSecret
  } = options;

  if (naverSaCustomerId && naverSaAccessLicence && naverSaSecretKey && naverClientId && naverClientSecret) {
    try {
      const saResults = await fetchNaverSaMetrics(keywords, naverSaCustomerId, naverSaAccessLicence, naverSaSecretKey);
      const datalabResults = await fetchNaverDatalabTrend(keywords, naverClientId, naverClientSecret);
      
      const combined: Record<string, ExtendedKeywordMetrics> = {};
      for (const kw of keywords) {
        const sa = saResults[kw] || { searchVolume: 10, searchVolumePc: 5, searchVolumeMobile: 5, competition: '보통' as Competition };
        const dl = datalabResults[kw] || { trendScore: 50, trendDirection: '유지' as Trend };
        combined[kw] = {
          ...sa,
          ...dl,
          source: 'naver'
        };
      }
      return combined;
    } catch (err) {
      console.warn('[datasource] Naver API fetch failed, falling back to LLM', err);
    }
  }

  if (claudeApiKey) {
    try {
      const result = await callClaudeForMetrics(keywords, claudeApiKey);
      const extended: Record<string, ExtendedKeywordMetrics> = {};
      for (const kw of Object.keys(result)) {
        extended[kw] = { ...result[kw], source: 'estimated' };
      }
      return extended;
    } catch (err) {
      console.warn(`[datasource] Claude 실패:`, err);
    }
  }

  if (geminiApiKey) {
    try {
      const result = await callGeminiForMetrics(keywords, geminiApiKey);
      const extended: Record<string, ExtendedKeywordMetrics> = {};
      for (const kw of Object.keys(result)) {
        extended[kw] = { ...result[kw], source: 'estimated' };
      }
      return extended;
    } catch (err) {
      console.warn(`[datasource] Gemini 실패:`, err);
      throw err;
    }
  }
  
  throw new Error('API 키가 없습니다.');
}
