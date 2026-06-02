# AGENT.md — Secubit website

Static site for `www.secubit.io`, served by GitHub Pages from `secubit-io/website`. No build
step, no framework: plain HTML/CSS/JS. The homepage is `index.html` + `styles.css`. The blog
lives under `blogs/` and shares the same `styles.css` (blog rules live in its "BLOG PAGES"
section at the bottom of the file).

The **nav and footer are shared** across every page: each page has empty `<div id="site-nav">`
and `<div id="site-footer">` placeholders plus `<script src="/components.js" defer></script>`,
and `components.js` injects the markup (and handles nav-scroll + `.reveal` animation). Blog posts
also include a `<div id="site-post-cta">` placeholder for the shared call-to-action. Do NOT
hardcode a `<nav>`/`<footer>`/CTA in a page — use the placeholders. `components.js` uses
root-relative URLs (`/...`), so the same markup works at any depth (served at the domain root).

`.nojekyll` (repo root) disables GitHub Pages' Jekyll so files are served verbatim — **required**
so the `blogs/posts/<slug>.md` files are fetchable (Jekyll otherwise consumes front-matter `.md`
files and they 404). Do not delete it.

```
.nojekyll               # serve files as-is on GitHub Pages (keep!)
index.html              # homepage
styles.css              # ALL styles — homepage + blog (single stylesheet)
components.js            # shared nav + footer + CTA (injected) + nav-scroll + reveal
blogs/
  index.html            # blog listing  -> https://www.secubit.io/blogs/
  posts.html            # generic post renderer -> /blogs/posts.html?post=<slug>
  posts/
    <slug>.md           # a post — Markdown source + YAML front matter (the ONLY per-post file)
```

## Posts are Markdown-only — there is no per-post HTML

A blog post is just `blogs/posts/<slug>.md`. It is rendered at runtime by `blogs/posts.html`,
which reads `?post=<slug>`, fetches the `.md`, parses the front matter to build the `.post-hero`
header (tag, read_time, title, byline), renders the body with `marked` (loaded from CDN), then
post-processes the output to apply the site's post classes so it looks like a normal article:
- first paragraph → `.lead`
- tables → `table.cmp` inside `.table-scroll`, and each row's first cell → `<th>` (bold label)
- "Best fit:" paragraphs → `.bestfit`
- a `## References` heading and everything after it → a sibling `<section class="references">`
  (a trailing blockquote becomes the `.disclaimer`)

Do **not** generate static HTML for posts. To preview existing rendering logic, read
`blogs/posts.html`. Canonical example post: `blogs/posts/secubit-vs-privy-dfns-fireblocks.md`.

## How to add a new blog post

### 1. Write the Markdown
Create `blogs/posts/<slug>.md` (`<slug>` lowercase, hyphenated, URL-safe). Front matter:

```yaml
---
title: "Full post title"
date: 2025-06-12          # ISO date; rendered as e.g. "June 2025"
tag: Security             # Comparison | Security | Architecture | Compliance | ...
read_time: 6 min read
author: Secubit Team      # default
excerpt: "One-sentence summary used on listing cards and the <meta description>."
featured: false           # true => belongs in the listing's featured slot
---

Markdown body…
```

Then write the body in plain Markdown — headings (`##`/`###`), `**bold**`, `*italic*`, links,
images, bullet/numbered lists, `> blockquotes`, and GitHub-flavored tables all render. For a
comparison table, make the first column the row label (it becomes a bold `<th>` automatically).
For "best fit" callouts, start the paragraph with `**Best fit:**`. Put citations under a
`## References` heading as a numbered list; an optional final `> blockquote` becomes the disclaimer.

The post is immediately live at `/blogs/posts.html?post=<slug>` — nothing to generate.

### 2. Add it to the listing (`blogs/index.html`)
Newest first. Link to `posts.html?post=<slug>`.
- **If `featured: true`** — update the `<a class="featured reveal" href="posts.html?post=<slug>">`
  block: `tag`, `meta` (`Featured · {read_time}`), `<h2>` title, `<p>` excerpt (and the SVG art).
- **Otherwise** — add a card at the front of `.posts-grid`:
  ```html
  <a href="posts.html?post=<slug>" class="post-card linked reveal">
    <div class="tag-row"><span class="tag blue">Tag</span><span class="meta">{read_time}</span></div>
    <h3>Post title</h3>
    <p>Excerpt.</p>
    <div class="card-foot">Read the article →</div>
  </a>
  ```
  (Placeholder/"coming soon" cards use `class="post-card soon"` with a `card-foot` and no `href`.)

### 3. Mirror the newest post on the homepage (`index.html`)
The `#blog` section's `.blog-grid` shows the three newest posts. Point the first
`<a class="blog-card" href="blogs/posts.html?post=<slug>">` at the new post (tag/date/title) and
shift the others down. "View all →" already points to `blogs/index.html`.

### 4. Verify locally
From the repo root: `python3 -m http.server 8080`, then open:
- `http://localhost:8080/blogs/posts.html?post=<slug>` — renders with the post header, body,
  table, references, and shared nav/footer/CTA; "← Back to Blog" works.
- `http://localhost:8080/blogs/` and `http://localhost:8080/` — the new card links resolve.

Then commit (only when asked).
