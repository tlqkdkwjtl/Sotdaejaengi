// 자원 관리 시스템
// 경찰 파견 가능 인원, 드론 보유 대수, CCTV 설치 현황 등을 관리합니다.

// 자원 정보 가져오기
function getResourceManagementInfo(gameState) {
    const resources = gameState.resources || {
        budget: 100,
        personnel: 100,
        police: 6,
        drones: 8,
        equipment: 50
    };
    
    // 사용 가능한 경찰 수 (전체 - 파견 중)
    const totalPolice = resources.police || 0;
    const availablePolice = (typeof getAvailablePoliceCount === 'function')
        ? getAvailablePoliceCount(gameState)
        : totalPolice;
    const deployedPolice = totalPolice - availablePolice;
    
    // 사용 가능한 드론 수 (전체 - 사용 중)
    const totalDrones = resources.drones || 0;
    const availableDrones = (typeof getAvailableDroneCount === 'function')
        ? getAvailableDroneCount(gameState)
        : totalDrones;
    const deployedDrones = totalDrones - availableDrones;
    
    // CCTV 설치 현황 (equipment 기반)
    const installedCCTV = Math.floor((resources.equipment || 0) * 0.5); // 장비의 50%가 CCTV
    
    return {
        title: "자원 관리",
        sections: [
            {
                title: "경찰 차량 현황",
                text: `전체 경찰 차량: ${totalPolice}대\n사용 가능: ${availablePolice}대\n파견 중: ${deployedPolice}대\n최대 보유: 10대\n\n경찰 파견 시 차량이 소모되며, 복귀 시간이 지나면 다시 사용 가능합니다.\n자원이 부족하면 사건 처리가 불가능할 수 있습니다.\n\n💡 예산을 소모하여 경찰 차량을 추가할 수 있습니다.\n(경찰 차량 1대 추가: 예산 5% 소모)`,
                description: "경찰 차량 현황입니다."
            },
            {
                title: "드론 보유 현황",
                text: `전체 드론: ${totalDrones}대\n사용 가능: ${availableDrones}대\n사용 중: ${deployedDrones}대\n최대 보유: 20대\n\n드론 사용 시 대수가 소모되며, 복귀 시간이 지나면 다시 사용 가능합니다.\n자원이 부족하면 드론 사용이 제한됩니다.\n\n💡 예산을 소모하여 드론을 추가할 수 있습니다.\n(드론 1대 추가: 예산 3% 소모)`,
                description: "드론 보유 현황입니다."
            },
            {
                title: "CCTV 설치 현황",
                text: `현재 설치된 CCTV: ${installedCCTV}대\n\n전체 장비: ${resources.equipment || 0}대\n\nCCTV는 설치 비용이 저렴하지만 효과가 제한적일 수 있습니다.`,
                description: "CCTV 설치 현황입니다."
            }
        ]
    };
}

