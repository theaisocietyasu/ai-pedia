# AI Pedia

An interactive encyclopedia of artificial intelligence, written and maintained by
[The AI Society](https://www.ais-asu.com/) at Arizona State University.

Articles are plain Markdown files in this repository. There is no database, no
CMS and no login: to add or fix an article you open a pull request.

## Tech Stack

- Next.js 15 (App Router, fully static export at build time) · React 19 · TypeScript
- Tailwind CSS 4 with a single light "paper" theme (tokens in `app/globals.css`)
- `react-markdown` + `remark-gfm` / `remark-math` / `rehype-katex` for articles
- Recharts, three.js and Framer Motion for the interactive visualizations
- Biome for lint/format · GitHub Actions CI · Dependabot

## Getting Started

```bash
git clone https://github.com/theaisocietyasu/ai-pedia.git
cd ai-pedia
npm install
npm run dev            # http://localhost:3000
```

No environment variables are required for local development. `NEXT_PUBLIC_SITE_URL`
(see `.env.example`) sets the canonical URL used in the sitemap and metadata.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (prerenders every article) |
| `npm start` | Serve the production build |
| `npm run lint` | Biome check |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Biome format (writes) |

## Writing Content

Everything under `content/` is the encyclopedia:

```
content/
  supervised/
    _category.md                # category title, description, order
    linear-regression.md        # one article
    gradient-descent.ipynb      # a Jupyter notebook, also an article
  statistics/
    _category.md
    sampling-foundations-for-statistical-inference.md
public/images/                  # images referenced from articles
```

### Add a category

Create a folder named with a URL-safe slug (`lowercase-with-hyphens`) and put a
`_category.md` in it:

```md
---
title: "Supervised"
description: "Regression, classification, and the algorithms behind them."
order: 1
---
```

### Add an article

Create `content/<category>/<slug>.md`. The file name becomes the URL:
`/learn/<category>/<slug>`. A `.ipynb` file works the same way and is rendered
as a notebook; see [CONTRIBUTING.md](CONTRIBUTING.md).

```md
---
title: "Linear Regression"
description: "One-paragraph summary shown on the category page and in search."
thumbnail: "/images/linear-regression.png"   # optional
createdAt: "2025-10-13"                      # optional, YYYY-MM-DD
updatedAt: "2026-02-02"                      # optional, YYYY-MM-DD
contributors:                                # optional
  - "Your Name"
---

# Your article

Standard Markdown, GitHub tables, and LaTeX math (`$x^2$`, `$$ ... $$`) all work.
```

- Use `#`, `##`, `###` headings — they build the "On this page" navigation.
- Put images in `public/images/` and reference them as `/images/<file>`.
- Embed an interactive visualization by placing its placeholder on its own line:

  ```html
  <div id="VZ-linear-equation" data-placeholder="Interactive Linear Equation"></div>
  ```

  The id must match an entry in
  `components/visualizations/visualization-registry.tsx`. To add a new
  visualization, create a component under `components/visualizations/categories/`
  and register it there.

Every article page has an "Edit this page on GitHub" link that opens the source
file directly, so small fixes can be made from the browser as a PR.

## Project Structure

```
app/                      # App Router pages (all statically generated)
  learn/                  # Category index, category page, article page
  sitemap.ts, robots.ts   # Generated from content/
components/
  MarkdownRenderer.tsx    # Markdown → HTML, swaps VZ placeholders for React
  TableOfContents.tsx     # "On this page" rail
  visualizations/         # Interactive demos + registry
  home/, ui/              # Hero, navbar, footer, search, buttons
content/                  # The encyclopedia (Markdown and notebooks)
lib/
  content.ts              # Reads content/ at build time (categories, articles, search index)
  notebook.ts             # Parses .ipynb files into renderable cells
  embeds.ts               # iframe allowlist and URL normalization
  markdown-utils.ts       # Heading extraction for the TOC
  constants.ts, types.ts  # Site constants, shared types
styles/markdown.css       # Article typography
docs/                     # Map artwork sources
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The short version: edit a file under
`content/`, open a pull request, and a maintainer will review it.

## License

[MIT](LICENSE). Articles under `content/` are contributed by their listed
authors and published under the same license.
