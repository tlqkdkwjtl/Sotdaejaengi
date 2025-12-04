# 음악 파일 저장 위치

이 폴더에 음악 파일을 넣거나, 웹 링크를 사용할 수 있습니다.

## 지원 형식
- MP3 (.mp3)
- OGG (.ogg)
- WAV (.wav)
- 웹 URL (http:// 또는 https://)

## 사용 방법

### 방법 1: 로컬 파일 사용

1. 음악 파일을 이 폴더에 복사합니다.
   예: `audio/bgm1.mp3`, `audio/music2.ogg`

2. `game-content/ui/music-list.js` 파일의 `Playlist` 배열에 음악 정보를 추가합니다:

```javascript
const Playlist = [
    {
        id: 1,
        title: '노래 제목',
        artist: '아티스트 이름',
        file: 'audio/bgm1.mp3'  // 로컬 파일 경로
    }
];
```

### 방법 2: 웹 링크 사용

1. `game-content/ui/music-list.js` 파일의 `Playlist` 배열에 음악 정보를 추가합니다:

```javascript
const Playlist = [
    {
        id: 1,
        title: '온라인 음악',
        artist: '아티스트 이름',
        file: 'https://example.com/music.mp3'  // 웹 URL
    }
];
```

**참고**: 웹 링크를 사용할 때는 CORS(Cross-Origin Resource Sharing) 정책을 확인하세요. 
일부 서버는 다른 도메인에서의 접근을 차단할 수 있습니다.

3. 게임에서 노래 목록에서 선택하거나 다음 재생 큐에 추가할 수 있습니다.

