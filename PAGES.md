# GitHub Pages와 Google Sheets 배포

브라우저 앱: `https://teacherTG.github.io/dh_shoot2/`

`pages/main.tsx`는 기존 수업 화면을 불러오며, `lib/class-api.ts`가 Google Apps Script에 요청합니다. `docs/`를 GitHub Pages의 배포 폴더로 사용합니다.

## 수정 후 빌드

```sh
npm ci
npm run build:pages
```

생성된 `docs/assets/`와 수정한 소스를 함께 커밋하세요. GitHub 설정에서 Pages의 Source를 Deploy from a branch, Branch를 main, 폴더를 /docs로 선택합니다.

## Google 저장 서버

`google-apps-script/Code.gs`를 Apps Script 편집기에 넣습니다. 스크립트 속성의 `SPREADSHEET_ID`에 비공개 시트 ID를 설정하고 `setup`을 실행합니다. 시트 탭과 첫 행은 다음과 같습니다.

- 기록: id, classroom, student, score, createdAt
- 명렬표: classroom, student, name

`setup`이 생성한 수업 코드는 스크립트 속성 `CLASS_CODE`에만 저장됩니다. 실제 코드나 학생 데이터는 GitHub에 올리지 마세요. 웹앱은 소유자로 실행하고 모든 사용자가 호출할 수 있도록 배포하되, 모든 데이터 조회·저장은 서버에서 수업 코드를 검사합니다. 배포 URL은 `pages/main.tsx`에 설정합니다.

수업 코드를 아는 사람은 명렬표와 기록을 조회·등록할 수 있습니다. 공용 태블릿에서는 사용 후 ‘수업 나가기’를 누르세요. 시트 자체의 공유 설정은 비공개로 유지합니다. 수업 코드를 바꾸려면 Script Properties의 `CLASS_CODE`를 변경합니다.

시간은 서버의 UTC ISO 문자열로 저장하고 화면에서 기기 시간대로 표시합니다. 중복 요청은 기록 ID로 구분하며, 동시에 들어오는 저장 요청은 잠금으로 처리합니다. 기존 Sites용 서버 파일은 이전 버전 보존용이며 Pages에서는 실행하지 않습니다.
