// 사건 타입 정의
// 각 사건 규모별 예산 소모, 발생 확률, 최대 활성 개수 등을 정의합니다.
const EventTypesData = {
    small: {
        name: '소규모',
        budgetCostMin: 0.5, // 예산 소모 최소값 (%)
        budgetCostMax: 1.5, // 예산 소모 최대값 (%)
        occurrenceRate: 0.3, // 기본 발생 확률 (시간당)
        maxActive: 5 // 동시 활성 최대 개수
    },
    medium: {
        name: '중규모',
        budgetCostMin: 1.5,
        budgetCostMax: 3.0,
        occurrenceRate: 0.15,
        maxActive: 3
    },
    large: {
        name: '대규모',
        budgetCostMin: 3.0,
        budgetCostMax: 6.0,
        occurrenceRate: 0.05,
        maxActive: 2
    },
    mega: {
        name: '초대형',
        budgetCostMin: 6.0,
        budgetCostMax: 10.0,
        occurrenceRate: 0.01,
        maxActive: 1
    }
};

