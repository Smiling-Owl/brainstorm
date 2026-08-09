# EDEN. // Sys_Garden v2.0

A digital garden built with [Astro](https://astro.build/). 

## Features


- **Interactive Neural Map:** A D3.js powered knowledge graph with glowing nodes, interactive zoom/pan, and dynamic linkage based on your markdown wikilinks.
- **Global Search:** Full-text instant search powered by [Pagefind](https://pagefind.app/), accessible via `CTRL+K`.

## Tech Stack

- **Framework:** Astro 
- **Styling:** Tailwind CSS (v4)
- **Data Visualization:** D3.js
- **Search:** Pagefind
- **Content:** Markdown (Astro Content Collections)

## Local Development

```bash
# 1. Clone the repository and initialize submodules (to fetch the notes)
git clone --recurse-submodules https://github.com/Smiling-Owl/brainstorm.git
cd brainstorm

# 2. Install dependencies
npm install

# 3. Build the search index (Required for global search to work in dev mode)
npm run build

# 4. Start the development server
npm run dev
```

> **Note:** The `CTRL+K` search relies on the `dist/pagefind` directory. You must run `npm run build` at least once so the search index is generated for the dev proxy to serve.


