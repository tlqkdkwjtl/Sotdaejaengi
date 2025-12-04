// 치안부 관련 콘텐츠
// 치안부 인물, 부서, 대사 등을 정의합니다. 여기에 텍스트를 추가/수정하면 됩니다.

// 치안부 인물 정보 (예산 처리 능력 포함)
// 이 데이터는 GameState.departments에서 사용됩니다.
const DepartmentPersonnel = {
    minister: {
        name: "이천호",
        role: "치안부 장관",
        efficiency: 75,
        faction: null,
        budgetAbility: {
            reduction: 0.05, // 예산 5% 절감 능력
            bonus: 0 // 추가 소모 없음
        },
        dialogues: {
            // TODO: 장관 대사 추가
        }
    },
    viceMinisters: [
        { 
            name: "김윤서", 
            role: "공안 차관", 
            efficiency: 70, 
            faction: "samulnori",
            budgetAbility: {
                reduction: 0.03, // 예산 3% 절감 (감시 효율)
                bonus: 0
            },
            dialogues: {
                // TODO: 공안 차관 대사 추가
            },
            directors: [
                { name: "최도현", role: "공안부장", efficiency: 70, faction: "samulnori", type: "surveillance", budgetAbility: { reduction: 0.02, bonus: 0 } },
                { name: "장미라", role: "공안부장", efficiency: 75, faction: "samulnori", type: "surveillance", budgetAbility: { reduction: 0.03, bonus: 0 } },
                { name: "한기석", role: "공안부장", efficiency: 68, faction: "samulnori", type: "surveillance", budgetAbility: { reduction: 0.01, bonus: 0 } }
            ]
        },
        { 
            name: "박수환", 
            role: "경찰 차관", 
            efficiency: 75, 
            faction: "bigCorp",
            budgetAbility: {
                reduction: 0, // 예산 절감 없음
                bonus: 0.1 // 예산 10% 추가 소모 (대규모 작전)
            },
            dialogues: {
                // TODO: 경찰 차관 대사 추가
            },
            directors: [
                { name: "오태준", role: "경찰부장", efficiency: 72, faction: "bigCorp", type: "police", budgetAbility: { reduction: 0, bonus: 0.05 } },
                { name: "윤세라", role: "경찰부장", efficiency: 78, faction: "bigCorp", type: "police", budgetAbility: { reduction: 0.01, bonus: 0 } },
                { name: "김도윤", role: "경찰부장", efficiency: 75, faction: "bigCorp", type: "police", budgetAbility: { reduction: 0, bonus: 0.03 } }
            ]
        },
        { 
            name: "이한솔", 
            role: "검문소 차관", 
            efficiency: 65, 
            faction: "immigrants",
            budgetAbility: {
                reduction: 0.02, // 예산 2% 절감
                bonus: 0
            },
            dialogues: {
                // TODO: 검문소 차관 대사 추가
            },
            directors: [
                { name: "박지훈", role: "검문소부장", efficiency: 70, faction: "immigrants", type: "checkpoint", budgetAbility: { reduction: 0.01, bonus: 0 } },
                { name: "최강호", role: "검문소부장", efficiency: 73, faction: "immigrants", type: "checkpoint", budgetAbility: { reduction: 0.02, bonus: 0 } },
                { name: "이서연", role: "검문소부장", efficiency: 68, faction: "immigrants", type: "checkpoint", budgetAbility: { reduction: 0.01, bonus: 0 } }
            ]
        }
    ]
};

// 치안부 부서별 설명
const DepartmentDescriptions = {
    surveillance: {
        name: "공안부",
        description: "감시 및 정보 수집을 담당하는 부서입니다.",
        specialties: ["CCTV 모니터링 효율 증가", "정보 수집 능력"]
    },
    police: {
        name: "경찰부",
        description: "경찰 파견 및 치안 유지를 담당하는 부서입니다.",
        specialties: ["경찰 파견 효율", "대규모 작전 능력"]
    },
    checkpoint: {
        name: "검문소부",
        description: "검문소 운영 및 통제를 담당하는 부서입니다.",
        specialties: ["검문소 운영 효율", "예산 절감 능력"]
    }
};

