import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles, getCategories, getCategory } from "@/lib/content";
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
    <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12">
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
      <CategoryPageClient category={category} articles={articles} />
    </div>
  );
}
