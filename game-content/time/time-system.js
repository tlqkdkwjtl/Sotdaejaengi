// 시간 시스템
// 게임 시간 진행, 시간대 구분, 출퇴근 시간 감지 등의 함수들을 정의합니다.

// 시간 진행 함수 (GameState에 추가될 메서드)
function advanceTime(gameState, hours = 1) {
    gameState.time += hours;
    if (gameState.time >= 24) {
        gameState.time = 0;
        gameState.day++;
    }
}

// 시간대 구분 (새벽, 오전, 낮, 오후, 저녁, 밤)
function getTimePeriod(time) {
    if (time >= 0 && time < 6) return 'dawn'; // 새벽 (0-5시)
    if (time >= 6 && time < 12) return 'morning'; // 오전 (6-11시)
    if (time >= 12 && time < 17) return 'afternoon'; // 오후 (12-16시)
    if (time >= 17 && time < 21) return 'evening'; // 저녁 (17-20시)
    return 'night'; // 밤 (21-23시)
}

// 출퇴근 시간 감지
function isRushHour(time) {
    // 출근 시간: 7-9시
    // 퇴근 시간: 17-19시
    return (time >= 7 && time < 9) || (time >= 17 && time < 19);
}

// 시간대별 사건 발생률 배수 계산
function getEventRateMultiplier(time) {
    const period = getTimePeriod(time);
    const isRush = isRushHour(time);
    
    // 기본 발생률 배수
    let multiplier = 1.0;
    
    // 시간대별 기본 배수
    switch(period) {
        case 'dawn': // 새벽: 낮은 활동, 낮은 발생률
            multiplier = 0.5;
            break;
        case 'morning': // 오전: 활동 증가
            multiplier = 1.2;
            break;
        case 'afternoon': // 오후: 높은 활동
            multiplier = 1.5;
            break;
        case 'evening': // 저녁: 활동 감소
            multiplier = 1.0;
            break;
        case 'night': // 밤: 특정 사건 증가
            multiplier = 1.3;
            break;
    }
    
    // 출퇴근 시간 추가 보정
    if (isRush) {
        multiplier *= 1.5; // 출퇴근 시간에는 교통 관련 사건 증가
    }
    
    return multiplier;
}

// 시간대별 설명 텍스트
function getTimeDescription(time) {
    const period = getTimePeriod(time);
    const isRush = isRushHour(time);
    
    const periodNames = {
        'dawn': '새벽',
        'morning': '오전',
        'afternoon': '오후',
        'evening': '저녁',
        'night': '밤'
    };
    
    let description = periodNames[period];
    if (isRush) {
        description += ' (출퇴근 시간)';
    }
    
    return description;
}

// 시간 표시 업데이트 (UI)
function updateTimeDisplay(gameState) {
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        const timeText = `Day ${gameState.day} - ${gameState.time}시`;
        const timeDescription = getTimeDescription(gameState.time);
        timeDisplay.textContent = timeText;
        timeDisplay.title = timeDescription; // 툴팁으로 시간대 설명 표시
    }
}

// 오퍼레이터 시간 표시 업데이트
function updateOperatorTimeDisplay(gameState, operatorActivity) {
    const timeDisplay = document.getElementById('operatorTimeDisplay');
    const endTimeDisplay = document.getElementById('operatorEndTime');
    
    if (timeDisplay) {
        timeDisplay.textContent = `${gameState.time}시`;
    }
    if (endTimeDisplay && operatorActivity) {
        endTimeDisplay.textContent = `${operatorActivity.endTime}시`;
    }
}

