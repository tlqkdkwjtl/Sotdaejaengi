// 자원 현황 아이콘 정보
// 아이콘 박스 클릭 시 표시될 정보를 정의합니다.
// 이 정보는 동적으로 생성되므로 템플릿 함수로 정의합니다.
function getResourcesInfo(gameState) {
    return {
        title: "자원 현황",
        sections: [
            {
                title: "자원 관리",
                text: `예산: ${gameState.resources.budget.toLocaleString()}%\n인력: ${gameState.resources.personnel}\n장비: ${gameState.resources.equipment}`,
                description: "현재 보유 자원을 확인합니다."
            }
        ]
    };
}

