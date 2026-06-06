import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../../consts';
import { getPosts, postUrl } from '../../i18n/utils';

// English feed: notes, projects, and writing combined.
export async function GET(context) {
	const sections = ['notes', 'projects', 'writing'];
	const items = (
		await Promise.all(
			sections.map(async (collection) =>
				(await getPosts(collection, 'en')).map((post) => ({
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
		description: SITE_DESCRIPTION.en,
		site: context.site,
		items,
	});
}
