# AGENT.md — Secubit website

Static site for `www.secubit.io`, served by GitHub Pages from `secubit-io/website`. No build
step, no framework: plain HTML/CSS/JS. The homepage is `index.html` + `styles.css`. The blog
lives under `blogs/` and shares the same `styles.css` (blog rules live in its "BLOG PAGES"
section at the bottom of the file).

```
index.html              # homepage
styles.css              # ALL styles — homepage + blog (single stylesheet)
blogs/
  index.html            # blog listing  -> https://www.secubit.io/blogs/
  posts/
    <slug>.md           # Markdown source of a post (kept for re-conversion / editing)
    <slug>.html         # the published article page
```

## How to add a new blog post from a Markdown file

The author writes a post as Markdown. You convert it to an article HTML page by hand using the
existing template, then register it on the listing. **`blogs/posts/secubit-vs-privy-dfns-fireblocks.{md,html}`
is the canonical worked example — copy from it.**

### 1. Save the Markdown source
Save the file as `blogs/posts/<slug>.md`. `<slug>` is lowercase, hyphenated, URL-safe
(e.g. `why-hsm-mpc-is-the-gold-standard`). Use this front matter:

```yaml
---
title: "Full post title"
date: 2025-06-12          # ISO date
tag: Security             # Comparison | Security | Architecture | Compliance | ...
read_time: 6 min read
author: Secubit Team      # default
excerpt: "One-sentence summary used on cards and the <meta description>."
featured: false           # true if it should be the big featured card on the listing
---

Markdown body...
```

### 2. Generate `blogs/posts/<slug>.html`
Copy `blogs/posts/secubit-vs-privy-dfns-fireblocks.html` as the shell and replace the content.
Keep these page parts verbatim (they only change per-post where noted):

- **`<head>`**: set `<title>` to `Post title — Secubit Blog` and `<meta name="description">` to the
  `excerpt`. Asset links stay `../../logo_favicon.png`, `../../logo.svg`, and `../../styles.css`.
- **Nav**: unchanged. Links are `../../index.html#features|#architecture|#api|#about`,
  Blog → `../index.html`, Whitepaper (external), Join Waitlist → `../../index.html#cta`.
- **`<header class="post-hero">`**: set the `back-link` (`../index.html`), the `tag` + `read_time`
  in `.tag-row`, the `<h1>` title, and the byline `who` (author) / `when` (e.g. "June 2025").
- **Footer**: unchanged (Blog → `../index.html`, Contact → `mailto:info@secubit.io`).

> Path rule for article pages (they sit in `blogs/posts/`): root assets are `../../`,
> the stylesheet is `../../styles.css`, and links back to the listing are `../index.html`.
> Never reintroduce Cloudflare `/cdn-cgi/...` email links — use `mailto:info@secubit.io`.
> Keep the small nav-scroll `<script>` at the bottom of the page (it toggles the nav background
> on scroll, matching the homepage).

### 3. Convert the Markdown body → HTML (mapping to CSS classes)
Wrap the body in `<article class="article">`. The classes below are all defined in the
"BLOG PAGES" section of `styles.css`.

| Markdown | HTML |
|---|---|
| First/intro paragraph | `<p class="lead">…</p>` |
| Other paragraphs | `<p>…</p>` |
| `## Heading` | `<h2>…</h2>` |
| `### Heading` | `<h3>…</h3>` |
| `**bold**` | `<strong>…</strong>` (use for emphasis; renders in brighter text) |
| `*italic*` | `<em>…</em>` |
| Links `[text](url)` | `<a href="url" target="_blank" rel="noopener">text</a>` (auto-styled blue) |
| Images `![alt](path)` | `<img src="path" alt="alt">` (use `../../` for root-level images) |
| Bullet list | `<ul><li>…</li></ul>` (blue-dot bullets are automatic) |
| "Best fit:" / key takeaway line | `<p class="bestfit"><strong>Best fit:</strong> …</p>` |
| Tables | `<div class="table-scroll"><table class="cmp"><thead>…</thead><tbody>…</tbody></table></div>` — use `<th>` for the left-hand row labels too |
| Footnote marker `[1]` | `<sup><a href="#ref-1">[1]</a></sup>` |
| Tag chip | `<span class="tag">Comparison</span>` (cyan) or `<span class="tag blue">Security</span>` |

**References** (if the post has footnotes): close `</article>`, then add
```html
<section class="references">
  <hr style="border:none;border-top:1px solid var(--border);margin-bottom:36px;">
  <h2>References</h2>
  <ol>
    <li id="ref-1">Source — <em>title</em>: <a href="URL" target="_blank" rel="noopener">URL</a></li>
    ...
  </ol>
  <p class="disclaimer">Optional disclaimer text…</p>
</section>
```
The `id="ref-N"` values must match the `#ref-N` anchors used in the body.

**CTA** — always end every post with this block (copy verbatim from the example):
```html
<section class="post-cta">
  <div class="post-cta-inner">
    <h3>Want hardware-grade assurance, delivered as a service?</h3>
    <p>Join the waitlist for early access to Secubit's institutional WaaS platform.</p>
    <a href="../../index.html#cta" class="btn">Join Waitlist →</a>
  </div>
</section>
```

### 4. Register the post on the listing (`blogs/index.html`)
Newest post goes on top.

- **If `featured: true`** — replace the existing `<a class="featured reveal">` block: update its
  `href` to `posts/<slug>.html`, the `tag`, the `meta` (`Featured · {read_time}`), the `<h2>`
  title, and the `<p>` excerpt. (Keep or swap the SVG illustration in `.featured-visual`.)
- **Otherwise** — add a linked card at the front of `.posts-grid`:
  ```html
  <a href="posts/<slug>.html" class="post-card linked reveal">
    <div class="tag-row"><span class="tag blue">Tag</span><span class="meta">{read_time}</span></div>
    <h3>Post title</h3>
    <p>Excerpt.</p>
    <div class="card-foot">Read the article →</div>
  </a>
  ```
  The `linked` class enables the hover lift; placeholder cards use `class="post-card soon"` and a
  `<div class="card-foot">In the works</div>` with no `href`.

### 5. Mirror the newest post on the homepage
In `index.html`, the `#blog` section's `.blog-grid` shows the three newest posts. Update the first
`<a class="blog-card">` to point at `blogs/posts/<slug>.html` with the new tag/date/title, and shift
the others down. "View all →" already points to `blogs/index.html`.

### 6. Verify locally
From the repo root: `python3 -m http.server 8000`, then open:
- `http://localhost:8000/blogs/` — the post appears and links correctly.
- `http://localhost:8000/blogs/posts/<slug>.html` — renders with styling; "← Back to Blog",
  logo, nav, and footer links all resolve; no broken `cdn-cgi` links.
- `http://localhost:8000/` — homepage "Blog" nav/section/footer point to `/blogs/`.

Then commit (only when asked).
