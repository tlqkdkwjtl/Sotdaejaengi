// 사건 대응 옵션 템플릿
// 사건 발생 시 플레이어가 선택할 수 있는 대응 방법들을 정의합니다.

const EventResponseOptions = [
    {
        type: 'dispatch',
        title: '경찰 파견',
        desc: '경찰을 직접 파견하여 사건을 처리합니다. 기본적인 대응 방법입니다.',
        costMultiplier: 1.0
    },
    {
        type: 'drone',
        title: '드론 사용',
        desc: '드론을 활용하여 사건을 모니터링하고 대응합니다. 빠르지만 비용이 더 듭니다.',
        costMultiplier: 1.2
    },
    {
        type: 'cctv',
        title: 'CCTV 모니터링',
        desc: '기존 CCTV를 활용하여 사건을 모니터링합니다. 비용이 절감되지만 효과가 제한적일 수 있습니다.',
        costMultiplier: 0.5
    },
    {
        type: 'ignore',
        title: '무시',
        desc: '사건을 무시합니다. 예산은 소모되지 않지만 범죄율과 안정도에 부정적 영향을 미칩니다.',
        costMultiplier: 0
    }
];

// 대응 방법 이름 매핑 (결과 메시지용)
const ResponseNames = {
    'dispatch': '경찰 파견',
    'drone': '드론 사용',
    'cctv': 'CCTV 모니터링',
    'ignore': '무시'
};

// 대응 방법별 비용 텍스트 생성 함수
function getResponseCostText(responseType, baseCost, actualCost) {
    const option = EventResponseOptions.find(opt => opt.type === responseType);
    if (!option) return `예산 소모: ${actualCost.toFixed(1)}%`;
    
    if (responseType === 'ignore') {
        return '예산 소모: 0% (영향 증가)';
    }
    
    if (responseType === 'drone') {
        return `예산 소모: ${actualCost.toFixed(1)}% (기본 +20%)`;
    }
    
    if (responseType === 'cctv') {
        return `예산 소모: ${actualCost.toFixed(1)}% (기본 -50%)`;
    }
    
    return `예산 소모: ${actualCost.toFixed(1)}%`;
}

