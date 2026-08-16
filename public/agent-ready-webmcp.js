/**
 * Agent-ready WebMCP shim.
 *
 * Registers two read-only tools against navigator.modelContext when a browsing
 * agent provides it. Silent no-op everywhere else — no polyfill, no globals
 * left behind, no network requests, and nothing that runs for a human visitor
 * beyond one feature check.
 *
 * Loaded with `defer` on every page. Total shipped JS on non-tool pages is this
 * file plus the header's inline module.
 */
(function () {
  'use strict';

  var ctx = typeof navigator !== 'undefined' && navigator.modelContext;
  if (!ctx || typeof ctx.registerTool !== 'function') return;

  function currentPageMarkdown() {
    var path = location.pathname;
    var mdPath = path === '/' ? '/index.md' : path.replace(/\/$/, '') + '.md';
    return fetch(mdPath, { headers: { Accept: 'text/markdown' } }).then(function (r) {
      if (!r.ok) throw new Error('No markdown mirror for ' + path);
      return r.text();
    });
  }

  try {
    ctx.registerTool({
      name: 'get_current_page_markdown',
      description:
        'Return the full text of the page currently being viewed on this site, as markdown, from its published mirror.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        return currentPageMarkdown().then(function (text) {
          return { content: [{ type: 'text', text: text }] };
        });
      },
    });

    ctx.registerTool({
      name: 'list_agent_ready_resources',
      description:
        'List the machine-readable resources this site publishes: sitemap, llms.txt, the whole-site markdown document, and the agent catalog.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        var o = location.origin;
        return Promise.resolve({
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  sitemap: o + '/sitemap-index.xml',
                  llms: o + '/llms.txt',
                  llmsFull: o + '/llms-full.txt',
                  apiCatalog: o + '/.well-known/api-catalog',
                  agentCard: o + '/.well-known/agent-card.json',
                  pageMarkdownConvention: 'Any page URL /x/ has a markdown mirror at /x.md',
                },
                null,
                2
              ),
            },
          ],
        });
      },
    });
  } catch (e) {
    /* Registration failed; nothing to do. The site works without it. */
  }
})();
