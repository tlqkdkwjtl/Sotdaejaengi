// 솟대쟁이 - 도시 관리자 시뮬레이션 게임

// 뉴스 템플릿은 game-content/news/news-templates.js에서 로드됩니다.
// NewsTemplates 객체가 정의되어 있어야 합니다.
    

// 사건 템플릿은 game-content/event-templates.js에서 로드됩니다.
// EventTemplates 객체가 정의되어 있어야 합니다.

// 게임 상태 관리
class GameState {
    constructor() {
        this.day = 1;
        this.time = 8;
        // 초기 자원 값
        // InitialResources는 game-content/initial-values.js에서 로드됩니다.
        this.resources = (typeof InitialResources !== 'undefined' && InitialResources)
            ? { ...InitialResources }
            : { budget: 100, personnel: 100, equipment: 50 };
        
        // 초기 도시 통계
        // InitialCityStats는 game-content/initial-values.js에서 로드됩니다.
        this.cityStats = (typeof InitialCityStats !== 'undefined' && InitialCityStats)
            ? { ...InitialCityStats }
            : { stability: 70, crimeRate: 30, citizenSatisfaction: 60, factionTension: 40 };
        
        // 파벌 정보
        // FactionsData는 game-content/factions.js에서 로드됩니다.
        this.factions = (typeof FactionsData !== 'undefined' && FactionsData)
            ? JSON.parse(JSON.stringify(FactionsData)) // 깊은 복사
            : {};
        
        // 도시 구역 정보
        // CityDistricts는 game-content/districts.js에서 로드됩니다.
        this.districts = (typeof CityDistricts !== 'undefined' && CityDistricts) 
            ? [...CityDistricts] // 복사본 사용
            : []; // CityDistricts가 없을 경우 빈 배열 (기본값)
        
        this.activeEvents = [];
        this.factionEvents = []; // 파벌 이벤트
        
        // 사건 타입 정의
        // EventTypesData는 game-content/event-types.js에서 로드됩니다.
        this.eventTypes = (typeof EventTypesData !== 'undefined' && EventTypesData)
            ? JSON.parse(JSON.stringify(EventTypesData)) // 깊은 복사
            : {};
        
        // 뉴스 데이터 (날짜별로 관리)
        this.news = [];
        
        // 플레이어 정보
        // InitialPlayer는 game-content/initial-values.js에서 로드됩니다.
        this.player = (typeof InitialPlayer !== 'undefined' && InitialPlayer)
            ? { ...InitialPlayer }
            : { name: "플레이어", role: "도시 관리자", authority: 100 };
        
        // 부서 인물 데이터 (치안부)
        // DepartmentPersonnel은 game-content/department-content.js에서 로드됩니다.
        this.departments = (typeof DepartmentPersonnel !== 'undefined' && DepartmentPersonnel) 
            ? JSON.parse(JSON.stringify(DepartmentPersonnel)) // 깊은 복사
            : {
                minister: {
                    name: "이천호",
                    role: "치안부 장관",
                    efficiency: 75,
                    faction: null,
                    budgetAbility: {
                        reduction: 0.05,
                        bonus: 0
                    }
                },
                viceMinisters: []
            };
        
        // 현재 선택된 인물 (사건 처리 시 사용)
        this.selectedPersonnel = null;
    }
    
    updateCityStats() {
        let totalCrime = 0;
        this.districts.forEach(district => {
            totalCrime += district.crimeLevel;
        });
        this.cityStats.crimeRate = Math.min(100, totalCrime / this.districts.length);
        this.cityStats.stability = Math.max(0, Math.min(100, 
            100 - this.cityStats.crimeRate * 0.7 - this.cityStats.factionTension * 0.3
        ));
        this.cityStats.citizenSatisfaction = Math.max(0, Math.min(100,
            this.cityStats.stability * 0.6 + (100 - this.cityStats.crimeRate) * 0.4
        ));
    }
    
    // 시간 진행 (1시간씩 증가)
    // 시간 시스템은 game-content/time/time-system.js에서 관리됩니다.
    advanceTime(hours = 1) {
        // time-system.js의 advanceTime 함수 호출
        if (typeof window.advanceTime === 'function') {
            window.advanceTime(this, hours);
        } else if (typeof advanceTime === 'function') {
            advanceTime(this, hours);
        } else {
            // 폴백: 직접 시간 업데이트
            this.time += hours;
            if (this.time >= 24) {
                this.time = 0;
                this.day++;
            }
        }
    }
    
    // 시간대 구분 (새벽, 오전, 낮, 오후, 저녁, 밤)
    // 시간 시스템은 game-content/time/time-system.js에서 관리됩니다.
    getTimePeriod() {
        if (typeof window.getTimePeriod === 'function') {
            return window.getTimePeriod(this.time);
        } else if (typeof getTimePeriod === 'function') {
            return getTimePeriod(this.time);
        }
        return 'dawn';
    }
    
