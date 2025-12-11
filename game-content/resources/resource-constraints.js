// 자원 제약 시스템
// 경찰 파견, 드론 사용에 대한 제약 조건을 정의합니다.

// 사건 규모별 자원 소모량 정의
const EventResourceCost = {
    small: {
        police: { min: 1, max: 2 }, // 경찰 1~2대
        drone: 0, // 드론 사용 없음
        returnTime: 1 // 복귀 시간 1시간
    },
    medium: {
        police: { min: 2, max: 2 }, // 경찰 2대
        drone: 1, // 드론 1대
        returnTime: 3 // 복귀 시간 3시간
    },
    large: {
        police: { min: 3, max: 3 }, // 경찰 3대
        drone: 2, // 드론 2대
        returnTime: 5 // 복귀 시간 5시간
    },
    mega: {
        // 초대형은 파벌 이벤트처럼 처리되므로 여기서는 정의하지 않음
        // 별도의 UI에서 선택지로 처리
        police: { min: 5, max: 7 }, // 경찰 5~7대 (선택에 따라)
        drone: { min: 3, max: 5 }, // 드론 3~5대 (선택에 따라)
        returnTime: 8 // 복귀 시간 8시간
    }
};

// 경찰 손실 확률 (디스토피아 컨셉)
const PoliceCasualtyRates = {
    small: 0.02, // 소규모: 2% 확률로 경찰 1명 손실
    medium: 0.05, // 중규모: 5% 확률로 경찰 1~2명 손실
    large: 0.10, // 대규모: 10% 확률로 경찰 2~3명 손실
    mega: 0.20 // 초대형: 20% 확률로 경찰 3~5명 손실
};

// 자원 소모량 계산 (사건 타입별)
function calculateResourceCost(eventType) {
    const cost = EventResourceCost[eventType];
    if (!cost) return null;
    
    // 랜덤 경찰 수 (min~max)
    const policeCount = cost.police 
        ? cost.police.min + Math.floor(Math.random() * (cost.police.max - cost.police.min + 1))
        : 0;
    
    return {
        police: policeCount,
        drone: cost.drone || 0,
        returnTime: cost.returnTime || 1
    };
}

// 경찰 손실 계산 (디스토피아 컨셉)
function calculatePoliceCasualty(eventType, policeDeployed) {
    const casualtyRate = PoliceCasualtyRates[eventType];
    if (!casualtyRate) return 0;
    
    // 확률 체크
    if (Math.random() < casualtyRate) {
        // 사건 규모에 따라 손실량 결정
        switch(eventType) {
            case 'small':
                return 1; // 1명 손실
            case 'medium':
                return 1 + Math.floor(Math.random() * 2); // 1~2명 손실
            case 'large':
                return 2 + Math.floor(Math.random() * 2); // 2~3명 손실
            case 'mega':
                return 3 + Math.floor(Math.random() * 3); // 3~5명 손실
            default:
                return 0;
        }
    }
    
    return 0; // 손실 없음
}

// 자원 사용 가능 여부 확인
function checkResourceAvailability(gameState, eventType, responseType) {
    const cost = calculateResourceCost(eventType);
    if (!cost) return { available: true, reason: null };
    
    // CCTV는 자원 소모 없음
    if (responseType === 'cctv' || responseType === 'ignore') {
        return { available: true, reason: null };
    }
    
    // 경찰 파견 시
    if (responseType === 'dispatch') {
        const availablePolice = getAvailablePoliceCount(gameState);
        if (availablePolice < cost.police) {
            return { 
                available: false, 
                reason: `경찰 인원 부족 (필요: ${cost.police}대, 보유: ${availablePolice}대)` 
            };
        }
    }
    
    // 드론 사용 시
    if (responseType === 'drone') {
        const availableDrones = getAvailableDroneCount(gameState);
        if (availableDrones < cost.drone) {
            return { 
                available: false, 
                reason: `드론 부족 (필요: ${cost.drone}대, 보유: ${availableDrones}대)` 
            };
        }
    }
    
    return { available: true, reason: null };
}

