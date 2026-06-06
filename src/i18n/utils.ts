import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLang, otherLang, ui, type Lang, type UiKey } from './ui';

// 글이 담기는 4개 콜렉션. 모두 동일한 ko/en 페어링 규칙을 따른다.
export type PostCollection = 'research' | 'notes' | 'projects' | 'writing';
export type PostEntry = CollectionEntry<PostCollection>;

/** URL 경로에서 현재 언어를 읽는다. /en/* 이면 en, 그 외는 ko. */
export function getLangFromUrl(url: URL): Lang {
	const [, first] = url.pathname.split('/');
	return first === 'en' ? 'en' : defaultLang;
}

/** UI 문자열 조회 함수를 만든다. 누락된 키는 기본 언어(ko)로 폴백. */
export function useTranslations(lang: Lang) {
	return function t(key: UiKey): string {
		return ui[lang][key] ?? ui[defaultLang][key];
	};
}

/** ko 경로를 해당 언어의 경로로 바꾼다. ko는 그대로, en은 /en 프리픽스를 붙인다. */
export function localizePath(path: string, lang: Lang): string {
	if (lang === defaultLang) return path;
	return path === '/' ? '/en/' : `/en${path}`;
}

/** 콘텐츠 파일 경로(src/content/<collection>/<lang>/...)에서 언어를 읽는다. */
export function entryLang(entry: { id: string }): Lang {
	return entry.id.split('/')[0] === 'en' ? 'en' : 'ko';
}

/** 언어 폴더를 제외한 슬러그. ko/hello-world → hello-world */
export function entrySlug(entry: { id: string }): string {
	return entry.id.split('/').slice(1).join('/');
}

/** 글의 최종 URL. */
export function postUrl(collection: PostCollection, entry: PostEntry): string {
	return localizePath(`/${collection}/${entrySlug(entry)}/`, entryLang(entry));
}

/** 해당 언어의 글 목록 (draft 제외, 최신순). */
export async function getPosts(collection: PostCollection, lang: Lang): Promise<PostEntry[]> {
	const posts = await getCollection(
		collection,
		(entry) => entryLang(entry) === lang && !entry.data.draft,
	);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * 같은 translationKey를 가진 반대 언어 버전의 URL.
 * 짝이 (아직) 없으면 반대 언어의 섹션 인덱스로 폴백한다 — 번역 검수 전에 한쪽만 먼저
 * 배포돼도 토글이 깨지지 않게 하기 위함.
 */
export async function getTranslationUrl(
	collection: PostCollection,
	entry: PostEntry,
): Promise<string> {
	const target = otherLang(entryLang(entry));
	const pair = await getCollection(
		collection,
		(candidate) =>
			entryLang(candidate) === target &&
			candidate.data.translationKey === entry.data.translationKey,
	);
	return pair[0] ? postUrl(collection, pair[0]) : localizePath(`/${collection}/`, target);
}

/** [...slug].astro 페이지들이 공유하는 getStaticPaths 본체. */
export async function getStaticPathsForLang(collection: PostCollection, lang: Lang) {
	const posts = await getPosts(collection, lang);
	return Promise.all(
		posts.map(async (post) => ({
			params: { slug: entrySlug(post) },
			props: { post, translationUrl: await getTranslationUrl(collection, post) },
		})),
	);
}
