# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Framework: Next.js 15 (App Router) with TypeScript
- UI/Styling: Tailwind CSS v4 via PostCSS plugin and custom CSS in app/globals.css
- Core feature: DawnMark (components/DawnMark.tsx) — a client-side Markdown editor with live preview, safe HTML sanitization, syntax highlighting, and on-page file attachments via Blob URLs
- No API routes or backend code; all logic is in the client and the app/ tree
- Public assets under public/

Common commands
- Start dev server (Turbopack):
  - npm run dev
- Build (Turbopack):
  - npm run build
- Start production server:
  - npm run start
- Lint all files:
  - npm run lint
  - or: npx eslint .
- Lint a single file:
  - npx eslint components/DawnMark.tsx
- Type-check (no emit):
  - npx tsc --noEmit
- Tests: none configured in this repo (no Jest/Vitest/Cypress/Playwright configs found)

Architecture and code structure
- App Router layout
  - app/layout.tsx: global HTML shell, metadata, header, and font setup via next/font (Geist and Geist Mono). Imports global styles (app/globals.css) and a highlight.js theme (github-dark-dimmed).
  - app/page.tsx: renders the main application surface with <DawnMark /> inside a .dm-container wrapper.
  - app/globals.css: Tailwind v4 import plus a custom design system implemented with CSS variables. Defines a two-column grid (50vw/50vw) locked to viewport height, a fixed header area, and component styles for the editor, preview, uploader, and toasts.
- Core client component
  - components/DawnMark.tsx ("use client") manages all interactive behavior:
    - State and persistence: Markdown text is saved to localStorage (key: dawnmark:text) with a small debounce. Component restores saved content on mount.
    - Markdown parsing and safety: marked is configured with GFM + breaks, and marked-highlight integrates highlight.js. Parsed HTML is sanitized with DOMPurify before assigning to previewRef.innerHTML.
    - Syntax highlighting: highlight.js with language autodetection fallback to plaintext when unknown.
    - File attachments: drag-and-drop and manual selection produce Blob URLs for selected files. Generates Markdown snippets:
      - Images -> ![name](blob:...)
      - Other files -> [name](blob:...)
      Snippet clicks copy to clipboard with a transient toast.
    - Accessibility: dropzone uses ARIA roles/labels and keyboard activation; toast uses aria-live.
    - Resource cleanup: revokes created object URLs on unmount.
- Tooling configuration
  - ESLint: eslint.config.mjs uses FlatCompat to extend next/core-web-vitals and next/typescript; ignores build artifacts and node_modules.
  - TypeScript: tsconfig.json sets moduleResolution: bundler and defines a path alias @/* -> project root (not currently used in imports).
  - PostCSS: postcss.config.mjs loads @tailwindcss/postcss (Tailwind v4). No separate tailwind.config.* is necessary.
  - Next: next.config.ts currently relies on defaults.

Notes from README.md
- Dev server starts at http://localhost:3000
- The main page content can be edited via app/page.tsx

What’s not present
- No test runner or e2e setup detected
- No API routes (app/api) or server-side data fetching
- No environment configuration files found
