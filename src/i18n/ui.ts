export const languages = {
	ko: '한국어',
	en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'ko';

export function otherLang(lang: Lang): Lang {
	return lang === 'ko' ? 'en' : 'ko';
}

// 페이지 곳곳에서 쓰이는 UI 문자열. 키는 ko를 기준으로 하고 en이 누락되면 ko로 폴백한다.
export const ui = {
	ko: {
		'nav.home': '홈',
		'nav.research': '연구',
		'nav.notes': '노트',
		'nav.projects': '프로젝트',
		'nav.writing': '글',
		'nav.cv': 'CV',
		'home.recent': '최근 글',
		'section.research': '연구',
		'section.research.description': '논문 실적과 진행 중인 연구',
		'section.research.published': '논문',
		'section.research.inProgress': '진행 중 연구',
		'section.notes': '노트',
		'section.notes.description': '논문 스터디와 기술 노트',
		'section.projects': '프로젝트',
		'section.projects.description': '사이드 프로젝트',
		'section.writing': '글',
		'section.writing.description': '야구, 영화, 여행, 운동에 대한 기록',
		'post.updatedOn': '마지막 수정',
		'toggle.label': 'Read in English',
	},
	en: {
		'nav.home': 'Home',
		'nav.research': 'Research',
		'nav.notes': 'Notes',
		'nav.projects': 'Projects',
		'nav.writing': 'Writing',
		'nav.cv': 'CV',
		'home.recent': 'Recent posts',
		'section.research': 'Research',
		'section.research.description': 'Publications and ongoing research',
		'section.research.published': 'Publications',
		'section.research.inProgress': 'In progress',
		'section.notes': 'Notes',
		'section.notes.description': 'Paper studies and technical notes',
		'section.projects': 'Projects',
		'section.projects.description': 'Side projects',
		'section.writing': 'Writing',
		'section.writing.description': 'On baseball, movies, travel, and fitness',
		'post.updatedOn': 'Last updated on',
		'toggle.label': '한국어로 읽기',
	},
} as const;

export type UiKey = keyof (typeof ui)[typeof defaultLang];
