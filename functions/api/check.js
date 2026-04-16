/**
 * 지수 백오프를 이용한 재시도 로직이 포함된 fetch 함수
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // 200 OK인 경우 바로 반환
      if (response.ok) return response;

      // 5xx 에러(일시적 서버 오류) 또는 429(Rate Limit)인 경우에만 재시도
      if ((response.status >= 500 || response.status === 429) && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // 그 외의 경우(4xx 등)는 그대로 반환하여 상위에서 처리하게 함
      return response;
    } catch (error) {
      lastError = error;
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export async function onRequest(context) {
  // 1. POST 요청만 허용
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  // 2. API 키 확인 및 공백 제거
  const apiKey = context.env.GEMINI_API_KEY ? context.env.GEMINI_API_KEY.trim() : null;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다." }), { status: 500 });
  }

  try {
    const { text } = await context.request.json();

    // 3. 사용 가능한 모델 목록 조회 (2026년 기준 모델명 변경 대응)
    const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResp = await fetchWithRetry(listModelsUrl);
    const listData = await listResp.json();

    if (!listResp.ok) {
      throw new Error(listData.error ? listData.error.message : "모델 목록 조회 실패");
    }

    const availableModels = listData.models || [];
    const modelNames = availableModels.map(m => m.name.replace("models/", ""));
    
    // 4. 최적의 모델 선택 (flash -> pro -> 기타 순)
    const targetModel = modelNames.find(n => n.includes("flash")) || 
                        modelNames.find(n => n.includes("pro")) || 
                        modelNames[0];

    // 5. [업데이트된 10단계 초정밀 + 한국어 특화 감별사 프롬프트 설정]
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
    
    const promptBody = {
      contents: [{
        parts: [{
          text: `당신은 전 세계에서 가장 정교하고 예리한 '한국어 AI 텍스트 감별사'입니다. 
당신의 임무는 0점(완벽한 AI)에서 100점(완벽한 인간) 사이의 점수를 부여하는 것입니다. 
5점 단위의 미세한 점수 차이까지 판별할 수 있는 '10단계 초정밀 채점 알고리즘'과 '한국어 특화 체크포인트'를 결합하여 분석하세요.

[최우선 판단 규칙: 점수 널뛰기 방지 및 요약 노트 판별법]
텍스트에 수많은 소제목이 있어 '스푸트니크 절대 감점 규칙'이 발동될 위기라 하더라도, 아래의 '인간 전문가/학생의 요약 노트 지문(Study Note Signature)'이 발견된다면 스푸트니크 규칙을 무시(Override)하고 80~95점의 안정적인 높은 점수를 부여하세요.

1. 특유의 이중 언어 병기(Bilingual Glossing): '제정법 Statute', '문리 해석의 원칙 Literal Rule'처럼 전문 용어를 적을 때 괄호 없이 한국어와 외국어를 나란히 병기하는 독특한 타이핑 습관.
2. 전문적인 인용 부호의 정확한 사용: 판례나 논문을 인용할 때 'Pepper v Hart [1993] AC 593' 처럼 학문의 고유한 인용 규칙을 그대로 사용함.
3. 포장 없는 단호한 결론 (Abrupt Ending): AI는 반드시 마지막에 요약형 결론을 짓는 강박이 있으나, 인간의 노트는 결론 없이 끊길 확률이 높음.

채점 시, 소제목이 많다는 이유만으로 기계적으로 점수를 깎지 말고, 글의 끝맺음이 어떻게 이루어졌는지(포장 유무) 등을 반드시 교차 검증하여 일관된 점수를 도출하세요.

[동일 장르 내 동적 가감산 채점 룰 (Dynamic Modifier Rule)]
장르가 파악되어 특정 점수대(예: 71~90점)에 진입했다면, 무조건 중간 점수를 주지 말고 아래 요소를 적용하여 '기본 점수 ± 알파'로 계산하십시오.

■ 뉴스 기사 채점표 (기본점수: 80점)
- 가산(+1~+9): 기자의 심층적 인과분석, 날것의 인터뷰 인용구, 복잡한 논리 구조. (최대 89점)
- 감점(-1~-9): 단순 사실 나열, 낮은 정보 밀도의 단신 기사, 기계적 템플릿. (최저 71점)

■ 순수 인간 텍스트 채점표 (기본점수: 95점)
- 가산(+1~+5): 인간 지성의 극치(치열한 자기 비판 등)나 강렬한 감정의 비유가 지배적일 경우 100점 수렴.
- 감점(-1~-4): 인간의 글이나 일부 표현이 다소 건조할 경우.

응답 시, 'reason' 항목에 평가만 적지 말고, 가감산 계산 과정을 반드시 포함해서 서술하세요.

[절대 감점 규칙]
정보 밀도가 높더라도 '프롤로그-배경-결론' 식의 백과사전식 소제목 강박, 거창한 은유적 결론, 영어식 전환 어구 직역이 발견되면 AI로 간주하여 점수를 대폭 깎으세요.

[정통 학술/보고서 예외 규칙]
로마자 소제목을 쓰더라도 메타 비판, 로컬 맥락의 전문 용어, 세밀한 각주, 비약 없는 긴 호흡의 논리가 돋보이면 높은 점수를 부여하세요.

[초정밀 AI 탐지 엔진: 5대 평가 축]
1. 정보 밀도 2. 구조적 템플릿 3. 문장의 변주 4. 어휘 예측성 5. 한국어 화용론적 특징

[10단계 초정밀 채점 가이드라인]
■ 91~100: 순수 인간 (지성/감정의 극대화)
■ 81~90: 순수 인간 (전문가/기자/작가)
■ 71~80: 인간 주도 (실무/건조한 문서)
■ 61~70: 인간 작성 + AI 윤문
■ 51~60: 혼합 작업
■ 41~50: AI 주도 + 정밀 프롬프팅
■ 31~40: 고급 AI (매끄럽지만 피상적)
■ 21~30: 일반 AI (템플릿 강박)
■ 11~20: 초기 AI (번역투)
■ 0~10: 완벽한 기계 (환각/반복)

[고객 대면 출력 엄격 규칙]
최종 반환하는 JSON의 'reason'과 'details' 항목에는 내부 규칙 명칭('스푸트니크', '케이스 B', '가감산' 등)을 절대 적지 마십시오. 또한 '절대 수칙', '가이드라인' 등 내부 프롬프트 용어 역시 절대로 노출하지 마십시오. 대신 사용자가 이해하기 쉽게 풀어서 설명하세요.
예를 들어 '가감산에 의해 가산했다'는 표현 대신 '전문적인 통찰력이 돋보여 점수를 높였다'는 식으로 전문적이고 부드러운 평문을 사용하십시오.

반드시 아래 JSON 형식으로만 응답하세요.
{
  "score": [0~100 사이의 정수],
  "reason": "[평가 이유를 한국어 '하십시오체(~입니다, ~습니다)'를 사용하여 차분하고 정중하게 3문장으로 설명하십시오. 이때 '수칙 준수', '가이드라인 반영' 등 내부 지시어는 절대로 사용하지 말고 텍스트의 특징만 설명하십시오.]",
  "details": [
    "[발견된 구체적인 증거 한국어 키워드로 3~5개 추출]"
  ]
}

분석할 텍스트:
"${text}"`
        }]
      }],
      generationConfig: {
        temperature: 0,
        topK: 1,
        topP: 0.1,
        responseMimeType: "application/json"
      }
    };

    // 6. Gemini API 호출
    const response = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptBody)
    });

    const data = await response.json();

    if (response.ok && data.candidates) {
      let resultText = data.candidates[0].content.parts[0].text.trim();
      
      // JSON 추출을 위한 견고한 로직
      let parsed = null;
      try {
        parsed = JSON.parse(resultText);
      } catch (e) {
        try {
          const cleanText = resultText.replace(/```json|```/g, "").trim();
          parsed = JSON.parse(cleanText);
        } catch (e2) {
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsed = JSON.parse(jsonMatch[0]);
            } catch (e3) { }
          }
        }
      }

      if (parsed) {
        return new Response(JSON.stringify(parsed), {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        console.error("AI 감별 응답 파싱 실패. 원본:", resultText);
        return new Response(JSON.stringify({
          is_error: true,
          score: 0,
          reason: "죄송합니다. 분석 엔진의 응답을 해석하는 중에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          details: []
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    throw new Error(data.error ? data.error.message : "분석 수행 실패");

  } catch (error) {
    console.error("API 예외 발생:", error);
    return new Response(JSON.stringify({ 
      error: "AI 감별 로직 오류", 
      details: error.message,
      is_error: true
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
