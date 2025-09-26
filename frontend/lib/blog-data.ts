import type { LegacyBlogPost, BlogCategory } from "./types"
import { fetchBlogs, fetchBlogBySlug, convertToLegacyBlog } from "./api/blogs"

// blog categories
export const blogCategories: BlogCategory[] = [
  {
    id: "ml-fundamentals",
    name: "ML Fundamentals",
    slug: "ml-fundamentals",
    description: "Core concepts and foundations of machine learning",
    color: "var(--gradient-primary)"
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    slug: "deep-learning", 
    description: "Neural networks, architectures, and advanced techniques",
    color: "var(--gradient-secondary)"
  },
  {
    id: "computer-vision",
    name: "Computer Vision",
    slug: "computer-vision",
    description: "Image processing, object detection, and visual AI",
    color: "var(--gradient-accent)"
  },
  {
    id: "nlp",
    name: "Natural Language Processing",
    slug: "nlp",
    description: "Text analysis, language models, and conversational AI",
    color: "var(--gradient-primary)"
  },
  {
    id: "tutorials",
    name: "Tutorials",
    slug: "tutorials",
    description: "Step-by-step guides and hands-on projects",
    color: "var(--gradient-secondary)"
  }
]


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

    // Use categories (new) or category (legacy) for matching
    const currentCategory = currentBlog.categories || currentBlog.category
    const relatedBlogs = allBlogs
      .filter(blog => {
        const blogCategory = blog.categories || blog.category
        return blog.slug !== currentSlug && blogCategory === currentCategory
      })
      .slice(0, limit)

    return relatedBlogs.map(convertToLegacyBlog)
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    return []
  }
}

