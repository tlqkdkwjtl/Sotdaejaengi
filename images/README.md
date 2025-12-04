# 이미지 파일 저장 위치

이 폴더에 게임에서 사용할 이미지 파일을 넣으세요.

## 지원 형식
- PNG (.png)
- JPG/JPEG (.jpg, .jpeg)
- GIF (.gif)
- SVG (.svg)
- WebP (.webp)

## 사용 방법

1. 이미지 파일을 이 폴더에 복사합니다.
   예: `images/character.png`, `images/background.jpg`

2. 코드에서 이미지를 사용할 때 경로를 지정합니다:
   ```javascript
   const imagePath = 'images/character.png';
   ```

3. HTML에서 사용할 때:
   ```html
   <img src="images/character.png" alt="캐릭터">
   ```

4. CSS에서 사용할 때:
   ```css
   background-image: url('images/background.jpg');
   ```

