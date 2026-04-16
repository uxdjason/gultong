// 브라우저 직접 실행을 위해 CSS import 제거 (이미 index.html에서 로드 중)
// import './style.css'; 

console.log("글통: main.js 로드됨 (Progress Percentage 버전)");

const textInput = document.getElementById('text-input');
const checkBtn = document.getElementById('check-btn');
const resultArea = document.getElementById('result-area');
const scoreValue = document.getElementById('score-value');
const reasonText = document.getElementById('reason-text');
const detailsList = document.getElementById('details-list');

// Error message elements
const textInputError = document.getElementById('text-input-error');
const humanizeError = document.getElementById('humanize-error');

// Humanizer 요소들
const humanizeBtn = document.getElementById('humanize-btn');
const historyContainer = document.getElementById('history-container');
const scoreBasedMsg = document.getElementById('score-based-msg');

// 옵션 요소들
const modeSelect = document.getElementById('mode-select');
const seriousnessRange = document.getElementById('seriousness-range');
const emotionRange = document.getElementById('emotion-range');
const honorificSelect = document.getElementById('honorific-select');

let historyCount = 0;

/**
 * 버튼에 진행률 표시를 위한 유틸리티
 */
function createProgressTracker(button, loadingText) {
    let progress = 0;
    const originalContent = button.innerHTML;
    
    // 버튼 내용 변경 (로딩 텍스트 + 퍼센트 스팬)
    button.innerHTML = `${loadingText} <span class="progress-percent">0%</span>`;
    const percentSpan = button.querySelector('.progress-percent');
    
    const interval = setInterval(() => {
        // 0% -> 99%까지 가변 속도로 증가 (실제 완료 전까지 100%에 도달하지 않음)
        if (progress < 60) {
            progress += Math.floor(Math.random() * 10) + 2;
        } else if (progress < 85) {
            progress += Math.floor(Math.random() * 5) + 1;
        } else if (progress < 98) {
            progress += 1;
        }
        
        if (progress > 99) progress = 99;
        if (percentSpan) percentSpan.textContent = `${progress}%`;
    }, 500 + Math.random() * 500);

    return {
        stop: (finalText) => {
            clearInterval(interval);
            if (percentSpan) percentSpan.textContent = '100%';
            // 잠시 100%를 보여준 뒤 텍스트 복구 또는 변경
            setTimeout(() => {
                if (finalText) {
                    button.textContent = finalText;
                } else {
                    button.innerHTML = originalContent;
                }
            }, 600);
        }
    };
}

async function analyzeText(text) {
    try {
        const response = await fetch('/api/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await response.json();
        // API 자체는 200이지만 내용상 에러인 경우도 처리
        return data;
    } catch (apiError) {
        console.error("API 호출 중 오류:", apiError);
        throw apiError;
    }
}

async function humanizeText(text, options) {
    try {
        const response = await fetch('/api/humanize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, ...options })
        });
        const data = await response.json();
        return data;
    } catch (apiError) {
        console.error("Humanizer API 호출 중 오류:", apiError);
        throw apiError;
    }
}

function updateScoreUI(score, element) {
    element.textContent = score;
    if (score >= 81) element.style.color = '#10b981';
    else if (score >= 41) element.style.color = '#f59e0b';
    else element.style.color = '#ef4444';
}

