// @ts-nocheck
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkWikiLink from 'remark-wiki-link';
import { unified } from '@astrojs/markdown-remark';
import fs from 'node:fs';
import path from 'node:path';

function servePagefind() {
  return {
    name: 'serve-pagefind',
    configureServer(server) {
      server.middlewares.use('/pagefind', (req, res, next) => {
        const filePath = path.join(process.cwd(), 'dist', 'pagefind', req.url.split('?')[0]);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
          if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
          if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json');
          if (filePath.endsWith('.wasm')) res.setHeader('Content-Type', 'application/wasm');
          res.end(fs.readFileSync(filePath));
        } else {
          next();
        }
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), servePagefind()]
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        [remarkWikiLink, {
          pathFormat: 'obsidian-short',
          /** @param {string} permalink */
          hrefTemplate: (permalink) => `/${permalink}`
        }]
      ]
    })
  }
});
