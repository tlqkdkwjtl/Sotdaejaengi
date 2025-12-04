// 현재 재생 중인 노래 정보 표시

/**
 * 음악 정보 업데이트
 * @param {string} title - 노래 제목
 * @param {string} artist - 아티스트/출처
 */
function updateMusicInfo(title, artist) {
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    
    if (musicTitle) {
        musicTitle.textContent = title || '-';
    }
    
    if (musicArtist) {
        musicArtist.textContent = artist || '-';
    }
}

/**
 * 음악 정보 초기화
 */
function initMusicInfo() {
    // 임시 주석 텍스트 표시
    updateMusicInfo('이곳은 노래가 나오는 곳입니다.', '');
    
    // 노래 정보 박스 클릭 이벤트 추가
    const musicInfoBox = document.getElementById('musicInfoBox');
    if (musicInfoBox) {
        musicInfoBox.style.cursor = 'pointer';
        musicInfoBox.addEventListener('click', () => {
            showMusicInfoOverlay();
        });
    }
}

/**
 * 음량 가져오기 (localStorage에서)
 */
function getMusicVolume() {
    const saved = localStorage.getItem('musicVolume');
    return saved !== null ? parseFloat(saved) : 1.0; // 기본값 100%
}

/**
 * 음량 설정
 */
function setMusicVolume(volume) {
    // 0.0 ~ 1.0 범위로 제한
    volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('musicVolume', volume.toString());
    
    // 실제 오디오 요소가 있으면 음량 조절
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = volume;
    });
    
    // 배경 음악이 있다면 조절
    if (window.gameInstance && window.gameInstance.backgroundMusic) {
        window.gameInstance.backgroundMusic.volume = volume;
    }
    
    // music-list.js의 currentAudio도 조절
    if (window.currentAudio) {
        window.currentAudio.volume = volume;
    }
    
    return volume;
}

/**
 * 노래 정보 오버레이 표시
 */
