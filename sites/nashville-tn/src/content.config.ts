/**
 * Astro 5 content collections.
 *
 * Written against the documented gotchas:
 *  • Config lives at src/content.config.ts in Astro 5, not src/content/config.ts.
 *  • Collections use the glob loader — `type: 'content'` no longer exists.
 *  • Entries expose `entry.id`, not `entry.slug`. Routes are generated from id.
 *  • Rendering uses the standalone `render()` from 'astro:content',
 *    never `entry.render()` and never set:html on the raw body.
 *  • getStaticPaths filters empty ids so a dynamic route cannot collide with
 *    its own index route.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    /** The literal search question — becomes the page H1. */
    h1: z.string(),
    description: z.string(),
    dek: z.string(),
    /** 40–60 word direct answer rendered immediately beneath the dek. */
    answer: z.string(),
    primaryKeyword: z.string(),
    /** Slug of the money page this guide is breadcrumbed under. */
    parentService: z.string(),
    /** BoFu-adjacent buckets only — pure-informational content stays off-site. */
    intent: z.enum(['cost', 'insurance-permits', 'urgency', 'vs-decision']),
    badge: z.enum(['Cost Guide', 'Decision Guide', 'What To Do Now', 'Rules & Permits']),
    datePublished: z.string(),
    dateModified: z.string(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3).max(3),
    siblings: z.array(z.string()).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string(),
    dek: z.string(),
    primaryKeyword: z.string(),
    category: z.enum(['seasonal', 'walkthrough', 'news', 'events']),
    datePublished: z.string(),
    dateModified: z.string(),
    /** Organization-authored by default. No invented author persona, ever. */
    authorType: z.literal('Organization').default('Organization'),
  }),
});

export const collections = { guides, blog };
