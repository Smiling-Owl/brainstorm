# Project Brainstorm - Implementation Plan

## 1. Project Overview
**Goal:** Build a custom, zero-cost Digital Garden that matches the Obsidian Publish 3-column layout (interactive graph, Ctrl+K search, folder tree) while providing a premium, highly-styled aesthetic.

## 2. Technology Stack
*   **Framework:** **Astro** (Static Site Generator) - chosen for its zero-JS default output, incredible speed, and robust content collections for Markdown.
*   **Deployment:** **GitHub Actions** CI/CD pipeline deploying to a free tier host (e.g., GitHub Pages, Vercel, or Netlify).
*   **Search Engine:** **Pagefind** or **FlexSearch** (Static, client-side full-text search).
*   **Knowledge Graph:** **D3.js** or **Force-Graph** rendering a build-time generated static JSON mapping.

## 3. Vault & Note Parsing Strategy
### 3.1 Supported Syntax
*   Standard Markdown formatting.
*   Core Obsidian features: Wikilinks (`[[Note Title]]`), YAML frontmatter, and basic callouts.

### 3.2 Selective Publishing & Filtering
*   The build process will exclusively target specific subdirectories within the vault (e.g., `4-2026-2027-1`).
*   **Included:** `synthesized_notes/zettelkasten` and `synthesized_notes/cornell`.
*   **Excluded (Ignored):** `materials`, `pre_notes`, `pdf`, and `anki_cloze`.

### 3.3 Folder Flattening & URL Structure
*   Deeply nested paths will be simplified for the web.
*   Example Path: `CIT016-data_communication/synthesized_notes/zettelkasten/Network_Topology.md`
*   **Resulting Web Path:** `/CIT016-data_communication/Network_Topology`
*   Wikilinks using the shortest path (`[[Network_Topology]]`) will be globally resolved to this new flattened path.

## 4. UI & Aesthetics
*   **Layout Structure (Desktop):**
    *   **Left Column:** File Explorer / Folder Tree (organized by course/topic).
    *   **Center Column:** Note Content (Reading view).
    *   **Right Column:** Interactive Knowledge Graph & Table of Contents.
*   **Responsiveness:** Fully responsive design. On mobile, the sidebars will collapse into hamburger menus or off-canvas drawers.
*   **Design Language:** A premium, highly-styled custom theme utilizing a curated color palette (e.g., Catppuccin or Nord) and modern typography (like Inter or Roboto). Dark/Light mode toggle included.

## 5. Development Phases                                                                    
1.  **Phase 1: Foundation.** Initialize Astro project, configure Markdown/Remark plugins to handle Wikilinks and frontmatter, and write the script to filter and flatten the Obsidian vault folders.
2.  **Phase 2: Layout & UI.** Build the 3-column responsive layout and implement the custom styling/color palette.
3.  **Phase 3: Search & Graph.** Implement the static JSON generator for the graph connections, integrate D3.js/Force-Graph, and set up Pagefind/FlexSearch for the Ctrl+K modal.
4.  **Phase 4: Deployment.** Configure GitHub Actions for automated zero-cost deployment.