function showMusicInfoOverlay() {
    const overlay = document.getElementById('musicInfoOverlay');
    const panelBody = document.getElementById('musicInfoPanelBody');
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    
    if (!overlay || !panelBody) return;
    
    // 현재 노래 정보 표시
    const title = musicTitle ? musicTitle.textContent : '-';
    const artist = musicArtist ? musicArtist.textContent : '-';
    
    // 현재 음량 가져오기
    const currentVolume = getMusicVolume();
    const volumePercent = Math.round(currentVolume * 100);
    
    panelBody.innerHTML = `
        <div class="info-section">
            <div class="volume-control">
                <label for="musicVolumeSlider" style="display: block; margin-bottom: 10px; color: #6bcf7f;">
                    음량: <span id="musicVolumeDisplay">${volumePercent}%</span>
                </label>
                <input 
                    type="range" 
                    id="musicVolumeSlider" 
                    min="0" 
                    max="100" 
                    value="${volumePercent}" 
                    class="volume-slider"
                    style="width: 100%;"
                />
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.8rem; color: #888;">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
        <div class="info-section">
            <h3>현재 재생 중</h3>
            <p><strong>제목:</strong> ${title}</p>
            <p><strong>아티스트:</strong> ${artist || '정보 없음'}</p>
        </div>
        <div class="info-section">
            <h3>노래 목록</h3>
            <div id="musicListContainer" style="margin-top: 15px;">
                <!-- 노래 목록이 동적으로 생성됩니다 -->
            </div>
        </div>
    `;
    
    // 노래 목록 표시
    const musicListContainer = document.getElementById('musicListContainer');
    if (musicListContainer && typeof window.Playlist !== 'undefined') {
        const playlist = window.Playlist || [];
        
        // file이 있는 항목만 필터링 (빈 file 제외)
        const availableSongs = playlist.filter(m => m.file && m.file.trim() !== '');
        
        if (availableSongs.length === 0) {
            const noMusic = document.createElement('div');
            noMusic.style.textAlign = 'center';
            noMusic.style.color = '#888';
            noMusic.style.padding = '20px';
            noMusic.textContent = '현재 노래는 지원하지 않습니다.';
            musicListContainer.appendChild(noMusic);
        } else {
            availableSongs.forEach((music, index) => {
                const musicItem = document.createElement('div');
                musicItem.className = 'music-list-item';
                musicItem.style.padding = '12px';
                musicItem.style.marginBottom = '8px';
                musicItem.style.background = '#1a1a1a';
                musicItem.style.border = '2px solid #4a9eff';
                musicItem.style.cursor = 'pointer';
                musicItem.style.transition = 'all 0.2s';
                
                const title = document.createElement('div');
                title.style.color = '#6bcf7f';
                title.style.fontWeight = 'bold';
                title.style.marginBottom = '5px';
                title.textContent = music.title || '제목 없음';
                musicItem.appendChild(title);
                
                if (music.artist) {
                    const artist = document.createElement('div');
                    artist.style.color = '#888';
                    artist.style.fontSize = '0.85rem';
                    artist.textContent = music.artist;
                    musicItem.appendChild(artist);
                }
                
                // 현재 재생 중인 곡인지 확인
                const currentTitle = musicTitle ? musicTitle.textContent : '';
                if (music.title === currentTitle) {
                    musicItem.style.borderColor = '#6bcf7f';
                    musicItem.style.background = '#1a2a1a';
                }
                
                // 클릭 시 다음 재생 큐에 추가
                musicItem.addEventListener('click', () => {
                    // 다음 재생 큐에 추가
                    if (typeof window.addToNextQueue === 'function') {
                        window.addToNextQueue(music);
                    }
                    // 오른쪽 패널도 업데이트
                    if (typeof showMusicListOverlay === 'function') {
                        showMusicListOverlay();
                    }
                });
                
                musicItem.addEventListener('mouseenter', () => {
                    musicItem.style.background = '#2a2a2a';
                    musicItem.style.borderColor = '#6bcf7f';
                    musicItem.style.boxShadow = '0 0 10px rgba(107, 207, 127, 0.3)';
                });
                
                musicItem.addEventListener('mouseleave', () => {
                    const isCurrent = music.title === currentTitle;
                    musicItem.style.background = isCurrent ? '#1a2a1a' : '#1a1a1a';
                    musicItem.style.borderColor = isCurrent ? '#6bcf7f' : '#4a9eff';
                    musicItem.style.boxShadow = 'none';
                });
                
                musicListContainer.appendChild(musicItem);
            });
        }
    }
    
    // 음량 슬라이더 이벤트
    const volumeSlider = document.getElementById('musicVolumeSlider');
    const volumeDisplay = document.getElementById('musicVolumeDisplay');
    
    if (volumeSlider && volumeDisplay) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            volumeDisplay.textContent = `${e.target.value}%`;
            setMusicVolume(volume);
        });
    }
    
    overlay.classList.add('active');
    
    // 전체 음악목록 오버레이도 함께 표시
    if (typeof showMusicListOverlay === 'function') {
        showMusicListOverlay();
    }
    
    // ESC 키로 닫기 (노래 오버레이만 닫기)
    const handleEscape = (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (overlay.classList.contains('active')) {
                // 전체 음악목록 오버레이가 열려있으면 먼저 닫기
                const musicListOverlay = document.getElementById('musicListOverlay');
                if (musicListOverlay && musicListOverlay.classList.contains('active')) {
                    if (typeof closeMusicListOverlay === 'function') {
                        closeMusicListOverlay();
                    }
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                closeMusicInfoOverlay();
                document.removeEventListener('keydown', handleEscape);
            }
        }
    };
    
    document.addEventListener('keydown', handleEscape);
}

/**
 * 노래 정보 오버레이 닫기
 */
function closeMusicInfoOverlay() {
    const overlay = document.getElementById('musicInfoOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // 전체 음악목록 오버레이도 함께 닫기
    if (typeof closeMusicListOverlay === 'function') {
        closeMusicListOverlay();
    }
}

/**
 * 노래 설정 오버레이 열기 (노래 정보 + 전체 음악목록 함께)
 */
function showMusicSettingsOverlay() {
    showMusicInfoOverlay();
}

// 닫기 버튼 이벤트
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const closeBtn = document.getElementById('musicInfoCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMusicInfoOverlay);
        }
        
        // 오버레이 배경 클릭 시 닫기
        const overlay = document.getElementById('musicInfoOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeMusicInfoOverlay();
                }
            });
        }
    });
} else {
    const closeBtn = document.getElementById('musicInfoCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMusicInfoOverlay);
    }
    
    // 오버레이 배경 클릭 시 닫기
    const overlay = document.getElementById('musicInfoOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeMusicInfoOverlay();
            }
        });
    }
}

// 전역으로 노출
window.updateMusicInfo = updateMusicInfo;
window.initMusicInfo = initMusicInfo;
window.getMusicVolume = getMusicVolume;
window.setMusicVolume = setMusicVolume;

// 초기화 시 저장된 음량 적용
function applySavedVolume() {
    const volume = getMusicVolume();
    setMusicVolume(volume);
}

// 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMusicInfo();
        applySavedVolume();
    });
} else {
    initMusicInfo();
    applySavedVolume();
}