// 자원 충족도 계산 (성공률 조정용)
// 반환값: { fulfillment: 0~1 이상 (1.0 = 100% 충족, 1.5 = 150% 충족), required: 필요량, available: 사용 가능량 }
function calculateResourceFulfillment(gameState, eventType, responseType) {
    const cost = calculateResourceCost(eventType);
    if (!cost) return { fulfillment: 1.0, required: 0, available: 0 };
    
    // CCTV나 무시는 자원 필요 없음 (항상 충족)
    if (responseType === 'cctv' || responseType === 'ignore') {
        return { fulfillment: 1.0, required: 0, available: 0 };
    }
    
    // 경찰 파견 시
    if (responseType === 'dispatch') {
        const required = cost.police;
        const available = getAvailablePoliceCount(gameState);
        const fulfillment = available > 0 ? available / required : 0;
        return { fulfillment: fulfillment, required: required, available: available };
    }
    
    // 드론 사용 시
    if (responseType === 'drone') {
        const required = cost.drone;
        const available = getAvailableDroneCount(gameState);
        const fulfillment = available > 0 ? available / required : 0;
        return { fulfillment: fulfillment, required: required, available: available };
    }
    
    return { fulfillment: 1.0, required: 0, available: 0 };
}

// 사용 가능한 경찰 수 계산 (전체 - 파견 중 - 손실)
function getAvailablePoliceCount(gameState) {
    const totalPolice = gameState.resources.police || 0;
    const deployedPolice = getDeployedPoliceCount(gameState);
    return Math.max(0, totalPolice - deployedPolice);
}

// 사용 가능한 드론 수 계산 (전체 - 사용 중)
function getAvailableDroneCount(gameState) {
    const totalDrones = gameState.resources.drones || 0;
    const deployedDrones = getDeployedDroneCount(gameState);
    return Math.max(0, totalDrones - deployedDrones);
}

// 현재 파견 중인 경찰 수 계산
function getDeployedPoliceCount(gameState) {
    if (!gameState.deployedResources) return 0;
    
    return gameState.deployedResources.reduce((sum, resource) => {
        if (resource.type === 'police' && !resource.returned) {
            return sum + resource.count;
        }
        return sum;
    }, 0);
}

// 현재 사용 중인 드론 수 계산
function getDeployedDroneCount(gameState) {
    if (!gameState.deployedResources) return 0;
    
    return gameState.deployedResources.reduce((sum, resource) => {
        if (resource.type === 'drone' && !resource.returned) {
            return sum + resource.count;
        }
        return sum;
    }, 0);
}

// 자원 파견 (사건 처리 시)
function deployResources(gameState, eventType, responseType, eventId, customPoliceCount = null, customDroneCount = null) {
    const cost = calculateResourceCost(eventType);
    if (!cost) return null;
    
    // CCTV나 무시는 자원 소모 없음
    if (responseType === 'cctv' || responseType === 'ignore') {
        return null;
    }
    
    const deployed = [];
    
    // 경찰 파견
    if (responseType === 'dispatch') {
        // 선택된 수량이 있으면 사용, 없으면 기본 계산
        const policeCount = customPoliceCount !== null 
            ? customPoliceCount 
            : (cost.police ? (cost.police.min + Math.floor(Math.random() * (cost.police.max - cost.police.min + 1))) : 0);
        
        if (policeCount > 0) {
            deployed.push({
                type: 'police',
                count: policeCount,
                eventId: eventId,
                eventType: eventType,
                deployedAt: { day: gameState.day, time: gameState.time },
                returnTime: cost.returnTime,
                returned: false
            });
        }
    }
    
    // 드론 사용
    if (responseType === 'drone') {
        // 선택된 수량이 있으면 사용, 없으면 기본 계산
        const droneCount = customDroneCount !== null 
            ? customDroneCount 
            : (cost.drone || 0);
        
        if (droneCount > 0) {
            deployed.push({
                type: 'drone',
                count: droneCount,
                eventId: eventId,
                eventType: eventType,
                deployedAt: { day: gameState.day, time: gameState.time },
                returnTime: cost.returnTime,
                returned: false
            });
        }
    }
    
    // gameState에 추가
    if (!gameState.deployedResources) {
        gameState.deployedResources = [];
    }
    gameState.deployedResources.push(...deployed);
    
    return deployed;
}