    // 출퇴근 시간 감지
    // 시간 시스템은 game-content/time/time-system.js에서 관리됩니다.
    isRushHour() {
        if (typeof window.isRushHour === 'function') {
            return window.isRushHour(this.time);
        } else if (typeof isRushHour === 'function') {
            return isRushHour(this.time);
        }
        return false;
    }
    
    // 시간대별 사건 발생률 배수 계산
    // 시간 시스템은 game-content/time/time-system.js에서 관리됩니다.
    getEventRateMultiplier() {
        if (typeof window.getEventRateMultiplier === 'function') {
            return window.getEventRateMultiplier(this.time);
        } else if (typeof getEventRateMultiplier === 'function') {
            return getEventRateMultiplier(this.time);
        }
        return 1.0;
    }
    
    // 시간대별 설명 텍스트
    // 시간 시스템은 game-content/time/time-system.js에서 관리됩니다.
    getTimeDescription() {
        if (typeof getTimeDescription === 'function') {
            return getTimeDescription(this.time);
        }
        return '시간';
    }
    
    // 사건 생성 (기본 구조)
    createEvent(type, districtIndex = null, template = null) {
        const eventType = this.eventTypes[type];
        if (!eventType) {
            console.error(`알 수 없는 사건 타입: ${type}`);
            return null;
        }
        
        // districts 확인
        if (!this.districts || this.districts.length === 0) {
            console.error('districts가 초기화되지 않았습니다.');
            return null;
        }
        
        // 구역 선택 (랜덤 또는 지정)
        let district;
        let finalDistrictIndex;
        if (districtIndex !== null && districtIndex >= 0 && districtIndex < this.districts.length) {
            district = this.districts[districtIndex];
            finalDistrictIndex = districtIndex;
        } else {
            finalDistrictIndex = Math.floor(Math.random() * this.districts.length);
            district = this.districts[finalDistrictIndex];
        }
        
        if (!district) {
            console.error('유효한 구역을 찾을 수 없습니다.');
            return null;
        }
        
        // 예산 소모 계산
        const budgetCost = eventType.budgetCostMin + 
            Math.random() * (eventType.budgetCostMax - eventType.budgetCostMin);
        
        // 사건 객체 생성
        const event = {
            id: Date.now() + Math.random(),
            type: type,
            title: template?.title || `${eventType.name} 사건`,
            description: template?.description || `${district.name}에서 ${eventType.name} 사건이 발생했습니다.`,
            district: district.name,
            districtIndex: finalDistrictIndex,
            budgetCost: Math.round(budgetCost * 10) / 10, // 소수점 1자리
            time: this.time,
            day: this.day,
            status: 'active', // active, resolved, failed
            impact: {
                crimeRate: 0,
                stability: 0,
                factionTension: 0
            },
            responseType: null, // dispatch, drone, cctv, ignore
            resolvedAt: null
        };
        
        // 템플릿이 있으면 적용
        if (template) {
            if (template.impact) {
                event.impact = { ...event.impact, ...template.impact };
            }
            if (template.budgetCost) {
                event.budgetCost = template.budgetCost;
            }
        }
        
        return event;
    }
    
    // 사건 발생 시스템 (시간대별 발생률 적용)
    generateEvents() {
        // EventTemplates 확인
        if (typeof EventTemplates === 'undefined') {
            console.warn('EventTemplates가 로드되지 않았습니다.');
            return;
        }
        
        // eventTypes 확인
        if (!this.eventTypes || Object.keys(this.eventTypes).length === 0) {
            console.warn('eventTypes가 초기화되지 않았습니다.');
            return;
        }
        
        const timeMultiplier = this.getEventRateMultiplier();
        let eventsGenerated = 0;
        let totalChance = 0;
        
        // 각 사건 타입별로 발생 확인
        Object.keys(this.eventTypes).forEach(type => {
            const eventType = this.eventTypes[type];
            if (!eventType) return;
            
            // 현재 활성 사건 개수 확인
            const activeCount = this.activeEvents.filter(e => e.type === type && e.status === 'active').length;
            if (activeCount >= eventType.maxActive) {
                return; // 최대 개수 도달
            }
            
            // 발생 확률 계산 (시간대 배수 적용)
            const occurrenceChance = eventType.occurrenceRate * timeMultiplier;
            totalChance += occurrenceChance;
            
            // 랜덤 발생 확인
            if (Math.random() < occurrenceChance) {
                // 템플릿에서 랜덤 선택
                const templates = EventTemplates[type] || [];
                const template = templates.length > 0 
                    ? templates[Math.floor(Math.random() * templates.length)]
                    : null;
                
                const newEvent = this.createEvent(type, null, template);
                if (newEvent) {
                    this.activeEvents.push(newEvent);
                    eventsGenerated++;
                }
            }
        });
        
        // 디버깅: 사건 생성 여부 확인
        console.log(`사건 생성 시도 - 시간: ${this.time}시, 배수: ${timeMultiplier.toFixed(2)}, 총 확률: ${totalChance.toFixed(2)}, 생성된 사건: ${eventsGenerated}개`);
        
        // 활성 사건이 없고 발생 확률이 낮은 경우, 최소 1개 사건 강제 생성 (테스트용)
        const activeCount = this.activeEvents.filter(e => e.status === 'active').length;
        if (activeCount === 0 && eventsGenerated === 0 && totalChance > 0) {
            // 소규모 사건 강제 생성
            const smallType = this.eventTypes.small;
            if (smallType) {
                const templates = EventTemplates.small || [];
                const template = templates.length > 0 
                    ? templates[Math.floor(Math.random() * templates.length)]
                    : null;
                const newEvent = this.createEvent('small', null, template);
                if (newEvent) {
                    this.activeEvents.push(newEvent);
                    console.log('활성 사건이 없어 소규모 사건을 강제 생성했습니다.');
                }
            }
        }
    }
    
