// 파벌 이벤트 UI 시스템
// 파벌 이벤트 오버레이 표시 및 처리

// 파벌 이벤트 상태 관리
let currentFactionEvent = null;
let factionDialogueTimer = null;

// 파벌 이벤트 표시
function showFactionEventUI(factionEvent, applyImpactCallback, updateUICallback) {
    if (!factionEvent) return;

    currentFactionEvent = factionEvent;

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

