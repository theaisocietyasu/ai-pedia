import { NextResponse } from "next/server";
import { toArticlePayload } from "@/lib/article-payload";
import { getArticle, getArticles } from "@/lib/content";

/**
 * Article content for the map's reading panel, generated at build time
 * alongside the article pages themselves — no database, no runtime rendering.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ category: a.category, slug: a.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string; slug: string }> },
) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(toArticlePayload(article));
}
