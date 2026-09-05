/**
 * Astro 5 content collections.
 *
 * Gotchas this file is written against (see APPENDIX — BUILD GOTCHAS):
 *  • Config lives at src/content.config.ts in Astro 5, not src/content/config.ts.
 *  • Collections use the glob loader — `type: 'content'` is gone.
 *  • Entries expose `entry.id` (not `entry.slug`); routes are generated from id.
 *  • Rendering uses the standalone `render()` from 'astro:content',
 *    not `entry.render()`. Never set:html the raw body.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    /** The literal search question — becomes the page H1. */
    h1: z.string(),
    /**
     * Optional heading used on guide cards elsewhere on the site. Lets a card
     * avoid restacking the same search words the host page's own headings
     * already carry, without touching this guide's H1 (which its keyword gate
     * pins). Falls back to h1 when absent.
     */
    cardTitle: z.string().optional(),
    description: z.string(),
    /** Standfirst under the H1. */
    dek: z.string(),
    /** 40–60 word direct answer, rendered immediately under the dek. */
    answer: z.string(),
    primaryKeyword: z.string(),
    /** Slug of the money page this guide is breadcrumbed under. */
    parentService: z.string(),
    /** BoFu-adjacent buckets only. Pure-informational content stays off the site. */
    intent: z.enum(['cost', 'insurance-permits', 'urgency', 'vs-decision']),
    badge: z.enum(['Cost Guide', 'Decision Guide', 'What To Do Now', 'Rules & Permits']),
    datePublished: z.string(),
    dateModified: z.string(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    /** Sibling guides linked at the foot of the article. */
    related: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string(),
    dek: z.string(),
    category: z.enum(['Seasonal Alert', 'How the Work Goes', 'Industry & Code', 'Scheduling']),
    primaryKeyword: z.string(),
    datePublished: z.string(),
    dateModified: z.string(),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { guides, blog };
