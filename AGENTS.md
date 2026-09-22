# AGENTS.md

## Operational Commands

- 패키지 매니저는 **Bun 고정**이다. `npm`/`yarn`/`pnpm` 사용 금지 (`bun.lock`만 존재, `package-lock.json`/`yarn.lock` 없음).
- 의존성 설치: `bun install`
- 개발 서버 (API + 프론트엔드 동시 실행): `bun run dev`
- API 서버만 실행: `bun run server` (`bun --watch run server/index.ts`)
- 빌드: `bun run build` (`tsc -b && vite build`)
- 테스트 전체 실행: `bun run test` (`vitest run`) / watch 모드: `bun run test:watch`
- 린트: `bun run lint`
- API 서버는 `3002` 포트 고정이다 (`server/index.ts:139`). `vite.config.ts:9-14`의 `/api` 프록시 target이 이 포트를 하드코딩하고 있으므로, 포트를 바꾸면 두 파일을 함께 수정해야 한다.
- `tsc -b`는 `tsconfig.json`이 참조하는 `tsconfig.app.json`(`src/`)과 `tsconfig.node.json`(`vite.config.ts`만 포함)만 검사한다. `server/**/*.ts`는 어떤 tsconfig에도 포함되지 않으므로 `bun run build`로 서버 코드의 타입 에러를 잡을 수 없다 — 서버 코드는 `bun run server` 실행 시점에만 타입이 확인된다.

## Golden Rules

### Immutable

- 실제 API 키 값(`ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`)을 클라이언트 응답에 포함하지 마라. `GET /api/config`는 키의 **존재 여부(boolean)만** 반환한다 (`server/index.ts:147-157`). 여기에 실제 키 문자열을 노출하는 필드를 추가하지 마라.
- 클라이언트가 직접 입력한 API 키가 서버 환경변수보다 우선한다 (`resolveApiKey`, `server/index.ts:64-66`). 이 키는 Provider API에 그대로 전달될 뿐 서버에 저장되지 않는다 — 로깅이나 영속화 로직을 추가하지 마라.
- AI가 생성하는 컴포넌트 코드는 `import` 문과 TypeScript 문법(타입 주석, 인터페이스, 제네릭, `as` 캐스팅)을 쓸 수 없다 (`server/index.ts:11,20`). `react-live`의 `LiveProvider`가 `noInline` 모드로 트랜스파일 없이 실행하기 때문이며, React는 전역 스코프로만 주입된다 (`src/components/LivePreview.tsx:14`).

### Do's & Don'ts (팀 고유 규칙, 근거 기반)

- **Asymmetry — Google 경로에만 모델 폴백이 있다.** `GOOGLE_MODELS`는 2개 모델 배열이고 `callGoogle`은 `withModelFallback`으로 감싸져 있으며, `finishReason === 'MAX_TOKENS'` 잘림까지 별도 처리한다 (`server/index.ts:5, 98-132, 134-136`). 반면 `callAnthropic`은 단일 모델 하드코딩이고 폴백이 없다 (`server/index.ts:68-96`). 이는 Gemini 쪽에서만 겪은 응답 잘림/불안정 문제에 대응한 흔적이다 — Anthropic 경로에 근거 없이 동일한 폴백 구조를 추가하지 마라.
- **Test Boundary — 부수효과 없는 함수만 테스트한다.** `server/generator.ts`, `server/fallback.ts`는 순수 함수이며 각각 테스트가 있다 (`server/generator.test.ts`, `server/fallback.test.ts`). `server/fallback.ts:1-2` 주석이 "부수효과(Bun.serve 등)가 없어 단위 테스트가 가능하다"고 명시한다. `server/index.ts`(Bun.serve 핸들러, 실제 fetch 호출)에는 테스트가 없다 — 새 로직을 추가할 때 순수 로직은 `generator.ts`/`fallback.ts` 같은 별도 모듈로 뽑아 테스트 가능하게 유지하고, `index.ts`에 직접 박아넣지 마라.
- **Double Defense — AI 출력 정규화는 두 겹으로 막는다.** "import/TS 문법 금지, render() 호출 필수" 규칙은 (1) 시스템 프롬프트 지시 (`server/index.ts:10-20`)와 (2) 후처리 함수 `stripCodeFences`/`ensureRenderCall` (`server/generator.ts`) 양쪽에서 강제된다. AI가 지시를 따르지 않는 경우를 대비한 이중 방어이므로, 한쪽만 있으면 된다고 판단해 후처리 로직을 제거하지 마라.
- **Hard Constraint — `render()` 호출 없이는 미리보기가 그려지지 않는다.** `LiveProvider`가 `noInline`으로 설정되어 있어 (`src/components/LivePreview.tsx:14`) 코드 블록 안에 `render(<Component />)` 호출이 명시적으로 있어야 한다. `ensureRenderCall`(`server/generator.ts:12-24`)이 없는 경우 자동 주입하므로, AI 응답 처리 파이프라인에서 이 단계를 건너뛰지 마라.

## Project Context

프롬프트를 입력하면 AI(Anthropic Claude 또는 Google Gemini)가 React 컴포넌트를 생성하고, `react-live`로 즉시 미리보기를 렌더링하는 도구다.

Tech Stack: React 19, TypeScript, Vite, Bun (API 프록시 서버), react-live, Vitest, Testing Library, ESLint.

## Standards & References

- 코딩 컨벤션은 `eslint.config.js` 및 각 `tsconfig*.json`의 `strict`/`noUnusedLocals` 등 설정을 따른다. 별도 문서화하지 않는다.
- 실행 방법과 기능 목록은 `README.md` 참고.
- **Maintenance Policy:** 코드를 수정하며 이 문서의 규칙과 실제 동작이 어긋난 것을 발견하면, 그 자리에서 이 문서의 업데이트를 제안하라.
