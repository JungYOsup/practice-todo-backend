# practice-todo-backend

Slack 봇 연습용 할 일 백엔드 (TypeScript + Moleculer + vitest, 인메모리 저장).

## 명령어
- 설치: `npm ci`
- 개발 서버: `npm run dev` (포트는 env `PORT`, 기본 3000)
- 테스트: `npm test`
- 린트: `npm run lint`
- 타입 검사: `npm run typecheck`
- 빌드: `npm run build` (결과는 `dist/`), 실행은 `npm start`

## 디렉터리
- `services/api.service.ts`: moleculer-web 게이트웨이 (`/api`)
- `services/todos.service.ts`: 할 일 서비스 (상태는 서비스 인스턴스 안에 보관)
- `test/`: vitest 테스트 (서비스 단위 + HTTP)
- `.github/workflows/ci.yml`: CI (lint, typecheck, test, build)

## API 계약 (별도 프런트 저장소가 의존하므로 그대로 유지)
`Todo = { id: number, title: string, done: boolean }`, id는 1부터 증가.
- `GET /api/todos` -> `todos.list` -> `Todo[]` (삽입 순서)
- `POST /api/todos` body `{ "title": string }` -> `todos.create` -> 생성된 `Todo`
  - title은 trim 후 비어 있지 않아야 하며 trim된 값을 저장, 아니면 422
- `PATCH /api/todos/:id/complete` -> `todos.complete` -> `done: true`인 `Todo`
  - id는 URL 문자열을 숫자로 변환, 없는 id는 404 (`NOT_FOUND`)

## 규칙
- 테스트를 먼저 쓴다.
- main에 직접 push하지 않고 PR로 머지한다.
- 인증, 영속성, 추가 엔드포인트는 만들지 않는다.
