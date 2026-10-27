# 레이저 사격 클래스 · dh_shoot2

중학교 1학년 2학기 7~11반 레이저 사격 수업 웹앱입니다.

## 실행 주소

https://laser-class-seven-eleven.tg-1.chatgpt.site/

현재 소유자 계정으로 로그인해서 사용하는 비공개 배포입니다.

## 기능

- 안전, 자세, 조준선, 호흡 수업 가이드
- 아이언부터 챌린저까지 티어 안내
- 반·번호·점수 기록, 반별 및 전체 순위, 도전 이력
- 엑셀(.xlsx), CSV, 붙여넣기 명렬표 등록 및 학생 이름 자동 연결
- Cloudflare D1에 명렬표와 점수 영구 저장

## 개발

Node.js 22.13 이상과 npm을 사용합니다.

```sh
npm ci
npm run dev
npm run build
```

기술 구성: React, Vinext, Cloudflare Workers, D1, Drizzle, ExcelJS.

## 배포

현재 서비스는 Sites에서 배포되며 `.openai/hosting.json`에 기존 프로젝트와 DB 바인딩이 지정되어 있습니다. GitHub는 소스 저장소입니다. GitHub에 커밋하는 것만으로 Sites가 자동 재배포되지는 않습니다.

서버 API와 D1을 사용하므로 정적 호스팅인 GitHub Pages에 소스만 올려서는 기록 기능을 실행할 수 없습니다. Sites에서 동일 프로젝트로 저장·게시해야 기존 DB가 유지됩니다.

`drizzle/`의 적용된 마이그레이션을 변경하거나 삭제하지 말고 새 마이그레이션을 추가하세요. 학생의 실제 명렬표와 기록은 저장소에 포함하지 않습니다.
