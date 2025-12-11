// 초대형 사건 템플릿 시스템
// 초대형 사건은 스토리와 함께 정의되며, 첫 번째 주(1~7일)에는 발생하지 않습니다.

const MegaEventTemplates = [
    {
        title: "초대형 테러 사건",
        description: "도시 전역을 위협하는 대규모 테러 사건이 발생했습니다.",
        story: `경찰청 긴급 상황실에 연이어 신고가 들어왔다. 
        
"중앙 광장에서 폭발음이 들렸습니다!"
"시청 건물 주변에서 의심스러운 차량이 발견되었습니다!"
"지하철역에서 대피 명령이 내려졌습니다!"

도시 전역에 걸친 테러 계획이 실행되고 있었다. 
이것은 단순한 사건이 아니라, 도시 전체의 안전을 위협하는 초대형 사건이었다.

당신은 즉시 대응을 결정해야 한다.`,
        impact: { crimeRate: 10, stability: -15, factionTension: 8 },
        budgetCost: 8.0,
        minDay: 8 // 첫 번째 주 이후에만 발생
    },
    {
        title: "도시 전역 폭동",
        description: "도시 전역에 걸친 대규모 폭동이 발생했습니다.",
        story: `아침 뉴스에서 충격적인 소식이 전해졌다.

"시민들이 시청 앞에서 집회를 시작했습니다."
"집회가 점점 커지고 있습니다!"
"일부 시민들이 건물에 진입을 시도하고 있습니다!"

도시 전역으로 확산된 폭동은 단순한 시위가 아니었다.
각 구역에서 동시다발적으로 발생한 이 사건은 도시 전체의 안정을 위협했다.

당신은 신속하고 확실한 대응이 필요하다.`,
        impact: { crimeRate: 12, stability: -18, factionTension: 10 },
        budgetCost: 9.0,
        minDay: 8,
        // 파벌 연관 정보
        relatedFactions: ['immigrants', 'citizens', 'religion'], // 이주민 단체, 시민단체, 종교단체
        factionImpactType: 'riot' // 시위/폭동 타입
    },
    {
        title: "초대형 자연재해",
        description: "대규모 자연재해로 인한 피해가 발생했습니다.",
        story: `기상청에서 긴급 경보가 발령되었다.

"태풍이 예상보다 빠르게 접근하고 있습니다!"
"강풍과 폭우로 인한 피해가 예상됩니다!"
"주민 대피가 시급합니다!"

자연의 힘 앞에서 도시는 무력해 보였다.
하지만 신속한 대응으로 피해를 최소화할 수 있었다.

당신은 모든 자원을 동원하여 대응해야 한다.`,
        impact: { crimeRate: 5, stability: -12 },
        budgetCost: 10.0,
        minDay: 8
    },
    {
        title: "대규모 사이버 공격",
        description: "도시의 핵심 시스템을 타겟으로 한 대규모 사이버 공격이 발생했습니다.",
        story: `IT 부서에서 긴급 보고가 들어왔다.

"도시 전력 시스템에 이상이 감지되었습니다!"
"교통 신호등이 멈췄습니다!"
"은행 시스템이 마비되었습니다!"

도시의 핵심 인프라가 공격받고 있었다.
이것은 단순한 해킹이 아니라, 도시 전체의 기능을 마비시키려는 계획된 공격이었다.

당신은 전문가와 경찰을 동원하여 즉시 대응해야 한다.`,
        impact: { crimeRate: 8, stability: -10, factionTension: 5 },
        budgetCost: 9.5,
        minDay: 8,
        // 파벌 연관 정보
        relatedFactions: ['samulnori'], // 사물놀이
        factionImpactType: 'cyber', // 사이버 공격 타입 (도움 가능)
        canReceiveHelp: true // 사물놀이로부터 도움을 받을 수 있음
    },
    {
        title: "대규모 인질 사건",
        description: "여러 건물에서 동시에 발생한 대규모 인질 사건이 발생했습니다.",
        story: `경찰청에 연이어 긴급 신고가 들어왔다.

"은행에 무장 괴한들이 침입했습니다!"
"학교에서 인질이 발생했습니다!"
"병원에서도 비슷한 사건이 발생했습니다!"

도시 전역에서 동시다발적으로 발생한 인질 사건.
이것은 우연이 아니라 계획된 범죄였다.

당신은 모든 경찰력을 동원하여 인질들을 구출해야 한다.`,
        impact: { crimeRate: 15, stability: -20, factionTension: 12 },
        budgetCost: 11.0,
        minDay: 10 // 10일 이후에만 발생 (더 늦게)
    }
];

// 초대형 사건 발생 가능 여부 확인
function canGenerateMegaEvent(day) {
    // 첫 번째 주(1~7일)에는 발생하지 않음
    return day > 7;
}

// 랜덤 초대형 사건 선택 (날짜 조건 확인)
function getRandomMegaEvent(day) {
    if (!canGenerateMegaEvent(day)) {
        return null;
    }
    
    // 날짜 조건을 만족하는 사건만 필터링
    const availableEvents = MegaEventTemplates.filter(event => {
        return day >= (event.minDay || 8);
    });
    
    if (availableEvents.length === 0) {
        return null;
    }
    
    // 랜덤 선택
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

