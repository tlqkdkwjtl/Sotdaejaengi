// 구역 정보 아이콘 정보
// 아이콘 박스 클릭 시 표시될 정보를 정의합니다.
// 이 정보는 동적으로 생성되므로 템플릿 함수로 정의합니다.
function getDistrictInfo(gameState) {
    return {
        title: "구역 정보",
        sections: gameState.districts.map(district => {
            const residentialText = `고소득층 ${district.residentialLevel.high}%, 중산층 ${district.residentialLevel.middle}%, 저소득층 ${district.residentialLevel.low}%`;
            const problemsText = district.problems.join(', ');
            
            return {
                title: district.name,
                text: `범죄율: ${district.crimeLevel}%\n\n특징: ${district.features}\n\n기업 분포: ${district.companyDistribution}\n\n주거 수준: ${residentialText}\n\n치안: 낮 - ${district.security.day}, 밤 - ${district.security.night}\n\n교통: ${district.traffic}\n\n주요 문제: ${problemsText}`,
                description: `${district.name}의 상세 정보입니다.`
            };
        })
    };
}

