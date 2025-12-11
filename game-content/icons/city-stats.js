// 도시 통계 아이콘 정보
// 아이콘 박스 클릭 시 표시될 정보를 정의합니다.
// 동적 정보가 필요하므로 함수로 정의합니다.
function getCityStatsInfo(gameState) {
    return {
        title: "도시 통계",
        sections: [
            {
                title: "현재 상태",
                text: `Day ${gameState.day} - 도시 관리 현황`,
                description: "도시의 전반적인 통계 정보를 확인할 수 있습니다."
            },
            {
                title: "안정도 그래프",
                graph: true,
                description: "도시 안정도 추이를 그래프로 확인합니다."
            }
        ]
    };
}

