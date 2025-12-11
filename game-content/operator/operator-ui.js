// 오퍼레이터 UI 렌더링 시스템
// 오퍼레이터 화면의 사건 목록 및 UI 업데이트를 담당합니다.

// 오퍼레이터 사건 목록 렌더링
function renderOperatorEventsList(gameState) {
    const eventsList = document.getElementById('operatorEventsList');
    if (!eventsList) return;
    
    eventsList.innerHTML = '';
    
    // 활성 사건과 미해결 사건 모두 표시
    const activeEvents = gameState.activeEvents.filter(e => e.status === 'active' || e.status === 'failed');
    
    if (activeEvents.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.className = 'operator-event-item';
        noEvents.style.borderColor = '#4a9eff';
        noEvents.style.cursor = 'default';
        noEvents.textContent = '현재 활성 사건이 없습니다.';
        noEvents.style.textAlign = 'center';
        noEvents.style.color = '#888';
        eventsList.appendChild(noEvents);
        return;
    }
    
    activeEvents.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'operator-event-item';
        eventItem.style.cursor = 'pointer';
        
        // 사건 제목 (미해결 사건은 표시)
        const title = document.createElement('div');
        title.className = 'operator-event-title';
        if (event.status === 'failed') {
            title.textContent = `⚠ ${event.title} (미해결)`;
            title.style.color = '#ff6b6b'; // 미해결 사건은 빨간색
        } else {
            title.textContent = event.title;
        }
        eventItem.appendChild(title);
        
        // 사건 상세 정보
        const details = document.createElement('div');
        details.className = 'operator-event-details';
        details.textContent = event.description;
        eventItem.appendChild(details);
        
        // 사건 위치
        const location = document.createElement('div');
        location.className = 'operator-event-location';
        if (event.district) {
            location.textContent = `📍 ${event.district}`;
        } else if (event.districtIndex !== null && event.districtIndex >= 0 && gameState.districts[event.districtIndex]) {
            location.textContent = `📍 ${gameState.districts[event.districtIndex].name}`;
        } else {
            location.textContent = '📍 위치 미확인';
        }
        eventItem.appendChild(location);
        
        // 예산 소모
        const cost = document.createElement('div');
        cost.className = 'operator-event-cost';
        cost.textContent = `💰 예상 비용: ${event.budgetCost}%`;
        eventItem.appendChild(cost);
        
        // eventId 저장
        eventItem.dataset.eventId = event.id;
        
        // 클릭 이벤트 (사건 대응)
        eventItem.addEventListener('click', () => {
            // showEventResponseOptions는 Game 클래스에서 전역으로 노출해야 합니다.
            if (typeof window.showEventResponseOptions === 'function') {
                window.showEventResponseOptions(event);
            }
        });
        
        eventsList.appendChild(eventItem);
    });
}

// 오퍼레이터 UI 업데이트 (시간, 통계 등)
function updateOperatorUI(gameState, operatorActivity) {
    // 시간 표시 업데이트
    if (typeof updateOperatorTimeDisplay === 'function') {
        updateOperatorTimeDisplay(gameState, operatorActivity);
    }
    
    // 활성 사건 개수
    const activeEventsCount = document.getElementById('activeEventsCount');
    if (activeEventsCount) {
        const activeCount = gameState.activeEvents.filter(e => e.status === 'active').length;
        activeEventsCount.textContent = activeCount;
    }
    
    // 미해결 사건 개수 (실패한 사건)
    const failedEventsCount = document.getElementById('failedEventsCount');
    if (failedEventsCount) {
        const failedCount = gameState.activeEvents.filter(e => e.status === 'failed').length;
        failedEventsCount.textContent = failedCount;
    }
    
    // 해결된 사건 개수
    const resolvedEventsCount = document.getElementById('resolvedEventsCount');
    if (resolvedEventsCount) {
        const resolvedCount = gameState.activeEvents.filter(e => e.status === 'resolved').length;
        resolvedEventsCount.textContent = resolvedCount;
    }
}

