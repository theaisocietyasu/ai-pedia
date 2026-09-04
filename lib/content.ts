import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { extractHeadings, type Heading } from "@/lib/markdown-utils";
import {
  type Notebook,
  notebookHeadings,
  notebookTitle,
  notebookToMarkdown,
  parseNotebook,
  withoutLeadingTitle,
} from "@/lib/notebook";

/**
 * File-based content layer.
 *
 * content/
 *   <category>/_category.md   — frontmatter: title, description, image?, order?, mapPosition?
 *   <category>/<slug>.md      — frontmatter: title, description, thumbnail?,
 *                               createdAt?, updatedAt?, contributors?[]
 *   <category>/<slug>.ipynb   — a Jupyter notebook, rendered as an article.
 *                               The same fields may be set on the notebook's
 *                               `metadata["ai-pedia"]` object; the title falls
 *                               back to the notebook's first `# heading`.
 *
 * Everything is read at build time; there is no database.
 */

export const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Category {
  slug: string;
  title: string;
  description: string;
  image?: string;
  order: number;
  /** Optional "x% y%" override for the map vignette region. */
  mapPosition?: string;
}

export interface ArticleMeta {
  slug: string;
  category: string;
  title: string;
  description: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
  contributors: string[];
}

export interface Article extends ArticleMeta {
  /** Markdown body. For notebooks, a markdown rendering of the cells. */
  content: string;
  headings: Heading[];
  /**
   * Markdown source for the copy action: the file itself for `.md` articles,
   * a markdown rendering of the cells for notebooks.
   */
  source: string;
  format: "markdown" | "notebook";
  /** Set when `format` is "notebook". */
  notebook?: Notebook;
}

export interface SearchEntry {
  title: string;
  description?: string;
  path: string;
  type: "page" | "category" | "article";
  category?: string;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readFrontmatter(file: string) {
  const raw = fs.readFileSync(file, "utf8");
  return matter(raw);
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function dateStr(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && value) return value;
  return undefined;
}

export const getCategories = cache((): Category[] => {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && SLUG.test(d.name))
    .map((d) => {
      const file = path.join(CONTENT_DIR, d.name, "_category.md");
      const data = fs.existsSync(file) ? readFrontmatter(file).data : {};
      return {
        slug: d.name,
        title: str(data.title, titleCase(d.name)),
        description: str(data.description),
        image: str(data.image) || undefined,
        order: typeof data.order === "number" ? data.order : 99,
        mapPosition: str(data.mapPosition) || undefined,
      } satisfies Category;
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
});

export const getCategory = cache((slug: string): Category | null => {
  return getCategories().find((c) => c.slug === slug) ?? null;
});

export const getArticles = cache((category?: string): ArticleMeta[] => {
  const categories = category
    ? getCategories().filter((c) => c.slug === category)
    : getCategories();

  const articles: ArticleMeta[] = [];
  for (const cat of categories) {
    const dir = path.join(CONTENT_DIR, cat.slug);
    for (const entry of fs.readdirSync(dir)) {
      if (entry.startsWith("_")) continue;
      const ext = path.extname(entry);
      if (ext !== ".md" && ext !== ".ipynb") continue;
      const slug = entry.slice(0, -ext.length);
      if (!SLUG.test(slug)) continue;
      const file = path.join(dir, entry);

      if (ext === ".md") {
        articles.push(toMeta(cat.slug, slug, readFrontmatter(file).data));
        continue;
      }

      const notebook = parseNotebook(fs.readFileSync(file, "utf8"));
      if (!notebook) continue;
      articles.push(
        toMeta(cat.slug, slug, {
          title: notebookTitle(notebook),
          ...notebook.meta,
        }),
      );
    }
  }
  return articles.sort((a, b) => a.title.localeCompare(b.title));
});

export const getArticle = cache(
  (category: string, slug: string): Article | null => {
    if (!SLUG.test(category) || !SLUG.test(slug)) return null;

    const markdownFile = path.join(CONTENT_DIR, category, `${slug}.md`);
    if (fs.existsSync(markdownFile)) {
      const raw = fs.readFileSync(markdownFile, "utf8");
      const { data, content } = matter(raw);
      const body = content.replace(/\r\n/g, "\n").trim();
      return {
        ...toMeta(category, slug, data),
        content: body,
        headings: extractHeadings(body),
        source: raw.replace(/\r\n/g, "\n"),
        format: "markdown",
      };
    }

    const notebookFile = path.join(CONTENT_DIR, category, `${slug}.ipynb`);
    if (fs.existsSync(notebookFile)) {
      const parsed = parseNotebook(fs.readFileSync(notebookFile, "utf8"));
      if (!parsed) return null;
      const notebook = withoutLeadingTitle(parsed);
      const markdown = notebookToMarkdown(notebook);
      return {
        ...toMeta(category, slug, {
          title: notebookTitle(parsed),
          ...parsed.meta,
        }),
        content: markdown,
        headings: notebookHeadings(notebook),
        source: markdown,
        format: "notebook",
        notebook,
      };
    }

    return null;
  },
);

export const getSearchIndex = cache((): SearchEntry[] => {
  const entries: SearchEntry[] = [];
  for (const cat of getCategories()) {
    entries.push({
      title: cat.title,
      description: cat.description,
      path: `/learn/${cat.slug}`,
      type: "category",
    });
  }
  for (const a of getArticles()) {
    entries.push({
      title: a.title,
      description: a.description,
      path: `/learn/${a.category}/${a.slug}`,
      type: "article",
      category: getCategory(a.category)?.title ?? a.category,
    });
  }
  return entries;
});

/** Path of the article source in the repo, for "edit on GitHub" links. */
export function articleSourcePath(category: string, slug: string): string {
  const ext = fs.existsSync(path.join(CONTENT_DIR, category, `${slug}.md`))
    ? "md"
    : "ipynb";
  return `content/${category}/${slug}.${ext}`;
}

function toMeta(
  category: string,
  slug: string,
  data: Record<string, unknown>,
): ArticleMeta {
  const contributors = Array.isArray(data.contributors)
    ? data.contributors.map((c) => String(c)).filter(Boolean)
    : [];
  return {
    slug,
    category,
    title: str(data.title, titleCase(slug)),
    description: str(data.description),
    thumbnail: str(data.thumbnail) || undefined,
    createdAt: dateStr(data.createdAt),
    updatedAt: dateStr(data.updatedAt),
    contributors,
  };
}

export function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