function createHistoryCard(improvedText, analysis) {
    historyCount++;
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // 데이터 유효성 검증 및 기본값 설정
    const isError = !!analysis.is_error;
    const score = (analysis && typeof analysis.score === 'number') ? analysis.score : 0;
    const reason = (analysis && analysis.reason) ? analysis.reason : '분석 정보를 불러올 수 없습니다.';
    const details = (analysis && Array.isArray(analysis.details)) ? analysis.details : [];
    
    const scoreColor = score >= 81 ? '#10b981' : (score >= 41 ? '#f59e0b' : '#ef4444');
    
    // 배지 HTML 생성 (불필요한 불렛 제거)
    const badgesHtml = details.map(d => `<span class="badge" style="margin-right:5px; margin-bottom:5px;">${d}</span>`).join('');

    const honorificLabel = honorificSelect.options[honorificSelect.selectedIndex].text;

    card.innerHTML = `
        <div class="card-header">
            <h4 style="font-weight:900; color:#111827;">개선된 텍스트 결과 ${historyCount}</h4>
            <p>${modeSelect.value} | 진지함 ${seriousnessRange.value} | 감성 ${emotionRange.value} | ${honorificLabel}</p>
        </div>
        <textarea class="card-textarea" spellcheck="false" readonly>${improvedText}</textarea>
        
        <div class="card-score-box" style="${isError ? 'display:none;' : ''}">
            <span class="score-label">인간 작성 확률 점수</span>
            <span class="card-score-number" style="color: ${scoreColor}">${score}</span>
        </div>

        <div class="card-reason" style="${isError ? 'background-color:#fee2e2; color:#b91c1c;' : ''}">${reason}</div>
        <div class="details-tags" style="margin-bottom:24px; justify-content: center; ${isError ? 'display:none;' : ''}">${badgesHtml}</div>
        <div class="card-actions" style="position: relative; flex-direction: column; align-items: stretch;">
            <button class="text-button copy-card-btn" style="${isError ? 'display:none;' : ''}">
                개선된 텍스트 복사하기
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap='round' stroke-linejoin='round'><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
            <p class="caption" style="margin-top: 12px; text-align: left; ${isError ? 'display:none;' : ''}">개선된 텍스트도 결국 AI의 작업 결과입니다. 제목/소제목이 사라졌거나 문단 순서가 바뀌었을 수 있으니 반드시 꼼꼼히 검토한 후 중요한 곳에 사용하세요.</p>
            <div class="toast">클립보드로 저장되었습니다.</div>
        </div>
    `;

    // 복사 버튼 이벤트 리스너
    if (!isError) {
        card.querySelector('.copy-card-btn').addEventListener('click', (e) => {
            const textarea = card.querySelector('textarea');
            textarea.select();
            document.execCommand('copy');
            
            // 토스트 알림 표시
            const toast = card.querySelector('.toast');
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        });
    }

    return card;
}

