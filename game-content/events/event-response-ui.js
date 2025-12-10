// 사건 대응 UI 시스템
// 사건 대응 선택지 표시 및 처리 (v2 - 수량 선택 기능 포함)
//
// 주요 DOM 요소 (index.html에 정의됨):
// - eventResponseOverlay: 사건 대응 오버레이 전체
// - eventResponseTitle: 사건 제목 표시 영역
// - eventResponseInfo: 사건 정보 표시 영역 (위치, 비용, 시간 등)
// - eventResponseOptions: 대응 선택지 표시 영역
// - eventResponseCloseBtn: 닫기 버튼
//
// 호출 위치:
// - js/Sotdaejaengi.js의 Game 클래스에서 window.showEventResponseOptions로 전역 노출
// - game-content/operator/operator-ui.js에서 사건 클릭 시 호출

// 선택된 자원 수량 저장
let selectedPoliceCount = 0;
let selectedDroneCount = 0;
let currentEventForResponse = null;
let currentGameStateForResponse = null;
let currentCallbackForResponse = null;
let currentCloseOverlayCallback = null; // 전역 변수로 closeOverlayCallback 저장

/**
 * 사건 대응 선택지 표시
 * @param {Object} event - 사건 객체 (title, description, district, budgetCost, time, character 등)
 * @param {Object} gameState - 게임 상태 객체 (departments, resources 등)
 * @param {Function} handleEventResponseCallback - 사건 대응 선택 시 호출될 콜백 함수
 * @param {Function} closeOverlayCallback - 오버레이 닫기 시 호출될 콜백 함수
 * @description 사건 대응 오버레이를 열고, 사건 정보와 대응 선택지를 표시합니다.
 *              event.character가 있으면 조언 스텐드에 캐릭터 이미지를 표시합니다.
 */
