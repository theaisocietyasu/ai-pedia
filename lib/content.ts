import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { extractHeadings, type Heading } from "@/lib/markdown-utils";

/**
 * File-based content layer.
 *
 * content/
 *   <category>/_category.md   — frontmatter: title, description, image?, order?, mapPosition?
 *   <category>/<slug>.md      — frontmatter: title, description, thumbnail?,
 *                               createdAt?, updatedAt?, contributors?[]
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
  content: string;
  headings: Heading[];
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
      if (!entry.endsWith(".md") || entry.startsWith("_")) continue;
      const slug = entry.slice(0, -3);
      if (!SLUG.test(slug)) continue;
      const { data } = readFrontmatter(path.join(dir, entry));
      articles.push(toMeta(cat.slug, slug, data));
    }
  }
  return articles.sort((a, b) => a.title.localeCompare(b.title));
});

export const getArticle = cache(
  (category: string, slug: string): Article | null => {
    if (!SLUG.test(category) || !SLUG.test(slug)) return null;
    const file = path.join(CONTENT_DIR, category, `${slug}.md`);
    if (!fs.existsSync(file)) return null;
    const { data, content } = readFrontmatter(file);
    const body = content.replace(/\r\n/g, "\n").trim();
    return {
      ...toMeta(category, slug, data),
      content: body,
      headings: extractHeadings(body),
    };
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
  return `content/${category}/${slug}.md`;
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
