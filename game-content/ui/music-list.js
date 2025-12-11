// 현재 재생 곡 및 재생 목록 시스템
// 현재 재생 중인 곡과 다음 재생될 곡 목록을 표시합니다.

// 재생 목록 데이터
// 음악 파일을 추가하려면:
// 1. 로컬 파일: audio/ 폴더에 음악 파일을 넣고 경로를 지정 (예: 'audio/music1.mp3')
// 2. 웹 링크: URL을 직접 지정 (예: 'https://example.com/music.mp3')
// 3. 아래 Playlist 배열에 음악 정보를 추가합니다
//    - id: 고유 번호
//    - title: 노래 제목
//    - artist: 아티스트 이름
//    - file: 음악 파일 경로 또는 URL (예: 'audio/bgm1.mp3' 또는 'https://example.com/music.mp3')
const Playlist = [
    {
        id: 1,
        title: '이곳은 노래가 나오는 곳입니다.',
        artist: '',
        file: '' // 음악 파일 경로 또는 URL
    }
    // 주석 처리: 현재 지원하지 않음
    // {
    //     id: 2,
    //     title: 'Dangerous Checkpoint',
    //     artist: 'CrimsonResonantTuba404311',
    //     file: 'https://www.udio.com/embed/h2d6b58LN3PehhBiJ8cqxk?embedVariant=default&utm_source=generator',
    //     type: 'embed' // 'audio' 또는 'embed'
    // }
    // 예시 (로컬 파일):
    // {
    //     id: 3,
    //     title: '배경 음악 1',
    //     artist: '아티스트',
    //     file: 'audio/bgm1.mp3'
    // },
    // 예시 (웹 링크):
    // {
    //     id: 4,
    //     title: '온라인 음악',
    //     artist: '아티스트',
    //     file: 'https://example.com/music.mp3'
    // }
];

// 현재 재생 중인 곡 인덱스
let currentMusicIndex = 0;

// 다음 재생 곡 큐
let nextQueue = [];

// 현재 재생 중인 Audio 객체
let currentAudio = null;

/**
 * 현재 재생 곡 오버레이 표시
 */
