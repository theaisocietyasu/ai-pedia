import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapVignette } from "@/components/map-vignette";
import { siteConfig } from "@/lib/constants";
import {
  articleSourcePath,
  getArticle,
  getArticles,
  getCategory,
} from "@/lib/content";
import { mapRegionFor } from "@/lib/map-regions";
import { ArticleView } from "./ArticleView";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aipedia.ais-asu.com/";

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return getArticles().map((a) => ({ category: a.category, slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) {
    return { title: "Article Not Found" };
  }
  const url = `${baseUrl}/learn/${category}/${slug}`;
  const description =
    article.description || `Learn about ${article.title} on AI Pedia.`;

  return {
    title: article.title,
    description,
    keywords: [...article.title.split(" "), ...category.split("-")],
    openGraph: {
      title: article.title,
      description,
      url,
      type: "article",
      ...(article.thumbnail && { images: [{ url: article.thumbnail }] }),
    },
    alternates: { canonical: url },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, slug } = await params;
  const article = getArticle(categorySlug, slug);
  const category = getCategory(categorySlug);
  if (!article || !category) notFound();

  const url = `${baseUrl}/learn/${categorySlug}/${slug}`;
  const region = mapRegionFor(categorySlug, category.mapPosition);
  const editUrl = `${siteConfig.repoUrl}/edit/main/${articleSourcePath(categorySlug, slug)}`;

  const learningResourceSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: article.title,
    description: article.description,
    image: article.thumbnail,
    learningResourceType: "Tutorial",
    inLanguage: "en-US",
    dateCreated: article.createdAt,
    dateModified: article.updatedAt,
    provider: {
      "@type": "Organization",
      name: "The AI Society at ASU",
      url: baseUrl,
    },
    about: { "@type": "Thing", name: category.title },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: `${baseUrl}/learn`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: `${baseUrl}/learn/${categorySlug}`,
      },
      { "@type": "ListItem", position: 4, name: article.title, item: url },
    ],
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12 overflow-x-hidden">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data serialized via JSON.stringify, not user HTML
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(learningResourceSchema),
        }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data serialized via JSON.stringify, not user HTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="relative w-screen max-w-[100vw] -mx-6 sm:-mx-8 lg:-mx-12 py-20 md:py-24 text-center">
        <MapVignette position={region.position} zoom={2.3} />
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="eyebrow mb-5">
            <Link
              href="/learn"
              className="hover:text-foreground transition-colors"
            >
              Learn
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/learn/${categorySlug}`}
              className="hover:text-foreground transition-colors"
            >
              {category.title}
            </Link>
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            {article.title}
          </h1>
          {article.description && (
            <p className="mt-5 text-lg md:text-xl text-ink-2 font-display italic max-w-2xl mx-auto">
              {article.description}
            </p>
          )}
        </div>
      </header>

      <div className="w-full max-w-5xl flex flex-col items-center">
        <ArticleView
          article={article}
          editUrl={editUrl}
          source={article.source}
        />
      </div>
    </div>
  );
}
