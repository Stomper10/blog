import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPosts, postUrl } from '../i18n/utils';

// 한국어(기본) 피드: 노트 · 프로젝트 · 일상 글을 한데 모은다.
export async function GET(context) {
	const sections = ['notes', 'projects', 'writing'];
	const items = (
		await Promise.all(
			sections.map(async (collection) =>
				(await getPosts(collection, 'ko')).map((post) => ({
					title: post.data.title,
					description: post.data.description,
					pubDate: post.data.pubDate,
					link: postUrl(collection, post),
				})),
			),
		)
	)
		.flat()
		.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION.ko,
		site: context.site,
		items,
	});
}
