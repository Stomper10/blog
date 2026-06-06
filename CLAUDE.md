# 프로젝트 규칙

개인 블로그 (Astro + MDX, Cloudflare Pages). 한국어가 기본 언어이고 모든 글은 ko/en 한 쌍으로 존재한다.

## 콘텐츠 구조

- 글 위치: `src/content/<collection>/<lang>/<slug>.mdx` — collection은 `research` | `notes` | `projects` | `writing`, lang은 `ko` | `en`.
- 같은 글의 ko/en 파일은 **파일명이 같고** frontmatter의 **`translationKey`가 동일**해야 한다.
- 스키마는 `src/content.config.ts`에 정의되어 있다.

## 번역 요청 처리 ("이 글 번역해줘")

사용자가 글 번역을 요청하면:

1. 원문 파일을 읽고, 반대 언어 폴더(`ko/` ↔ `en/`)에 **같은 파일명**으로 새 파일을 만든다.
2. frontmatter 처리 규칙:
   - **그대로 복사**: `translationKey`, `pubDate`, `updatedDate`, `tags`, `heroImage`, `category`, `status`, `venue`, `links`, `repo`, `demo`
   - **번역**: `title`, `description`, `authors`(이름은 해당 언어 표기로 — 예: 홍길동 ↔ Gildong Hong)
   - 초벌 번역본에는 `draft: true`를 추가한다 (사람 검수 후 직접 제거하고 게시).
3. 본문 번역 규칙:
   - 코드블록·수식·URL·이미지 경로는 번역하지 않고 그대로 둔다.
   - 고유명사(팀명·선수명·논문 제목 등)는 해당 언어의 관용 표기를 따른다.
   - 직역보다 자연스러운 문장을 우선하되, 기술 용어는 정확하게.
4. 이미 반대 언어 파일이 존재하면 덮어쓰지 말고 사용자에게 확인한다.

## 검증

- 빌드 확인: `npm run build`
- translationKey 짝이 없는 글이 있어도 빌드는 깨지지 않지만(토글이 섹션 인덱스로 폴백), 정상 상태는 항상 쌍이 존재하는 것이다.
