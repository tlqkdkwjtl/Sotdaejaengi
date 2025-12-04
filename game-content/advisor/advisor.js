// AI 조언 시스템
// 게임 상태와 선택지를 분석하여 AI 조언을 생성합니다.

class AIAdvisor {
    static generateRecommendation(gameState, choice) {
        const impact = choice.impact;
        const recommendations = [];
        
        // 확률 계산
        let successRate = 70;
        if (gameState.resources.budget < 20) successRate -= 20; // 예산이 20% 미만이면 위험
        if (gameState.cityStats.stability < 50) successRate -= 15;
        
        recommendations.push(`성공 확률: ${successRate}%`);
        
        // 위험도 분석
        const risks = [];
        if (impact.bigCorp && impact.bigCorp.trust < 0) {
            risks.push(`대기업의 반발 가능성: ${Math.abs(impact.bigCorp.trust * 2)}%`);
        }
        if (impact.immigrants && impact.immigrants.trust < 0) {
            risks.push(`민족공동체의 반발 가능성: ${Math.abs(impact.immigrants.trust * 2)}%`);
        }
        if (impact.samulnori && impact.samulnori.trust < 0) {
            risks.push(`사물놀이의 반발 가능성: ${Math.abs(impact.samulnori.trust * 2)}%`);
        }
        if (impact.budget && impact.budget < -5) {
            risks.push(`예산 부족 위험 (${Math.abs(impact.budget)}% 소모)`);
        }
        
        if (risks.length > 0) {
            recommendations.push(`⚠ 위험: ${risks.join(', ')}`);
        }
        
        // 추천 여부
        const factionTension = Object.values(gameState.factions)
            .reduce((sum, f) => sum + f.tension, 0) / Object.keys(gameState.factions).length;
        
        if (factionTension > 60 && choice.impact[Object.keys(choice.impact)[0]]?.tension < 0) {
            recommendations.push(`✅ 추천: 파벌 긴장도 완화에 도움이 됩니다.`);
        } else if (gameState.cityStats.crimeRate > 50 && choice.impact.crimeRate < 0) {
            recommendations.push(`✅ 추천: 범죄율 감소에 효과적입니다.`);
        }
        
        return recommendations.join(' | ');
    }
}

