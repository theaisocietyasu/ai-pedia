import type { LegacyBlogPost, BlogCategory } from "./types"
import { fetchBlogs, fetchBlogBySlug, convertToLegacyBlog } from "./api/blogs"


// API-based utility functions without static fallbacks
export async function getBlogPost(slug: string): Promise<LegacyBlogPost | null> {
  try {
    const blog = await fetchBlogBySlug(slug)
    return blog ? convertToLegacyBlog(blog) : null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getAllBlogs(): Promise<LegacyBlogPost[]> {
  try {
    const blogs = await fetchBlogs()
    return blogs.map(convertToLegacyBlog)
  } catch (error) {
    console.error('Error fetching all blogs:', error)
    return []
  }
}

export async function getBlogsByCategory(category: string): Promise<LegacyBlogPost[]> {
  try {
    const blogs = await fetchBlogs({ category })
    return blogs.map(convertToLegacyBlog)
  } catch (error) {
    console.error('Error fetching blogs by category:', error)
    return []
  }
}

export async function getBlogsByCategories(categories: string): Promise<LegacyBlogPost[]> {
  try {
    const blogs = await fetchBlogs({ category: categories })
    return blogs.map(convertToLegacyBlog)
  } catch (error) {
    console.error('Error fetching blogs by categories:', error)
    return []
  }
}

export async function getFeaturedBlogs(limit: number = 3): Promise<LegacyBlogPost[]> {
  try {
    const blogs = await fetchBlogs({ limit })
    return blogs.map(convertToLegacyBlog)
  } catch (error) {
    console.error('Error fetching featured blogs:', error)
    return []
  }
}

export async function getRelatedBlogs(currentSlug: string, limit: number = 3): Promise<LegacyBlogPost[]> {
  try {
    const allBlogs = await fetchBlogs()
    const currentBlog = allBlogs.find(blog => blog.slug === currentSlug)
    if (!currentBlog) return []

    // Use categories (new) for matching
    const currentCategory = currentBlog.categories
    const relatedBlogs = allBlogs
      .filter(blog => {
        const blogCategory = blog.categories
        return blog.slug !== currentSlug && blogCategory === currentCategory
      })
      .slice(0, limit)

    return relatedBlogs.map(convertToLegacyBlog)
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    return []
  }
}

