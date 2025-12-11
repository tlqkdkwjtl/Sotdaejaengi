// 뉴스 시스템
// 뉴스 렌더링 및 상세 표시 함수들을 정의합니다.

// 뉴스 렌더링 함수
function renderNews(gameState, gameInstance) {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '';
    
    // 오늘 날짜의 뉴스와 상태 기반 뉴스 가져오기
    const todayNews = gameState.news.filter(n => n.day === gameState.day);
    
    // 상태 기반 자동 뉴스 추가 (선택지 뉴스가 없을 때 기본 뉴스)
    // 상태 기반 뉴스 시스템은 game-content/news/status-news.js에서 관리됩니다.
    if (todayNews.length === 0) {
        if (typeof generateStatusNews === 'function') {
            const statusNews = generateStatusNews(gameState);
            todayNews.push(...statusNews);
        } else {
            // 폴백 (status-news.js가 로드되지 않은 경우)
            todayNews.push({
                title: "도시 현황 보고",
                content: `Day ${gameState.day} - 도시 관리 현황을 확인하세요.`,
                fullContent: `Day ${gameState.day} - 도시 관리 현황을 확인하세요.`,
                day: gameState.day
            });
        }
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
            showNewsDetail(news);
        });
        
        newsContainer.appendChild(newsItem);
    });
}

// 뉴스 상세 내용 표시 함수
function showNewsDetail(news) {
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
    
    // 이미지가 있으면 표시
    if (news.image) {
        const img = document.createElement('img');
        img.className = 'info-image';
        img.src = news.image;
        img.alt = news.title;
        img.style.maxWidth = '100%';
        img.style.marginTop = '10px';
        sectionDiv.appendChild(img);
    }
    
    panelBody.appendChild(sectionDiv);
    
    overlay.classList.add('active');
}