    // 파벌 이벤트 생성
    generateFactionEvent() {
        // FactionEventTemplates 확인
        if (typeof FactionEventTemplates === 'undefined') {
            return null;
        }
        
        // 파벌 이벤트 발생 확률 (시간당 5%)
        const factionEventChance = 0.05;
        if (Math.random() >= factionEventChance) {
            return null;
        }
        
        // 랜덤 파벌 선택
        const factionKeys = Object.keys(this.factions);
        if (factionKeys.length === 0) {
            return null;
        }
        
        const randomFactionKey = factionKeys[Math.floor(Math.random() * factionKeys.length)];
        const faction = this.factions[randomFactionKey];
        
        // 해당 파벌의 이벤트 템플릿 가져오기
        const templates = FactionEventTemplates[randomFactionKey] || [];
        if (templates.length === 0) {
            return null;
        }
        
        // 랜덤 템플릿 선택
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // 파벌 이벤트 객체 생성
        return {
            id: Date.now() + Math.random(),
            factionKey: randomFactionKey,
            faction: faction,
            title: template.title,
            description: template.description,
            dialogue: template.dialogue,
            options: template.options,
            time: this.time,
            day: this.day
        };
    }
    
    // 사건 해결 처리
    resolveEvent(eventId, responseType = 'dispatch', personnelId = null) {
        const event = this.activeEvents.find(e => e.id === eventId);
        if (!event || event.status !== 'active') {
            return false;
        }
        
        // 사건 해결 처리
        event.status = 'resolved';
        event.responseType = responseType;
        event.resolvedAt = { time: this.time, day: this.day };
        event.personnelId = personnelId; // 처리한 인물 기록
        
        // 예산 처리
        // 예산 시스템은 game-content/budget/budget-system.js에서 관리됩니다.
        let personnel = null;
        if (personnelId) {
            personnel = this.getPersonnelById(personnelId);
        }
        
        let actualBudgetCost = 0;
        if (typeof calculateEventBudgetCost === 'function') {
            actualBudgetCost = calculateEventBudgetCost(event, responseType, personnel);
        } else {
            // 폴백 (budget-system.js가 로드되지 않은 경우)
            actualBudgetCost = event.budgetCost;
            if (responseType === 'drone') actualBudgetCost *= 1.2;
            else if (responseType === 'cctv') actualBudgetCost *= 0.5;
            else if (responseType === 'ignore') actualBudgetCost = 0;
        }
        
        // 무시 시 영향 증가
        if (responseType === 'ignore') {
            event.impact.crimeRate = (event.impact.crimeRate || 0) + 5;
            event.impact.stability = (event.impact.stability || 0) - 3;
        }
        
        // 예산 적용
        if (typeof applyBudgetCost === 'function') {
            applyBudgetCost(this, actualBudgetCost);
        } else {
            // 폴백
            this.resources.budget = Math.max(0, Math.min(100, this.resources.budget - actualBudgetCost));
        }
        
        // 도시 통계에 영향 적용
        if (event.impact.crimeRate) {
            const district = this.districts[event.districtIndex];
            if (district) {
                district.crimeLevel = Math.max(0, Math.min(100, 
                    district.crimeLevel + event.impact.crimeRate
                ));
            }
        }
        
        if (event.impact.stability) {
            this.cityStats.stability = Math.max(0, Math.min(100,
                this.cityStats.stability + event.impact.stability
            ));
        }
        
        if (event.impact.factionTension) {
            this.cityStats.factionTension = Math.max(0, Math.min(100,
                this.cityStats.factionTension + event.impact.factionTension
            ));
        }
        
        this.updateCityStats();
        return true;
    }
    
    // 인물 ID로 인물 찾기
    getPersonnelById(personnelId) {
        // personnelId 형식: "minister", "viceMinister_0", "director_0_0" 등
        const parts = personnelId.split('_');
        
        if (parts[0] === 'minister') {
            return this.departments.minister;
        } else if (parts[0] === 'viceMinister') {
            const index = parseInt(parts[1]);
            if (this.departments.viceMinisters[index]) {
                if (parts.length === 2) {
                    return this.departments.viceMinisters[index];
                } else if (parts.length === 3) {
                    const dirIndex = parseInt(parts[2]);
                    return this.departments.viceMinisters[index].directors[dirIndex];
                }
            }
        }
        return null;
    }
    
