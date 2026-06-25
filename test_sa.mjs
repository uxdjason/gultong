import fs from 'fs';
import crypto from 'crypto';

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

async function testSa() {
  try {
    const timestamp = Date.now().toString();
    const method = 'GET';
    const path = '/keywordstool';
    const message = `${timestamp}.${method}.${path}`;
    const signature = crypto.createHmac('sha256', env.NAVER_SA_SECRET_KEY).update(message).digest('base64');
    
    // hintKeywords without spaces
    const kw = '홍명보 실책'.replace(/\s+/g, '');
    const url = `https://api.naver.com${path}?hintKeywords=${encodeURIComponent(kw)}&showDetail=1`;
    
    const res = await fetch(url, {
      method,
      headers: {
        'X-Timestamp': timestamp,
        'X-API-KEY': env.NAVER_SA_ACCESS_LICENCE || '',
        'X-Customer': env.NAVER_SA_CUSTOMER_ID || '',
        'X-Signature': signature
      }
    });
    console.log("SA:", res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}
testSa();
