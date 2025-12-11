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
        
        // 지도 클릭 이벤트 설정
        this.setupClickHandler();
    }
    
    // 지도 클릭 이벤트 핸들러 설정
    setupClickHandler() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 클릭한 위치가 어느 구역에 속하는지 확인
            const clickedDistrictIndex = this.getDistrictAtPoint(x, y);
            
            if (clickedDistrictIndex !== -1 && window.gameInstance) {
                // 구역 정보 표시
                this.showDistrictInfo(clickedDistrictIndex, window.gameInstance.state);
            }
        });
    }
    
    // 특정 좌표가 어느 구역에 속하는지 확인
    getDistrictAtPoint(x, y) {
        const districtAreas = this.getDistrictAreas();
        
        for (let i = 0; i < districtAreas.length; i++) {
            const area = districtAreas[i];
            if (!area) continue;
            
            // 폴리곤 내부 점 판별 (ray casting algorithm)
            let inside = false;
            for (let j = 0, k = area.length - 1; j < area.length; k = j++) {
                const xi = area[j].x, yi = area[j].y;
                const xk = area[k].x, yk = area[k].y;
                
                const intersect = ((yi > y) !== (yk > y)) && (x < (xk - xi) * (y - yi) / (yk - yi) + xi);
                if (intersect) inside = !inside;
            }
            
            if (inside) {
                return i;
            }
        }
        
        return -1; // 구역을 찾지 못함
    }
    
    // 구역 정보 표시
    showDistrictInfo(districtIndex, gameState) {
        if (!gameState || !gameState.districts || districtIndex < 0 || districtIndex >= gameState.districts.length) {
            return;
        }
        
        const district = gameState.districts[districtIndex];
        if (!district) return;
        
        // 정보 패널에 구역 정보 표시
        const overlay = document.getElementById('infoOverlay');
        const titleEl = document.getElementById('infoPanelTitle');
        const bodyEl = document.getElementById('infoPanelBody');
        const closeBtn = document.getElementById('infoCloseBtn');
        
        if (!overlay || !titleEl || !bodyEl) return;
        
        const residentialText = `고소득층 ${district.residentialLevel.high}%, 중산층 ${district.residentialLevel.middle}%, 저소득층 ${district.residentialLevel.low}%`;
        // const problemsText = district.problems.join(', '); // 주요 문제 주석 처리
        
        // 제목 설정
        titleEl.textContent = district.name;
        
        // 본문 내용 생성
        bodyEl.innerHTML = '';
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'info-section';
        
        // 범죄율 통계 (상단에 강조 표시)
        const statsDiv = document.createElement('div');
        statsDiv.style.marginBottom = '20px';
        statsDiv.style.padding = '15px';
        statsDiv.style.background = '#1a1a1a';
        statsDiv.style.border = '2px solid #4a9eff';
        statsDiv.innerHTML = `
            <div style="color: #6bcf7f; font-weight: bold; margin-bottom: 10px; font-size: 1.1rem;">📊 구역 통계</div>
            <div style="color: #ff6b6b; font-size: 1.2rem; font-weight: bold;">범죄율: ${district.crimeLevel}%</div>
        `;
        sectionDiv.appendChild(statsDiv);
        
        // 상세 정보
        const textDiv = document.createElement('div');
        textDiv.style.whiteSpace = 'pre-line';
        textDiv.style.color = '#ccc';
        textDiv.style.lineHeight = '1.6';
        textDiv.textContent = `특징: ${district.features}\n\n기업 분포: ${district.companyDistribution}\n\n주거 수준: ${residentialText}\n\n치안: 낮 - ${district.security.day}, 밤 - ${district.security.night}\n\n교통: ${district.traffic}`;
        // textDiv.textContent += `\n\n주요 문제: ${problemsText}`; // 주요 문제 주석 처리
        sectionDiv.appendChild(textDiv);
        
        bodyEl.appendChild(sectionDiv);
        
        // 닫기 버튼 이벤트
        if (closeBtn) {
            closeBtn.onclick = () => {
                overlay.classList.remove('active');
            };
        }
        
        // 오버레이 배경 클릭 시 닫기
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        };
        
        // ESC 키로 닫기
        const handleEscape = (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                if (overlay.classList.contains('active')) {
                    overlay.classList.remove('active');
                    document.removeEventListener('keydown', handleEscape);
                }
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // 오버레이 표시
        overlay.classList.add('active');
        
        // 조언 스텐드 표시
        if (typeof showAdvisorStand === 'function') {
            showAdvisorStand('info');
        }
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
        if (!gameState || !gameState.districts || gameState.districts.length === 0) {
            return; // districts가 없으면 렌더링하지 않음
        }
        
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
        if (!gameState || !gameState.activeEvents || !gameState.districts) {
            return; // gameState가 유효하지 않으면 렌더링하지 않음
        }
        
        const activeEvents = gameState.activeEvents.filter(e => e.status === 'active');
        const districtAreas = this.getDistrictAreas();
        const currentTime = Date.now();
        
        // 전체 범죄율 계산 (위협감 강화용)
        const avgCrimeRate = gameState.districts.length > 0 
            ? gameState.districts.reduce((sum, d) => sum + d.crimeLevel, 0) / gameState.districts.length
            : 0;
        const highCrimeMode = avgCrimeRate >= 60; // 범죄율 60% 이상 시 글리치 모드
        
        activeEvents.forEach(event => {
            const districtIndex = event.districtIndex;
            if (districtIndex < 0 || districtIndex >= districtAreas.length) return;
            
            const area = districtAreas[districtIndex];
            if (!area) return;
            
            // 해당 구역의 범죄율
            const district = gameState.districts[districtIndex];
            const districtCrimeRate = district ? district.crimeLevel : 0;
            
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
            
            // 미처리 시간 계산 (시간 단위)
            const hoursSinceEvent = (gameState.day - event.day) * 24 + (gameState.time - event.time);
            const hoursUnresolved = Math.max(0, hoursSinceEvent);
            
            // 깜빡임 강도 계산
            // 기본: 0.2~0.5초 간격, 범죄율과 미처리 시간에 따라 강도 증가
            const baseBlinkSpeed = 500; // 기본 0.5초
            const crimeRateFactor = Math.min(1.0, districtCrimeRate / 100); // 범죄율 영향 (0~1)
            const timeFactor = Math.min(1.0, hoursUnresolved / 24); // 미처리 시간 영향 (24시간 = 최대)
            const blinkSpeed = baseBlinkSpeed * (1 - crimeRateFactor * 0.6 - timeFactor * 0.3); // 최소 0.1초까지 감소
            const blinkIntensity = 0.3 + (crimeRateFactor * 0.4) + (timeFactor * 0.3); // 깜빡임 강도 증가
            
            // 깜빡임 효과 (0.2~0.5초 간격)
            const pulse = Math.sin(currentTime / blinkSpeed) * blinkIntensity + (1 - blinkIntensity);
            this.ctx.globalAlpha = pulse;
            
            // 범죄율이 높을 때 색상 변화 (더 위협적으로)
            if (districtCrimeRate >= 60) {
                eventColor = '#ff0000'; // 빨간색으로 변경
            } else if (districtCrimeRate >= 40) {
                eventColor = '#ff4444'; // 밝은 빨간색
            }
            
            // 노이즈/글리치 효과 (범죄율 60% 이상 또는 미처리 12시간 이상)
            if (highCrimeMode || hoursUnresolved >= 12) {
                const glitchOffset = (Math.random() - 0.5) * 2; // -1 ~ 1 픽셀 랜덤 오프셋
                const glitchAlpha = Math.random() * 0.3; // 랜덤 투명도
                
                // 글리치 효과: 약간의 랜덤 오프셋으로 여러 번 그리기
                for (let i = 0; i < 3; i++) {
                    const offsetX = (Math.random() - 0.5) * 2;
                    const offsetY = (Math.random() - 0.5) * 2;
                    this.ctx.globalAlpha = glitchAlpha;
                    this.ctx.fillStyle = eventColor;
                    this.ctx.beginPath();
                    this.ctx.arc(centerX + offsetX, centerY + offsetY, eventSize + 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
            
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
        
        // 전체 범죄율이 높을 때 전체 화면에 노이즈 효과 (성능 최적화: 매 프레임마다 호출하지 않음)
        // 주석 처리: getImageData/putImageData가 성능 문제를 일으킬 수 있음
        // if (highCrimeMode) {
        //     this.renderGlitchEffect();
        // }
    }
    
    // 글리치 효과 렌더링 (범죄율이 높을 때)
    renderGlitchEffect() {
        const noiseIntensity = 0.05; // 노이즈 강도
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // 랜덤 픽셀에 노이즈 추가
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < noiseIntensity) {
                // RGB 값에 랜덤 노이즈 추가
                data[i] = Math.min(255, data[i] + (Math.random() - 0.5) * 50);     // R
                data[i + 1] = Math.min(255, data[i + 1] + (Math.random() - 0.5) * 50); // G
                data[i + 2] = Math.min(255, data[i + 2] + (Math.random() - 0.5) * 50); // B
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
}

