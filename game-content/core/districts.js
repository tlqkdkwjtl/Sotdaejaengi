// 도시 구역 정보
// 각 구역의 특징, 기업 분포, 주거 수준, 치안, 교통, 문제점 등을 정의합니다.
const CityDistricts = [
    {
        name: "중앙 행정·금융·상업 구역",
        type: "central",
        crimeLevel: 20,
        x: 0.15,
        y: 0.3,
        features: "시청, 금융기관, 대기업 본사, 주요 백화점·문화시설 밀집",
        companyDistribution: "대기업 비율 높음, 중견기업 일부, 소기업은 상권 중심",
        residentialLevel: { high: 40, middle: 40, low: 20 },
        security: { day: "안정적", night: "유흥업소·상권으로 사건 발생률 높음" },
        traffic: "지하철 환승역·버스 터미널 밀집 → 출퇴근 시간 극심한 혼잡",
        problems: ["기업 로비", "행정 압박", "야간 치안 악화(유흥가 사건)"]
    },
    {
        name: "동부 산업·제조 구역",
        type: "industrial",
        crimeLevel: 25,
        x: 0.7,
        y: 0.4,
        features: "제조업 단지, 발전소, 공장 밀집",
        companyDistribution: "중견기업·소기업 중심, 일부 대기업 하청 구조",
        residentialLevel: { high: 5, middle: 55, low: 40 },
        security: { day: "안정적", night: "안정적 (노동자 밀집 → 공동체적 감시 작동)" },
        traffic: "출퇴근 시간 교통 혼잡 심각 (노동자 대규모 이동)",
        problems: ["산업재해(낮·밤 모두 발생 가능)", "노동 갈등(임금·근로조건 문제)", "불법 거래(야간에도 발생, 노동자 대상)", "생활형 상권 활발, 밤에도 운영"]
    },
    {
        name: "서부 재개발·낙후 구역",
        type: "redevelopment",
        crimeLevel: 40,
        x: 0.1,
        y: 0.6,
        features: "오래된 주거지, 쪽방촌, 재개발 혼합지대",
        companyDistribution: "소기업·영세 자영업 중심",
        residentialLevel: { high: 5, middle: 35, low: 60 },
        security: { day: "불안정", night: "불안정 (빈민층·불법 활동)" },
        traffic: "의외로 교통 허브 근처에 위치 → 접근성은 좋음",
        problems: ["범죄율 상승", "질병 유행", "재개발 갈등", "산업재해·노동 갈등·불법 거래도 발생 (저임금 노동자·비공식 산업 활동)"]
    },
    {
        name: "남부 생활·교육 구역",
        type: "residential",
        crimeLevel: 15,
        x: 0.5,
        y: 0.8,
        features: "학교, 병원, 중형 상업시설, 일반 아파트 단지",
        companyDistribution: "중견기업·소기업 중심, 교육·복지 관련 기업 존재",
        residentialLevel: { high: 20, middle: 55, low: 25 },
        security: { day: "비교적 안정적", night: "비교적 안정적" },
        traffic: "출퇴근·통학 시간 혼잡",
        problems: ["입시 경쟁", "교통 혼잡", "의료 서비스 불만"]
    },
    {
        name: "북부 외곽·물류 구역",
        type: "logistics",
        crimeLevel: 30,
        x: 0.5,
        y: 0.1,
        features: "항만, 공항, 대형 물류센터, 외곽 고속도로 연결",
        companyDistribution: "물류 대기업, 운송 중견기업, 소규모 하청업체",
        residentialLevel: { high: 5, middle: 25, low: 70 },
        security: { day: "물류 활동으로 안정적", night: "외부 세력 유입으로 불안정" },
        traffic: "물류 차량 집중 → 상시 혼잡, 특히 출퇴근·야간 물류 시간대",
        problems: ["물류 마비", "교통 체증", "외부 세력 유입"]
    },
    {
        name: "외곽 이주민·난민촌",
        type: "refugee",
        crimeLevel: 60,
        x: 0.9,
        y: 0.7,
        features: "도시 외곽 비공식 정착지, 난민·불법 체류자·외부 유입 인구 거주",
        companyDistribution: "거의 없음, 일부 불법 노동·비공식 상권 존재",
        residentialLevel: { high: 0, middle: 10, low: 90 },
        security: { day: "불안정", night: "불안정 (시위, 무장 집단 충돌 가능성)" },
        traffic: "대중교통 접근성 낮음, 일부 버스 노선만 연결",
        problems: ["전염병 확산", "난민 시위", "무장 집단 충돌", "기업 불법 노동 착취 폭로"]
    }
];

