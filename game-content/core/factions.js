// 파벌 정보
// 각 파벌의 초기 신뢰도, 긴장도, 이름, 대표 등을 정의합니다.
//
// 사용 위치:
// - js/Sotdaejaengi.js: GameState 클래스에서 파벌 데이터 초기화
// - game-content/events/faction-events.js: 파벌 이벤트 생성 시 사용
// - game-content/events/faction-event-ui.js: 파벌 이벤트 UI 표시 시 portraitUrl 사용
//
// 각 파벌 객체 속성:
// - trust: 초기 신뢰도 (0-100)
// - tension: 초기 긴장도 (0-100)
// - name: 파벌 한글 이름
// - representative: 파벌 대표 이름
// - englishName: 파벌 영문 이름
// - portraitUrl: 파벌 대표 초상화 이미지 경로 (faction-event-ui.js에서 사용)
const FactionsData = {
    bigCorp: { 
        trust: 50,        // 초기 신뢰도
        tension: 30,      // 초기 긴장도
        name: "기업경제협회",
        representative: "최수환",
        englishName: "Corporate Economic Association",
        portraitUrl: "images/Choi Suhwan_pon.png"  // 파벌 이벤트 UI에서 사용
    },
    citizens: { 
        trust: 60, 
        tension: 20, 
        name: "민족시민연대",
        representative: "이서연",
        englishName: "National Citizens Alliance",
        portraitUrl: "images/Lee Seoyeon.png"
    },
    immigrants: { 
        trust: 45, 
        tension: 40, 
        name: "민족공동체",
        representative: "이영철",
        englishName: "National Community",
        portraitUrl: "images/Lee Youngcheol(Ri Youngcheol).png"
    },
    religion: { 
        trust: 55, 
        tension: 25, 
        name: "범시민종교인평화협회",
        representative: "박도현",
        englishName: "Pan-Citizen Religious Peace Association",
        portraitUrl: "images/Bishop Protasius Dohyun Park.png"
    },
    samulnori: { 
        trust: 30, 
        tension: 60, 
        name: "사물놀이",
        representative: "윤하림",
        englishName: "Samulnori",
        portraitUrl: "images/Yoon Harim.png"
    }
};

