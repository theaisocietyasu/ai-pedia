import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategories,
  getModulesForCategory,
  type LearnModuleUI,
} from "../categories";
import { CategoryPageClient } from "./CategoryPageClient";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://aipedia.ais-asu.com/";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  try {
    // Fetch category data and modules
    const [categoriesData, modules] = await Promise.all([
      getCategories(),
      getModulesForCategory(category),
    ]);

    const categoryData = categoriesData[category];

    if (!categoryData) {
      return {
        title: "Category Not Found",
        description: "The requested learning category could not be found.",
      };
    }

    // Extract keywords from modules
    const keywords = [
      category.replace(/-/g, " "),
      ...modules.slice(0, 5).map((m) => m.name),
    ];

    // Create a comprehensive description
    const description =
      categoryData.description ||
      `Explore ${
        modules.length
      } comprehensive tutorials and guides about ${category.replace(
        /-/g,
        " ",
      )}. Master key concepts with our interactive learning modules.`;

    return {
      title: `${
        category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
      } Learning`,
      description: description,
      keywords: keywords,
      openGraph: {
        title: `${
          category.charAt(0).toUpperCase() +
          category.slice(1).replace(/-/g, " ")
        } Learning | AI Pedia`,
        description: description,
        url: `${baseUrl}/learn/${category}`,
        type: "website",
        images: [
          {
            url: categoryData.imgPath || "/og-image.png",
            width: 1200,
            height: 630,
            alt: `${category.replace(/-/g, " ")} learning resources`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${
          category.charAt(0).toUpperCase() +
          category.slice(1).replace(/-/g, " ")
        } Learning`,
        description: description,
        images: [categoryData.imgPath || "/og-image.png"],
      },
      alternates: {
        canonical: `${baseUrl}/learn/${category}`,
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for category ${category}:`, error);
    return {
      title: "Category Not Found",
      description: "The requested learning category could not be found.",
    };
  }
}

async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  let models: LearnModuleUI[] = [];
  let categoryDescription: string = "";

  try {
    // Load both models and categories data in parallel
    const [modelsData, categoriesData] = await Promise.all([
      getModulesForCategory(category),
      getCategories(),
    ]);

    models = modelsData;

    // Get the description for this specific category
    const categoryData = categoriesData[category];
    if (categoryData?.description) {
      categoryDescription = categoryData.description;
    }

    // if (!models.length) {
    //   notFound();
    // }
  } catch (err) {
    console.error(`Error loading data for category ${category}:`, err);
    notFound();
  }

  // Structured data for collection page
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${
      category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
    } Learning`,
    description:
      categoryDescription ||
      `Learning resources about ${category.replace(/-/g, " ")}`,
    url: `${baseUrl}/learn/${category}`,
    provider: {
      "@type": "Organization",
      name: "The AI Society at ASU",
      url: baseUrl,
    },
    numberOfItems: models.length,
    hasPart: models.slice(0, 10).map((model) => ({
      "@type": "LearningResource",
      name: model.name,
      description: model.description,
      url: `${baseUrl}/learn/${category}/${model.slug}`,
      image: model.imgPath,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: `${baseUrl}/learn`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name:
          category.charAt(0).toUpperCase() +
          category.slice(1).replace(/-/g, " "),
        item: `${baseUrl}/learn/${category}`,
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

      {/* Pass data to client component for interactive features */}
      <CategoryPageClient
        category={category}
        models={models}
        categoryDescription={categoryDescription}
      />
    </div>
  );
}

export default CategoryPage;
