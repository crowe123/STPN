// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import { SITE } from './src/config.ts';

/**
 * Version pins are deliberate — see APPENDIX: BUILD GOTCHAS in the build spec.
 *   astro 5.x + @astrojs/mdx 4.x + @astrojs/preact 4.x + @astrojs/sitemap 3.x
 *   tailwind 4.x is wired through @tailwindcss/vite, NOT @astrojs/tailwind.
 *   (@astrojs/tailwind is a Tailwind-3-era package whose majors are locked to
 *   specific Tailwind majors; going through the Vite plugin avoids that entirely.)
 * Astro 7 is current at time of writing. We stay on 5.x deliberately because the
 * content-collection API changed across those majors and this configuration is
 * verified working. Revisit as a planned migration, not as a drive-by upgrade.
 */

const PRIORITY = [
  [/^\/$/, 1.0],
  [/^\/tools\//, 0.8],
  [/^\/service-areas\/[^/]+\//, 0.7],
  [/^\/service-areas\/$/, 0.7],
  [/^\/guide\//, 0.7],
  [/^\/blog\//, 0.6],
  [/^\/resources\/$/, 0.6],
  [/^\/leave-a-review\//, 0.5],
  [/^\/(about|contact)\//, 0.5],
  [/^\/(privacy|terms)\//, 0.1],
];

export default defineConfig({
  site: SITE.origin,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  output: 'static',
  vite: { plugins: [tailwindcss()], build: { cssMinify: 'lightningcss' } },
  integrations: [
    mdx(),
    preact({ compat: false }),
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(SITE.lastReviewed),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const hit = PRIORITY.find(([re]) => re.test(path));
        item.priority = hit ? hit[1] : 0.8;
        if (path === '/') item.changefreq = 'weekly';
        return item;
      },
    }),
  ],
});