    // 사건 실패 처리 (시간 초과 등)
    failEvent(eventId) {
        const event = this.activeEvents.find(e => e.id === eventId);
        if (!event || event.status !== 'active') {
            return false;
        }
        
        event.status = 'failed';
        event.resolvedAt = { time: this.time, day: this.day };
        
        // 실패 시 영향 증가
        if (event.impact.crimeRate) {
            event.impact.crimeRate *= 1.5;
        }
        if (event.impact.stability) {
            event.impact.stability *= 1.5;
        }
        
        // 도시 통계에 영향 적용
        const district = this.districts[event.districtIndex];
        if (district) {
            district.crimeLevel = Math.max(0, Math.min(100,
                district.crimeLevel + (event.impact.crimeRate || 0)
            ));
        }
        
        this.cityStats.stability = Math.max(0, Math.min(100,
            this.cityStats.stability + (event.impact.stability || 0)
        ));
        
        this.updateCityStats();
        return true;
    }
    
    // 오래된 사건 정리 (해결된 사건은 일정 시간 후 제거)
    cleanupEvents() {
        const maxAge = 3; // 3일 후 제거
        this.activeEvents = this.activeEvents.filter(event => {
            if (event.status === 'active') return true;
            if (event.status === 'resolved' || event.status === 'failed') {
                const age = this.day - event.resolvedAt.day;
                return age < maxAge;
            }
            return false;
        });
    }
    
    // generateDailyChoices() 및 applyChoice() 함수는 제거되었습니다.
    // 오퍼레이터 활동 화면으로 전환되면서 일일 선택지 시스템이 제거되었습니다.
    // 파벌 이벤트 시스템이 이를 대체합니다.
    
    // 예산 %를 금액으로 변환하는 함수 (나중에 금액 추가 시 사용)
    // getBudgetAmount(percent) {
    //     return Math.round(this.resources.budgetAmount * (percent / 100));
    // }
    
    // 선택지에 따른 뉴스 생성
    // generateNewsFromChoice() 함수는 제거되었습니다.
    // 일일 선택지 시스템이 제거되면서 더 이상 사용되지 않습니다.
    // 뉴스는 사건 해결 및 파벌 이벤트에서 생성됩니다.
    
    // 뉴스 추가 메서드
    // 뉴스 시스템은 game-content/news/news-system.js에서 관리됩니다.
    addNews(newsData) {
        this.news.push({
            ...newsData,
            day: newsData.day || this.day,
            id: Date.now() + Math.random() // 고유 ID 생성
        });
        
        // 최대 50개까지만 유지 (메모리 관리)
        if (this.news.length > 50) {
            this.news = this.news.slice(-50);
        }
    }
}

// AI 조언 시스템은 game-content/advisor/advisor.js로 분리되었습니다.
// 도시 지도 렌더링은 game-content/map/map-renderer.js로 분리되었습니다.

// 게임 메인 클래스
class Game {
    constructor() {
        this.state = new GameState();
        this.mapCanvas = document.getElementById('cityMap');
        this.mapRenderer = new MapRenderer(this.mapCanvas);
        this.selectedChoice = null;
        this.operatorActivity = null;
        this.operatorTimeInterval = null;
        // 파벌 이벤트 UI는 game-content/events/faction-event-ui.js에서 관리됩니다.
        this.factionDialogueFullText = '';
        this.factionDialogueIndex = 0;
        
        // showEventResponseOptions를 전역으로 노출 (operator-ui.js에서 사용)
        // this를 바인딩하기 위해 화살표 함수 사용
        const gameInstance = this;
        window.showEventResponseOptions = (event) => {
            if (typeof showEventResponseOptionsUI === 'function') {
                showEventResponseOptionsUI(
                    event,
                    gameInstance.state,
                    (eventId, responseType, personnelId) => {
                        gameInstance.handleEventResponse(eventId, responseType, personnelId);
                    },
                    () => {
                        gameInstance.closeEventResponseOverlay();
                    }
                );
            } else {
                console.error('showEventResponseOptionsUI 함수가 로드되지 않았습니다.');
            }
        };
        
        this.init();
    }
    
    init() {
        // UI 업데이트
        this.updateUI();
        this.renderNews();
        
        // 배경 이미지 설정 (이미지 파일 경로를 여기에 설정)
        // 예: this.mapRenderer.setBackgroundImage('images/city_map.png');
        
        // 지도 렌더링 루프
        this.gameLoop();
        
        // 이벤트 리스너
        this.setupEventListeners();
        
        // 오퍼레이터 활동 시작 (게임 시작 시 바로)
        this.startOperatorActivity();
    }
    
