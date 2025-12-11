// 사건 발생 시스템
// 시간대별, 날짜별, 범죄율별 사건 발생 로직을 관리합니다.

/**
 * 사건 발생 시스템
 * @param {GameState} gameState - 게임 상태 객체
 * @returns {number} 생성된 사건 개수
 */
function generateEvents(gameState) {
    // EventTemplates 확인
    if (typeof EventTemplates === 'undefined') {
        console.warn('EventTemplates가 로드되지 않았습니다.');
        return 0;
    }
    
    // eventTypes 확인
    if (!gameState.eventTypes || Object.keys(gameState.eventTypes).length === 0) {
        console.warn('eventTypes가 초기화되지 않았습니다.');
        return 0;
    }
    
    const timeMultiplier = gameState.getEventRateMultiplier();
    
    // 날짜가 지날수록 사건 발생률 증가 (위험 리스크 증가)
    // 1일당 +3% 발생률 증가
    const dayMultiplier = 1 + ((gameState.day - 1) * 0.03);
    
    // 범죄율이 높을수록 사건 발생률 증가
    const avgCrimeRate = gameState.districts.reduce((sum, d) => sum + d.crimeLevel, 0) / gameState.districts.length;
    const crimeRateMultiplier = 1 + (avgCrimeRate * 0.01); // 범죄율 1%당 +1% 발생률
    
    let eventsGenerated = 0;
    let totalChance = 0;
    
    // 각 사건 타입별로 발생 확인
    Object.keys(gameState.eventTypes).forEach(type => {
        const eventType = gameState.eventTypes[type];
        if (!eventType) return;
        
        // 초대형 사건은 첫 번째 주에는 발생하지 않음
        if (type === 'mega') {
            if (typeof canGenerateMegaEvent === 'function' && !canGenerateMegaEvent(gameState.day)) {
                return; // 첫 번째 주에는 스킵
            }
        }
        
        // 현재 활성 사건 개수 확인 (활성 + 실패 사건 포함)
        const activeCount = gameState.activeEvents.filter(e => e.type === type && (e.status === 'active' || e.status === 'failed')).length;
        
        // 하드 캡: 최대 개수 도달 시 스킵
        if (activeCount >= eventType.maxActive) {
            return;
        }
        
        // 기본 발생 확률 계산 (시간대 배수 + 날짜 배수 + 범죄율 배수 적용)
        let occurrenceChance = eventType.occurrenceRate * timeMultiplier * dayMultiplier * crimeRateMultiplier;
        
        // 소프트캡 적용: 활성 사건이 많을수록 확률 감소
        const softCapThreshold = eventType.maxActive * (eventType.softCapStart || 0.8);
        if (activeCount >= softCapThreshold) {
            const reduction = eventType.softCapReduction || 0.5;
            occurrenceChance *= reduction;
        }
        
        // 쿨다운 적용: 최근 발생했으면 확률 감소
        const lastEvent = gameState.lastEventTime[type];
        if (lastEvent) {
            // 마지막 발생 시간으로부터 경과 시간 계산 (시간 단위)
            const hoursSinceLastEvent = (gameState.day - lastEvent.day) * 24 + (gameState.time - lastEvent.time);
            const cooldown = eventType.cooldown || 0;
            
            if (hoursSinceLastEvent < cooldown) {
                // 쿨다운 중이면 확률 30%로 감소
                occurrenceChance *= 0.3;
            }
        }
        
        totalChance += occurrenceChance;
        
        // 랜덤 발생 확인
        if (Math.random() < occurrenceChance) {
            let template = null;
            
            // 초대형 사건은 별도 템플릿에서 가져오기
            if (type === 'mega') {
                if (typeof getRandomMegaEvent === 'function') {
                    template = getRandomMegaEvent(gameState.day);
                    // 파벌 관계에 따른 규모 조정
                    if (template && typeof adjustMegaEventByFactions === 'function') {
                        template = adjustMegaEventByFactions(template, gameState);
                    }
                }
            } else {
                // 일반 사건은 기존 템플릿에서 가져오기
                const templates = EventTemplates[type] || [];
                template = templates.length > 0 
                    ? templates[Math.floor(Math.random() * templates.length)]
                    : null;
            }
            
            if (template) {
                const newEvent = gameState.createEvent(type, null, template);
                if (newEvent) {
                    // 초대형 사건은 파벌 이벤트처럼 즉시 UI 표시 (별도 처리)
                    if (type === 'mega') {
                        // 초대형 사건은 pending 상태로 설정하고 즉시 UI 표시
                        newEvent.status = 'pending';
                        gameState.activeEvents.push(newEvent);
                        // window.gameInstance를 통해 UI 표시
                        if (window.gameInstance && typeof window.gameInstance.showMegaEvent === 'function') {
                            // 다음 프레임에서 표시 (현재 실행 중인 코드 완료 후)
                            setTimeout(() => {
                                window.gameInstance.showMegaEvent(newEvent);
                            }, 100);
                        }
                    } else {
                        // 일반 사건은 active 상태로 추가
                        gameState.activeEvents.push(newEvent);
                    }
                    
                    eventsGenerated++;
                    
                    // 마지막 발생 시간 기록 (쿨다운 시스템용)
                    gameState.lastEventTime[type] = {
                        day: gameState.day,
                        time: gameState.time
                    };
                }
            }
        }
    });
    
    // 디버깅: 사건 생성 여부 확인
    console.log(`사건 생성 시도 - 시간: ${gameState.time}시, 배수: ${timeMultiplier.toFixed(2)}, 총 확률: ${totalChance.toFixed(2)}, 생성된 사건: ${eventsGenerated}개`);
    
    // 활성 사건이 없고 생성된 사건도 없으면 소규모 사건 강제 생성 (게임 진행을 위해)
    const activeCount = gameState.activeEvents.filter(e => e.status === 'active' || e.status === 'failed').length;
    if (activeCount === 0 && eventsGenerated === 0 && totalChance > 0) {
        const smallType = gameState.eventTypes.small;
        if (smallType) {
            const templates = EventTemplates.small || [];
            const template = templates.length > 0
                ? templates[Math.floor(Math.random() * templates.length)]
                : null;
            const newEvent = gameState.createEvent('small', null, template);
            if (newEvent) {
                gameState.activeEvents.push(newEvent);
                gameState.lastEventTime.small = { day: gameState.day, time: gameState.time }; // 강제 생성 시 쿨다운 기록
                console.log('활성 사건이 없어 소규모 사건을 강제 생성했습니다.');
                eventsGenerated++;
            }
        }
    }
    
    return eventsGenerated;
}

// 전역 함수로 노출 (GameState에서 호출하기 위해)
// 스크립트가 로드되자마자 즉시 할당
// try-catch로 감싸서 오류가 있어도 할당이 실행되도록 보장
try {
    if (typeof window !== 'undefined') {
        window.generateEvents = generateEvents;
        // 디버깅용 로그
        if (console && console.log) {
            console.log('generateEvents 함수가 window에 등록되었습니다.');
        }
    } else {
        console.error('window 객체를 찾을 수 없습니다.');
    }
} catch (error) {
    console.error('generateEvents 함수를 window에 등록하는 중 오류 발생:', error);
    // 오류가 있어도 함수는 할당 시도
    if (typeof window !== 'undefined' && typeof generateEvents === 'function') {
        window.generateEvents = generateEvents;
    }
}

