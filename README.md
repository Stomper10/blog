# Digital Home

연구·논문·프로젝트와 야구·영화·여행·운동 기록이 한 사이트에 공존하는 개인 블로그.
Astro + MDX, Cloudflare Pages 배포.

## 구조

| URL | 내용 |
|---|---|
| `/` | 랜딩 — 자기소개 + 최근 글 |
| `/research` | 논문 실적, 진행 중 연구 |
| `/notes` | 논문 스터디 · 기술 노트 |
| `/projects` | 사이드 프로젝트 |
| `/writing` | 야구 · 영화 · 여행 · 운동 등 일상 글 |
| `/cv` | 이력서 |

## 다국어 모델

- **한국어가 기본**: `/notes/foo` = 한국어, `/en/notes/foo` = 영어. (`astro.config.mjs`의 `i18n` 설정)
- **모든 글은 ko/en 한 쌍**이 정상 상태:

  ```
  src/content/writing/ko/hello-world.mdx   ← 원문
  src/content/writing/en/hello-world.mdx   ← 번역 (같은 파일명)
  ```

- 두 파일은 frontmatter의 **`translationKey`가 같아야** 헤더의 언어 토글로 서로 연결된다.
  `translationKey` · `pubDate` · `tags`는 두 파일에서 동일하게, `title` · `description` · 본문은 번역한다.
- 짝이 아직 없으면 토글은 반대 언어의 섹션 인덱스로 폴백한다 (깨지지 않음).

### 글 frontmatter 예시

```yaml
---
title: '글 제목'
description: '한 줄 요약'
pubDate: 2026-06-06
translationKey: my-post        # ko/en 쌍에서 동일, 파일명과 같게 권장
tags: [baseball]
draft: false                   # true면 목록·빌드에서 제외
category: baseball             # writing 전용: baseball|movie|travel|fitness|etc
---
```

`research`는 `status`(published|in-progress) · `authors` · `venue` · `links`,
`projects`는 `repo` · `demo` 필드를 추가로 가진다. 전체 스키마는 `src/content.config.ts` 참고.

## 글 작성 → 번역 → 게시 워크플로

1. **작성**: 한국어로 먼저 쓴다.

   ```
   src/content/writing/ko/2026-team-projection.mdx
   ```

2. **초벌 번역**: Claude Code에게 한 줄로 요청한다.

   ```
   이 글 번역해줘: src/content/writing/ko/2026-team-projection.mdx
   ```

   그러면 `src/content/writing/en/2026-team-projection.mdx`가 같은
   `translationKey`로 생성된다. (규칙은 `CLAUDE.md`에 정의되어 있어
   frontmatter 처리·코드블록 보존 등이 자동으로 지켜진다.)

   영어로 먼저 썼다면 반대 방향(en → ko)도 동일하게 동작한다.

3. **검수**: en 초벌을 직접 다듬는다. 검수 전까지는 en 파일에
   `draft: true`를 두면 목록·빌드에서 빠진다.

4. **게시**: `git push` → Cloudflare Pages가 자동 빌드·배포.

## 개발

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # 정적 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

## 배포 (Cloudflare Pages)

1. GitHub 저장소 생성 후 push.
2. Cloudflare 대시보드 → Workers & Pages → Pages → 저장소 연결.
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. 배포 후 `astro.config.mjs`의 `site`를 실제 도메인으로 변경 (sitemap·RSS·canonical URL에 쓰임).

## 댓글 (giscus)

1. 저장소를 public으로 두고 GitHub Discussions 활성화.
2. [giscus.app](https://giscus.app)에서 저장소 연결 후 발급값을 `src/consts.ts`의 `GISCUS`에 입력.
3. `repo`가 채워지면 글 하단에 댓글이 나타난다. 경로(pathname) 매핑이라 ko/en 댓글 스레드는 분리된다.

## 추후 확장

- CMS가 필요해지면 [Keystatic](https://keystatic.com)·[Decap CMS](https://decapcms.org) 등 git 기반 CMS를 콘텐츠 구조 변경 없이 얹을 수 있다.