function showMusicListOverlay() {
    const overlay = document.getElementById('musicListOverlay');
    const panelBody = document.getElementById('musicListPanelBody');
    
    if (!overlay || !panelBody) return;
    
    // 현재 재생 중인 곡 정보 가져오기
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    const currentTitle = musicTitle ? musicTitle.textContent : '이곳은 노래가 나오는 곳입니다.';
    const currentArtist = musicArtist ? musicArtist.textContent : '';
    
    panelBody.innerHTML = '';
    
    // 현재 재생 중인 곡 표시
    const currentSection = document.createElement('div');
    currentSection.className = 'current-music-section';
    currentSection.style.marginBottom = '20px';
    currentSection.style.paddingBottom = '20px';
    currentSection.style.borderBottom = '2px solid #4a9eff';
    
    const currentLabel = document.createElement('div');
    currentLabel.style.color = '#888';
    currentLabel.style.fontSize = '0.8rem';
    currentLabel.style.marginBottom = '10px';
    currentLabel.textContent = '현재 재생 중';
    currentSection.appendChild(currentLabel);
    
    const currentMusicItem = document.createElement('div');
    currentMusicItem.className = 'music-list-item';
    currentMusicItem.style.padding = '15px';
    currentMusicItem.style.background = '#1a1a1a';
    currentMusicItem.style.border = '2px solid #6bcf7f';
    currentMusicItem.style.cursor = 'default';
    
    const currentTitleDiv = document.createElement('div');
    currentTitleDiv.style.color = '#6bcf7f';
    currentTitleDiv.style.fontWeight = 'bold';
    currentTitleDiv.style.marginBottom = '5px';
    currentTitleDiv.textContent = currentTitle;
    currentMusicItem.appendChild(currentTitleDiv);
    
    if (currentArtist) {
        const currentArtistDiv = document.createElement('div');
        currentArtistDiv.style.color = '#888';
        currentArtistDiv.style.fontSize = '0.9rem';
        currentArtistDiv.textContent = currentArtist;
        currentMusicItem.appendChild(currentArtistDiv);
    }
    
    currentSection.appendChild(currentMusicItem);
    panelBody.appendChild(currentSection);
    
    // 재생 컨트롤 버튼 추가
    const controlButtons = document.createElement('div');
    controlButtons.style.display = 'flex';
    controlButtons.style.gap = '10px';
    controlButtons.style.marginBottom = '20px';
    controlButtons.style.justifyContent = 'center';
    
    const pauseBtn = document.createElement('button');
    pauseBtn.textContent = '⏸ 일시정지';
    pauseBtn.style.padding = '8px 15px';
    pauseBtn.style.background = '#1a1a1a';
    pauseBtn.style.border = '2px solid #4a9eff';
    pauseBtn.style.color = '#6bcf7f';
    pauseBtn.style.cursor = 'pointer';
    pauseBtn.style.fontFamily = "'Courier New', monospace";
    pauseBtn.style.fontSize = '0.9rem';
    pauseBtn.style.transition = 'all 0.2s';
    pauseBtn.addEventListener('click', () => {
        pauseMusic();
    });
    pauseBtn.addEventListener('mouseenter', () => {
        pauseBtn.style.background = '#2a2a2a';
        pauseBtn.style.borderColor = '#6bcf7f';
        pauseBtn.style.boxShadow = '0 0 10px rgba(107, 207, 127, 0.3)';
    });
    pauseBtn.addEventListener('mouseleave', () => {
        pauseBtn.style.background = '#1a1a1a';
        pauseBtn.style.borderColor = '#4a9eff';
        pauseBtn.style.boxShadow = 'none';
    });
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '⏭ 다음 곡';
    nextBtn.style.padding = '8px 15px';
    nextBtn.style.background = '#1a1a1a';
    nextBtn.style.border = '2px solid #4a9eff';
    nextBtn.style.color = '#6bcf7f';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.fontFamily = "'Courier New', monospace";
    nextBtn.style.fontSize = '0.9rem';
    nextBtn.style.transition = 'all 0.2s';
    nextBtn.addEventListener('click', () => {
        playNextMusic();
    });
    nextBtn.addEventListener('mouseenter', () => {
        nextBtn.style.background = '#2a2a2a';
        nextBtn.style.borderColor = '#6bcf7f';
        nextBtn.style.boxShadow = '0 0 10px rgba(107, 207, 127, 0.3)';
    });
    nextBtn.addEventListener('mouseleave', () => {
        nextBtn.style.background = '#1a1a1a';
        nextBtn.style.borderColor = '#4a9eff';
        nextBtn.style.boxShadow = 'none';
    });
    
    controlButtons.appendChild(pauseBtn);
    controlButtons.appendChild(nextBtn);
    currentSection.appendChild(controlButtons);
    
    // 다음 재생될 곡 목록 표시
    const nextLabel = document.createElement('div');
    nextLabel.style.color = '#888';
    nextLabel.style.fontSize = '0.8rem';
    nextLabel.style.marginBottom = '10px';
    nextLabel.style.marginTop = '20px';
    nextLabel.textContent = '다음 재생';
    panelBody.appendChild(nextLabel);
    
    // 다음 재생 곡 큐 표시
    if (nextQueue.length === 0) {
        const noNextMusic = document.createElement('div');
        noNextMusic.style.textAlign = 'center';
        noNextMusic.style.color = '#888';
        noNextMusic.style.padding = '20px';
        noNextMusic.textContent = '다음 재생될 곡이 없습니다.';
        panelBody.appendChild(noNextMusic);
    } else {
        nextQueue.forEach((music, index) => {
            const musicItem = document.createElement('div');
            musicItem.className = 'music-list-item';
            musicItem.style.padding = '15px';
            musicItem.style.marginBottom = '10px';
            musicItem.style.background = '#1a1a1a';
            musicItem.style.border = '2px solid #4a9eff';
            musicItem.style.cursor = 'pointer';
            musicItem.style.transition = 'all 0.2s';
            
            const title = document.createElement('div');
            title.style.color = '#6bcf7f';
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.textContent = music.title;
            musicItem.appendChild(title);
            
            if (music.artist) {
                const artist = document.createElement('div');
                artist.style.color = '#888';
                artist.style.fontSize = '0.9rem';
                artist.textContent = music.artist;
                musicItem.appendChild(artist);
            }
            
            musicItem.addEventListener('mouseenter', () => {
                musicItem.style.background = '#2a2a2a';
                musicItem.style.borderColor = '#6bcf7f';
                musicItem.style.boxShadow = '0 0 10px rgba(107, 207, 127, 0.3)';
            });
            
            musicItem.addEventListener('mouseleave', () => {
                musicItem.style.background = '#1a1a1a';
                musicItem.style.borderColor = '#4a9eff';
                musicItem.style.boxShadow = 'none';
            });
            
            panelBody.appendChild(musicItem);
        });
    }
    
    overlay.classList.add('active');
    
    // ESC 키로 닫기
    const handleEscape = (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (overlay.classList.contains('active')) {
                e.preventDefault();
                e.stopPropagation();
                closeMusicListOverlay();
                document.removeEventListener('keydown', handleEscape);
            }
        }
    };
    
    document.addEventListener('keydown', handleEscape);
}

