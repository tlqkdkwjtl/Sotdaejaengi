// 초대형 사건 파벌 관계 조정 시스템
// 파벌 관계에 따라 초대형 사건의 규모와 영향을 조정합니다.

/**
 * 파벌 관계에 따른 초대형 사건 규모 조정
 * @param {Object} eventTemplate - 초대형 사건 템플릿
 * @param {Object} gameState - 게임 상태 객체
 * @returns {Object} 조정된 사건 객체 (impact, budgetCost 등이 조정됨)
 */
function adjustMegaEventByFactions(eventTemplate, gameState) {
    if (!eventTemplate.relatedFactions || !gameState.factions) {
        return eventTemplate; // 파벌 연관이 없으면 그대로 반환
    }
    
    const adjustedEvent = JSON.parse(JSON.stringify(eventTemplate)); // 깊은 복사
    
    // 시위/폭동 타입
    if (eventTemplate.factionImpactType === 'riot') {
        return adjustRiotEvent(adjustedEvent, gameState);
    }
    
    // 사이버 공격 타입
    if (eventTemplate.factionImpactType === 'cyber') {
        return adjustCyberEvent(adjustedEvent, gameState);
    }
    
    return adjustedEvent;
}

/**
 * 시위/폭동 사건 조정
 * @param {Object} event - 사건 객체
 * @param {Object} gameState - 게임 상태 객체
 * @returns {Object} 조정된 사건 객체
 */
function adjustRiotEvent(event, gameState) {
    const relatedFactions = event.relatedFactions || [];
    if (relatedFactions.length === 0) return event;
    
    // 관련 파벌들의 신뢰도 확인
    let allBad = true; // 모든 파벌과 관계가 나쁨
    let anyGood = false; // 하나라도 관계가 좋음
    
    relatedFactions.forEach(factionKey => {
        const faction = gameState.factions[factionKey];
        if (faction) {
            // 신뢰도가 낮고 긴장도가 높으면 관계가 나쁨
            const isBad = faction.trust < 40 || faction.tension > 60;
            const isGood = faction.trust > 60 && faction.tension < 40;
            
            if (isGood) {
                allBad = false;
                anyGood = true;
            } else if (!isBad) {
                allBad = false;
            }
        }
    });
    
    // 모든 파벌과 관계가 나쁨 → 규모 3배 증가
    if (allBad) {
        event.impact.crimeRate = (event.impact.crimeRate || 0) * 3.0; // 3배 증가
        event.impact.stability = (event.impact.stability || 0) * 3.0; // 3배 증가 (음수이므로 더 큰 손실)
        event.impact.factionTension = (event.impact.factionTension || 0) * 2.5; // 2.5배 증가
        event.budgetCost = (event.budgetCost || 0) * 2.0; // 2배 증가
        event.story += `\n\n⚠⚠⚠ 심각한 경고: 관련 파벌 3개 모두와의 관계가 악화되어 시위 규모가 3배로 폭증했습니다! 도시 전체가 위험에 처했습니다!`;
    }
    // 하나라도 관계가 좋음 → 규모 감소
    else if (anyGood) {
        event.impact.crimeRate = (event.impact.crimeRate || 0) * 0.7; // 30% 감소
        event.impact.stability = (event.impact.stability || 0) * 0.7; // 30% 감소 (음수이므로 손실 감소)
        event.impact.factionTension = (event.impact.factionTension || 0) * 0.8; // 20% 감소
        event.budgetCost = (event.budgetCost || 0) * 0.9; // 10% 감소
        event.story += `\n\n✅ 다행히 일부 파벌과의 좋은 관계로 인해 시위 규모가 줄어들었습니다.`;
    }
    
    return event;
}

/**
 * 사이버 공격 사건 조정
 * @param {Object} event - 사건 객체
 * @param {Object} gameState - 게임 상태 객체
 * @returns {Object} 조정된 사건 객체
 */
function adjustCyberEvent(event, gameState) {
    const relatedFactions = event.relatedFactions || [];
    if (relatedFactions.length === 0) return event;
    
    // 사물놀이와의 관계 확인
    const samulnori = gameState.factions.samulnori;
    if (!samulnori) return event;
    
    const trust = samulnori.trust || 0;
    const tension = samulnori.tension || 0;
    
    // 관계가 나쁨 (신뢰도 낮고 긴장도 높음) → 규모 증가
    if (trust < 40 || tension > 60) {
        event.impact.crimeRate = (event.impact.crimeRate || 0) * 1.4; // 40% 증가
        event.impact.stability = (event.impact.stability || 0) * 1.4; // 40% 증가
        event.impact.factionTension = (event.impact.factionTension || 0) * 1.2; // 20% 증가
        event.budgetCost = (event.budgetCost || 0) * 1.2; // 20% 증가
        event.story += `\n\n⚠ 경고: 사물놀이와의 관계 악화로 인해 공격 규모가 더욱 커졌습니다!`;
        event.samulnoriHelp = false; // 도움 없음
    }
    // 관계가 좋음 (신뢰도 높고 긴장도 낮음) → 규모 감소 + 도움
    else if (trust > 60 && tension < 40 && event.canReceiveHelp) {
        event.impact.crimeRate = (event.impact.crimeRate || 0) * 0.6; // 40% 감소
        event.impact.stability = (event.impact.stability || 0) * 0.6; // 40% 감소
        event.impact.factionTension = (event.impact.factionTension || 0) * 0.7; // 30% 감소
        event.budgetCost = (event.budgetCost || 0) * 0.8; // 20% 감소
        event.story += `\n\n✅ 사물놀이가 사이버 공격 대응에 도움을 주었습니다! 공격 규모가 크게 줄어들었습니다.`;
        event.samulnoriHelp = true; // 도움 받음
    }
    // 중간 관계 → 약간 감소
    else {
        event.impact.crimeRate = (event.impact.crimeRate || 0) * 0.9; // 10% 감소
        event.impact.stability = (event.impact.stability || 0) * 0.9; // 10% 감소
        event.budgetCost = (event.budgetCost || 0) * 0.95; // 5% 감소
        event.samulnoriHelp = false; // 도움 없음
    }
    
    return event;
}

