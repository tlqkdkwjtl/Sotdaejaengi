// 사건 타입 정의
// 각 사건 규모별 예산 소모, 발생 확률, 최대 활성 개수, 쿨다운, 소프트캡 등을 정의합니다.
const EventTypesData = {
    small: {
        name: '소규모',
        budgetCostMin: 0.5, // 예산 소모 최소값 (%)
        budgetCostMax: 1.5, // 예산 소모 최대값 (%)
        occurrenceRate: 0.3, // 기본 발생 확률 (시간당)
        maxActive: 5, // 동시 활성 최대 개수
        cooldown: 1, // 쿨다운 시간 (시간) - 1시간 단위 게임이므로 최소 1시간
        softCapStart: 0.8, // 소프트캡 시작 비율 (maxActive의 80%)
        softCapReduction: 0.5 // 소프트캡 적용 시 확률 감소율 (50%)
    },
    medium: {
        name: '중규모',
        budgetCostMin: 1.5,
        budgetCostMax: 3.0,
        occurrenceRate: 0.15,
        maxActive: 3,
        cooldown: 2, // 2시간 쿨다운
        softCapStart: 0.8,
        softCapReduction: 0.5
    },
    large: {
        name: '대규모',
        budgetCostMin: 3.0,
        budgetCostMax: 6.0,
        occurrenceRate: 0.05,
        maxActive: 2,
        cooldown: 3, // 3시간 쿨다운
        softCapStart: 0.8,
        softCapReduction: 0.6 // 대규모는 더 강하게 감소 (60%)
    },
    mega: {
        name: '초대형',
        budgetCostMin: 6.0,
        budgetCostMax: 10.0,
        occurrenceRate: 0.01,
        maxActive: 1,
        cooldown: 6, // 6시간 쿨다운 (하루의 1/4)
        softCapStart: 1.0, // 초대형은 maxActive 도달 시만 감소
        softCapReduction: 0.8 // 초대형은 더 강하게 감소 (80%)
    }
};

