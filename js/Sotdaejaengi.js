// 솟대쟁이 - 도시 관리자 시뮬레이션 게임

// 뉴스 템플릿 시스템
// 선택지별로 뉴스 템플릿을 정의합니다. 여기에 텍스트를 추가/수정하면 됩니다.
const NewsTemplates = {
    "시민 지원 확대": {
        title: "시민 지원 정책 발표",
        content: "도시 관리부가 시민 단체 지원 확대 정책을 발표했습니다. 시민 단체 관계자들은 긍정적인 반응을 보였습니다.",
        fullContent: `도시 관리부는 오늘 시민 단체 지원 확대 정책을 발표했습니다.\n\n이번 정책은 시민들의 자치 활동을 지원하고, 지역 커뮤니티의 활성화를 목표로 합니다. 시민 단체 관계자들은 "시민 참여의 확대는 도시 민주주의의 발전을 의미한다"며 긍정적인 반응을 보였습니다.\n\n예산 ${500}만원이 이번 정책에 할당되었습니다.`
    },
    "산업 인프라 투자": {
        title: "산업 인프라 투자 계획 발표",
        content: "대규모 산업 인프라 투자 계획이 발표되었습니다. 대기업들은 이번 투자에 환영의 뜻을 표했습니다.",
        fullContent: `도시 관리부는 오늘 대규모 산업 인프라 투자 계획을 발표했습니다.\n\n이번 투자는 도시의 산업 경쟁력을 강화하고 일자리를 창출하는 것을 목표로 합니다. 대기업 관계자들은 "이번 투자는 도시 경제 발전에 큰 도움이 될 것"이라며 환영의 뜻을 표했습니다.\n\n예산 ${800}만원이 이번 투자에 할당되었습니다.`
    },
    "정보 자유화": {
        title: "정보 자유화 정책 시행",
        content: "정보 자유화 정책이 시행되었습니다. 해커 네트워크와 시민 단체가 이번 정책을 환영했습니다.",
        fullContent: `도시 관리부는 오늘 정보 자유화 정책을 시행했습니다.\n\n이번 정책은 시민들의 정보 접근권을 확대하고, 투명한 정보 공개를 목표로 합니다. 해커 네트워크는 "정보는 모든 시민의 권리"라며 이번 정책을 환영했으며, 시민 단체들도 긍정적인 반응을 보였습니다.\n\n일부 보안 전문가들은 정보 보안에 대한 우려를 표명했습니다.`
    },
    "치안 강화": {
        title: "도시 치안 강화 조치 발표",
        content: "도시 전역에 걸친 치안 강화 조치가 발표되었습니다. 범죄율 감소가 기대되지만, 일부 시민들은 자유 제한에 대한 우려를 표명했습니다.",
        fullContent: `도시 관리부는 오늘 도시 전역에 걸친 치안 강화 조치를 발표했습니다.\n\n이번 조치는 경찰 인력 증원, CCTV 확대 설치, 검문소 강화 등을 포함합니다. 치안부 관계자는 "범죄율 감소와 시민 안전 확보가 최우선 목표"라고 밝혔습니다.\n\n일부 시민 단체들은 "과도한 감시는 시민의 자유를 침해할 수 있다"며 우려를 표명했습니다. 예산 ${600}만원이 이번 조치에 할당되었습니다.`
    },
    "노동자 권리 보호": {
        title: "노동자 권리 보호 법안 통과",
        content: "노동자 권리 보호 법안이 통과되었습니다. 노조는 환영했지만, 대기업들은 반발하고 있습니다.",
        fullContent: `도시 관리부는 오늘 노동자 권리 보호 법안을 통과시켰습니다.\n\n이번 법안은 최저 임금 인상, 근로 환경 개선, 노동자 보호 조치 등을 포함합니다. 노동조합은 "오랫동안 기다려온 법안"이라며 환영했으며, 노조 관계자는 "노동자의 권리가 보장되는 것은 사회 정의의 실현"이라고 밝혔습니다.\n\n반면 대기업들은 "기업 경쟁력 저하와 비용 증가를 우려한다"며 반발하고 있습니다. 예산 ${400}만원이 이번 법안 시행에 할당되었습니다.`
    },
    "종교 단체 협력": {
        title: "종교 단체와의 협력 협약 체결",
        content: "도시 관리부가 종교 단체와 협력 협약을 체결했습니다. 도덕적 치안 강화에 기여할 것으로 기대됩니다.",
        fullContent: `도시 관리부는 오늘 주요 종교 단체와 협력 협약을 체결했습니다.\n\n이번 협약은 도시의 도덕적 치안 강화와 시민 정신 함양을 목표로 합니다. 종교 단체 대표는 "종교와 정부의 협력은 건강한 사회를 만드는 기반"이라며 긍정적인 반응을 보였습니다.\n\n시민 단체들도 이번 협약에 대해 대체로 긍정적인 평가를 내렸습니다.`
    }
};

