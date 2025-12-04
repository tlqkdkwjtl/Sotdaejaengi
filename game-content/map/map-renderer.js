// 도시 지도 렌더링 시스템
// 도시 지도를 Canvas에 렌더링하고 구역, 사건 등을 표시합니다.

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
        // 활성 사건을 지도에 표시
        const activeEvents = gameState.activeEvents.filter(e => e.status === 'active');
        const districtAreas = this.getDistrictAreas();
        
        activeEvents.forEach(event => {
            const districtIndex = event.districtIndex;
            if (districtIndex < 0 || districtIndex >= districtAreas.length) return;
            
            const area = districtAreas[districtIndex];
            if (!area) return;
            
            // 사건 위치 (구역 중앙에서 약간 랜덤)
            const centerX = area.reduce((sum, p) => sum + p.x, 0) / area.length;
            const centerY = area.reduce((sum, p) => sum + p.y, 0) / area.length;
            
            // 사건 타입에 따른 색상
            let eventColor = '#ff6b6b';
            let eventSize = 8;
            switch(event.type) {
                case 'small':
                    eventColor = '#ffd93d';
                    eventSize = 6;
                    break;
                case 'medium':
                    eventColor = '#ff8c42';
                    eventSize = 8;
                    break;
                case 'large':
                    eventColor = '#ff6b6b';
                    eventSize = 10;
                    break;
                case 'mega':
                    eventColor = '#ff0000';
                    eventSize = 12;
                    break;
            }
            
            // 사건 마커 그리기 (펄스 효과)
            const pulse = Math.sin(Date.now() / 500) * 0.3 + 0.7;
            this.ctx.globalAlpha = pulse;
            
            // 외곽 원
            this.ctx.fillStyle = eventColor;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, eventSize + 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 내부 원
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, eventSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.globalAlpha = 1.0;
            
            // 사건 제목 표시 (호버 시)
            // TODO: 마우스 호버 이벤트 추가
        });
    }
}

