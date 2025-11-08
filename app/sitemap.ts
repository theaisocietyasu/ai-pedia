import { MetadataRoute } from 'next'
import { getAllBlogs } from '@/lib/blog-data'
import { getCategories, getModulesForCategory } from './learn/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipedia.ais-asu.com/'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/waitlist`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const blogs = await getAllBlogs()
    blogPages = blogs.map((blog) => {
      // Use lastUpdated if available, otherwise fall back to publishDate
      const lastModifiedDate = blog.lastUpdated
        ? new Date(blog.lastUpdated)
        : new Date(blog.publishDate)

      return {
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: lastModifiedDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error)
  }

  // Dynamic learning pages
  let learningPages: MetadataRoute.Sitemap = []
  try {
    const categories = await getCategories()

    for (const [categorySlug, categoryData] of Object.entries(categories)) {
      // Add category page
      learningPages.push({
        url: `${baseUrl}/learn/${categorySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })

      // Add individual model/module pages
      try {
        const modules = await getModulesForCategory(categorySlug)
        for (const module of modules) {
          // Use updatedAt if available, otherwise fall back to createdAt or current date
          let lastModifiedDate = new Date()
          if (module.updatedAt) {
            lastModifiedDate = new Date(module.updatedAt)
          } else if (module.createdAt) {
            lastModifiedDate = new Date(module.createdAt)
          }

          learningPages.push({
            url: `${baseUrl}/learn/${categorySlug}/${module.slug}`,
            lastModified: lastModifiedDate,
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      } catch (error) {
        console.error(`Error fetching modules for category ${categorySlug}:`, error)
      }
    }
  } catch (error) {
    console.error('Error generating learning sitemap entries:', error)
  }

  return [...staticPages, ...blogPages, ...learningPages]
}
