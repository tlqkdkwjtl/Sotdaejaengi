// 게임 메시지 템플릿
// 게임 내에서 표시되는 모든 메시지 텍스트를 정의합니다.

const GameMessages = {
    // 오퍼레이터 활동 시작
    operatorStart: (day) => `Day ${day} 시작!\n오퍼레이터 활동을 시작합니다.`,
    
    // 예산 부족 경고
    budgetInsufficient: '예산이 부족합니다!',
    
    // 사건 처리 완료
    eventResolved: (responseName, cost) => `사건 처리 완료!\n\n대응 방법: ${responseName}\n예산 소모: ${cost.toFixed(1)}%`,
    
    // 플레이어 정보
    playerInfo: (player) => `${player.name} (${player.role})\n\n권한: ${player.authority}%\n\n도시 전체를 관리하는 최고 책임자입니다.`,
    
    // 기본 정보 (파일 로드 실패 시)
    infoUnavailable: {
        title: "정보",
        sections: [{
            text: "정보를 불러올 수 없습니다."
        }]
    },
    
    // 캐릭터 상세 정보
    characterDetails: (character, faction) => {
        let details = `${character.name} (${character.role})\n\n`;
        details += `효율성: ${character.efficiency}%\n`;
        if (character.faction && faction) {
            details += `파벌: ${faction.name}\n`;
            details += `파벌 신뢰도: ${faction.trust}%\n`;
            details += `파벌 긴장도: ${faction.tension}%`;
        } else {
            details += `파벌: 중립`;
        }
        return details;
    }
};

