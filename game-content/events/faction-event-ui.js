// 파벌 이벤트 UI 시스템
// 파벌 이벤트 오버레이 표시 및 처리
//
// 주요 DOM 요소 (index.html에 정의됨):
// - factionEventOverlay: 파벌 이벤트 오버레이 전체
// - factionEventTitle: 이벤트 제목
// - factionEventPortrait: 파벌 대표 초상화 영역 (faction.portraitUrl 사용)
// - factionEventFactionName: 파벌 이름
// - factionEventRepresentative: 파벌 대표 이름
// - factionEventDialogueText: 대사 텍스트 (한 글자씩 출력)
// - factionEventNextBtn: 다음 버튼 (선택지 표시)
// - factionEventSkipBtn: 건너뛰기 버튼 (대사 즉시 표시)
// - factionEventCloseBtn: 닫기 버튼
// - factionEventOptions: 선택지 표시 영역
//
// 호출 위치:
// - js/Sotdaejaengi.js의 Game 클래스에서 파벌 이벤트 발생 시 호출

// 파벌 이벤트 상태 관리
let currentFactionEvent = null;        // 현재 표시 중인 파벌 이벤트 객체
let factionDialogueTimer = null;      // 대사 한 글자씩 출력 타이머

/**
 * 파벌 이벤트 표시
 * @param {Object} factionEvent - 파벌 이벤트 객체 (title, description, dialogue, options, faction 등)
 * @param {Function} applyImpactCallback - 선택지 선택 시 호출될 콜백 함수 (이벤트 영향 적용)
 * @param {Function} updateUICallback - UI 업데이트 콜백 함수
 * @description 파벌 이벤트 오버레이를 열고, 대사를 한 글자씩 출력한 후 선택지를 표시합니다.
 *              faction.portraitUrl이 있으면 초상화 이미지를 표시하고, 없으면 대표 이름 첫 글자로 이니셜을 표시합니다.
 */
function showFactionEventUI(factionEvent, applyImpactCallback, updateUICallback) {
    if (!factionEvent) return;

    currentFactionEvent = factionEvent;  // 현재 이벤트 저장

    const overlay = document.getElementById('factionEventOverlay');
    const titleEl = document.getElementById('factionEventTitle');
    const portraitEl = document.getElementById('factionEventPortrait');
    const factionNameEl = document.getElementById('factionEventFactionName');
    const repEl = document.getElementById('factionEventRepresentative');
    const dialogueEl = document.getElementById('factionEventDialogueText');
    const nextBtn = document.getElementById('factionEventNextBtn');
    const skipBtn = document.getElementById('factionEventSkipBtn');
    const closeBtn = document.getElementById('factionEventCloseBtn');
    const optionsContainer = document.getElementById('factionEventOptions');

    if (!overlay || !titleEl || !portraitEl || !factionNameEl || !repEl || !dialogueEl || !nextBtn || !skipBtn || !closeBtn || !optionsContainer) {
        // 요소를 찾지 못하면 기존 alert 방식 사용
        let message = `${factionEvent.title}\n\n${factionEvent.description}\n\n${factionEvent.dialogue}\n\n`;
        message += '선택지:\n';
        factionEvent.options.forEach((option, index) => {
            message += `${index + 1}. ${option.text}\n`;
        });
        const choice = prompt(message + '\n선택지를 입력하세요 (1, 2, 3):');
        if (choice && choice >= '1' && choice <= '3') {
            const optionIndex = parseInt(choice) - 1;
            const selectedOption = factionEvent.options[optionIndex];
            if (selectedOption && applyImpactCallback) {
                applyImpactCallback(factionEvent, selectedOption);
            }
        }
        return;
    }

    // 제목 및 파벌 정보 설정
    titleEl.textContent = factionEvent.title;
    const faction = factionEvent.faction;
    factionNameEl.textContent = faction?.name || '파벌';
    repEl.textContent = faction?.representative ? `대표: ${faction.representative}` : '';

    // 초상(이미지/이니셜) 설정
    portraitEl.style.backgroundImage = '';
    if (faction && faction.portraitUrl) {
        portraitEl.style.backgroundImage = `url('${faction.portraitUrl}')`;
        portraitEl.textContent = '';
    } else {
        // 대표 이름 첫 글자로 이니셜 표시
        const repName = faction?.representative || '';
        const initial = repName ? repName.charAt(0) : '?';
        portraitEl.textContent = initial;
    }

    // 이전 대사 타이머 정리
    if (factionDialogueTimer) {
        clearInterval(factionDialogueTimer);
        factionDialogueTimer = null;
    }

    // 대사 텍스트 준비 (한 글자씩 출력)
    const fullText = factionEvent.dialogue || '';
    let factionDialogueFullText = fullText;
    let factionDialogueIndex = 0;
    dialogueEl.textContent = '';

    // 버튼/옵션 초기 상태
    optionsContainer.style.display = 'none';
    optionsContainer.innerHTML = '';

    // 대사 출력 타이머
    const typeSpeed = 30; // ms
    factionDialogueTimer = setInterval(() => {
        if (factionDialogueIndex >= factionDialogueFullText.length) {
            clearInterval(factionDialogueTimer);
            factionDialogueTimer = null;
            return;
        }
        dialogueEl.textContent += factionDialogueFullText.charAt(factionDialogueIndex);
        factionDialogueIndex++;
    }, typeSpeed);

    // 건너뛰기 버튼: 전체 대사 즉시 표시
    skipBtn.onclick = () => {
        if (factionDialogueTimer) {
            clearInterval(factionDialogueTimer);
            factionDialogueTimer = null;
        }
        dialogueEl.textContent = factionDialogueFullText;
    };

    // 닫기 버튼: 오버레이 닫기
    const closeOverlay = () => {
        if (factionDialogueTimer) {
            clearInterval(factionDialogueTimer);
            factionDialogueTimer = null;
        }
        overlay.classList.remove('active');
        currentFactionEvent = null;
    };
    closeBtn.onclick = () => {
        closeOverlay();
    };

    // 다음 버튼: 선택지 표시 단계로 전환
    nextBtn.onclick = () => {
        if (!currentFactionEvent) return;

        // 대사 출력 중이면 먼저 다 보여주기
        if (factionDialogueTimer) {
            clearInterval(factionDialogueTimer);
            factionDialogueTimer = null;
            dialogueEl.textContent = factionDialogueFullText;
        }

        // 선택지 UI 구성
        optionsContainer.innerHTML = '';
        currentFactionEvent.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'faction-event-option';

            const textEl = document.createElement('div');
            textEl.className = 'faction-event-option-text';
            textEl.textContent = option.text;
            optionEl.appendChild(textEl);

            optionEl.addEventListener('click', () => {
                if (applyImpactCallback) {
                    applyImpactCallback(currentFactionEvent, option);
                }
                closeOverlay();
                if (updateUICallback) {
                    updateUICallback();
                }
            });

            optionsContainer.appendChild(optionEl);
        });

        optionsContainer.style.display = 'flex';
    };

    // 오버레이 표시
    overlay.classList.add('active');
}

// 파벌 이벤트 오버레이 닫기
function closeFactionEventOverlay() {
    const overlay = document.getElementById('factionEventOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    if (factionDialogueTimer) {
        clearInterval(factionDialogueTimer);
        factionDialogueTimer = null;
    }
    currentFactionEvent = null;
}

