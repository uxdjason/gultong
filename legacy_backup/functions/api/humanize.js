/**
 * 지수 백오프를 이용한 재시도 로직이 포함된 fetch 함수
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if ((response.status >= 500 || response.status === 429) && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
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
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = context.env.GEMINI_API_KEY ? context.env.GEMINI_API_KEY.trim() : null;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다." }), { status: 500 });
  }

  try {
    const { text, mode, seriousness, emotion, honorificType } = await context.request.json();

    const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listResp = await fetchWithRetry(listModelsUrl);
    const listData = await listResp.json();
    const availableModels = listData.models || [];
    const modelNames = availableModels.map(m => m.name.replace("models/", ""));
    const targetModel = modelNames.find(n => n.includes("flash")) || modelNames[0];

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
    
    const safeText = text.replace(/"/g, '\\"').replace(/\n/g, '\\n');

    const promptBody = {
      contents: [{
        parts: [{
          text: `당신은 현존하는 가장 까다로운 AI 탐지기를 완벽하게 속여야 하는 20년 차 최고급 에디터입니다. 
단순 윤문이 아니라 원본의 팩트만 남기고 텍스트를 완전히 재창조하십시오. 아래의 [극단적 인간화 4대 절대 수칙]을 하나라도 위반하면 실패입니다.

[극단적 인간화 및 AI 지문 소거 4대 절대 수칙]

1. 문단의 극단적 파편화 (Extreme Fragmentation):
   - 한 문단이 절대 3~4문장을 넘지 않게 하십시오. 
   - 글 중간에 반드시 **단 한 줄(1문장)짜리 문단**을 삽입하여 시각적 리듬감(Burstiness)을 강제로 만드십시오. 
   - 마크다운 헤딩이나 리스트 기호는 절대 쓰지 마십시오.

2. 기계적 접속사 및 도입부 절대 금지:
   - 문단 첫머리에 '구체적으로', '한편', '더불어', '또한', '결과적으로', '사실상' 같은 뻔한 접속사를 절대(NEVER) 쓰지 마십시오.
   - 접속사 없이 앞 문장의 맥락을 꼬리 물기 방식으로 자연스럽게 이으십시오.

3. 획일적 종결 어미 탈피:
   - '~현명하다', '~중요하다', '~권장된다' 식의 설교조 어미를 남발하지 마십시오.
   - 건조한 팩트 전달, 가벼운 의문형, 주관적 소회 등 종결 어미를 의도적으로 들쭉날쭉하게 섞으십시오.

4. 인간의 메타 인지(Meta-cognition) 가미:
   - "흔히들 간과하지만...", "직접 경험해 보면 알겠지만..." 처럼 화자의 통찰력이 엿보이는 서술을 한 방울 섞어 인간이 직접 쓴 글임을 증명하십시오.

[설정 및 세부 말투 가이드라인]

1. 글쓰기 모드: ${mode} 에 맞춰 다음 지침을 엄수하십시오.
   - '학술적 글쓰기(논문/리포트)': 논리적 비약 없이 인과관계를 분명히 하되, AI 특유의 '~라고 할 수 있다'는 식의 유보적 태도를 버리고 명확한 논조를 유지하십시오. 전문 용어를 정확하게 사용하되 설명은 친절하게 하십시오.
   - '상업적 글쓰기(광고/카피)': 독자의 행동을 유도하는 강력한 후킹 문구를 포함하십시오. 문장을 짧게 끊어 리듬감을 극대화하고, 혜택 위주의 서술을 하십시오.
   - '개인적 글쓰기(블로그/에세이)': 화자의 개인적인 경험담이나 감정이 솔직하게 드러나야 합니다. 독백체와 대화체를 적절히 섞어 친밀감을 형성하십시오.
   - '비즈니스 문서(보고서/이메일)': 효율성과 명확성이 핵심입니다. 핵심 결론을 앞에 두는 두괄식 구성을 취하되, 무례하지 않고 정중한 비즈니스 에티켓이 느껴지는 어휘를 선택하십시오.

2. 진지함 레벨 (1~5): 현재 레벨 ${seriousness}
   - 1: 매우 가볍고 친숙하며 유머러스한 톤
   - 3: 격식을 갖추되 딱딱하지 않은 일상적 전문성
   - 5: 매우 정중하고 무게감 있으며 엄격한 권위가 느껴지는 톤

3. 감성/주관 레벨 (1~5): 현재 레벨 ${emotion}
   - 1: 감정을 배제하고 철저히 객관적인 팩트 위주의 서술
   - 3: 개인의 소회나 관점이 자연스럽게 묻어나는 수준
   - 5: 화자의 감정이 풍부하게 담기고 주관적인 수식어가 화려하게 사용되는 호소력 짙은 스타일

4. 최우선 사항: 존댓말 설정 (honorificType): ${honorificType}
  - 'none': 절대 존댓말을 쓰지 말고, '~다', '~한다' 등의 건조한 평어체나 독백체를 유지하십시오.
  - 'soft': 문장의 끝을 무조건 '~해요', '~인데요', '~죠' 등 부드러운 구어체 존댓말로 통일하십시오. 딱딱한 '~니다'는 쓰지 마십시오.
  - 'formal': 문장의 끝을 무조건 '~입니다', '~합니다', '~습니까' 등 격식 있는 하십시오체로 통일하십시오. 가벼운 '~해요'는 쓰지 마십시오.
  - 'mixed': '~입니다'와 '~해요'를 7:3 또는 6:4 비율로 자연스럽게 섞어, 너무 딱딱하지도 너무 가볍지도 않은 전문적인 인터뷰/에세이 톤을 만드십시오.

[추가 가이드라인: 구조적 변주 및 패턴 파괴 (Anti-Pattern Rules)]
위의 지침에 더해, AI 탐지기를 완벽히 속이기 위해 다음 규칙을 반드시 따르십시오:

1. 서술 순서의 무작위 셔플 (Randomize Narrative Order):
   - 나열형 정보를 다룰 때, 모든 항목을 '정의 -> 효능 -> 음식' 순서로 똑같이 설명하지 마십시오.
   - (예: 첫 번째 항목은 음식 이야기로 시작하고, 두 번째 항목은 결핍 증상으로 시작하는 등 매 문단마다 서술 순서를 뒤섞으십시오.)

2. 문단의 물리적 결합 (Paragraph Merging):
   - 원본의 항목이 5개라고 해서 반드시 문단을 5개로 나누지 마십시오.
   - 연관성이 깊은 2~3개 항목은 하나의 긴 문단으로 합치고, 접속사 대신 문맥(Context)으로 자연스럽게 이으십시오.

3. 결론부의 '요약' 강박 제거:
   - 글의 마지막에 '이처럼 다양한 영양소가...'와 같이 전체를 아우르는 요약 문단을 만들지 마십시오.
   - 마지막 항목에 대한 설명이 끝나면, 독자에게 가벼운 질문을 던지거나 구체적인 제언 한 문장만 남기고 글을 뚝 끊으십시오.

반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 불필요한 텍스트는 금지합니다.
{
  "improved_text": "[위 수칙이 100% 적용된 재창조 텍스트]",
  "score": [0~100 사이의 정수. 기계적으로 98, 99점만 반복하지 마십시오. 문체의 자연스러움과 옵션 정합성을 엄격히 따져 88~99점 사이에서 현실적으로 다양하게(예: 91, 94, 97, 92 등) 부여하십시오.],
  "reason": "[해당 점수를 부여한 이유에 대해 한국어 '하십시오체(~입니다, ~습니다)'를 사용하여 차분하고 정중하게 1~2문장으로 요약하십시오. 이때 '수칙 준수', '가이드라인 반영', '인간화 규칙' 등 내부 지시어나 프롬프트 용어는 절대로 사용하지 말고 사용자가 납득할 수 있는 텍스트의 특징만 설명하십시오.]",
  "details": ["[핵심 요약 1]", "[핵심 요약 2]", "[핵심 요약 3]"]
}

[details(뱃지) 작성 주의사항]
- 내부 개발 용어(파편화, 수칙 준수, 패턴 소거 등)를 절대 쓰지 마십시오.
- '문단 구조 최적화', '자연스러운 문맥 연결', '주관적 통찰 반영' 등 사용자가 이해하기 쉬운 10자 내외의 짧은 구어로만 작성하십시오.

원본 텍스트:
"${safeText}"`
        }]
      }],
      generationConfig: {
        temperature: 1.0,
        responseMimeType: "application/json"
      }
    };

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
            } catch (e3) {
              console.error("JSON 파싱 최종 실패. 원본 데이터:", resultText);
            }
          }
        }
      }

      if (parsed && parsed.improved_text) {
        return new Response(JSON.stringify({
          improved_text: parsed.improved_text,
          score: typeof parsed.score === 'number' ? parsed.score : 0,
          reason: parsed.reason || "분석 결과를 생성하지 못했습니다.",
          details: Array.isArray(parsed.details) ? parsed.details : ["데이터 누락"]
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        // 파싱 실패 시 사용자에게는 공손한 메시지, 콘솔에는 에러 로그
        console.error("Gemini 응답 파싱 실패 또는 구조 불일치. 원본:", resultText);
        return new Response(JSON.stringify({ 
          improved_text: "죄송합니다. 텍스트 개선 작업 중 예상치 못한 형식이 반환되어 처리에 실패했습니다. 잠시 후 다시 시도해 주시면 감사하겠습니다.",
          is_error: true,
          score: 0,
          reason: "응답 데이터 구조 해석 실패",
          details: []
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    throw new Error(data.error ? data.error.message : "텍스트 개선 실패");

  } catch (error) {
    console.error("API 호출 중 예외 발생:", error);
    return new Response(JSON.stringify({ 
      error: "텍스트 개선 오류", 
      details: error.message,
      is_error: true
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