function showEventResponseOptionsUI(event, gameState, handleEventResponseCallback, closeOverlayCallback) {
    // 전역 변수에 저장
    currentCloseOverlayCallback = closeOverlayCallback;
    
    // DOM 요소 가져오기
    const overlay = document.getElementById('eventResponseOverlay');      // 오버레이 전체
    const titleEl = document.getElementById('eventResponseTitle');        // 사건 제목
    const infoEl = document.getElementById('eventResponseInfo');           // 사건 정보
    const optionsEl = document.getElementById('eventResponseOptions');    // 대응 선택지
    const closeBtn = document.getElementById('eventResponseCloseBtn');     // 닫기 버튼
    
    if (!overlay || !titleEl || !infoEl || !optionsEl) return;
    
    // 전역 변수 저장
    currentEventForResponse = event;
    currentGameStateForResponse = gameState;
    currentCallbackForResponse = handleEventResponseCallback;
    
    // 선택된 수량 초기화
    selectedPoliceCount = 0;
    selectedDroneCount = 0;
    
    // 사건 정보 표시
    titleEl.textContent = event.title;
    
    infoEl.innerHTML = `
        <div class="event-response-info-title">${event.title}</div>
        <div class="event-response-info-desc">${event.description}</div>
        <div class="event-response-info-detail">📍 위치: ${event.district}</div>
        <div class="event-response-info-detail">💰 기본 비용: ${event.budgetCost}%</div>
        <div class="event-response-info-detail">⏰ 발생 시간: ${event.time}시</div>
    `;
    
    // 대응 선택지 생성
    optionsEl.innerHTML = '';
    
    // 사용 가능한 자원 확인
    const availablePolice = (typeof getAvailablePoliceCount === 'function')
        ? getAvailablePoliceCount(gameState)
        : (gameState.resources.police || 0);
    const availableDrones = (typeof getAvailableDroneCount === 'function')
        ? getAvailableDroneCount(gameState)
        : (gameState.resources.drones || 0);
    
    // 경찰 파견 옵션 (수량 선택)
    createResourceSelectionOption(optionsEl, '경찰 파견', 'dispatch', availablePolice, 10, event, gameState);
    
    // 드론 사용 옵션 (수량 선택)
    createResourceSelectionOption(optionsEl, '드론 사용', 'drone', availableDrones, 20, event, gameState);
    
    // 예산 계산은 game-content/budget/budget-system.js에서 관리됩니다.
    // 사건 대응 옵션은 game-content/events/event-responses.js에서 로드됩니다.
    if (typeof EventResponseOptions === 'undefined') {
        console.error('EventResponseOptions가 로드되지 않았습니다.');
        return;
    }
    
    // CCTV와 무시 옵션은 기존 방식 유지
    
    // CCTV와 무시 옵션만 처리
    const simpleOptions = EventResponseOptions.filter(opt => opt.type === 'cctv' || opt.type === 'ignore');
    
    simpleOptions.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'event-response-option';
        
        const title = document.createElement('div');
        title.className = 'event-response-option-title';
        title.textContent = option.title;
        optionDiv.appendChild(title);
        
        const desc = document.createElement('div');
        desc.className = 'event-response-option-desc';
        desc.textContent = option.desc;
        optionDiv.appendChild(desc);
        
        const cost = document.createElement('div');
        cost.className = 'event-response-option-cost';
        cost.textContent = option.costText;
        optionDiv.appendChild(cost);
        
        // 성공률 및 자원 충족도 표시 (ignore 제외)
        if (option.type !== 'ignore' && window.gameInstance && window.gameInstance.state) {
            const successRate = window.gameInstance.state.calculateEventSuccessRate(event, option.type);
            const successRateDiv = document.createElement('div');
            successRateDiv.className = 'event-response-option-success-rate';
            successRateDiv.style.marginTop = '6px';
            successRateDiv.style.fontSize = '0.9em';
            
            // 성공률에 따라 색상 변경
            if (successRate >= 70) {
                successRateDiv.style.color = '#51cf66'; // 녹색
            } else if (successRate >= 40) {
                successRateDiv.style.color = '#ffd43b'; // 노란색
            } else {
                successRateDiv.style.color = '#ff6b6b'; // 빨간색
            }
            
            let successRateText = `예상 성공률: ${successRate.toFixed(0)}%`;
            
            // 자원 충족도 정보 추가 (경찰 파견 또는 드론 사용 시)
            if (typeof calculateResourceFulfillment === 'function' && 
                (option.type === 'dispatch' || option.type === 'drone')) {
                const fulfillment = calculateResourceFulfillment(gameState, event.type, option.type);
                
                if (fulfillment.required > 0) {
                    const fulfillmentPercent = (fulfillment.fulfillment * 100).toFixed(0);
                    if (fulfillment.fulfillment >= 1.0) {
                        successRateText += ` | 자원 충족: ${fulfillmentPercent}% ✅`;
                    } else if (fulfillment.fulfillment > 0) {
                        successRateText += ` | 자원 충족: ${fulfillmentPercent}% ⚠️`;
                    } else {
                        successRateText += ` | 자원 부족 ❌`;
                    }
                }
            }
            
            successRateDiv.textContent = successRateText;
            optionDiv.appendChild(successRateDiv);
        }
        
        // 예산 부족 시 선택 불가, 자원 부족 시 경고만 표시 (선택은 가능)
        const budgetInsufficient = option.cost > gameState.resources.budget && option.type !== 'ignore';
        const resourceShortage = option.resourceShortage || false;
        
        if (budgetInsufficient) {
            // 예산 부족 시 선택 불가
            const warning = document.createElement('div');
            warning.className = 'event-response-option-cost';
            warning.style.color = '#ff6b6b';
            warning.style.marginTop = '8px';
            warning.textContent = '⚠ 예산 부족!';
            optionDiv.appendChild(warning);
            optionDiv.style.opacity = '0.6';
            optionDiv.style.cursor = 'not-allowed';
        } else {
            // 예산이 충분하면 선택 가능 (자원 부족해도 선택 가능)
            if (resourceShortage) {
                // 자원 부족 시 경고만 표시
                const warning = document.createElement('div');
                warning.className = 'event-response-option-cost';
                warning.style.color = '#ffd43b';
                warning.style.marginTop = '8px';
                warning.textContent = `⚠ ${option.resourceWarning} (성공률 감소)`;
                optionDiv.appendChild(warning);
            }
            
            // 클릭 이벤트 (CCTV와 무시는 바로 처리)
            optionDiv.addEventListener('click', () => {
                if (handleEventResponseCallback) {
                    handleEventResponseCallback(event.id, option.type, null);
                }
                // 오버레이 닫기
                if (currentCloseOverlayCallback) {
                    currentCloseOverlayCallback();
                }
            });
        }
        
        optionsEl.appendChild(optionDiv);
    });
    
    // 확인 버튼은 HTML에 이미 있으므로 참조만 가져오기
    const confirmBtn = document.getElementById('eventResponseConfirmBtn');
    const confirmContainer = document.getElementById('eventResponseConfirmContainer');
    if (confirmBtn && confirmContainer) {
        confirmBtn.style.display = 'none';
        confirmBtn.onclick = () => {
            handleResourceSelection();
        };
    }
    
    // 조언자 초기 메시지
    if (typeof displayAdvisorStandDialogue === 'function') {
        displayAdvisorStandDialogue('사건을 확인했습니다. 어떤 대응 방법을 선택하시겠습니까?', 'event');
    }
    
    // 닫기 버튼 비활성화 (확인 버튼을 눌러야만 닫힘)
    if (closeBtn) {
        closeBtn.onclick = () => {
            // 확인 버튼이 표시되어 있으면 닫기 불가
            if (confirmBtn && confirmBtn.style.display !== 'none') {
                if (typeof displayAdvisorStandDialogue === 'function') {
                    displayAdvisorStandDialogue('먼저 확인 버튼을 눌러주세요.', 'event');
                }
                return;
            }
            // CCTV나 무시 선택 시에만 닫기 가능
            if (currentCloseOverlayCallback) {
                currentCloseOverlayCallback();
            }
        };
    }
    
    // 오버레이 배경 클릭 시 닫기 비활성화
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            // 확인 버튼이 표시되어 있으면 닫기 불가
            if (confirmBtn && confirmBtn.style.display !== 'none') {
                if (typeof displayAdvisorStandDialogue === 'function') {
                    displayAdvisorStandDialogue('먼저 확인 버튼을 눌러주세요.', 'event');
                }
                return;
            }
            // CCTV나 무시 선택 시에만 닫기 가능
            if (currentCloseOverlayCallback) {
                currentCloseOverlayCallback();
            }
        }
    };
    
    // ESC 키로 닫기 비활성화
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            // 확인 버튼이 표시되어 있으면 닫기 불가
            if (confirmBtn && confirmBtn.style.display !== 'none') {
                if (typeof displayAdvisorStandDialogue === 'function') {
                    displayAdvisorStandDialogue('먼저 확인 버튼을 눌러주세요.', 'event');
                }
                return;
            }
            // CCTV나 무시 선택 시에만 닫기 가능
            if (currentCloseOverlayCallback) {
                currentCloseOverlayCallback();
            }
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // 오버레이 표시
    overlay.classList.add('active');
}

