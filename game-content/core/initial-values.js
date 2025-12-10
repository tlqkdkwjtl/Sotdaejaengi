// 게임 초기값 설정
// 게임 시작 시의 자원, 도시 통계, 플레이어 정보 등을 정의합니다.

// 초기 자원 값
const InitialResources = {
    budget: 100, // 예산 % (100% = 전체 예산)
    // budgetAmount: 50000000000, // 전체 예산 금액 (500억원) - 나중에 금액 추가 시 사용
    personnel: 100, // 전체 인력 (일반 업무용)
    police: 5, // 경찰 차량 수 (초기 5대)
    drones: 8, // 드론 보유 대수 (7~10대 중 8대)
    equipment: 50 // 기타 장비
};

// 초기 도시 통계
const InitialCityStats = {
    stability: 70,
    crimeRate: 30,
    citizenSatisfaction: 60,
    factionTension: 40
};

// 플레이어 정보
const InitialPlayer = {
    name: "플레이어",
    role: "도시 관리자",
    authority: 100
};