// 게임 상태 관리
class GameState {
    constructor() {
        this.day = 1;
        this.time = 8;
        this.resources = {
            budget: 10000,
            personnel: 100,
            equipment: 50
        };
        
        this.cityStats = {
            stability: 70,
            crimeRate: 30,
            citizenSatisfaction: 60,
            factionTension: 40
        };
        
        this.factions = {
            bigCorp: { trust: 50, tension: 30, name: "대기업" },
            labor: { trust: 40, tension: 50, name: "노조" },
            citizens: { trust: 60, tension: 20, name: "시민 단체" },
            religion: { trust: 55, tension: 25, name: "종교 단체" },
            hackers: { trust: 30, tension: 60, name: "해커 네트워크" }
        };
        
        this.districts = [
            { name: "중앙 구역", type: "central", crimeLevel: 20, x: 0.15, y: 0.3 },
            { name: "동부 산업 구역", type: "industrial", crimeLevel: 25, x: 0.7, y: 0.4 },
            { name: "서부 재개발 구역", type: "redevelopment", crimeLevel: 40, x: 0.1, y: 0.6 },
            { name: "남부 생활 구역", type: "residential", crimeLevel: 15, x: 0.5, y: 0.8 },
            { name: "북부 물류 구역", type: "logistics", crimeLevel: 30, x: 0.5, y: 0.1 },
            { name: "외곽 난민촌", type: "refugee", crimeLevel: 60, x: 0.9, y: 0.7 }
        ];
        
        this.activeEvents = [];
        this.currentChoices = [];
        
        // 뉴스 데이터 (날짜별로 관리)
        this.news = [];
        
        // 플레이어 정보
        this.player = {
            name: "플레이어",
            role: "도시 관리자",
            authority: 100
        };
        
        // 부서 인물 데이터 (치안부)
        this.departments = {
            minister: {
                name: "치안부장관",
                role: "치안부 장관",
                efficiency: 75,
                faction: null
            },
            viceMinisters: [
                { 
                    name: "김차관", 
                    role: "차관", 
                    efficiency: 70, 
                    faction: "bigCorp",
                    directors: [
                        { name: "공안부장1", role: "공안부장", efficiency: 70, faction: "bigCorp", type: "surveillance" },
                        { name: "경찰부장1", role: "경찰부장", efficiency: 75, faction: "bigCorp", type: "police" },
                        { name: "검문소부장1", role: "검문소부장", efficiency: 65, faction: "bigCorp", type: "checkpoint" }
                    ]
                },
                { 
                    name: "이차관", 
                    role: "차관", 
                    efficiency: 65, 
                    faction: "labor",
                    directors: [
                        { name: "공안부장2", role: "공안부장", efficiency: 68, faction: "labor", type: "surveillance" },
                        { name: "경찰부장2", role: "경찰부장", efficiency: 72, faction: "labor", type: "police" },
                        { name: "검문소부장2", role: "검문소부장", efficiency: 70, faction: "labor", type: "checkpoint" }
                    ]
                },
                { 
                    name: "박차관", 
                    role: "차관", 
                    efficiency: 75, 
                    faction: "citizens",
                    directors: [
                        { name: "공안부장3", role: "공안부장", efficiency: 75, faction: "citizens", type: "surveillance" },
                        { name: "경찰부장3", role: "경찰부장", efficiency: 78, faction: "citizens", type: "police" },
                        { name: "검문소부장3", role: "검문소부장", efficiency: 73, faction: "citizens", type: "checkpoint" }
                    ]
                }
            ]
        };
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
    
    generateDailyChoices() {
        // 매일 새로운 선택지 생성
        const choiceTemplates = [
            {
                text: "시민 지원 확대",
                impact: { citizens: { trust: +10 }, budget: -500 },
                description: "시민 단체의 호감도가 상승합니다."
            },
            {
                text: "산업 인프라 투자",
                impact: { bigCorp: { trust: +10 }, budget: -800 },
                description: "기업가의 지지가 증가합니다."
            },
            {
                text: "정보 자유화",
                impact: { hackers: { trust: +15, tension: -10 }, citizens: { trust: +5 } },
                description: "해커 네트워크의 활동이 강화되고, 시민들의 자유가 확대됩니다."
            },
            {
                text: "치안 강화",
                impact: { crimeRate: -5, bigCorp: { trust: +5 }, citizens: { trust: -5 }, budget: -600 },
                description: "범죄율이 감소하지만, 시민들의 자유가 제한됩니다."
            },
            {
                text: "노동자 권리 보호",
                impact: { labor: { trust: +15, tension: -10 }, bigCorp: { trust: -10 }, budget: -400 },
                description: "노조의 지지가 크게 증가하지만, 대기업의 반발이 있습니다."
            },
            {
                text: "종교 단체 협력",
                impact: { religion: { trust: +10 }, citizens: { trust: +3 } },
                description: "종교 단체와의 협력으로 도덕적 치안이 강화됩니다."
            }
        ];
        
        // 랜덤하게 3개 선택
        const shuffled = [...choiceTemplates].sort(() => Math.random() - 0.5);
        this.currentChoices = shuffled.slice(0, 3);
    }
    
    applyChoice(choiceIndex) {
        const choice = this.currentChoices[choiceIndex];
        if (!choice) return;
        
        const impact = choice.impact;
        
        // 파벌 영향 적용
        Object.keys(impact).forEach(key => {
            if (this.factions[key]) {
                if (impact[key].trust) {
                    this.factions[key].trust = Math.max(0, Math.min(100, 
                        this.factions[key].trust + impact[key].trust
                    ));
                }
                if (impact[key].tension !== undefined) {
                    this.factions[key].tension = Math.max(0, Math.min(100, 
                        this.factions[key].tension + impact[key].tension
                    ));
                }
            }
        });
        
        // 범죄율 영향
        if (impact.crimeRate) {
            this.districts.forEach(district => {
                district.crimeLevel = Math.max(0, Math.min(100, 
                    district.crimeLevel + impact.crimeRate
                ));
            });
        }
        
        // 예산 영향
        if (impact.budget) {
            this.resources.budget = Math.max(0, this.resources.budget + impact.budget);
        }
        
        // 선택에 따른 뉴스 생성
        this.generateNewsFromChoice(choice);
        
        this.updateCityStats();
        this.day++;
        this.generateDailyChoices();
    }
    
    // 선택지에 따른 뉴스 생성
    generateNewsFromChoice(choice) {
        const newsTemplate = NewsTemplates[choice.text];
        if (!newsTemplate) {
            // 템플릿이 없으면 기본 뉴스 생성
            this.addNews({
                title: `${choice.text} 정책 시행`,
                content: choice.description || `${choice.text} 정책이 시행되었습니다.`,
                fullContent: choice.description || `${choice.text} 정책이 시행되었습니다.\n\n이번 정책의 영향이 도시 전반에 미칠 것으로 예상됩니다.`,
                day: this.day
            });
            return;
        }
        
        // 템플릿에서 뉴스 생성 (동적 값 치환)
        let fullContent = newsTemplate.fullContent;
        if (choice.impact.budget) {
            const budgetAmount = Math.abs(choice.impact.budget);
            fullContent = fullContent.replace(/\$\{(\d+)\}/g, budgetAmount.toLocaleString());
        }
        
        this.addNews({
            title: newsTemplate.title,
            content: newsTemplate.content,
            fullContent: fullContent,
            day: this.day
        });
    }
    
    // 뉴스 추가 메서드
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

// AI 추천 시스템
class AIAdvisor {
    static generateRecommendation(gameState, choice) {
        const impact = choice.impact;
        const recommendations = [];
        
        // 확률 계산
        let successRate = 70;
        if (gameState.resources.budget < 500) successRate -= 20;
        if (gameState.cityStats.stability < 50) successRate -= 15;
        
        recommendations.push(`성공 확률: ${successRate}%`);
        
        // 위험도 분석
        const risks = [];
        if (impact.bigCorp && impact.bigCorp.trust < 0) {
            risks.push(`대기업의 반발 가능성: ${Math.abs(impact.bigCorp.trust * 2)}%`);
        }
        if (impact.labor && impact.labor.trust < 0) {
            risks.push(`노조의 반발 가능성: ${Math.abs(impact.labor.trust * 2)}%`);
        }
        if (impact.budget && impact.budget < -500) {
            risks.push(`예산 부족 위험`);
        }
        
        if (risks.length > 0) {
            recommendations.push(`⚠ 위험: ${risks.join(', ')}`);
        }
        
        // 추천 여부
        const factionTension = Object.values(gameState.factions)
            .reduce((sum, f) => sum + f.tension, 0) / Object.keys(gameState.factions).length;
        
        if (factionTension > 60 && choice.impact[Object.keys(choice.impact)[0]]?.tension < 0) {
            recommendations.push(`✅ 추천: 파벌 긴장도 완화에 도움이 됩니다.`);
        } else if (gameState.cityStats.crimeRate > 50 && choice.impact.crimeRate < 0) {
            recommendations.push(`✅ 추천: 범죄율 감소에 효과적입니다.`);
        }
        
        return recommendations.join(' | ');
    }
}

// 도시 지도 렌더링
class MapRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        // 픽셀 퍼펙트 렌더링 설정
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        
        // 배경 이미지 로드
        this.backgroundImage = null;
        this.loadBackgroundImage();
    }
    