// 사건 대응 오버레이 닫기
function closeEventResponseOverlay() {
    const overlay = document.getElementById('eventResponseOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * 자원 선택 옵션 생성 (경찰/드론)
 */
function createResourceSelectionOption(container, title, type, available, maxCount, event, gameState) {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'event-response-option resource-selection-option';
    optionDiv.dataset.type = type;
    
    const titleEl = document.createElement('div');
    titleEl.className = 'event-response-option-title';
    titleEl.textContent = title;
    optionDiv.appendChild(titleEl);
    
    // 현재 보유량 표시
    const totalCount = type === 'dispatch' 
        ? (gameState.resources.police || 0)
        : (gameState.resources.drones || 0);
    
    const currentCountEl = document.createElement('div');
    currentCountEl.className = 'resource-current-count';
    currentCountEl.textContent = `보유: ${totalCount}대 / 최대: ${maxCount}대`;
    currentCountEl.style.fontSize = '0.85rem';
    currentCountEl.style.color = '#888';
    currentCountEl.style.marginBottom = '8px';
    optionDiv.appendChild(currentCountEl);
    
    // 아이콘 선택 영역
    const iconContainer = document.createElement('div');
    iconContainer.className = 'resource-icon-container';
    iconContainer.dataset.type = type;
    
    // 아이콘 생성 함수 (재사용 가능하도록)
    const updateIcons = () => {
        // 현재 선택된 수량 저장
        const currentSelected = type === 'dispatch' ? selectedPoliceCount : selectedDroneCount;
        
        iconContainer.innerHTML = '';
        const currentAvailable = type === 'dispatch'
            ? ((typeof getAvailablePoliceCount === 'function') ? getAvailablePoliceCount(gameState) : (gameState.resources.police || 0))
            : ((typeof getAvailableDroneCount === 'function') ? getAvailableDroneCount(gameState) : (gameState.resources.drones || 0));
        const currentTotal = type === 'dispatch'
            ? (gameState.resources.police || 0)
            : (gameState.resources.drones || 0);
        
        // 사용 가능한 수량만큼 아이콘 생성
        for (let i = 0; i < Math.min(currentAvailable, maxCount); i++) {
            const icon = document.createElement('div');
            icon.className = 'resource-icon';
            icon.dataset.index = i;
            icon.textContent = '■';
            
            // 이전에 선택된 아이콘인지 확인
            if (i < currentSelected) {
                icon.classList.add('resource-icon-selected');
            }
            
            icon.addEventListener('click', () => {
                toggleResourceIcon(icon, type, i);
            });
            iconContainer.appendChild(icon);
        }
        
        // 부족한 경우 빈 아이콘 표시
        if (currentTotal < maxCount) {
            for (let i = currentTotal; i < maxCount; i++) {
                const icon = document.createElement('div');
                icon.className = 'resource-icon resource-icon-disabled';
                icon.textContent = '□';
                iconContainer.appendChild(icon);
            }
        }
        
        // 선택된 수량 표시 업데이트
        const countDisplay = optionDiv.querySelector('.resource-count-display');
        if (countDisplay) {
            countDisplay.textContent = `선택: ${currentSelected}대`;
        }
    };
    
    updateIcons();
    optionDiv.updateIcons = updateIcons; // 나중에 업데이트할 수 있도록 저장
    
    optionDiv.appendChild(iconContainer);
    
    // 선택된 수량 표시
    const countDisplay = document.createElement('div');
    countDisplay.className = 'resource-count-display';
    countDisplay.textContent = `선택: 0대`;
    countDisplay.dataset.type = type;
    optionDiv.appendChild(countDisplay);
    
    container.appendChild(optionDiv);
}

/**
 * 자원 아이콘 토글 (왼쪽부터 자동 선택)
 */
function toggleResourceIcon(icon, type, index) {
    const optionDiv = icon.closest('.resource-selection-option');
    const iconContainer = optionDiv.querySelector('.resource-icon-container');
    const countDisplay = optionDiv.querySelector('.resource-count-display');
    const allIcons = iconContainer.querySelectorAll('.resource-icon:not(.resource-icon-disabled)');
    
    // 클릭한 아이콘의 인덱스까지 모든 아이콘 선택/해제
    const targetIndex = index;
    const isCurrentlySelected = icon.classList.contains('resource-icon-selected');
    
    if (isCurrentlySelected) {
        // 선택 해제: 클릭한 아이콘부터 오른쪽 끝까지 모두 해제
        for (let i = targetIndex; i < allIcons.length; i++) {
            allIcons[i].classList.remove('resource-icon-selected');
        }
        
        // 선택된 수량 업데이트
        if (type === 'dispatch') {
            selectedPoliceCount = targetIndex;
        } else {
            selectedDroneCount = targetIndex;
        }
    } else {
        // 선택: 왼쪽부터 클릭한 아이콘까지 모두 선택
        for (let i = 0; i <= targetIndex; i++) {
            allIcons[i].classList.add('resource-icon-selected');
        }
        
        // 선택된 수량 업데이트
        if (type === 'dispatch') {
            selectedPoliceCount = targetIndex + 1;
        } else {
            selectedDroneCount = targetIndex + 1;
        }
    }
    
    // 선택된 수량 표시 업데이트
    if (type === 'dispatch') {
        countDisplay.textContent = `선택: ${selectedPoliceCount}대`;
    } else {
        countDisplay.textContent = `선택: ${selectedDroneCount}대`;
    }
    
    // 확인 버튼 표시/숨김
    const confirmBtn = document.getElementById('eventResponseConfirmBtn');
    if (confirmBtn) {
        if (selectedPoliceCount > 0 || selectedDroneCount > 0) {
            confirmBtn.style.display = 'block';
        } else {
            confirmBtn.style.display = 'none';
        }
    }
    
    // 조언자 메시지 업데이트
    updateAdvisorForResourceSelection();
}

/**
 * 자원 선택에 따른 조언자 메시지 업데이트
 */
function updateAdvisorForResourceSelection() {
    if (!currentEventForResponse || !currentGameStateForResponse || !window.gameInstance) return;
    
    let responseType = 'dispatch';
    if (selectedPoliceCount > 0 && selectedDroneCount > 0) {
        responseType = 'dispatch'; // 경찰이 우선
    } else if (selectedDroneCount > 0) {
        responseType = 'drone';
    } else if (selectedPoliceCount > 0) {
        responseType = 'dispatch';
    } else {
        if (typeof displayAdvisorStandDialogue === 'function') {
            displayAdvisorStandDialogue('자원을 선택해주세요.', 'event');
        }
        return;
    }
    
    // 예산 계산
    const cost = (typeof calculateEventBudgetCost === 'function')
        ? calculateEventBudgetCost(currentEventForResponse, responseType, null)
        : currentEventForResponse.budgetCost * (responseType === 'dispatch' ? 1.5 : responseType === 'drone' ? 1.2 : 0.5);
    
    // 성공률 계산 (수량 고려)
    let successRate = 0;
    if (window.gameInstance.state) {
        // 기본 성공률 계산
        successRate = window.gameInstance.state.calculateEventSuccessRate(currentEventForResponse, responseType);
        
        // 수량에 따른 추가 보너스/페널티
        const required = responseType === 'dispatch' 
            ? (currentEventForResponse.type === 'small' ? 1 : currentEventForResponse.type === 'medium' ? 2 : currentEventForResponse.type === 'large' ? 3 : 5)
            : (currentEventForResponse.type === 'small' ? 0 : currentEventForResponse.type === 'medium' ? 1 : currentEventForResponse.type === 'large' ? 2 : 3);
        
        const selected = responseType === 'dispatch' ? selectedPoliceCount : selectedDroneCount;
        const fulfillment = required > 0 ? selected / required : 1;
        
        if (fulfillment >= 1.5) {
            successRate += 10; // 150% 이상 충족 시 +10%
        } else if (fulfillment >= 1.0) {
            successRate += 5; // 100% 충족 시 +5%
        } else if (fulfillment >= 0.5) {
            successRate -= 10; // 50% 이상: -10%
        } else if (fulfillment > 0) {
            successRate -= 20; // 50% 미만: -20%
        }
        
        successRate = Math.min(100, Math.max(0, successRate));
    }
    
    // 조언자 메시지 생성
    const message = `이 선택은 예산을 약 ${cost.toFixed(1)}% 소모할 것으로 예상되며, 성공 확률은 약 ${successRate.toFixed(0)}%입니다.`;
    if (typeof displayAdvisorStandDialogue === 'function') {
        displayAdvisorStandDialogue(message, 'event');
    }
}

/**
 * 자원 추가 함수
 */
function addResource(type, gameState, optionDiv) {
    const cost = type === 'dispatch' ? 5 : 3; // 경찰 5%, 드론 3%
    const maxCount = type === 'dispatch' ? 10 : 20;
    const currentTotal = type === 'dispatch'
        ? (gameState.resources.police || 0)
        : (gameState.resources.drones || 0);
    
    // 최대 보유량 확인
    if (currentTotal >= maxCount) {
        alert(`${type === 'dispatch' ? '경찰 차량' : '드론'}은 최대 ${maxCount}대까지 보유할 수 있습니다.`);
        return;
    }
    
    // 예산 확인
    if (gameState.resources.budget < cost) {
        alert(`예산이 부족합니다! (필요: ${cost}%, 보유: ${gameState.resources.budget.toFixed(1)}%)`);
        return;
    }
    
    // 확인 대화상자
    const resourceName = type === 'dispatch' ? '경찰 차량' : '드론';
    if (!confirm(`${resourceName} 1대를 추가하시겠습니까?\n예산 소모: ${cost}%`)) {
        return;
    }
    
    // 자원 추가
    if (type === 'dispatch') {
        gameState.resources.police = Math.min(maxCount, (gameState.resources.police || 0) + 1);
    } else {
        gameState.resources.drones = Math.min(maxCount, (gameState.resources.drones || 0) + 1);
    }
    
    // 예산 차감
    if (typeof applyBudgetCost === 'function') {
        applyBudgetCost(gameState, cost);
    } else {
        gameState.resources.budget = Math.max(0, gameState.resources.budget - cost);
    }
    
    // UI 업데이트
    if (optionDiv.updateIcons) {
        optionDiv.updateIcons();
    }
    
    // 보유량 표시 업데이트
    const currentCountEl = optionDiv.querySelector('.resource-current-count');
    if (currentCountEl) {
        const newTotal = type === 'dispatch'
            ? (gameState.resources.police || 0)
            : (gameState.resources.drones || 0);
        currentCountEl.textContent = `보유: ${newTotal}대 / 최대: ${maxCount}대`;
    }
    
    // 자원 추가 버튼 업데이트 (최대치 도달 시 제거)
    const addBtn = optionDiv.querySelector('.resource-add-btn');
    if (addBtn && (type === 'dispatch' ? (gameState.resources.police || 0) : (gameState.resources.drones || 0)) >= maxCount) {
        addBtn.remove();
    }
    
    // 조언자 메시지 업데이트
    if (typeof displayAdvisorStandDialogue === 'function') {
        displayAdvisorStandDialogue(`${resourceName} 1대가 추가되었습니다. (예산 ${cost}% 소모)`, 'event');
    }
    
    // 게임 UI 업데이트
    if (window.gameInstance) {
        window.gameInstance.updateUI();
    }
    
    // 성공률 재계산
    updateAdvisorForResourceSelection();
}

/**
 * 자원 선택 처리
 */
function handleResourceSelection() {
    if (!currentEventForResponse || !currentCallbackForResponse) return;
    
    // 바로 처리 (2차 확인 제거)
    const responseType = selectedPoliceCount > 0 ? 'dispatch' : 'drone';
    
    // 실제 처리 (수량 정보를 추가 매개변수로 전달)
    if (currentCallbackForResponse) {
        currentCallbackForResponse(currentEventForResponse.id, responseType, null, {
            police: selectedPoliceCount,
            drone: selectedDroneCount
        });
    }
    // 오버레이 닫기
    if (currentCloseOverlayCallback) {
        currentCloseOverlayCallback();
    }
}

