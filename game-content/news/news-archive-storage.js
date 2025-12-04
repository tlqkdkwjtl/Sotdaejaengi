// 이전 뉴스 저장 시스템
// 매일 뉴스를 기록하고, 5일마다 새 파일을 생성합니다.

// 뉴스 저장 (매일 호출)
function saveDailyNews(gameState) {
    const currentDay = gameState.day;
    
    // 오늘 날짜의 뉴스 가져오기
    let todayNews = gameState.news.filter(n => n.day === currentDay);
    
    // 상태 기반 뉴스가 없으면 생성
    if (todayNews.length === 0) {
        if (typeof generateStatusNews === 'function') {
            const statusNews = generateStatusNews(gameState);
            statusNews.forEach(news => {
                gameState.addNews(news);
            });
            // 다시 가져오기
            todayNews = gameState.news.filter(n => n.day === currentDay);
        }
    }
    
    // 뉴스가 없으면 저장하지 않음
    if (todayNews.length === 0) return;
    
    // 저장할 파일 번호 계산 (5일마다 새 파일)
    const fileNumber = Math.floor((currentDay - 1) / 5) + 1;
    
    // 기존 뉴스 데이터 로드
    let archivedNews = getArchivedNewsData(fileNumber);
    
    // 오늘 날짜의 뉴스 추가
    todayNews.forEach(news => {
        // 중복 방지 (같은 ID가 있으면 추가하지 않음)
        const exists = archivedNews.some(n => n.id === news.id);
        if (!exists) {
            archivedNews.push({
                day: news.day,
                title: news.title,
                content: news.content,
                fullContent: news.fullContent,
                id: news.id,
                image: news.image
            });
        }
    });
    
    // 파일에 저장
    saveArchivedNewsToFile(fileNumber, archivedNews);
}

// 동기적으로 저장된 뉴스 데이터 가져오기
function getArchivedNewsData(fileNumber) {
    // 먼저 window 객체에서 확인
    if (window[`newsArchiveData${fileNumber}`]) {
        return window[`newsArchiveData${fileNumber}`];
    }
    
    // localStorage에서 확인
    const storageKey = `newsArchive_${fileNumber}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
        try {
            const data = JSON.parse(stored);
            window[`newsArchiveData${fileNumber}`] = data;
            return data;
        } catch (e) {
            console.error(`뉴스 아카이브 ${fileNumber}번 파일 로드 실패:`, e);
        }
    }
    
    // 없으면 빈 배열 반환
    return [];
}

// 특정 날짜의 뉴스 가져오기
function getArchivedNewsForDay(day) {
    // 1일차의 경우 현재 게임 상태에서 가져오기
    if (day === 1 && window.gameInstance && window.gameInstance.state) {
        const day1News = window.gameInstance.state.news.filter(n => n.day === 1);
        if (day1News.length > 0) {
            return day1News;
        }
    }
    
    // 2일차 이상은 저장된 데이터에서 가져오기
    const fileNumber = Math.floor((day - 1) / 5) + 1;
    const archivedNews = getArchivedNewsData(fileNumber);
    
    // 해당 날짜의 뉴스 필터링
    const dayNews = archivedNews.filter(news => news.day === day);
    
    // 뉴스가 없으면 현재 게임 상태에서 확인
    if (dayNews.length === 0 && window.gameInstance && window.gameInstance.state) {
        const currentDayNews = window.gameInstance.state.news.filter(n => n.day === day);
        return currentDayNews;
    }
    
    return dayNews;
}

// 파일에 뉴스 저장
function saveArchivedNewsToFile(fileNumber, newsData) {
    // localStorage에 저장
    const storageKey = `newsArchive_${fileNumber}`;
    localStorage.setItem(storageKey, JSON.stringify(newsData));
    
    // 동시에 window 객체에도 저장 (즉시 접근 가능)
    window[`newsArchiveData${fileNumber}`] = newsData;
    
    // 파일 동적 생성 (스크립트 태그로 로드 가능하도록)
    updateArchiveScriptFile(fileNumber, newsData);
    
    console.log(`뉴스 아카이브 ${fileNumber}번 파일에 ${newsData.length}개의 뉴스 저장됨`);
}

// 아카이브 스크립트 파일 업데이트 (동적 생성)
function updateArchiveScriptFile(fileNumber, newsData) {
    const fileName = `news-archive-${fileNumber}.js`;
    const scriptId = `news-archive-script-${fileNumber}`;
    
    // 기존 스크립트 제거
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
        existingScript.remove();
    }
    
    // 새 스크립트 생성
    const script = document.createElement('script');
    script.id = scriptId;
    script.textContent = `window.newsArchiveData${fileNumber} = ${JSON.stringify(newsData)};`;
    document.head.appendChild(script);
}

// 초기화: 모든 아카이브 파일 로드
function initNewsArchiveStorage() {
    // 현재 날짜 기준으로 필요한 모든 파일 번호 계산
    if (window.gameInstance && window.gameInstance.state) {
        const currentDay = window.gameInstance.state.day;
        const maxFileNumber = Math.floor((currentDay - 1) / 5) + 1;
        
        // 모든 파일 로드 (localStorage에서)
        for (let i = 1; i <= maxFileNumber; i++) {
            const storageKey = `newsArchive_${i}`;
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                try {
                    window[`newsArchiveData${i}`] = JSON.parse(stored);
                } catch (e) {
                    console.error(`뉴스 아카이브 ${i}번 파일 로드 실패:`, e);
                }
            }
        }
    }
}

// 게임 상태 변경 시 호출 (다음 날로 넘어갈 때)
function onDayChange(gameState) {
    // 전날 뉴스 저장
    saveDailyNews(gameState);
    
    // 필요한 아카이브 파일 로드
    const currentDay = gameState.day;
    const fileNumber = Math.floor((currentDay - 1) / 5) + 1;
    getArchivedNewsData(fileNumber);
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsArchiveStorage);
} else {
    initNewsArchiveStorage();
}

