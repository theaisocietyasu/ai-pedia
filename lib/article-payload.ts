import { siteConfig } from "@/lib/constants";
import { type Article, articleSourcePath, getCategory } from "@/lib/content";
import type { Notebook } from "@/lib/notebook";

/**
 * The shape the map's reading panel fetches. It carries exactly what the
 * renderers need — the same markdown (or notebook) the standalone article page
 * is built from — plus the few bits of chrome the panel shows around it.
 */
export interface ArticlePayload {
  title: string;
  description: string;
  category: string;
  categoryTitle: string;
  content: string;
  format: Article["format"];
  notebook?: Notebook;
  contributors: string[];
  updatedAt?: string;
  href: string;
  editUrl: string;
}

export function toArticlePayload(article: Article): ArticlePayload {
  const { category, slug } = article;
  return {
    title: article.title,
    description: article.description,
    category,
    categoryTitle: getCategory(category)?.title ?? category,
    content: article.content,
    format: article.format,
    notebook: article.notebook,
    contributors: article.contributors,
    updatedAt: article.updatedAt,
    href: `/learn/${category}/${slug}`,
    editUrl: `${siteConfig.repoUrl}/edit/main/${articleSourcePath(category, slug)}`,
  };
}