    loadBackgroundImage() {
        // 배경 이미지 로드 (사용자가 나중에 추가할 이미지)
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            // 이미지 로드 완료 후 렌더링
        };
        this.backgroundImage.onerror = () => {
            // 이미지가 없으면 기본 배경 사용
            console.log('배경 이미지가 없습니다. 기본 배경을 사용합니다.');
        };
        // 이미지 경로는 사용자가 설정할 수 있도록 나중에 변경 가능
        // this.backgroundImage.src = 'images/city_map.png';
    }
    
    setBackgroundImage(src) {
        if (this.backgroundImage) {
            this.backgroundImage.src = src;
        }
    }
    
    render(gameState) {
        this.clear();
        this.renderBackground();
        this.renderDistricts(gameState);
        this.renderEvents(gameState);
    }
    
    clear() {
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    renderBackground() {
        // 배경 이미지가 있으면 그리기
        if (this.backgroundImage && this.backgroundImage.complete && this.backgroundImage.naturalWidth > 0) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // 기본 배경 (이미지가 없을 때)
            this.ctx.fillStyle = '#1a1a2a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // 도트 패턴
            this.ctx.fillStyle = '#0f0f1a';
            for (let x = 0; x < this.canvas.width; x += 20) {
                for (let y = 0; y < this.canvas.height; y += 20) {
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
    
    renderDistricts(gameState) {
        // 6개 구역을 폴리곤으로 표시
        const districtAreas = this.getDistrictAreas();
        
        gameState.districts.forEach((district, index) => {
            const area = districtAreas[index];
            if (!area) return;
            
            // 범죄 수준에 따른 색상
            const color = this.getCrimeColor(district.crimeLevel);
            
            // 구역 영역 그리기
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = 0.4; // 반투명
            this.ctx.beginPath();
            this.ctx.moveTo(area[0].x, area[0].y);
            for (let i = 1; i < area.length; i++) {
                this.ctx.lineTo(area[i].x, area[i].y);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
            
            // 구역 테두리
            this.ctx.strokeStyle = '#6bcf7f';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(area[0].x, area[0].y);
            for (let i = 1; i < area.length; i++) {
                this.ctx.lineTo(area[i].x, area[i].y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            
            // 구역 이름 표시 (중앙 위치)
            const centerX = area.reduce((sum, p) => sum + p.x, 0) / area.length;
            const centerY = area.reduce((sum, p) => sum + p.y, 0) / area.length;
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 12px "Courier New", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            // 텍스트 외곽선
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(district.name, centerX, centerY - 10);
            this.ctx.fillText(district.name, centerX, centerY - 10);
            
            // 범죄 수준
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.font = 'bold 10px "Courier New", monospace';
            this.ctx.strokeText(`${district.crimeLevel}%`, centerX, centerY + 10);
            this.ctx.fillText(`${district.crimeLevel}%`, centerX, centerY + 10);
        });
    }
    
    // 6개 구역의 영역 정의 (사용자가 이미지에 맞게 조정 가능)
    getDistrictAreas() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        return [
            // 중앙 구역
            [{x: w*0.3, y: h*0.2}, {x: w*0.7, y: h*0.2}, {x: w*0.7, y: h*0.5}, {x: w*0.3, y: h*0.5}],
            // 동부 산업 구역
            [{x: w*0.7, y: h*0.2}, {x: w*0.95, y: h*0.2}, {x: w*0.95, y: h*0.5}, {x: w*0.7, y: h*0.5}],
            // 서부 재개발 구역
            [{x: w*0.05, y: h*0.2}, {x: w*0.3, y: h*0.2}, {x: w*0.3, y: h*0.5}, {x: w*0.05, y: h*0.5}],
            // 남부 생활 구역
            [{x: w*0.3, y: h*0.5}, {x: w*0.7, y: h*0.5}, {x: w*0.7, y: h*0.85}, {x: w*0.3, y: h*0.85}],
            // 북부 물류 구역
            [{x: w*0.3, y: h*0.05}, {x: w*0.7, y: h*0.05}, {x: w*0.7, y: h*0.2}, {x: w*0.3, y: h*0.2}],
            // 외곽 난민촌
            [{x: w*0.7, y: h*0.5}, {x: w*0.95, y: h*0.5}, {x: w*0.95, y: h*0.85}, {x: w*0.7, y: h*0.85}]
        ];
    }
    
    getCrimeColor(level) {
        if (level < 20) return '#4a9eff'; // 부드러운 파란색
        if (level < 40) return '#ffd93d'; // 부드러운 노란색
        if (level < 60) return '#ff8c42'; // 부드러운 주황색
        return '#ff6b6b'; // 부드러운 빨간색
    }
    
    renderEvents(gameState) {
        // 이벤트는 추후 구현
    }
}

// 게임 메인 클래스
class Game {
    constructor() {
        this.state = new GameState();
        this.mapCanvas = document.getElementById('cityMap');
        this.mapRenderer = new MapRenderer(this.mapCanvas);
        this.selectedChoice = null;
        
        this.init();
    }
    
    init() {
        // 초기 선택지 생성
        this.state.generateDailyChoices();
        
        // UI 업데이트
        this.updateUI();
        this.renderChoices();
        this.renderNews();
        
        // 배경 이미지 설정 (이미지 파일 경로를 여기에 설정)
        // 예: this.mapRenderer.setBackgroundImage('images/city_map.png');
        
        // 지도 렌더링 루프
        this.gameLoop();
        
        // 이벤트 리스너
        this.setupEventListeners();
    }
    
    // 배경 이미지 설정 메서드 (외부에서 호출 가능)
    setMapBackgroundImage(imagePath) {
        this.mapRenderer.setBackgroundImage(imagePath);
    }
    
    setupEventListeners() {
        const confirmBtn = document.getElementById('confirmBtn');
        const choicesContainer = document.getElementById('choicesContainer');
        
        // 선택지 버튼 생성
        this.renderChoices();
        
        // 확정 버튼
        confirmBtn.addEventListener('click', () => {
            if (this.selectedChoice !== null) {
                this.confirmChoice();
            } else {
                alert('선택지를 먼저 클릭해주세요.');
            }
        });
        
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
        // 각 아이콘 박스별 정보 데이터 (차후 확장)
        const infoTemplates = [
            {
                title: "도시 통계",
                sections: [
                    {
                        title: "현재 상태",
                        text: `Day ${this.state.day} - 도시 관리 현황`,
                        description: "도시의 전반적인 통계 정보를 확인할 수 있습니다."
                    },
                    {
                        title: "안정도 그래프",
                        graph: true,
                        description: "도시 안정도 추이를 그래프로 확인합니다."
                    }
                ]
            },
            {
                title: "파벌 관계",
                sections: [
                    {
                        title: "파벌 현황",
                        text: "각 파벌의 신뢰도와 긴장도를 확인할 수 있습니다.",
                        description: "파벌 간의 관계를 분석합니다."
                    }
                ]
            },
            {
                title: "구역 정보",
                sections: [
                    {
                        title: "도시 구역",
                        text: "6개 구역의 상세 정보를 확인할 수 있습니다.",
                        description: "각 구역의 범죄율과 특성을 분석합니다."
                    }
                ]
            },
            {
                title: "자원 현황",
                sections: [
                    {
                        title: "자원 관리",
                        text: `예산: ${this.state.resources.budget.toLocaleString()}\n인력: ${this.state.resources.personnel}\n장비: ${this.state.resources.equipment}`,
                        description: "현재 보유 자원을 확인합니다."
                    }
                ]
            },
            {
                title: "부서 정보",
                sections: [
                    {
                        title: "치안부 구조",
                        text: "치안부의 조직 구조와 인물 정보를 확인할 수 있습니다.",
                        description: "장관, 차관, 부장들의 효율성을 확인합니다."
                    }
                ]
            }
        ];
        
        return infoTemplates[infoId] || {
            title: "정보",
            sections: [{
                text: "정보를 불러올 수 없습니다."
            }]
        };
    }
    
    renderChoices() {
        const container = document.getElementById('choicesContainer');
        container.innerHTML = '';
        
        this.state.currentChoices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice';
            button.textContent = choice.text;
            button.dataset.index = index;
            
            button.addEventListener('mouseenter', () => {
                this.showAIResponse(choice);
            });
            
            button.addEventListener('click', () => {
                // 이전 선택 해제
                document.querySelectorAll('.choice').forEach(btn => {
                    btn.classList.remove('selected');
                });
                button.classList.add('selected');
                this.selectedChoice = index;
                this.showAIResponse(choice);
            });
            
            container.appendChild(button);
        });
    }
    
    showAIResponse(choice) {
        const aiResponse = document.getElementById('aiResponse');
        const recommendation = AIAdvisor.generateRecommendation(this.state, choice);
        
        let response = `${choice.description}\n\n`;
        response += `분석: ${recommendation}`;
        
        aiResponse.textContent = response;
    }
    
    confirmChoice() {
        if (this.selectedChoice === null) return;
        
        // 글리치 효과 시작
        this.showGlitchTransition(() => {
            // 전환 완료 후 선택 적용
            this.state.applyChoice(this.selectedChoice);
            this.selectedChoice = null;
            
            // UI 업데이트
            this.updateUI();
            this.renderChoices();
            this.renderNews();
            
            // AI 응답 초기화
            document.getElementById('aiResponse').textContent = '';
            
            // 다음 날 알림
            setTimeout(() => {
                alert(`Day ${this.state.day} 시작!\n새로운 선택지가 생성되었습니다.`);
            }, 100);
        });
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
        document.getElementById('budgetDisplay').textContent = 
            this.state.resources.budget.toLocaleString();
    }
    
    renderNews() {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;
        
        newsContainer.innerHTML = '';
        
        // 오늘 날짜의 뉴스와 상태 기반 뉴스 가져오기
        const todayNews = this.state.news.filter(n => n.day === this.state.day);
        
        // 상태 기반 자동 뉴스 추가 (선택지 뉴스가 없을 때 기본 뉴스)
        if (todayNews.length === 0) {
            // 기본 상태 뉴스
            const statusNews = [
                {
                    title: "도시 안정도 보고",
                    content: `현재 도시 안정도는 ${Math.round(this.state.cityStats.stability)}%입니다.`,
                    fullContent: `현재 도시 안정도는 ${Math.round(this.state.cityStats.stability)}%입니다.\n\n도시의 전반적인 안정 상태를 나타내는 지표입니다.`,
                    day: this.state.day
                },
                {
                    title: "범죄율 현황",
                    content: `전체 범죄율은 ${Math.round(this.state.cityStats.crimeRate)}%로 집계되었습니다.`,
                    fullContent: `전체 범죄율은 ${Math.round(this.state.cityStats.crimeRate)}%로 집계되었습니다.\n\n각 구역별 범죄 발생 현황을 종합한 수치입니다.`,
                    day: this.state.day
                }
            ];
            
            // 긴장도가 높은 파벌 뉴스 추가
            Object.keys(this.state.factions).forEach(factionKey => {
                const faction = this.state.factions[factionKey];
                if (faction.tension > 50) {
                    statusNews.push({
                        title: `${faction.name} 긴장도 상승`,
                        content: `${faction.name}의 긴장도가 ${faction.tension}%로 높은 수준입니다.`,
                        fullContent: `${faction.name}의 긴장도가 ${faction.tension}%로 높은 수준입니다.\n\n이에 대한 대응이 필요할 수 있습니다.`,
                        day: this.state.day
                    });
                }
            });
            
            todayNews.push(...statusNews);
        }
        
        // 최신 뉴스 5개만 표시 (최신순)
        const recentNews = todayNews.slice(-5).reverse();
        
        if (recentNews.length === 0) {
            const noNews = document.createElement('div');
            noNews.className = 'news-item';
            noNews.style.textAlign = 'center';
            noNews.style.color = '#888';
            noNews.textContent = '오늘의 뉴스가 없습니다.';
            newsContainer.appendChild(noNews);
            return;
        }
        
        recentNews.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.style.cursor = 'pointer';
            
            const title = document.createElement('div');
            title.className = 'news-title';
            title.textContent = news.title;
            newsItem.appendChild(title);
            
            const content = document.createElement('div');
            content.className = 'news-content';
            content.textContent = news.content;
            newsItem.appendChild(content);
            
            const time = document.createElement('div');
            time.className = 'news-time';
            time.textContent = `${news.day}일차`;
            newsItem.appendChild(time);
            
            // 클릭 시 상세 내용 표시
            newsItem.addEventListener('click', () => {
                this.showNewsDetail(news);
            });
            
            newsContainer.appendChild(newsItem);
        });
    }
    
    // 뉴스 상세 내용 표시
    showNewsDetail(news) {
        const overlay = document.getElementById('infoOverlay');
        const panelBody = document.getElementById('infoPanelBody');
        const panelTitle = document.getElementById('infoPanelTitle');
        
        if (!overlay || !panelBody) return;
        
        panelTitle.textContent = news.title;
        panelBody.innerHTML = '';
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'info-section';
        
        const fullContent = document.createElement('p');
        fullContent.textContent = news.fullContent || news.content || '상세 내용이 없습니다.';
        fullContent.style.whiteSpace = 'pre-line';
        sectionDiv.appendChild(fullContent);
        
        if (news.image) {
            const img = document.createElement('img');
            img.className = 'info-image';
            img.src = news.image;
            img.alt = news.title;
            sectionDiv.appendChild(img);
        }
        
        panelBody.appendChild(sectionDiv);
        overlay.classList.add('active');
    }
    
    renderCharacters() {
        // 플레이어 (도시 관리자) 렌더링
        const playerContainer = document.getElementById('playerContainer');
        playerContainer.innerHTML = '';
        const player = this.state.player;
        if (player) {
            const playerCard = this.createPlayerCard(player);
            playerContainer.appendChild(playerCard);
        }
        
        // 치안부 장관 렌더링
        const ministerContainer = document.getElementById('ministerContainer');
        ministerContainer.innerHTML = '';
        const minister = this.state.departments.minister;
        if (minister) {
            ministerContainer.appendChild(this.createCharacterCard(minister, 'minister'));
        }
        
        // 차관 렌더링
        const viceMinistersContainer = document.getElementById('viceMinistersContainer');
        viceMinistersContainer.innerHTML = '';
        this.state.departments.viceMinisters.forEach(vm => {
            viceMinistersContainer.appendChild(this.createCharacterCard(vm, 'viceMinister'));
        });
        
        // 부장 렌더링 (각 차관별 부장들)
        const directorsContainer = document.getElementById('directorsContainer');
        directorsContainer.innerHTML = '';
        this.state.departments.viceMinisters.forEach(vm => {
            if (vm.directors) {
                vm.directors.forEach(dir => {
                    directorsContainer.appendChild(this.createCharacterCard(dir, 'director'));
                });
            }
        });
    }
    
    createPlayerCard(player) {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.style.border = '3px solid #6bcf7f';
        card.style.background = '#1a2e1a';
        
        const name = document.createElement('div');
        name.className = 'character-name';
        name.textContent = player.name;
        name.style.color = '#6bcf7f';
        card.appendChild(name);
        
        const role = document.createElement('div');
        role.className = 'character-role';
        role.textContent = player.role;
        role.style.color = '#4a9eff';
        card.appendChild(role);
        
        // 권한 표시
        const authorityContainer = document.createElement('div');
        authorityContainer.className = 'character-stats';
        const authorityLabel = document.createElement('span');
        authorityLabel.textContent = '권한:';
        authorityContainer.appendChild(authorityLabel);
        const authorityValue = document.createElement('span');
        authorityValue.textContent = `${player.authority}%`;
        authorityValue.style.color = '#6bcf7f';
        authorityContainer.appendChild(authorityValue);
        card.appendChild(authorityContainer);
        
        // 권한 바
        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        const statBarFill = document.createElement('div');
        statBarFill.className = 'stat-bar-fill';
        statBarFill.style.width = `${player.authority}%`;
        statBar.appendChild(statBarFill);
        card.appendChild(statBar);
        
        // 클릭 이벤트
        card.addEventListener('click', () => {
            alert(`${player.name} (${player.role})\n\n권한: ${player.authority}%\n\n도시 전체를 관리하는 최고 책임자입니다.`);
        });
        
        return card;
    }
    
    createCharacterCard(character, type) {
        const card = document.createElement('div');
        card.className = 'character-card';
        
        const name = document.createElement('div');
        name.className = 'character-name';
        name.textContent = character.name;
        card.appendChild(name);
        
        const role = document.createElement('div');
        role.className = 'character-role';
        role.textContent = character.role;
        card.appendChild(role);
        
        // 효율성 표시
        const efficiencyContainer = document.createElement('div');
        efficiencyContainer.className = 'character-stats';
        const efficiencyLabel = document.createElement('span');
        efficiencyLabel.textContent = '효율성:';
        efficiencyContainer.appendChild(efficiencyLabel);
        const efficiencyValue = document.createElement('span');
        efficiencyValue.textContent = `${character.efficiency}%`;
        efficiencyValue.style.color = character.efficiency >= 70 ? '#2ed573' : 
                                      character.efficiency >= 50 ? '#ffb800' : '#ff6b6b';
        efficiencyContainer.appendChild(efficiencyValue);
        card.appendChild(efficiencyContainer);
        
        // 효율성 바
        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        const statBarFill = document.createElement('div');
        statBarFill.className = 'stat-bar-fill';
        statBarFill.style.width = `${character.efficiency}%`;
        statBar.appendChild(statBarFill);
        card.appendChild(statBar);
        
        // 파벌 배지
        if (character.faction) {
            const faction = this.state.factions[character.faction];
            if (faction) {
                const badge = document.createElement('span');
                badge.className = `faction-badge ${character.faction}`;
                badge.textContent = faction.name;
                card.appendChild(badge);
            }
        }
        
        // 클릭 이벤트 (추후 상세 정보 표시용)
        card.addEventListener('click', () => {
            this.showCharacterDetails(character, type);
        });
        
        return card;
    }
    
    showCharacterDetails(character, type) {
        let details = `${character.name} (${character.role})\n\n`;
        details += `효율성: ${character.efficiency}%\n`;
        if (character.faction) {
            const faction = this.state.factions[character.faction];
            details += `파벌: ${faction.name}\n`;
            details += `파벌 신뢰도: ${faction.trust}%\n`;
            details += `파벌 긴장도: ${faction.tension}%`;
        } else {
            details += `파벌: 중립`;
        }
        alert(details);
    }
    
    gameLoop() {
        this.mapRenderer.render(this.state);
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 게임 시작
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
