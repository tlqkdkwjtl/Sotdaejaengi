// 환경설정 UI

/**
 * 환경설정 오버레이 열기
 */
function openSettingsOverlay() {
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) {
        overlay.classList.add('active');
        // 저장된 테마 설정 불러오기
        loadThemeSettings();
    }
}

/**
 * 환경설정 오버레이 닫기
 */
function closeSettingsOverlay() {
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * 테마 설정 불러오기
 */
function loadThemeSettings() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeDark = document.getElementById('themeDark');
    const themeLight = document.getElementById('themeLight');
    
    if (themeDark && themeLight) {
        if (savedTheme === 'light') {
            themeLight.checked = true;
            applyTheme('light');
        } else {
            themeDark.checked = true;
            applyTheme('dark');
        }
    }
}

/**
 * 테마 적용
 * @param {string} theme - 'dark' 또는 'light'
 */
function applyTheme(theme) {
    const body = document.body;
    
    if (theme === 'light') {
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
    }
    
    // localStorage에 저장
    localStorage.setItem('theme', theme);
}

/**
 * 테마 전환 이벤트 초기화
 */
function initThemeToggle() {
    const themeDark = document.getElementById('themeDark');
    const themeLight = document.getElementById('themeLight');
    
    if (themeDark) {
        themeDark.addEventListener('change', function() {
            if (this.checked) {
                applyTheme('dark');
            }
        });
    }
    
    if (themeLight) {
        themeLight.addEventListener('change', function() {
            if (this.checked) {
                applyTheme('light');
            }
        });
    }
}

/**
 * 환경설정 박스 클릭 이벤트
 */
function initSettingsBox() {
    const settingsBox = document.getElementById('settingsBox');
    
    if (settingsBox) {
        settingsBox.addEventListener('click', function() {
            openSettingsOverlay();
        });
    }
}

/**
 * 환경설정 닫기 버튼 이벤트
 */
function initSettingsCloseBtn() {
    const closeBtn = document.getElementById('settingsCloseBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeSettingsOverlay();
        });
    }
    
    // 오버레이 배경 클릭 시 닫기
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeSettingsOverlay();
            }
        });
    }
}

/**
 * 환경설정 초기화
 */
function initSettings() {
    initSettingsBox();
    initSettingsCloseBtn();
    initThemeToggle();
    // 저장된 테마 적용
    loadThemeSettings();
}

// 전역으로 노출
window.initSettings = initSettings;
window.openSettingsOverlay = openSettingsOverlay;
window.closeSettingsOverlay = closeSettingsOverlay;
window.applyTheme = applyTheme;

// 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    initSettings();
}

