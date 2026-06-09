// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.jwy4888.workers.dev',
	// 한국어가 기본(프리픽스 없음), 영어는 /en/ 아래로 라우팅된다.
	// ko: /notes/foo  ↔  en: /en/notes/foo
	i18n: {
		defaultLocale: 'ko',
		locales: ['ko', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	// 폰트는 BaseHead에서 Pretendard를 CDN으로 로드한다 (Astro fonts API 미사용).
	integrations: [mdx(), sitemap(), pagefind(), react()],
});