/**
 * 음악을 다음 재생 큐에 추가
 */
function addToNextQueue(music) {
    // 이미 큐에 있는지 확인
    const exists = nextQueue.some(m => m.id === music.id);
    if (!exists) {
        nextQueue.push(music);
        // 오버레이 새로고침
        showMusicListOverlay();
    }
}

/**
 * 음악 선택 (즉시 재생)
 */
function selectMusic(music) {
    // 노래 정보 업데이트
    if (typeof updateMusicInfo === 'function') {
        updateMusicInfo(music.title, music.artist);
    }
    
    // 현재 재생 인덱스 업데이트
    const musicIndex = Playlist.findIndex(m => m.id === music.id);
    if (musicIndex !== -1) {
        currentMusicIndex = musicIndex;
    }
    
    // 실제 음악 재생 로직
    if (music.file) {
        // 현재 음악 재생은 지원하지 않습니다
        console.log('현재 노래는 지원하지 않습니다.');
        if (typeof updateMusicInfo === 'function') {
            updateMusicInfo('현재 노래는 지원하지 않습니다.', '');
        }
        return;
        
        // 아래 코드는 주석 처리됨 (현재 지원하지 않음)
        /*
        if (music.type === 'embed') {
            // embed 플레이어 로직
        } else {
            // 일반 오디오 파일 재생 로직
        }
        */
    } else {
        console.log(`음악 파일이 없습니다: ${music.title}`);
        if (typeof updateMusicInfo === 'function') {
            updateMusicInfo('현재 노래는 지원하지 않습니다.', '');
        }
    }
    
    // 오버레이 새로고침하여 현재 재생 곡 업데이트
    showMusicListOverlay();
}

/**
 * 음악 일시정지
 */
function pauseMusic() {
    // embed 타입은 일시정지 불가 (Udio 플레이어가 자체 제어)
    const embedContainer = document.getElementById('musicEmbedContainer');
    if (embedContainer) {
        console.log('Embed 플레이어는 일시정지 기능을 지원하지 않습니다.');
        return;
    }
    
    // 실제 음악 일시정지 로직
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play().catch(err => {
                console.error('음악 재생 실패:', err);
            });
            console.log('음악 재생');
        } else {
            currentAudio.pause();
            console.log('음악 일시정지');
        }
    } else if (window.gameInstance && window.gameInstance.backgroundMusic) {
        const audio = window.gameInstance.backgroundMusic;
        if (audio && audio.paused !== undefined) {
            if (audio.paused) {
                audio.play().catch(err => {
                    console.error('음악 재생 실패:', err);
                });
                console.log('음악 재생');
            } else {
                audio.pause();
                console.log('음악 일시정지');
            }
        }
    }
}

/**
 * 다음 곡 재생
 */
function playNextMusic() {
    if (nextQueue.length > 0) {
        const nextMusic = nextQueue.shift(); // 큐에서 첫 번째 곡 가져오기
        selectMusic(nextMusic);
    } else {
        // 큐가 비어있으면 다음 곡으로 이동
        const nextIndex = (currentMusicIndex + 1) % Playlist.length;
        if (Playlist[nextIndex]) {
            selectMusic(Playlist[nextIndex]);
        }
    }
}

/**
 * 현재 재생 곡 오버레이 닫기
 */
function closeMusicListOverlay() {
    const overlay = document.getElementById('musicListOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// 전역으로 노출
window.showMusicListOverlay = showMusicListOverlay;
window.closeMusicListOverlay = closeMusicListOverlay;
window.selectMusic = selectMusic;
window.addToNextQueue = addToNextQueue;
window.pauseMusic = pauseMusic;
window.playNextMusic = playNextMusic;
window.Playlist = Playlist;
window.currentMusicIndex = currentMusicIndex;
window.nextQueue = nextQueue;

// 닫기 버튼 이벤트
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const closeBtn = document.getElementById('musicListCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // 노래 정보 오버레이도 함께 닫기
                if (typeof closeMusicInfoOverlay === 'function') {
                    closeMusicInfoOverlay();
                } else {
                    closeMusicListOverlay();
                }
            });
        }
    });
} else {
    const closeBtn = document.getElementById('musicListCloseBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // 노래 정보 오버레이도 함께 닫기
            if (typeof closeMusicInfoOverlay === 'function') {
                closeMusicInfoOverlay();
            } else {
                closeMusicListOverlay();
            }
        });
    }
}

