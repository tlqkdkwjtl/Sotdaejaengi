// 사건 대응 UI 시스템
// 사건 대응 선택지 표시 및 처리

// 사건 대응 선택지 표시
function showEventResponseOptionsUI(event, gameState, handleEventResponseCallback, closeOverlayCallback) {
    const overlay = document.getElementById('eventResponseOverlay');
    const titleEl = document.getElementById('eventResponseTitle');
    const infoEl = document.getElementById('eventResponseInfo');
    const optionsEl = document.getElementById('eventResponseOptions');
    const closeBtn = document.getElementById('eventResponseCloseBtn');
    
    if (!overlay || !titleEl || !infoEl || !optionsEl) return;
    
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
    
    // 예산 계산은 game-content/budget/budget-system.js에서 관리됩니다.
    // 사건 대응 옵션은 game-content/events/event-responses.js에서 로드됩니다.
    if (typeof EventResponseOptions === 'undefined') {
        console.error('EventResponseOptions가 로드되지 않았습니다.');
        return;
    }
    
    const responseOptions = EventResponseOptions.map(option => {
        const cost = (typeof calculateEventBudgetCost === 'function')
            ? calculateEventBudgetCost(event, option.type, null)
            : event.budgetCost * option.costMultiplier;
        
        const costText = (typeof getResponseCostText === 'function')
            ? getResponseCostText(option.type, event.budgetCost, cost)
            : `예산 소모: ${cost.toFixed(1)}%`;
        
        return {
            type: option.type,
            title: option.title,
            desc: option.desc,
            cost: cost,
            costText: costText
        };
    });
    
    responseOptions.forEach(option => {
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
        
        // 인물 선택 드롭다운
        const personnelSelect = document.createElement('select');
        personnelSelect.className = 'event-response-personnel';
        personnelSelect.style.marginTop = '10px';
        personnelSelect.style.padding = '5px';
        personnelSelect.style.background = '#1a1a1a';
        personnelSelect.style.color = '#ccc';
        personnelSelect.style.border = '1px solid #4a9eff';
        personnelSelect.style.fontFamily = "'Courier New', monospace";
        
        // 기본 옵션
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '인물 미선택 (기본 처리)';
        personnelSelect.appendChild(defaultOption);
        
        // 장관
        const ministerOption = document.createElement('option');
        ministerOption.value = 'minister';
        ministerOption.textContent = `${gameState.departments.minister.name} (장관) - 예산 5% 절감`;
        personnelSelect.appendChild(ministerOption);
        
        // 차관 및 부장들
        gameState.departments.viceMinisters.forEach((vm, vmIndex) => {
            const vmOption = document.createElement('option');
            vmOption.value = `viceMinister_${vmIndex}`;
            const reduction = vm.budgetAbility.reduction > 0 ? `-${(vm.budgetAbility.reduction * 100).toFixed(0)}%` : '';
            const bonus = vm.budgetAbility.bonus > 0 ? `+${(vm.budgetAbility.bonus * 100).toFixed(0)}%` : '';
            vmOption.textContent = `${vm.name} (${vm.role}) ${reduction}${bonus}`;
            personnelSelect.appendChild(vmOption);
            
            // 부장들
            vm.directors.forEach((dir, dirIndex) => {
                const dirOption = document.createElement('option');
                dirOption.value = `director_${vmIndex}_${dirIndex}`;
                const dirReduction = dir.budgetAbility.reduction > 0 ? `-${(dir.budgetAbility.reduction * 100).toFixed(0)}%` : '';
                const dirBonus = dir.budgetAbility.bonus > 0 ? `+${(dir.budgetAbility.bonus * 100).toFixed(0)}%` : '';
                dirOption.textContent = `  └ ${dir.name} (${dir.role}) ${dirReduction}${dirBonus}`;
                personnelSelect.appendChild(dirOption);
            });
        });
        
        optionDiv.appendChild(personnelSelect);
        
        // 예산 부족 시 경고
        if (option.cost > gameState.resources.budget && option.type !== 'ignore') {
            const warning = document.createElement('div');
            warning.className = 'event-response-option-cost';
            warning.style.color = '#ff6b6b';
            warning.textContent = '⚠ 예산 부족!';
            optionDiv.appendChild(warning);
            optionDiv.style.opacity = '0.6';
            optionDiv.style.cursor = 'not-allowed';
        } else {
            // 클릭 이벤트
            optionDiv.addEventListener('click', (e) => {
                // select 클릭은 이벤트 전파 중지
                if (e.target.tagName === 'SELECT') return;
                
                const selectedPersonnel = personnelSelect.value || null;
                if (handleEventResponseCallback) {
                    handleEventResponseCallback(event.id, option.type, selectedPersonnel);
                }
            });
        }
        
        optionsEl.appendChild(optionDiv);
    });
    
    // 닫기 버튼
    if (closeBtn) {
        closeBtn.onclick = () => {
            if (closeOverlayCallback) {
                closeOverlayCallback();
            }
        };
    }
    
    // 오버레이 배경 클릭 시 닫기
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            if (closeOverlayCallback) {
                closeOverlayCallback();
            }
        }
    };
    
    // ESC 키로 닫기
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            if (closeOverlayCallback) {
                closeOverlayCallback();
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

