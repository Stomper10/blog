import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 콘텐츠 구조
 *
 *   src/content/<collection>/<lang>/<slug>.mdx
 *   예) src/content/writing/ko/2026-team-projection.mdx
 *       src/content/writing/en/2026-team-projection.mdx
 *
 * 모든 글은 ko/en 파일이 한 쌍으로 존재하는 것이 정상 상태다.
 * 같은 글의 두 언어 버전은 동일한 `translationKey`로 연결되며(파일명과 같게 쓰는 것을 권장),
 * 언어 토글은 이 키로 반대 언어 버전을 찾는다.
 * translationKey · pubDate · tags는 두 파일에서 항상 같아야 한다.
 */

const langDir = (collection: string) => ({
	base: `./src/content/${collection}`,
	pattern: '**/*.{md,mdx}',
});

const basePostSchema = ({ image }: { image: () => z.ZodType }) =>
	z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.optional(image()),
		// ko/en 쌍을 잇는 공통 키. 두 언어 파일에서 반드시 동일해야 한다.
		translationKey: z.string(),
		tags: z.array(z.string()).default([]),
		// true면 목록·RSS·빌드 경로에서 제외 (번역 검수 전 임시 상태 등)
		draft: z.boolean().default(false),
	});

// 논문 실적 + 진행 중 연구
const research = defineCollection({
	loader: glob(langDir('research')),
	schema: (ctx) =>
		basePostSchema(ctx).extend({
			status: z.enum(['published', 'in-progress']).default('published'),
			authors: z.array(z.string()).default([]),
			venue: z.string().optional(), // 예: 'NeurIPS 2026'
			links: z
				.object({
					paper: z.string().url().optional(),
					code: z.string().url().optional(),
					slides: z.string().url().optional(),
				})
				.default({}),
		}),
});

// 논문 스터디 · 기술 노트
const notes = defineCollection({
	loader: glob(langDir('notes')),
	schema: basePostSchema,
});

// 사이드 프로젝트
const projects = defineCollection({
	loader: glob(langDir('projects')),
	schema: (ctx) =>
		basePostSchema(ctx).extend({
			repo: z.string().url().optional(),
			demo: z.string().url().optional(),
		}),
});

// 야구 · 영화 · 여행 · 운동 등 일상 글
const writing = defineCollection({
	loader: glob(langDir('writing')),
	schema: (ctx) =>
		basePostSchema(ctx).extend({
			category: z.enum(['baseball', 'movie', 'travel', 'fitness', 'etc']).default('etc'),
		}),
});

export const collections = { research, notes, projects, writing };