if (checkBtn) {
    checkBtn.addEventListener('click', async () => {
        const originalText = textInput.value.trim();
        // 중복된 모든 공백(스페이스, 탭, 줄바꿈 등)을 하나로 압축하여 실제 '의미 있는' 길이 계산
        const effectiveText = originalText.replace(/\s+/g, ' ');
        
        // Clear previous error
        if (textInputError) textInputError.style.display = 'none';

        if (!originalText || effectiveText.length < 50) {
            if (textInputError) {
                textInputError.textContent = '정확한 분석을 위해 최소 50자 이상의 실질적인 텍스트 내용이 필요해요. 그러나 AI 특유의 패턴은 최소 100자 이상의 텍스트에서 잘 발견되므로 100자 이상 입력을 권장해 드려요.';
                textInputError.style.display = 'block';
            }
            return;
        }

        const maxLength = 5000;
        if (effectiveText.length > maxLength) {
            if (textInputError) {
                textInputError.textContent = `정확한 분석을 위해 한 번에 최대 ${maxLength.toLocaleString()}자(중복 공백 제외) 만큼만 처리해요. 방금 입력받은 텍스트는 총 ${effectiveText.length.toLocaleString()}자에요. 글의 맥락과 내용에 따라 적절히 나누어서 검사해 주세요.`;
                textInputError.style.display = 'block';
            }
            return;
        }

        // 한국어 비율 체크 (압축된 텍스트 기준으로 실제 한글의 비중 확인)
        const koreanChars = originalText.match(/[가-힣]/g) || [];
        if (koreanChars.length / effectiveText.length < 0.5) {
            if (textInputError) {
                textInputError.textContent = '글통은 한국어 전용 AI 탐지 및 개선 서비스에요. 외국어 비율이 지나치게 높은 텍스트는 검사 및 개선이 힘들어요.';
                textInputError.style.display = 'block';
            }
            return;
        }

        checkBtn.disabled = true;
        checkBtn.classList.add('loading');
        // 검사 시작 즉시 입력창 편집 불가능하게 설정
        textInput.readOnly = true;
        textInput.style.backgroundColor = '#f9fafb'; // 읽기 전용 시각적 표시
        
        const tracker = createProgressTracker(checkBtn, '분석 중입니다...');
        
        resultArea.classList.add('hidden');
        detailsList.innerHTML = ''; 

        try {
            // API에는 사용자의 원래 서식이 담긴 originalText를 보냄
            const result = await analyzeText(originalText);
            
            if (result.is_error) {
                // 검사 실패 시 처리
                updateScoreUI(0, scoreValue);
                reasonText.textContent = result.reason;
                reasonText.style.color = '#b91c1c';
                document.querySelector('.score-display').style.display = 'none';
                detailsList.innerHTML = '';
                if (scoreBasedMsg) scoreBasedMsg.style.display = 'none';
                
                // 실패 시에는 다시 시도할 수 있도록 입력창과 버튼 복구
                textInput.readOnly = false;
                textInput.style.backgroundColor = '';
                tracker.stop('다시 검사하기');
            } else {
                updateScoreUI(result.score, scoreValue);
                reasonText.textContent = result.reason;
                reasonText.style.color = '';
                document.querySelector('.score-display').style.display = 'block';

                if (scoreBasedMsg) {
                    if (result.score >= 81) {
                        scoreBasedMsg.textContent = "원문에 대한 검사 점수가 이미 높게 나왔으므로 아래 개선 작업은 AI 요소를 제거하기 보다는 문체를 다듬는 용도로 활용해 보세요. 작업 결과물에 대한 점수가 원문 점수 보다 낮을 수 있음을 유의하세요.";
                        scoreBasedMsg.style.color = '#10b981';
                        scoreBasedMsg.style.display = 'block';
                    } else if (result.score >= 41) {
                        scoreBasedMsg.style.display = 'none';
                    } else {
                        scoreBasedMsg.textContent = "원문에 AI적 특징이 많이 발견되었기 때문에 한 번의 개선 작업으로 만족할 만한 효과를 거두지 못할 수도 있어요. 결과물이 만족스럽지 않을 경우 아래 옵션들을 조정하여 개선 방향을 다르게 하거나, 결과물을 새로운 창에 입력하여 재작업 해보세요.";
                        scoreBasedMsg.style.color = '#ef4444';
                        scoreBasedMsg.style.display = 'block';
                    }
                }

                if (result.details && Array.isArray(result.details)) {
                    result.details.forEach(detail => {
                        const badge = document.createElement('span');
                        badge.className = 'badge';
                        badge.textContent = detail;
                        detailsList.appendChild(badge);
                    });
                }
                
                // 성공적으로 검사가 끝나면 버튼 숨기기
                checkBtn.style.display = 'none';
                tracker.stop();
            }

            resultArea.classList.remove('hidden');
        } catch (error) {
            console.log(`시스템 오류: ${error.message}`);
            if (textInputError) {
                textInputError.textContent = '시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
                textInputError.style.display = 'block';
            }
            // 오류 시 복구
            textInput.readOnly = false;
            textInput.style.backgroundColor = '';
            tracker.stop('검사하기');
        } finally {
            // 성공 시에는 위에서 display: none 처리됨
            if (checkBtn.style.display !== 'none') {
                checkBtn.disabled = false;
                checkBtn.classList.remove('loading');
            }
        }
    });
}

if (humanizeBtn) {
    humanizeBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        
        // Clear previous error
        if (humanizeError) humanizeError.style.display = 'none';

        if (!text) {
            // 검사가 완료된 후에는 텍스트가 비어있을 수 없으므로, 이 상황은 시스템 오류임
            console.error('글 개선 오류: 원본 텍스트를 찾을 수 없습니다.');
            return;
        }

        const options = {
            mode: modeSelect.value,
            seriousness: seriousnessRange.value,
            emotion: emotionRange.value,
            honorificType: honorificSelect.value
        };

        humanizeBtn.disabled = true;
        humanizeBtn.classList.add('loading');
        const tracker = createProgressTracker(humanizeBtn, '글을 개선하고 분석하는 중...');

        try {
            // 1. 텍스트 개선 및 자가 점수 측정 API 호출 (통합)
            const humResult = await humanizeText(text, options);
            
            // 2. 통합된 결과로 히스토리 카드 생성
            const card = createHistoryCard(humResult.improved_text, humResult);
            historyContainer.insertBefore(card, historyContainer.firstChild);
            
            // 3. 새 결과로 스크롤 이동
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            tracker.stop();

        } catch (error) {
            console.log(`개선 작업 오류: ${error.message}`);
            if (humanizeError) {
                humanizeError.textContent = '개선 작업 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
                humanizeError.style.display = 'block';
            }
            tracker.stop();
        } finally {
            humanizeBtn.disabled = false;
            humanizeBtn.classList.remove('loading');
        }
    });
}
