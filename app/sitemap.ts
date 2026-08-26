import type { MetadataRoute } from "next";
import { getCategories, getModulesForCategory } from "./learn/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://aipedia.ais-asu.com/";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Dynamic learning pages
  const learningPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();

    for (const [categorySlug] of Object.entries(categories)) {
      // Add category page
      learningPages.push({
        url: `${baseUrl}/learn/${categorySlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });

      // Add individual model/module pages
      try {
        const modules = await getModulesForCategory(categorySlug);
        for (const module of modules) {
          // Use updatedAt if available, otherwise fall back to createdAt or current date
          let lastModifiedDate = new Date();
          if (module.updatedAt) {
            lastModifiedDate = new Date(module.updatedAt);
          } else if (module.createdAt) {
            lastModifiedDate = new Date(module.createdAt);
          }

          learningPages.push({
            url: `${baseUrl}/learn/${categorySlug}/${module.slug}`,
            lastModified: lastModifiedDate,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      } catch (error) {
        console.error(
          `Error fetching modules for category ${categorySlug}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error("Error generating learning sitemap entries:", error);
  }

  return [...staticPages, ...learningPages];
}
