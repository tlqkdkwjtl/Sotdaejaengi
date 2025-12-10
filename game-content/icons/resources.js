// 자원 현황 아이콘 정보
// 아이콘 박스 클릭 시 표시될 정보를 정의합니다.
// 이 정보는 동적으로 생성되므로 템플릿 함수로 정의합니다.
function getResourcesInfo(gameState) {
    const resources = gameState.resources || {
        budget: 100,
        personnel: 100,
        equipment: 50
    };
    
    return {
        title: "자원 현황",
        sections: [
            {
                title: "예산 현황",
                text: `현재 예산: ${resources.budget.toFixed(1)}%\n\n예산이 부족하면 사건 처리가 제한됩니다.\n\n경찰 파견: 기본 비용의 1.5배\n드론 사용: 기본 비용의 1.2배\nCCTV 모니터링: 기본 비용의 0.5배`,
                description: "예산 현황입니다."
            },
            {
                title: "인력 현황",
                text: `현재 인력: ${resources.personnel}명\n\n인력은 경찰 파견 시 사용됩니다.`,
                description: "인력 현황입니다."
            },
            {
                title: "장비 현황",
                text: `현재 장비: ${resources.equipment}대\n\n장비는 드론과 CCTV 설치에 사용됩니다.`,
                description: "장비 현황입니다."
            }
        ]
    };
}

