import fs from 'fs';

function parseEnv() {
  const content = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    if (line && !line.startsWith('#') && line.includes('=')) {
      const parts = line.split('=');
      const key = parts.shift();
      env[key.trim()] = parts.join('=').trim();
    }
  });
  return env;
}

const env = parseEnv();

async function test() {
  try {
    const res = await fetch('https://openapi.naver.com/v1/datalab/search', {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': env.NAVER_CLIENT_ID || '',
        'X-Naver-Client-Secret': env.NAVER_CLIENT_SECRET || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: '2025-12-25',
        endDate: '2026-06-25',
        timeUnit: 'month',
        keywordGroups: [
          { groupName: '홍명보 실책', keywords: ['홍명보 실책'] }
        ]
      })
    });
    console.log("DataLab:", res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