    // 배경 이미지 설정 메서드 (외부에서 호출 가능)
    setMapBackgroundImage(imagePath) {
        this.mapRenderer.setBackgroundImage(imagePath);
    }
    
    setupEventListeners() {
        // 아이콘 박스 클릭 이벤트
        this.setupIconBoxListeners();
        
        // 정보 패널 닫기 버튼
        const infoCloseBtn = document.getElementById('infoCloseBtn');
        const infoOverlay = document.getElementById('infoOverlay');
        if (infoCloseBtn && infoOverlay) {
            infoCloseBtn.addEventListener('click', () => {
                this.closeInfoPanel();
            });
            
            // 오버레이 배경 클릭 시 닫기
            infoOverlay.addEventListener('click', (e) => {
                if (e.target === infoOverlay) {
                    this.closeInfoPanel();
                }
            });
        }
        
        // ESC 키로 정보 패널 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                this.closeInfoPanel();
            }
        });
    }
    
    setupIconBoxListeners() {
        const iconBoxes = document.querySelectorAll('.icon-box');
        iconBoxes.forEach((box, index) => {
            box.addEventListener('click', () => {
                this.showInfoPanel(index);
            });
        });
    }
    
    showInfoPanel(infoId) {
        const overlay = document.getElementById('infoOverlay');
        const panelBody = document.getElementById('infoPanelBody');
        const panelTitle = document.getElementById('infoPanelTitle');
        
        if (!overlay || !panelBody) return;
        
        // 정보 패널 내용 생성 (차후 확장 가능)
        const infoData = this.getInfoData(infoId);
        
        panelTitle.textContent = infoData.title;
        panelBody.innerHTML = '';
        
        // 섹션별로 정보 추가
        infoData.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'info-section';
            
            if (section.title) {
                const title = document.createElement('h3');
                title.textContent = section.title;
                sectionDiv.appendChild(title);
            }
            
            if (section.text) {
                const text = document.createElement('p');
                text.textContent = section.text;
                sectionDiv.appendChild(text);
            }
            
            if (section.graph) {
                const graphDiv = document.createElement('div');
                graphDiv.className = 'info-graph';
                graphDiv.id = `graph-${infoId}`;
                // 그래프는 차후 Canvas나 Chart 라이브러리로 구현
                graphDiv.textContent = '[그래프 영역]';
                sectionDiv.appendChild(graphDiv);
            }
            
            if (section.image) {
                const img = document.createElement('img');
                img.className = 'info-image';
                img.src = section.image;
                img.alt = section.imageAlt || '';
                sectionDiv.appendChild(img);
            }
            
            if (section.description) {
                const desc = document.createElement('p');
                desc.textContent = section.description;
                sectionDiv.appendChild(desc);
            }
            
            panelBody.appendChild(sectionDiv);
        });
        
        overlay.classList.add('active');
    }
    
    closeInfoPanel() {
        const overlay = document.getElementById('infoOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
    
    getInfoData(infoId) {
        // 아이콘 정보는 game-content/icons/ 폴더의 별도 파일에서 로드됩니다.
        // 동적 정보가 필요한 경우 함수를 호출하고, 정적 정보는 객체를 직접 사용합니다.
        switch(infoId) {
            case 0: // 도시 통계
                if (typeof getCityStatsInfo === 'function') {
                    return getCityStatsInfo(this.state);
                }
                break;
            case 1: // 파벌 관계
                if (typeof FactionRelationsInfo !== 'undefined') {
                    return FactionRelationsInfo;
                }
                break;
            case 2: // 구역 정보
                if (typeof getDistrictInfo === 'function') {
                    return getDistrictInfo(this.state);
                }
                break;
            case 3: // 자원 현황
                if (typeof getResourcesInfo === 'function') {
                    return getResourcesInfo(this.state);
                }
                break;
            case 4: // 부서 정보
                if (typeof DepartmentInfo !== 'undefined') {
                    return DepartmentInfo;
                }
                break;
        }
        
        // 기본값 (파일이 로드되지 않은 경우)
        // 메시지는 game-content/messages.js에서 로드됩니다.
        return (typeof GameMessages !== 'undefined' && GameMessages.infoUnavailable)
            ? GameMessages.infoUnavailable
            : {
                title: "정보",
                sections: [{
                    text: "정보를 불러올 수 없습니다."
                }]
            };
    }
    
    // 선택지 관련 함수들은 제거 (오퍼레이터 화면을 메인으로 사용)
    
    // 오퍼레이터 활동 시작
    startOperatorActivity() {
        // 오퍼레이터 활동 초기화
        this.operatorActivity = {
            startTime: this.state.time,
            endTime: 18, // 18시까지 활동
            isActive: true
        };
        
        // 초기 사건 생성
        this.state.generateEvents();
        
        // 오퍼레이터 화면 업데이트
        this.updateOperatorUI();
        this.renderOperatorEvents();
        
        // 시간 진행 시작 (1시간씩) - 수동 진행으로 변경
        // this.operatorTimeInterval = setInterval(() => {
        //     this.advanceOperatorTime();
        // }, 10000); // 10초마다 1시간 진행 (자동 진행)
        
        // 오퍼레이터 이벤트 리스너 설정
        this.setupOperatorListeners();
    }
    
    // 오퍼레이터 시간 진행
    advanceOperatorTime() {
        if (!this.operatorActivity || !this.operatorActivity.isActive) {
            return;
        }
        
        // 이미 종료 중이면 진행하지 않음
        if (this._isEndingOperatorActivity) {
            return;
        }
        
        // 1시간 진행
        this.state.advanceTime(1);
        
        // 사건 발생 확인
        this.state.generateEvents();
        
        // 파벌 이벤트 발생 확인
        const factionEvent = this.state.generateFactionEvent();
        if (factionEvent) {
            // 파벌 이벤트 표시 (game-content/events/faction-event-ui.js에서 처리)
            if (typeof showFactionEventUI === 'function') {
                showFactionEventUI(
                    factionEvent,
                    (factionEvent, option) => this.applyFactionEventImpact(factionEvent, option),
                    () => this.updateUI()
                );
            }
        }
        
        // 오퍼레이터 화면 업데이트
        this.updateOperatorUI();
        this.renderOperatorEvents();
        this.updateUI(); // 상단 정보 패널도 업데이트
        
        // 디버깅: 활성 사건 개수 확인
        const activeCount = this.state.activeEvents.filter(e => e.status === 'active').length;
        console.log(`현재 활성 사건: ${activeCount}개`);
        
        // 활동 종료 시간 체크
        if (this.state.time >= this.operatorActivity.endTime) {
            this.endOperatorActivity();
        }
    }
    
    // 오퍼레이터 활동 종료
    endOperatorActivity() {
        // 이미 종료 중이면 중복 실행 방지
        if (this._isEndingOperatorActivity) {
            return;
        }
        this._isEndingOperatorActivity = true;
        
        if (this.operatorTimeInterval) {
            clearInterval(this.operatorTimeInterval);
            this.operatorTimeInterval = null;
        }
        
        if (this.operatorActivity) {
            this.operatorActivity.isActive = false;
        }
        
        // 현재 시간부터 18시까지의 남은 시간에 대해 사건 발생 체크
        const currentTime = this.state.time;
        const endTime = this.operatorActivity ? this.operatorActivity.endTime : 18;
        const remainingHours = endTime - currentTime;
        
        // 남은 시간만큼 사건 발생 시뮬레이션 (시간은 증가시키지 않고 사건만 생성)
        for (let i = 0; i < remainingHours; i++) {
            // 시간을 임시로 증가시켜서 시간대별 발생률 적용
            const tempTime = currentTime + i;
            const originalTime = this.state.time;
            this.state.time = tempTime;
            
            // 사건 발생 확인 (시간대별 발생률 적용)
            this.state.generateEvents();
            
            // 시간 복원
            this.state.time = originalTime;
        }
        
        // 오래된 사건 정리
        this.state.cleanupEvents();
        
        // 현재 날짜 저장 (날짜 증가 전에 저장)
        const currentDay = this.state.day;
        
        // 전날 뉴스 저장 (날짜 증가 전에 저장)
        if (typeof saveDailyNews === 'function') {
            saveDailyNews(this.state);
        }
        
        // 날짜 증가 (다음 날로) - advanceTime을 사용하지 않고 직접 증가
        // advanceTime을 사용하면 시간이 24시를 넘어갈 때 또 날짜가 증가할 수 있음
        this.state.day = currentDay + 1;
        this.state.time = 8; // 다음 날 8시부터 시작
        
        // 다음 날 시작 - 오퍼레이터 활동 재시작
        this.showGlitchTransition(() => {
            // UI 업데이트
            this.updateUI();
            this.renderNews();
            
            // 오퍼레이터 활동 재시작
            this.startOperatorActivity();
            
            // 종료 플래그 해제
            this._isEndingOperatorActivity = false;
            
            // 다음 날 알림은 제거됨 (자동으로 넘어감)
        });
    }
    
    // 오퍼레이터 UI 업데이트
    // 오퍼레이터 UI 업데이트
    // 오퍼레이터 UI 렌더링은 game-content/operator/operator-ui.js에서 관리됩니다.
    updateOperatorUI() {
        if (typeof updateOperatorUI === 'function') {
            updateOperatorUI(this.state, this.operatorActivity);
        }
    }
    
    // 오퍼레이터 사건 목록 렌더링
    // 오퍼레이터 UI 렌더링은 game-content/operator/operator-ui.js에서 관리됩니다.
    renderOperatorEvents() {
        if (typeof renderOperatorEventsList === 'function') {
            renderOperatorEventsList(this.state);
        }
    }
    
    // 사건 대응 선택지 표시
    
    // 사건 대응 처리
    handleEventResponse(eventId, responseType) {
        const event = this.state.activeEvents.find(e => e.id === eventId);
        if (!event || event.status !== 'active') {
            this.closeEventResponseOverlay();
            return;
        }
        
        // 예산 확인
        // 예산 시스템은 game-content/budget/budget-system.js에서 관리됩니다.
        let cost = 0;
        if (typeof calculateEventBudgetCost === 'function') {
            // 선택된 인물 가져오기
            const personnelSelect = document.querySelector('.event-response-personnel');
            let personnel = null;
            if (personnelSelect && personnelSelect.value) {
                personnel = this.state.getPersonnelById(personnelSelect.value);
            }
            cost = calculateEventBudgetCost(event, responseType, personnel);
        } else {
            // 폴백
            cost = event.budgetCost;
            if (responseType === 'drone') cost = event.budgetCost * 1.2;
            else if (responseType === 'cctv') cost = event.budgetCost * 0.5;
            else if (responseType === 'ignore') cost = 0;
        }
        
        if (typeof checkBudgetSufficient === 'function') {
            if (!checkBudgetSufficient(this.state, cost) && responseType !== 'ignore') {
                // 메시지는 game-content/messages.js에서 로드됩니다.
                const message = (typeof GameMessages !== 'undefined' && GameMessages.budgetInsufficient)
                    ? GameMessages.budgetInsufficient
                    : '예산이 부족합니다!';
                alert(message);
                return;
            }
        } else {
            // 폴백
            if (cost > this.state.resources.budget && responseType !== 'ignore') {
                // 메시지는 game-content/messages.js에서 로드됩니다.
                const message = (typeof GameMessages !== 'undefined' && GameMessages.budgetInsufficient)
                    ? GameMessages.budgetInsufficient
                    : '예산이 부족합니다!';
                alert(message);
                return;
            }
        }
        
        // 선택된 인물 가져오기
        const personnelSelect = document.querySelector('.event-response-personnel');
        const personnelId = personnelSelect ? personnelSelect.value : null;
        
        // 사건 해결
        const success = this.state.resolveEvent(eventId, responseType, personnelId);
        
        if (success) {
            // 오버레이 닫기
            this.closeEventResponseOverlay();
            
            // UI 업데이트
            this.renderOperatorEvents();
            this.updateOperatorUI();
            this.updateUI();
            
            // 결과 메시지
            // ResponseNames는 game-content/event-responses.js에서 로드됩니다.
            const responseName = (typeof ResponseNames !== 'undefined' && ResponseNames[responseType])
                ? ResponseNames[responseType]
                : responseType;
            
            setTimeout(() => {
                // 메시지는 game-content/messages.js에서 로드됩니다.
                const message = (typeof GameMessages !== 'undefined' && GameMessages.eventResolved)
                    ? GameMessages.eventResolved(responseName, cost)
                    : `사건 처리 완료!\n\n대응 방법: ${responseName}\n예산 소모: ${cost.toFixed(1)}%`;
                alert(message);
            }, 100);
        }
    }
    
    // 사건 대응 오버레이 닫기
    // 사건 대응 오버레이 닫기
    // 사건 대응 UI는 game-content/events/event-response-ui.js에서 관리됩니다.
    closeEventResponseOverlay() {
        if (typeof closeEventResponseOverlay === 'function') {
            closeEventResponseOverlay();
        }
    }
    
    // 파벌 이벤트 표시는 game-content/events/faction-event-ui.js에서 처리됩니다.
    
    // 파벌 이벤트 영향 적용
    applyFactionEventImpact(factionEvent, option) {
        if (!option.impact) return;
        
        const impact = option.impact;
        
        // 파벌 영향 적용
        Object.keys(impact).forEach(key => {
            if (key === 'budget') {
                // 예산 영향
                if (typeof applyBudgetCost === 'function') {
                    applyBudgetCost(this.state, Math.abs(impact.budget));
                } else {
                    this.state.resources.budget = Math.max(0, 
                        Math.min(100, this.state.resources.budget + impact.budget));
                }
            } else if (this.state.factions[key]) {
                // 파벌 영향
                const faction = this.state.factions[key];
                if (impact[key].trust !== undefined) {
                    faction.trust = Math.max(0, Math.min(100, faction.trust + impact[key].trust));
                }
                if (impact[key].tension !== undefined) {
                    faction.tension = Math.max(0, Math.min(100, faction.tension + impact[key].tension));
                }
            }
        });
        
        // UI 업데이트
        this.updateUI();
    }
    
    // 오퍼레이터 이벤트 리스너 설정
    setupOperatorListeners() {
        const skipTimeBtn = document.getElementById('skipTimeBtn');
        const endOperatorBtn = document.getElementById('endOperatorBtn');
        
        if (skipTimeBtn) {
            skipTimeBtn.addEventListener('click', () => {
                // 시간을 1시간 건너뛰기
                this.advanceOperatorTime();
            });
        }
        
        if (endOperatorBtn) {
            endOperatorBtn.addEventListener('click', () => {
                // 활동 종료
                this.endOperatorActivity();
            });
        }
    }
    
    // 글리치 전환 효과 표시
    showGlitchTransition(callback) {
        const glitchOverlay = document.getElementById('glitchOverlay');
        if (!glitchOverlay) {
            if (callback) callback();
            return;
        }
        
        // 스캔라인 컨테이너 가져오기
        const scanlinesContainer = glitchOverlay.querySelector('.glitch-scanlines');
        if (!scanlinesContainer) {
            if (callback) callback();
            return;
        }
        
        // 기존 스캔라인 제거
        scanlinesContainer.innerHTML = '';
        
        // 글리치 오버레이 표시
        glitchOverlay.classList.add('active');
        
        // 여러 스캔라인 생성 (5~10개)
        const scanlineCount = 5 + Math.floor(Math.random() * 6);
        const scanlines = [];
        
        for (let i = 0; i < scanlineCount; i++) {
            const scanline = document.createElement('div');
            scanline.className = 'glitch-scanline';
            
            // 랜덤한 시작 위치와 지연 시간
            const startDelay = Math.random() * 0.5; // 0~0.5초 지연
            const duration = 0.1 + Math.random() * 0.1; // 0.1~0.2초 지속
            
            scanline.style.animationDelay = `${startDelay}s`;
            scanline.style.animationDuration = `${duration}s`;
            scanline.style.top = `${Math.random() * 100}%`;
            
            scanlinesContainer.appendChild(scanline);
            scanlines.push(scanline);
        }
        
        // 지속적으로 새로운 스캔라인 생성
        const createInterval = setInterval(() => {
            if (!glitchOverlay.classList.contains('active')) {
                clearInterval(createInterval);
                return;
            }
            
            const scanline = document.createElement('div');
            scanline.className = 'glitch-scanline';
            
            const startDelay = 0;
            const duration = 0.1 + Math.random() * 0.1;
            
            scanline.style.animationDelay = `${startDelay}s`;
            scanline.style.animationDuration = `${duration}s`;
            scanline.style.top = `${Math.random() * 20}%`; // 상단 20% 영역에서 시작
            
            scanlinesContainer.appendChild(scanline);
            
            // 스캔라인이 화면 밖으로 나가면 제거
            setTimeout(() => {
                if (scanline.parentNode) {
                    scanline.parentNode.removeChild(scanline);
                }
            }, (startDelay + duration) * 1000);
        }, 50); // 50ms마다 새 스캔라인 생성
        
        // 랜덤한 지속 시간 (1.5초 ~ 2.5초)
        const duration = 1500 + Math.random() * 1000;
        
        // 전환 완료 후 정리
        setTimeout(() => {
            clearInterval(createInterval);
            glitchOverlay.classList.remove('active');
            
            // 모든 스캔라인 제거
            setTimeout(() => {
                scanlinesContainer.innerHTML = '';
                if (callback) {
                    setTimeout(callback, 200);
                }
            }, 300);
        }, duration);
    }
    
    updateUI() {
        document.getElementById('dayDisplay').textContent = this.state.day;
        document.getElementById('stabilityDisplay').textContent = 
            Math.round(this.state.cityStats.stability) + '%';
        document.getElementById('crimeRateDisplay').textContent = 
            Math.round(this.state.cityStats.crimeRate) + '%';
        // 예산 표시는 game-content/budget/budget-system.js에서 관리됩니다.
        const budgetDisplay = document.getElementById('budgetDisplay');
        if (budgetDisplay) {
            if (typeof formatBudgetDisplay === 'function') {
                budgetDisplay.textContent = formatBudgetDisplay(this.state);
            } else {
                // 폴백
                budgetDisplay.textContent = Math.round(this.state.resources.budget) + '%';
            }
        }
        
        // 시간 표시는 game-content/time/time-system.js에서 관리됩니다.
        if (typeof updateTimeDisplay === 'function') {
            updateTimeDisplay(this.state);
        } else {
            // 폴백
            const timeDisplay = document.getElementById('timeDisplay');
            if (timeDisplay) {
                const timeText = `${this.state.time}시`;
                const timeDescription = this.state.getTimeDescription();
                timeDisplay.textContent = timeText;
                timeDisplay.title = timeDescription;
            }
        }
    }
    
    // 뉴스 렌더링 함수
    // 뉴스 시스템은 game-content/news/news-system.js에서 관리됩니다.
    renderNews() {
        if (typeof renderNews === 'function') {
            renderNews(this.state, this);
        }
    }
    
      // 뉴스 상세 내용 표시
    // 뉴스 시스템은 game-content/news/news-system.js에서 관리됩니다.
    showNewsDetail(news) {
        if (typeof showNewsDetail === 'function') {
            showNewsDetail(news);
        }
    }
    
    
    gameLoop() {
        this.mapRenderer.render(this.state);
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 게임 시작
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new Game();
});
