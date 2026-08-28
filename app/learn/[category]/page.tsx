import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapVignette } from "@/components/map-vignette";
import { getArticles, getCategories, getCategory } from "@/lib/content";
import { mapRegionFor } from "@/lib/map-regions";
import { CategoryPageClient } from "./CategoryPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aipedia.ais-asu.com/";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) {
    return { title: "Category Not Found" };
  }
  const articles = getArticles(slug);
  const description =
    category.description ||
    `${articles.length} tutorials about ${category.title.toLowerCase()}.`;

  return {
    title: category.title,
    description,
    keywords: [category.title, ...articles.slice(0, 5).map((a) => a.title)],
    openGraph: {
      title: `${category.title} | AI Pedia`,
      description,
      url: `${baseUrl}/learn/${slug}`,
      type: "website",
    },
    alternates: { canonical: `${baseUrl}/learn/${slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const articles = getArticles(slug);
  const region = mapRegionFor(slug, category.mapPosition);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `${baseUrl}/learn/${slug}`,
    provider: {
      "@type": "Organization",
      name: "The AI Society at ASU",
      url: baseUrl,
    },
    numberOfItems: articles.length,
    hasPart: articles.slice(0, 10).map((a) => ({
      "@type": "LearningResource",
      name: a.title,
      description: a.description,
      url: `${baseUrl}/learn/${slug}/${a.slug}`,
      image: a.thumbnail,
    })),
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
        item: `${baseUrl}/learn/${slug}`,
      },
    ],
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12 overflow-x-hidden">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data serialized via JSON.stringify, not user HTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data serialized via JSON.stringify, not user HTML
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="relative w-screen max-w-[100vw] -mx-6 sm:-mx-8 lg:-mx-12 py-20 md:py-24 text-center">
        <MapVignette position={region.position} />
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="eyebrow mb-5">
            <Link
              href="/learn"
              className="hover:text-foreground transition-colors"
            >
              Learn
            </Link>
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            {category.title}
          </h1>
          {category.description && (
            <p className="mt-5 text-lg text-ink-2 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          <p className="mt-6 text-xs tracking-[0.18em] uppercase text-purple-deep/80">
            {region.label}
          </p>
        </div>
      </header>

      <CategoryPageClient category={category} articles={articles} />
    </div>
  );
}
