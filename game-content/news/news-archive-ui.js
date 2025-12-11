// 이전 뉴스 UI 시스템
// 이전 뉴스 오버레이를 표시하고 관리합니다.
//
// 주요 DOM 요소 (index.html에 정의됨):
// - newsArchiveOverlay: 이전 뉴스 오버레이 전체
// - newsArchiveDropdown: 날짜 선택 드롭다운 (5일 단위 그룹)
// - newsArchiveList: 뉴스 목록이 표시되는 영역
// - newsArchiveCloseBtn: 닫기 버튼
//
// 호출 위치:
// - index.html의 newsArchiveIcon 클릭 시 (initNewsArchive 함수에서 이벤트 리스너 등록)

/**
 * 이전 뉴스 오버레이 표시
 * @param {Object} gameState - 게임 상태 객체 (현재 날짜 정보 포함)
 * @description 이전 뉴스 오버레이를 열고, 5일 단위로 그룹화된 날짜 선택 드롭다운을 생성합니다.
 *              첫 번째 그룹(가장 오래된 그룹)의 뉴스를 자동으로 표시합니다.
 */
function showNewsArchive(gameState) {
    // DOM 요소 가져오기
    const overlay = document.getElementById('newsArchiveOverlay');      // 오버레이 전체
    const dropdown = document.getElementById('newsArchiveDropdown');  // 날짜 선택 드롭다운
    const newsList = document.getElementById('newsArchiveList');        // 뉴스 목록 영역
    const closeBtn = document.getElementById('newsArchiveCloseBtn');     // 닫기 버튼
    
    if (!overlay || !dropdown || !newsList) return;
    
    // 드롭다운 옵션 생성
    dropdown.innerHTML = '';
    const currentDay = gameState.day;
    
    // 5일 단위 그룹 계산
    const totalGroups = Math.ceil(currentDay / 5);
    
    // 최신 그룹부터 역순으로 생성 (최신이 위에 오도록)
    for (let groupIndex = totalGroups - 1; groupIndex >= 0; groupIndex--) {
        const startDay = groupIndex * 5 + 1;
        const endDay = Math.min(startDay + 4, currentDay);
        
        const option = document.createElement('option');
        option.value = `${startDay}-${endDay}`;
        
        if (startDay === endDay) {
            option.textContent = `${startDay}일차`;
        } else {
            option.textContent = `${startDay}-${endDay}일차`;
        }
        
        dropdown.appendChild(option);
    }
    
    // 드롭다운 변경 이벤트
    dropdown.addEventListener('change', () => {
        const value = dropdown.value;
        const [startDay, endDay] = value.split('-').map(Number);
        displayNewsForGroup(startDay, endDay, gameState);
    });
    
    // 첫 번째 그룹 선택 및 표시 (가장 오래된 그룹)
    if (dropdown.options.length > 0) {
        dropdown.selectedIndex = dropdown.options.length - 1;
        const firstValue = dropdown.value;
        const [firstStartDay, firstEndDay] = firstValue.split('-').map(Number);
        displayNewsForGroup(firstStartDay, firstEndDay, gameState);
    }
    
    // 닫기 버튼 이벤트
    closeBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeNewsArchive();
    };
    
    // ESC 키로 닫기 (document에 추가하여 확실하게 작동)
    const handleEscape = (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (overlay.classList.contains('active')) {
                e.preventDefault();
                e.stopPropagation();
                closeNewsArchive();
            }
        }
    };
    
    // 기존 핸들러 제거 후 새로 추가 (중복 방지)
    if (overlay._escapeHandler) {
        document.removeEventListener('keydown', overlay._escapeHandler);
    }
    overlay._escapeHandler = handleEscape;
    document.addEventListener('keydown', handleEscape, true);
    
    // 오버레이 클릭 시 닫기 (패널 내부 클릭은 제외)
    const handleOverlayClick = (e) => {
        if (e.target === overlay) {
            closeNewsArchive();
        }
    };
    
    // 기존 클릭 핸들러 제거 후 새로 추가
    if (overlay._clickHandler) {
        overlay.removeEventListener('click', overlay._clickHandler);
    }
    overlay._clickHandler = handleOverlayClick;
    overlay.addEventListener('click', handleOverlayClick);
    
    overlay.classList.add('active');
}

