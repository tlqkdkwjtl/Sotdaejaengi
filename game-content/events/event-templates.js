// 사건 템플릿 시스템
// 각 규모별로 사건 템플릿을 정의합니다.
const EventTemplates = {
    small: [
        {
            title: "소규모 절도 사건",
            description: "상점에서 소액 절도가 발생했습니다.",
            impact: { crimeRate: 1, stability: -0.5 },
            budgetCost: 0.8
        },
        {
            title: "교통 사고",
            description: "경미한 교통 사고가 발생했습니다.",
            impact: { stability: -0.3 },
            budgetCost: 0.5
        },
        {
            title: "소음 민원",
            description: "주거 지역에서 소음 민원이 접수되었습니다.",
            impact: { stability: -0.2 },
            budgetCost: 0.3
        },
        {
            title: "불법 주차",
            description: "주요 도로에 불법 주차가 발생했습니다.",
            impact: { stability: -0.2 },
            budgetCost: 0.4
        },
        {
            title: "작은 화재",
            description: "작은 규모의 화재가 발생했습니다.",
            impact: { crimeRate: 0.5, stability: -0.5 },
            budgetCost: 1.0
        },
        {
            title: "음주 난동",
            description: "유흥가에서 음주 난동이 발생했습니다.",
            impact: { crimeRate: 1.5, stability: -0.8 },
            budgetCost: 0.7
        },
        {
            title: "불법 광고물",
            description: "불법 광고물이 다수 발견되었습니다.",
            impact: { stability: -0.3 },
            budgetCost: 0.4
        },
        {
            title: "작은 싸움",
            description: "공공장소에서 작은 싸움이 발생했습니다.",
            impact: { crimeRate: 0.8, stability: -0.4 },
            budgetCost: 0.6
        },
        {
            title: "무단 침입 시도",
            description: "주거 지역에서 무단 침입 시도가 있었습니다.",
            impact: { crimeRate: 1.2, stability: -0.6 },
            budgetCost: 0.9
        },
        {
            title: "교통 신호 고장",
            description: "교통 신호등이 고장났습니다.",
            impact: { stability: -0.3 },
            budgetCost: 0.5
        },
        {
            title: "불법 쓰레기 투기",
            description: "대량의 불법 쓰레기 투기가 발견되었습니다.",
            impact: { stability: -0.4 },
            budgetCost: 0.6
        },
        {
            title: "작은 시위",
            description: "소규모 시위가 발생했습니다.",
            impact: { stability: -0.5, factionTension: 0.5 },
            budgetCost: 0.7
        },
        {
            title: "공원 파손",
            description: "공원 시설이 파손되었습니다.",
            impact: { stability: -0.3 },
            budgetCost: 0.5
        },
        {
            title: "불법 노점",
            description: "불법 노점상이 발견되었습니다.",
            impact: { stability: -0.2 },
            budgetCost: 0.4
        },
        {
            title: "야간 소음",
            description: "야간 시간대에 큰 소음이 발생했습니다.",
            impact: { stability: -0.3 },
            budgetCost: 0.4
        }
    ],
    medium: [
        {
            title: "강도 사건",
            description: "상점에서 강도 사건이 발생했습니다.",
            impact: { crimeRate: 3, stability: -2 },
            budgetCost: 2.0
        },
        {
            title: "대규모 교통 사고",
            description: "다중 차량 사고가 발생했습니다.",
            impact: { crimeRate: 1, stability: -1.5 },
            budgetCost: 1.8
        },
        {
            title: "화재 사건",
            description: "건물 화재가 발생했습니다.",
            impact: { crimeRate: 2, stability: -2.5 },
            budgetCost: 2.5
        },
        {
            title: "폭행 사건",
            description: "심각한 폭행 사건이 발생했습니다.",
            impact: { crimeRate: 2.5, stability: -1.8 },
            budgetCost: 2.2
        },
        {
            title: "마약 거래 적발",
            description: "마약 거래가 적발되었습니다.",
            impact: { crimeRate: 2, stability: -1.5, factionTension: 1 },
            budgetCost: 2.0
        },
        {
            title: "집단 싸움",
            description: "대규모 집단 싸움이 발생했습니다.",
            impact: { crimeRate: 2.5, stability: -2 },
            budgetCost: 2.3
        },
        {
            title: "불법 집회",
            description: "허가 없는 대규모 집회가 발생했습니다.",
            impact: { stability: -1.5, factionTension: 1.5 },
            budgetCost: 1.8
        },
        {
            title: "산업재해",
            description: "공장에서 산업재해가 발생했습니다.",
            impact: { crimeRate: 1.5, stability: -2, factionTension: 1 },
            budgetCost: 2.5
        }
    ],
    large: [
        {
            title: "대규모 강도 사건",
            description: "은행 강도 사건이 발생했습니다.",
            impact: { crimeRate: 5, stability: -4 },
            budgetCost: 4.0
        },
        {
            title: "대형 화재",
            description: "대규모 건물 화재가 발생했습니다.",
            impact: { crimeRate: 3, stability: -5 },
            budgetCost: 5.0
        },
        {
            title: "폭동 사건",
            description: "대규모 폭동이 발생했습니다.",
            impact: { crimeRate: 6, stability: -6, factionTension: 3 },
            budgetCost: 5.5
        },
        {
            title: "테러 시도",
            description: "테러 시도가 적발되었습니다.",
            impact: { crimeRate: 4, stability: -7, factionTension: 4 },
            budgetCost: 6.0
        },
        {
            title: "대규모 마약 단속",
            description: "대규모 마약 조직이 적발되었습니다.",
            impact: { crimeRate: 3, stability: -3, factionTension: 2 },
            budgetCost: 4.5
        }
    ],
    mega: [
        {
            title: "초대형 테러 사건",
            description: "도시 전역을 위협하는 대규모 테러 사건이 발생했습니다.",
            impact: { crimeRate: 10, stability: -15, factionTension: 8 },
            budgetCost: 8.0
        },
        {
            title: "도시 전역 폭동",
            description: "도시 전역에 걸친 대규모 폭동이 발생했습니다.",
            impact: { crimeRate: 12, stability: -18, factionTension: 10 },
            budgetCost: 9.0
        },
        {
            title: "초대형 자연재해",
            description: "대규모 자연재해로 인한 피해가 발생했습니다.",
            impact: { crimeRate: 5, stability: -12 },
            budgetCost: 10.0
        }
    ]
};

