// 조언자 UI 시스템
// 조언대사박스와 조언자 박스의 표시 및 관리를 담당합니다.
//
// 주요 DOM 요소 (index.html에 정의됨):
// - advisorDialogueBox: 메인 화면의 조언 대사 박스 (오른쪽 상단, 시간대 이미지 창 아래)
// - advisorBox: 메인 화면의 조언자 이미지 박스 (advisorDialogueBox 아래)
// - advisorDialogueBoxStand: 오버레이용 조언 대사 박스 (정보 패널용)
// - advisorDialogueBoxStandEvent: 오버레이용 조언 대사 박스 (사건 대응용)
// - advisorDialogueBoxStandNews: 오버레이용 조언 대사 박스 (이전 뉴스용)
// - advisorBoxStand: 오버레이용 조언자 이미지 박스 (정보 패널용)
// - advisorBoxStandEvent: 오버레이용 조언자 이미지 박스 (사건 대응용)
// - advisorBoxStandNews: 오버레이용 조언자 이미지 박스 (이전 뉴스용)

/**
 * 조언 대사 표시 (메인 화면용)
 * @param {string} text - 표시할 대사 텍스트
 * @description 메인 화면 오른쪽 상단의 조언대사박스에 텍스트를 표시합니다.
 *              호출 위치: game-content/advisor/advisor.js의 AIAdvisor.generateRecommendation()
 */
function displayAdvisorDialogue(text) {
    const dialogueBox = document.getElementById('advisorDialogueBox');
    if (!dialogueBox) return;
    
    dialogueBox.textContent = text || '';
}

/**
 * 조언자 이미지 설정 (메인 화면용)
 * @param {string} imageUrl - 이미지 파일 경로 (예: 'images/character.png')
 * @description 메인 화면 오른쪽의 조언자 박스에 이미지를 배경으로 설정합니다.
 *              호출 위치: game-content/advisor/advisor.js의 AIAdvisor.generateRecommendation()
 */
function setAdvisorImage(imageUrl) {
    const advisorBox = document.getElementById('advisorBox');
    if (!advisorBox) return;
    
    if (imageUrl) {
        advisorBox.style.backgroundImage = `url('${imageUrl}')`;
        advisorBox.style.backgroundSize = 'cover';
        advisorBox.style.backgroundPosition = 'center';
        advisorBox.style.backgroundRepeat = 'no-repeat';
        advisorBox.style.backgroundColor = 'transparent'; // 배경색 제거하여 이미지가 보이도록
    } else {
        advisorBox.style.backgroundImage = '';
        advisorBox.style.backgroundColor = '#1a1a1a';
    }
}

/**
 * 조언자 UI 초기화
 * @description 페이지 로드 시 조언자 박스들을 초기 상태로 설정합니다.
 *              DOM 로드 완료 시 자동 호출됩니다.
 */
function initAdvisorUI() {
    const dialogueBox = document.getElementById('advisorDialogueBox');
    const advisorBox = document.getElementById('advisorBox');
    
    if (dialogueBox) {
        dialogueBox.textContent = '';
    }
    
    if (advisorBox) {
        // 기본 조언자 이미지 설정
        setAdvisorImage('images/Advisor1.png');
    }
}

/**
 * 조언대사박스스텐드 대사 표시 (오버레이용)
 * @param {string} text - 표시할 대사 텍스트
 * @param {string} type - 오버레이 타입: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
 * @description 오버레이가 열렸을 때 오른쪽에 표시되는 조언 대사 박스에 텍스트를 표시합니다.
 *              호출 위치: 
 *              - 'info': game-content/icons/*.js의 정보 패널 표시 함수들
 *              - 'event': game-content/events/event-response-ui.js의 showEventResponseOptionsUI()
 *              - 'news': game-content/news/news-archive-ui.js의 showNewsArchive()
 */
function displayAdvisorStandDialogue(text, type = 'info') {
    // type에 따라 사용할 DOM 요소 ID 결정
    let dialogueBoxId;
    if (type === 'info') {
        dialogueBoxId = 'advisorDialogueBoxStand'; // index.html의 infoOverlay 내부
    } else if (type === 'event') {
        dialogueBoxId = 'advisorDialogueBoxStandEvent'; // index.html의 eventResponseOverlay 내부
    } else if (type === 'news') {
        dialogueBoxId = 'advisorDialogueBoxStandNews'; // index.html의 newsArchiveOverlay 내부
    }
    
    const dialogueBox = document.getElementById(dialogueBoxId);
    if (!dialogueBox) return;
    
    dialogueBox.textContent = text || '';
}

