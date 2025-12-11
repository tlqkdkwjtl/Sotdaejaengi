// 파벌 이벤트 템플릿 시스템
// 각 파벌별로 이벤트 템플릿을 정의합니다. 여기에 텍스트를 추가/수정하면 됩니다.
const FactionEventTemplates = {
    bigCorp: [
        {
            title: "기업경제협회의 세금 감면 요구",
            description: "기업경제협회 대표 최수환이 세금 감면을 요구하며 도시 관리부를 방문했습니다.",
            dialogue: "최수환: \"도시의 경제 발전을 위해서는 기업에 대한 지원이 필요합니다. 세금 감면을 통해 기업 경쟁력을 높여야 합니다.\"",
            options: [
                { text: "세금 감면 승인", impact: { bigCorp: { trust: +15, tension: -10 }, budget: -3 } },
                { text: "요구 거부", impact: { bigCorp: { trust: -15, tension: +15 } } },
                { text: "부분적 감면", impact: { bigCorp: { trust: +8, tension: -5 }, budget: -1.5 } }
            ]
        }
        // TODO: 나머지 기업경제협회 이벤트 템플릿 추가 (총 15개)
    ],
    citizens: [
        {
            title: "민족시민연대의 시민 참여 확대 요구",
            description: "민족시민연대 대표 이서연이 시민 참여 확대를 요구하며 도시 관리부를 방문했습니다.",
            dialogue: "이서연: \"시민의 목소리가 도시 정책에 반영되어야 합니다. 참여 기회를 확대해주세요.\"",
            options: [
                { text: "참여 확대", impact: { citizens: { trust: +15, tension: -10 }, budget: -2 } },
                { text: "거부", impact: { citizens: { trust: -15, tension: +15 } } },
                { text: "부분 확대", impact: { citizens: { trust: +8, tension: -5 }, budget: -1 } }
            ]
        }
        // TODO: 나머지 민족시민연대 이벤트 템플릿 추가 (총 15개)
    ],
    immigrants: [
        {
            title: "민족공동체의 이주민 권리 보호 요구",
            description: "민족공동체 대표 이영철이 이주민 권리 보호를 요구하며 도시 관리부를 방문했습니다.",
            dialogue: "이영철: \"이주민도 이 도시의 구성원입니다. 그들의 권리를 보호해야 합니다.\"",
            options: [
                { text: "권리 보호", impact: { immigrants: { trust: +20, tension: -15 }, bigCorp: { trust: -10, tension: +10 }, budget: -3 } },
                { text: "거부", impact: { immigrants: { trust: -20, tension: +20 } } },
                { text: "부분 보호", impact: { immigrants: { trust: +12, tension: -8 }, bigCorp: { trust: -5, tension: +5 }, budget: -1.5 } }
            ]
        }
        // TODO: 나머지 민족공동체 이벤트 템플릿 추가 (총 15개)
    ],
    religion: [
        {
            title: "범시민종교인평화협회의 도덕 교육 요구",
            description: "범시민종교인평화협회 대표 박도현이 도덕 교육 강화를 요구하며 도시 관리부를 방문했습니다.",
            dialogue: "박도현: \"도덕 교육은 건강한 사회의 기반입니다. 학교에서 도덕 교육을 강화해주세요.\"",
            options: [
                { text: "교육 강화", impact: { religion: { trust: +18, tension: -12 }, citizens: { trust: +5, tension: -5 }, budget: -2 } },
                { text: "거부", impact: { religion: { trust: -12, tension: +12 } } },
                { text: "부분 강화", impact: { religion: { trust: +10, tension: -6 }, citizens: { trust: +3, tension: -3 }, budget: -1 } }
            ]
        }
        // TODO: 나머지 범시민종교인평화협회 이벤트 템플릿 추가 (총 15개)
    ],
    samulnori: [
        {
            title: "사물놀이의 정보 자유화 요구",
            description: "사물놀이 대표 윤하림이 정보 자유화를 요구하며 도시 관리부를 방문했습니다.",
            dialogue: "윤하림: \"정보는 모든 사람의 권리입니다. 정보 자유화가 필요합니다.\"",
            options: [
                { text: "자유화 추진", impact: { samulnori: { trust: +20, tension: -15 }, citizens: { trust: +10, tension: -10 }, bigCorp: { trust: -5, tension: +5 } } },
                { text: "거부", impact: { samulnori: { trust: -20, tension: +20 } } },
                { text: "부분 자유화", impact: { samulnori: { trust: +12, tension: -8 }, citizens: { trust: +5, tension: -5 }, bigCorp: { trust: -3, tension: +3 } } }
            ]
        }
        // TODO: 나머지 사물놀이 이벤트 템플릿 추가 (총 15개)
    ]
};

