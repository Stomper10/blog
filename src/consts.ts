// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { Lang } from './i18n/ui';

export const SITE_TITLE = 'Home Plate';

export const SITE_DESCRIPTION: Record<Lang, string> = {
	ko: '연구와 일상이 공존하는 디지털 홈',
	en: 'A digital home for research and everyday writing',
};

// giscus (GitHub Discussions 기반 댓글) 설정.
// https://giscus.app 에서 저장소를 연결하고 발급받은 값을 채우면 글 하단에 댓글이 활성화된다.
// repo가 비어 있는 동안에는 댓글 영역이 렌더링되지 않는다.
export const GISCUS = {
	repo: 'Stomper10/blog',
	repoId: 'R_kgDOSylnOg',
	category: 'Announcements',
	categoryId: 'DIC_kwDOSylnOs4C-nLo',
};