/**
 * 조언자박스스텐드 이미지 설정 (오버레이용)
 * @param {string} imageUrl - 이미지 파일 경로 (예: 'images/character.png')
 * @param {string} type - 오버레이 타입: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
 * @description 오버레이가 열렸을 때 오른쪽에 표시되는 조언자 이미지 박스에 이미지를 설정합니다.
 *              호출 위치:
 *              - 'event': game-content/events/event-response-ui.js의 showEventResponseOptionsUI()
 *                        (event.character가 있을 때 캐릭터 이미지 표시)
 */
function setAdvisorStandImage(imageUrl, type = 'info') {
    // type에 따라 사용할 DOM 요소 ID 결정
    let advisorBoxId;
    if (type === 'info') {
        advisorBoxId = 'advisorBoxStand'; // index.html의 infoOverlay 내부
    } else if (type === 'event') {
        advisorBoxId = 'advisorBoxStandEvent'; // index.html의 eventResponseOverlay 내부
    } else if (type === 'news') {
        advisorBoxId = 'advisorBoxStandNews'; // index.html의 newsArchiveOverlay 내부
    }
    
    const advisorBox = document.getElementById(advisorBoxId);
    if (!advisorBox) {
        console.warn(`조언자 이미지 박스를 찾을 수 없습니다: ${advisorBoxId}`);
        return;
    }
    
    if (imageUrl) {
        // 인라인 스타일로 강제 설정 (CSS보다 우선순위 높음)
        advisorBox.style.backgroundImage = `url('${imageUrl}')`;
        advisorBox.style.backgroundSize = 'cover';
        advisorBox.style.backgroundPosition = 'center';
        advisorBox.style.backgroundRepeat = 'no-repeat';
        advisorBox.style.backgroundColor = 'transparent';
        // CSS의 background 속성 제거
        advisorBox.style.background = `url('${imageUrl}') center/cover no-repeat`;
    } else {
        advisorBox.style.backgroundImage = '';
        advisorBox.style.background = '#0a0a0a';
        advisorBox.style.backgroundColor = '#1a1a1a';
    }
}

/**
 * 조언 스텐드 표시 (오버레이용)
 * @param {string} type - 오버레이 타입: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
 * @description 오버레이가 열렸을 때 오른쪽에 조언 스텐드(대사 박스 + 이미지 박스)를 표시합니다.
 *              호출 위치: 각 오버레이를 여는 함수에서 자동 호출
 */
function showAdvisorStand(type = 'info') {
    // type에 따라 오버레이 ID 결정
    let overlayId;
    if (type === 'info') {
        overlayId = 'infoOverlay'; // index.html의 정보 패널 오버레이
    } else if (type === 'event') {
        overlayId = 'eventResponseOverlay'; // index.html의 사건 대응 오버레이
    } else if (type === 'news') {
        overlayId = 'newsArchiveOverlay'; // index.html의 이전 뉴스 오버레이
    }
    
    // 오버레이 내부의 advisor-stand-container 요소 찾기
    const container = document.querySelector(`#${overlayId} .advisor-stand-container`);
    if (container) {
        container.style.display = 'block';
    }
    
    // 오버레이용 조언자 이미지 설정 (Advisor1.png)
    setAdvisorStandImage('images/Advisor1.png', type);
}

/**
 * 조언 스텐드 숨김 (오버레이용)
 * @param {string} type - 오버레이 타입: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
 * @description 오버레이가 닫힐 때 조언 스텐드를 숨깁니다.
 *              호출 위치: 각 오버레이를 닫는 함수에서 자동 호출
 */
function hideAdvisorStand(type = 'info') {
    // type에 따라 오버레이 ID 결정
    let overlayId;
    if (type === 'info') {
        overlayId = 'infoOverlay';
    } else if (type === 'event') {
        overlayId = 'eventResponseOverlay';
    } else if (type === 'news') {
        overlayId = 'newsArchiveOverlay';
    }
    
    // 오버레이 내부의 advisor-stand-container 요소 숨기기
    const container = document.querySelector(`#${overlayId} .advisor-stand-container`);
    if (container) {
        container.style.display = 'none';
    }
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvisorUI);
} else {
    initAdvisorUI();
}

