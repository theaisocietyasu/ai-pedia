# Contributing

AI Pedia is a collection of Markdown articles. Anyone can propose a change
through a pull request; a maintainer from The AI Society reviews and merges it.

## Fix or improve an existing article

1. Open the article on the site and click **Edit** in the top bar. It opens the
   source file on GitHub.
2. Make your change in the GitHub editor and choose **Propose changes**. GitHub
   creates a fork and a pull request for you.
3. Describe what you changed in the pull request. That is all.

Small fixes (typos, broken links, wrong formulas) are welcome and usually merged
quickly.

## Write a new article

1. Fork the repository and clone it, or use the GitHub web editor.
2. Create `content/<category>/<slug>.md`. The category is one of the folders
   under `content/`; the slug is lowercase with hyphens and becomes the URL.
3. Start the file with frontmatter:

   ```md
   ---
   title: "Logistic Regression"
   description: "One or two sentences. Shown on the category page and in search."
   contributors:
     - "Your Name"
   ---
   ```

4. Write the article below it in standard Markdown. GitHub tables and LaTeX math
   (`$x^2$` inline, `$$ ... $$` on its own lines) are supported. Use `#`, `##`
   and `###` headings; they build the page's table of contents.
5. Put images in `public/images/` and reference them as `/images/<file>`.
6. Open a pull request.

To preview locally: `npm install`, then `npm run dev` and open
http://localhost:3000. `npm run build` checks that every article's frontmatter
is valid.

## Add a category

Create a folder under `content/` and put a `_category.md` in it:

```md
---
title: "Unsupervised"
description: "Clustering, dimensionality reduction, and density estimation."
order: 2
---
```

## Interactive visualizations

Articles can embed React visualizations. Place the placeholder on its own line:

```html
<div id="VZ-linear-equation" data-placeholder="Interactive Linear Equation"></div>
```

The id must exist in `components/visualizations/visualization-registry.tsx`.
To add a new one, create a component under `components/visualizations/categories/`,
register it, and use its id in the article.

## Code changes

Run `npm run lint`, `npm run typecheck` and `npm run build` before opening a
pull request. CI runs the same checks.

## Writing guidelines

- Explain the idea before the formula, and define every symbol you use.
- Prefer plain language over hype. No emoji in prose.
- Cite sources for claims that are not common knowledge.
- Keep each article focused on one topic; link to other articles rather than
  repeating them.
