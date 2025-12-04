// 조언자 UI 시스템
// 조언대사박스와 조언자 박스의 표시 및 관리를 담당합니다.

// 조언 대사 표시
function displayAdvisorDialogue(text) {
    const dialogueBox = document.getElementById('advisorDialogueBox');
    if (!dialogueBox) return;
    
    dialogueBox.textContent = text || '';
}

// 조언자 이미지 설정
function setAdvisorImage(imageUrl) {
    const advisorBox = document.getElementById('advisorBox');
    if (!advisorBox) return;
    
    if (imageUrl) {
        advisorBox.style.backgroundImage = `url('${imageUrl}')`;
        advisorBox.style.backgroundSize = 'cover';
        advisorBox.style.backgroundPosition = 'center';
        advisorBox.style.backgroundRepeat = 'no-repeat';
    } else {
        advisorBox.style.backgroundImage = '';
        advisorBox.style.backgroundColor = '#1a1a1a';
    }
}

// 조언자 UI 초기화
function initAdvisorUI() {
    const dialogueBox = document.getElementById('advisorDialogueBox');
    const advisorBox = document.getElementById('advisorBox');
    
    if (dialogueBox) {
        dialogueBox.textContent = '';
    }
    
    if (advisorBox) {
        advisorBox.style.backgroundColor = '#1a1a1a';
    }
}

// 조언대사박스스텐드 대사 표시
function displayAdvisorStandDialogue(text, type = 'info') {
    // type: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
    let dialogueBoxId;
    if (type === 'info') {
        dialogueBoxId = 'advisorDialogueBoxStand';
    } else if (type === 'event') {
        dialogueBoxId = 'advisorDialogueBoxStandEvent';
    } else if (type === 'news') {
        dialogueBoxId = 'advisorDialogueBoxStandNews';
    }
    
    const dialogueBox = document.getElementById(dialogueBoxId);
    if (!dialogueBox) return;
    
    dialogueBox.textContent = text || '';
}

// 조언자박스스텐드 이미지 설정
function setAdvisorStandImage(imageUrl, type = 'info') {
    // type: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
    let advisorBoxId;
    if (type === 'info') {
        advisorBoxId = 'advisorBoxStand';
    } else if (type === 'event') {
        advisorBoxId = 'advisorBoxStandEvent';
    } else if (type === 'news') {
        advisorBoxId = 'advisorBoxStandNews';
    }
    
    const advisorBox = document.getElementById(advisorBoxId);
    if (!advisorBox) return;
    
    if (imageUrl) {
        advisorBox.style.backgroundImage = `url('${imageUrl}')`;
        advisorBox.style.backgroundSize = 'cover';
        advisorBox.style.backgroundPosition = 'center';
        advisorBox.style.backgroundRepeat = 'no-repeat';
    } else {
        advisorBox.style.backgroundImage = '';
        advisorBox.style.backgroundColor = '#1a1a1a';
    }
}

// 조언 스텐드 표시
function showAdvisorStand(type = 'info') {
    // type: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
    let overlayId;
    if (type === 'info') {
        overlayId = 'infoOverlay';
    } else if (type === 'event') {
        overlayId = 'eventResponseOverlay';
    } else if (type === 'news') {
        overlayId = 'newsArchiveOverlay';
    }
    
    const container = document.querySelector(`#${overlayId} .advisor-stand-container`);
    if (container) {
        container.style.display = 'block';
    }
}

// 조언 스텐드 숨김
function hideAdvisorStand(type = 'info') {
    // type: 'info' (정보 패널), 'event' (사건 대응), 'news' (이전 뉴스)
    let overlayId;
    if (type === 'info') {
        overlayId = 'infoOverlay';
    } else if (type === 'event') {
        overlayId = 'eventResponseOverlay';
    } else if (type === 'news') {
        overlayId = 'newsArchiveOverlay';
    }
    
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