// 특정 날짜의 뉴스 표시 (단일 날짜)
function displayNewsForDay(day, gameState) {
    const newsList = document.getElementById('newsArchiveList');
    if (!newsList) return;
    
    newsList.innerHTML = '';
    
    // 해당 날짜의 뉴스 가져오기
    let dayNews = [];
    if (typeof getArchivedNewsForDay === 'function') {
        dayNews = getArchivedNewsForDay(day);
    } else {
        // 폴백: 현재 게임 상태에서 가져오기
        if (gameState && gameState.news) {
            dayNews = gameState.news.filter(n => n.day === day);
        }
    }
    
    if (dayNews.length === 0) {
        const noNews = document.createElement('div');
        noNews.className = 'news-archive-item';
        noNews.style.textAlign = 'center';
        noNews.style.color = '#888';
        noNews.textContent = `${day}일차의 뉴스가 없습니다.`;
        newsList.appendChild(noNews);
        return;
    }
    
    // 뉴스 항목 생성
    dayNews.forEach(news => {
        const newsItem = createNewsItem(news);
        newsList.appendChild(newsItem);
    });
}

// 특정 그룹의 뉴스 표시 (5일 단위, 최신순)
function displayNewsForGroup(startDay, endDay, gameState) {
    const newsList = document.getElementById('newsArchiveList');
    if (!newsList) return;
    
    newsList.innerHTML = '';
    
    // 그룹 내 모든 날짜의 뉴스 수집 (최신순: endDay -> startDay)
    const allNews = [];
    for (let day = endDay; day >= startDay; day--) {
        let dayNews = [];
        if (typeof getArchivedNewsForDay === 'function') {
            dayNews = getArchivedNewsForDay(day);
        } else {
            // 폴백: 현재 게임 상태에서 가져오기
            if (gameState && gameState.news) {
                dayNews = gameState.news.filter(n => n.day === day);
            }
        }
        
        if (dayNews.length > 0) {
            // 날짜 구분 헤더 추가
            const dayHeader = document.createElement('div');
            dayHeader.className = 'news-archive-day-header';
            dayHeader.textContent = `${day}일차`;
            newsList.appendChild(dayHeader);
            
            // 해당 날짜의 뉴스 추가
            dayNews.forEach(news => {
                const newsItem = createNewsItem(news);
                newsList.appendChild(newsItem);
            });
        }
    }
    
    if (newsList.children.length === 0) {
        const noNews = document.createElement('div');
        noNews.className = 'news-archive-item';
        noNews.style.textAlign = 'center';
        noNews.style.color = '#888';
        noNews.textContent = `${startDay}-${endDay}일차의 뉴스가 없습니다.`;
        newsList.appendChild(noNews);
    }
}

// 뉴스 항목 생성 헬퍼 함수
function createNewsItem(news) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-archive-item';
    
    const title = document.createElement('div');
    title.className = 'news-archive-title';
    title.textContent = news.title || '제목 없음';
    newsItem.appendChild(title);
    
    const content = document.createElement('div');
    content.className = 'news-archive-content-text';
    content.textContent = news.content || news.fullContent || '내용 없음';
    newsItem.appendChild(content);
    
    const time = document.createElement('div');
    time.className = 'news-archive-time';
    time.textContent = `${news.day}일차`;
    newsItem.appendChild(time);
    
    return newsItem;
}

// 이전 뉴스 오버레이 닫기
function closeNewsArchive() {
    const overlay = document.getElementById('newsArchiveOverlay');
    if (!overlay) return;
    
    // ESC 키 핸들러 제거
    if (overlay._escapeHandler) {
        document.removeEventListener('keydown', overlay._escapeHandler, true);
        overlay._escapeHandler = null;
    }
    
    // 클릭 핸들러 제거
    if (overlay._clickHandler) {
        overlay.removeEventListener('click', overlay._clickHandler);
        overlay._clickHandler = null;
    }
    
    overlay.classList.remove('active');
    overlay.blur();
    overlay.removeAttribute('tabindex');
}

// 이전 뉴스 아이콘 초기화
function initNewsArchive() {
    const archiveIcon = document.getElementById('newsArchiveIcon');
    if (!archiveIcon) return;
    
    archiveIcon.addEventListener('click', () => {
        if (window.gameInstance && window.gameInstance.state) {
            showNewsArchive(window.gameInstance.state);
        }
    });
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsArchive);
} else {
    initNewsArchive();
}

