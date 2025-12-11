// 상태 기반 뉴스 시스템
// 게임 상태(안정도, 범죄율, 파벌 긴장도 등)에 따라 자동으로 생성되는 뉴스를 정의합니다.

// 상태 기반 뉴스 생성 함수
function generateStatusNews(gameState) {
    const statusNews = [];
    
    // 기본 상태 뉴스
    statusNews.push({
        title: "도시 안정도 보고",
        content: `현재 도시 안정도는 ${Math.round(gameState.cityStats.stability)}%입니다.`,
        fullContent: `현재 도시 안정도는 ${Math.round(gameState.cityStats.stability)}%입니다.\n\n도시의 전반적인 안정 상태를 나타내는 지표입니다.`,
        day: gameState.day
    });
    
    statusNews.push({
        title: "범죄율 현황",
        content: `전체 범죄율은 ${Math.round(gameState.cityStats.crimeRate)}%로 집계되었습니다.`,
        fullContent: `전체 범죄율은 ${Math.round(gameState.cityStats.crimeRate)}%로 집계되었습니다.\n\n각 구역별 범죄 발생 현황을 종합한 수치입니다.`,
        day: gameState.day
    });
    
    // 긴장도가 높은 파벌 뉴스 추가
    Object.keys(gameState.factions).forEach(factionKey => {
        const faction = gameState.factions[factionKey];
        if (faction.tension > 50) {
            statusNews.push({
                title: `${faction.name} 긴장도 상승`,
                content: `${faction.name}의 긴장도가 ${faction.tension}%로 높은 수준입니다.`,
                fullContent: `${faction.name}의 긴장도가 ${faction.tension}%로 높은 수준입니다.\n\n이에 대한 대응이 필요할 수 있습니다.`,
                day: gameState.day
            });
        }
    });
    
    // 시민 만족도 뉴스
    if (gameState.cityStats.citizenSatisfaction < 50) {
        statusNews.push({
            title: "시민 만족도 하락",
            content: `시민 만족도가 ${Math.round(gameState.cityStats.citizenSatisfaction)}%로 낮은 수준입니다.`,
            fullContent: `시민 만족도가 ${Math.round(gameState.cityStats.citizenSatisfaction)}%로 낮은 수준입니다.\n\n시민들의 불만이 증가하고 있습니다.`,
            day: gameState.day
        });
    } else if (gameState.cityStats.citizenSatisfaction > 70) {
        statusNews.push({
            title: "시민 만족도 상승",
            content: `시민 만족도가 ${Math.round(gameState.cityStats.citizenSatisfaction)}%로 높은 수준입니다.`,
            fullContent: `시민 만족도가 ${Math.round(gameState.cityStats.citizenSatisfaction)}%로 높은 수준입니다.\n\n시민들이 도시 관리에 만족하고 있습니다.`,
            day: gameState.day
        });
    }
    
    // 예산 부족 경고
    if (gameState.resources.budget < 20) {
        statusNews.push({
            title: "예산 부족 경고",
            content: `현재 예산이 ${Math.round(gameState.resources.budget)}%로 위험 수준입니다.`,
            fullContent: `현재 예산이 ${Math.round(gameState.resources.budget)}%로 위험 수준입니다.\n\n예산 관리에 주의가 필요합니다.`,
            day: gameState.day
        });
    }
    
    return statusNews;
}