// 자원 복귀 처리 (시간 경과에 따라)
function processResourceReturns(gameState) {
    if (!gameState.deployedResources) return;
    
    const completedEvents = []; // 완료된 사건 목록 (조언자 대사용)
    
    gameState.deployedResources.forEach(resource => {
        if (resource.returned) return;
        
        // 복귀 시간 계산
        const hoursDeployed = (gameState.day - resource.deployedAt.day) * 24 + 
                             (gameState.time - resource.deployedAt.time);
        
        // 복귀 시간 도달 시 복귀 처리 및 사건 성공/실패 결정
        if (hoursDeployed >= resource.returnTime && !resource.returned) {
            resource.returned = true;
            
            // 해당 사건 찾기
            const event = gameState.activeEvents.find(e => e.id === resource.eventId);
            if (event && event.status === 'processing') {
                // 같은 사건에 여러 자원이 파견되었을 수 있으므로, 모든 자원이 복귀했을 때만 처리
                const allResourcesForEvent = gameState.deployedResources.filter(r => r.eventId === resource.eventId);
                const allReturned = allResourcesForEvent.every(r => r.returned);
                
                // 모든 자원이 복귀했을 때만 사건 처리
                if (allReturned) {
                        // 사건의 성공/실패 결정 (파견 시점의 성공률 사용)
                        const successRate = event.successRate || 50;
                        const isSuccess = Math.random() * 100 < successRate;
                        
                        if (isSuccess) {
                            // 성공: 사건 해결
                            event.status = 'resolved';
                            event.resolvedAt = { time: gameState.time, day: gameState.day };
                            
                            // 도시 통계에 영향 적용
                            if (event.impact.crimeRate) {
                                const district = gameState.districts[event.districtIndex];
                                if (district) {
                                    district.crimeLevel = Math.max(0, Math.min(100, 
                                        district.crimeLevel + event.impact.crimeRate
                                    ));
                                }
                            }
                            
                            if (event.impact.stability) {
                                gameState.cityStats.stability = Math.max(0, Math.min(100,
                                    gameState.cityStats.stability + event.impact.stability
                                ));
                            }
                            
                            if (event.impact.factionTension) {
                                gameState.cityStats.factionTension = Math.max(0, Math.min(100,
                                    gameState.cityStats.factionTension + event.impact.factionTension
                                ));
                            }
                            
                            if (typeof gameState.updateCityStats === 'function') {
                                gameState.updateCityStats();
                            }
                            
                            // 조언자 대사용 정보 저장
                            completedEvents.push({
                                event: event,
                                success: true,
                                responseType: event.responseType
                            });
                        } else {
                            // 실패: 사건이 더 악화됨
                            event.status = 'active'; // 다시 활성 상태로
                            event.impact.crimeRate = (event.impact.crimeRate || 0) + 2;
                            event.impact.stability = (event.impact.stability || 0) - 1.5;
                            
                            // 도시 통계에 부정적 영향 적용
                            const district = gameState.districts[event.districtIndex];
                            if (district) {
                                district.crimeLevel = Math.max(0, Math.min(100, 
                                    district.crimeLevel + (event.impact.crimeRate || 0)
                                ));
                            }
                            
                            gameState.cityStats.stability = Math.max(0, Math.min(100,
                                gameState.cityStats.stability + (event.impact.stability || 0)
                            ));
                            
                            if (typeof gameState.updateCityStats === 'function') {
                                gameState.updateCityStats();
                            }
                            
                            // 조언자 대사용 정보 저장
                            completedEvents.push({
                                event: event,
                                success: false,
                                responseType: event.responseType
                            });
                        }
                }
            }
        }
    });
    
    // 완료된 사건이 있으면 조언자 대사 표시
    if (completedEvents.length > 0 && typeof displayAdvisorDialogue === 'function') {
        completedEvents.forEach(result => {
            const responseName = (typeof ResponseNames !== 'undefined' && ResponseNames[result.responseType])
                ? ResponseNames[result.responseType]
                : result.responseType;
            
            let message = '';
            if (result.success) {
                message = `✅ ${result.event.title} 사건이 성공적으로 처리되었습니다.\n대응 방법: ${responseName}`;
            } else {
                message = `❌ ${result.event.title} 사건 처리가 실패했습니다.\n대응 방법: ${responseName}\n범죄율과 안정도가 악화되었습니다.`;
            }
            
            displayAdvisorDialogue(message);
        });
    }
    
    // 복귀된 자원 제거 (선택사항 - 로그를 위해 남길 수도 있음)
    // gameState.deployedResources = gameState.deployedResources.filter(r => !r.returned);
}

// 경찰 손실 적용 (디스토피아 컨셉)
function applyPoliceCasualty(gameState, eventType, policeDeployed) {
    const casualties = calculatePoliceCasualty(eventType, policeDeployed);
    
    if (casualties > 0) {
        // 경찰 총원에서 영구 손실
        gameState.resources.police = Math.max(0, gameState.resources.police - casualties);
        
        return casualties;
    }
    
    return 0;
}

