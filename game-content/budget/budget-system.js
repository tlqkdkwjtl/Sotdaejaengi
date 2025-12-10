// 예산 처리 시스템
// 사건 대응에 따른 예산 계산, 인물별 예산 처리 능력 적용 등을 정의합니다.

// 대응 타입별 예산 배수
const ResponseTypeBudgetMultipliers = {
    dispatch: 1.5,    // 경찰 파견: 기본 예산의 1.5배 (사람이 가장 비쌈)
    drone: 1.2,       // 드론 사용: 예산 20% 추가 소모
    cctv: 0.5,        // CCTV 모니터링: 예산 50% 절감 (가장 저렴)
    ignore: 0         // 무시: 예산 소모 없음
};

// 사건 대응에 따른 실제 예산 비용 계산
function calculateEventBudgetCost(event, responseType, personnel = null) {
    let actualBudgetCost = event.budgetCost;
    
    // 대응 타입에 따른 예산 조정
    if (ResponseTypeBudgetMultipliers.hasOwnProperty(responseType)) {
        actualBudgetCost *= ResponseTypeBudgetMultipliers[responseType];
    }
    
    // 인물별 예산 처리 능력 적용
    if (personnel && actualBudgetCost > 0 && personnel.budgetAbility) {
        // 예산 절감 적용
        if (personnel.budgetAbility.reduction > 0) {
            actualBudgetCost *= (1 - personnel.budgetAbility.reduction);
        }
        // 예산 추가 소모 적용
        if (personnel.budgetAbility.bonus > 0) {
            actualBudgetCost *= (1 + personnel.budgetAbility.bonus);
        }
    }
    
    return Math.max(0, actualBudgetCost);
}

// 예산 적용 (게임 상태에 예산 차감)
function applyBudgetCost(gameState, cost) {
    gameState.resources.budget = Math.max(0, Math.min(100, 
        gameState.resources.budget - cost
    ));
}

// 예산 확인 (예산이 충분한지 확인)
function checkBudgetSufficient(gameState, cost) {
    return gameState.resources.budget >= cost;
}

// 예산 %를 금액으로 변환하는 함수 (나중에 금액 추가 시 사용)
function getBudgetAmount(gameState, percent) {
    // budgetAmount가 정의되어 있으면 사용
    if (gameState.resources.budgetAmount) {
        return Math.round(gameState.resources.budgetAmount * (percent / 100));
    }
    // 없으면 null 반환 (아직 금액 시스템이 구현되지 않음)
    return null;
}

// 예산 표시 텍스트 생성
function formatBudgetDisplay(gameState) {
    const budgetPercent = Math.round(gameState.resources.budget);
    return `${budgetPercent}%`;
}

