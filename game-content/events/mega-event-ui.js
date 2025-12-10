// 초대형 사건 UI 시스템
// 초대형 사건을 파벌 이벤트처럼 화면에 표시하고 선택지로 처리합니다.

// 초대형 사건 상태 관리
let currentMegaEvent = null;

/**
 * 초대형 사건 표시
 * @param {Object} megaEvent - 초대형 사건 객체 (title, description, district, budgetCost 등)
 * @param {Function} handleMegaEventCallback - 선택지 선택 시 호출될 콜백 함수
 * @param {Function} updateUICallback - UI 업데이트 콜백 함수
 * @description 초대형 사건 오버레이를 열고, 선택지를 표시합니다.
 *              파벌 이벤트와 유사한 UI를 사용하되, 초대형 사건 전용으로 처리합니다.
 */
function showMegaEventUI(megaEvent, handleMegaEventCallback, updateUICallback) {
    if (!megaEvent) return;

    currentMegaEvent = megaEvent;

    // 파벌 이벤트 오버레이 재사용 (또는 별도 오버레이 생성)
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
        alert(`${megaEvent.title}\n\n${megaEvent.description}\n\n이 사건은 즉시 대응이 필요합니다.`);
        return;
    }

    // 제목 설정
    titleEl.textContent = megaEvent.title;
    factionNameEl.textContent = '긴급 사건';
    
    // 파벌 연관 정보 표시
    let locationText = `위치: ${megaEvent.district}`;
    if (megaEvent.relatedFactions && megaEvent.relatedFactions.length > 0) {
        const factionNames = megaEvent.relatedFactions.map(key => {
            if (typeof FactionsData !== 'undefined' && FactionsData[key]) {
                return FactionsData[key].name;
            }
            return key;
        }).join(', ');
        locationText += `\n관련 파벌: ${factionNames}`;
    }
    repEl.textContent = locationText;

    // 초상화 설정 (긴급 사건 아이콘 또는 빨간색 배경)
    portraitEl.style.backgroundImage = '';
    portraitEl.textContent = '⚠';
    portraitEl.style.backgroundColor = '#ff0000';
    portraitEl.style.color = '#ffffff';
    portraitEl.style.fontSize = '3rem';

    // 대사 텍스트 (스토리 또는 설명)
    const fullText = megaEvent.story || megaEvent.description || megaEvent.title;
    dialogueEl.textContent = fullText;

    // 버튼/옵션 초기 상태
    optionsContainer.style.display = 'none';
    optionsContainer.innerHTML = '';

    // 건너뛰기 버튼: 즉시 선택지 표시
    skipBtn.onclick = () => {
        showMegaEventOptions();
    };

    // 닫기 버튼: 오버레이 닫기 (초대형 사건은 무시할 수 없음)
    closeBtn.onclick = () => {
        // 초대형 사건은 반드시 처리해야 하므로 경고
        if (confirm('초대형 사건을 무시하시겠습니까? 이는 심각한 결과를 초래할 수 있습니다.')) {
            closeMegaEventOverlay();
            // 무시 선택 시 영향 적용
            if (handleMegaEventCallback) {
                handleMegaEventCallback(megaEvent, { type: 'ignore' });
            }
            if (updateUICallback) {
                updateUICallback();
            }
        }
    };

    // 다음 버튼: 선택지 표시
    nextBtn.onclick = () => {
        showMegaEventOptions();
    };

    // 선택지 표시 함수
    function showMegaEventOptions() {
        optionsContainer.innerHTML = '';
        
        // 초대형 사건 대응 옵션 생성
        const options = [
            {
                text: '전력 투입 (경찰 7대 + 드론 5대)',
                type: 'full',
                police: 7,
                drone: 5,
                desc: '모든 자원을 투입하여 확실하게 처리합니다.'
            },
            {
                text: '표준 대응 (경찰 5대 + 드론 3대)',
                type: 'standard',
                police: 5,
                drone: 3,
                desc: '표준 규모로 대응합니다.'
            },
            {
                text: '최소 대응 (경찰 3대 + 드론 2대)',
                type: 'minimal',
                police: 3,
                drone: 2,
                desc: '최소한의 자원으로 대응합니다. (위험)'
            }
        ];

        options.forEach((option, index) => {
            // 자원 사용 가능 여부 확인
            const availablePolice = (typeof getAvailablePoliceCount === 'function')
                ? getAvailablePoliceCount(window.gameInstance.state)
                : window.gameInstance.state.resources.police || 0;
            const availableDrones = (typeof getAvailableDroneCount === 'function')
                ? getAvailableDroneCount(window.gameInstance.state)
                : window.gameInstance.state.resources.drones || 0;

            const optionEl = document.createElement('div');
            optionEl.className = 'faction-event-option';

            const textEl = document.createElement('div');
            textEl.className = 'faction-event-option-text';
            textEl.textContent = option.text;
            optionEl.appendChild(textEl);

            const descEl = document.createElement('div');
            descEl.className = 'faction-event-option-desc';
            descEl.style.fontSize = '0.85rem';
            descEl.style.color = '#aaa';
            descEl.style.marginTop = '5px';
            descEl.textContent = option.desc;
            optionEl.appendChild(descEl);

            // 자원 부족 시 비활성화
            if (availablePolice < option.police || availableDrones < option.drone) {
                optionEl.style.opacity = '0.5';
                optionEl.style.cursor = 'not-allowed';
                const warning = document.createElement('div');
                warning.style.color = '#ff6b6b';
                warning.style.fontSize = '0.8rem';
                warning.style.marginTop = '5px';
                warning.textContent = `⚠ 자원 부족 (경찰: ${option.police}대, 드론: ${option.drone}대 필요)`;
                optionEl.appendChild(warning);
            } else {
                optionEl.addEventListener('click', () => {
                    if (handleMegaEventCallback) {
                        handleMegaEventCallback(megaEvent, option);
                    }
                    closeMegaEventOverlay();
                    if (updateUICallback) {
                        updateUICallback();
                    }
                });
            }

            optionsContainer.appendChild(optionEl);
        });

        optionsContainer.style.display = 'flex';
    }

    // 오버레이 표시
    overlay.classList.add('active');
}

/**
 * 초대형 사건 오버레이 닫기
 */
function closeMegaEventOverlay() {
    const overlay = document.getElementById('factionEventOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    currentMegaEvent = null;
}

