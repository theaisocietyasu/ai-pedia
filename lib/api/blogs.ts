import type { BlogPost, EnhancedBlogPost, Author, ActionButton, LegacyBlogPost, BlogContent } from '@/lib/types'
import { MarkdownParser } from '@/lib/markdown-parser'

// Helper function to get base URL for API calls
function getApiBaseUrl(): string {
  // In server-side context
  if (typeof window === 'undefined') {
    // Use localhost for development, or environment variable for production
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }
  // In client-side context, we can use relative URLs
  return ''
}

const API_BASE = `${getApiBaseUrl()}/api/blogs`

// API service functions for blog data
export async function fetchBlogs(options?: {
  category?: string
  search?: string
  limit?: number
}): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams()

    if (options?.category) params.append('categories', options.category)  // Updated to use new field name
    if (options?.search) params.append('search', options.search)
    if (options?.limit) params.append('limit', options.limit.toString())

    const url = `${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`
    console.log(url)
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch blogs')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE}/${slug}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch blog: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch blog')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching blog:', error)
    throw error
  }
}

export async function fetchBlogCategories(): Promise<Array<{name: string, slug: string, count: number}>> {
  try {
    const response = await fetch(`${API_BASE}/categories`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch categories')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Utility functions to work with the new schema
export function getBlogsByCategory(blogs: BlogPost[], category: string): BlogPost[] {
  if (category === 'all') return blogs
  return blogs.filter(blog => {
    const blogCategory = 'categories' in blog ? blog.categories : undefined
    return blogCategory?.toLowerCase() === category.toLowerCase()
  })
}

export function getFeaturedBlogs(blogs: BlogPost[], limit: number = 3): BlogPost[] {
  return blogs.slice(0, limit)
}

export function getRelatedBlogs(blogs: BlogPost[], currentSlug: string, limit: number = 3): BlogPost[] {
  const currentBlog = blogs.find(blog => blog.slug === currentSlug)
  if (!currentBlog) return []

  const currentCategory = 'categories' in currentBlog ? currentBlog.categories : undefined

  return blogs
    .filter(blog => {
      const blogCategory = 'categories' in blog ? blog.categories : undefined
      return blog.slug !== currentSlug && blogCategory === currentCategory
    })
    .slice(0, limit)
}

// Helper function to convert MongoDB blog to legacy format for backward compatibility
export function convertToLegacyBlog(blog: BlogPost): LegacyBlogPost {
  // Handle both new and legacy author formats
  const primaryAuthor = blog.authors?.[0] || { name: 'Unknown Author', social: '' }

  // Generate missing fields from markdown content if needed
  let excerpt = blog.excerpt
  let readTime = blog.readTime
  let slug = blog.slug

  // Always ensure we have a slug - auto-generate from title if missing
  if (!slug && blog.title) {
    slug = blog.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // If we have new markdown content, parse it to generate missing fields
  if (typeof blog.content === 'string' && blog.content.trim()) {
    const parsed = MarkdownParser.parse(blog.content)
    if (!excerpt) excerpt = parsed.excerpt
    if (!readTime) readTime = parsed.estimatedReadTime
  }

  // Convert content to legacy format
  const legacyContent = convertContentToLegacy(blog)

  return {
    id: blog._id,
    title: blog.title,
    excerpt: excerpt || 'No excerpt available',
    author: primaryAuthor.name,
    authorImage: `/authors/${primaryAuthor.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    publishDate: blog.publishDate || blog.lastUpdated || new Date().toISOString(),
    readTime: readTime || '5 min read',
    category: blog.categories || 'General',
    tags: blog.tags || [],
    featuredImage: blog.featuredImage || '/blog/default-featured.jpg',
    slug: slug || 'untitled-blog',
    content: legacyContent,
    lastUpdated: blog.lastUpdated
  }
}

// Enhanced conversion function that handles both new and legacy content formats
function convertContentToLegacy(blog: BlogPost): BlogContent {
  // New format: string content (markdown)
  if (typeof blog.content === 'string') {
    return {
      type: 'markdown',
      rawMarkdown: blog.content,
      htmlReadMe: blog.content  // For backward compatibility
    }
  }

  // Legacy format: ContentBlock array
  if (Array.isArray(blog.content)) {
    const contentBlocks = blog.content as any[]  // Legacy ContentBlock type

    // Try to convert to structured format first
    const headings = contentBlocks
      .filter(block => block.heading)
      .map(block => block.heading!)

    const paragraphs: (string | { [key: string]: string })[] = []
    const images: string[] = []
    let visualization: string | undefined

    contentBlocks.forEach(block => {
      if (typeof block.content === 'string') {
        paragraphs.push(block.content)
      }

      if (block.images) {
        images.push(...block.images)
      }

      if (block.visualization && block.visualization.length > 0) {
        visualization = block.visualization[0]
      }
    })

    if (headings.length > 0) {
      return {
        type: 'structured',
        headings,
        paragraphs,
        images,
        visualization
      }
    }

    // Convert to markdown if no structured content
    const markdownContent = contentBlocks
      .map(block => {
        let content = ''
        if (block.heading) content += `## ${block.heading}\n\n`
        if (typeof block.content === 'string') content += `${block.content}\n\n`
        return content
      })
      .join('')

    return {
      type: 'markdown',
      rawMarkdown: markdownContent,
      htmlReadMe: markdownContent
    }
  }

  // Fallback for unknown content format
  return {
    type: 'markdown',
    rawMarkdown: '',
    htmlReadMe: ''
  }
}

// Helper function to enhance blog post with generated fields
export function enhanceBlogPost(blog: BlogPost): EnhancedBlogPost {
  let excerpt = blog.excerpt
  let slug = blog.slug
  let readTime = blog.readTime
  let tags = blog.tags
  let featuredImage = blog.featuredImage
  let publishDate = blog.publishDate

  // If we have markdown content, parse it to generate missing fields
  if (typeof blog.content === 'string' && blog.content.trim()) {
    const parsed = MarkdownParser.parse(blog.content)

    if (!excerpt) excerpt = parsed.excerpt
    if (!readTime) readTime = parsed.estimatedReadTime
    if (!featuredImage && parsed.extractedImages.length > 0) {
      featuredImage = parsed.extractedImages[0]
    }
    if (!slug) {
      slug = blog.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }
  }

  return {
    ...blog,
    excerpt: excerpt || `Learn about ${blog.title.toLowerCase()}`,
    slug: slug || blog._id,
    tags: tags || blog.categories ? [blog.categories] : [],
    featuredImage: featuredImage || '/blog/default-featured.jpg',
    publishDate: publishDate || blog.lastUpdated || blog.createdAt || new Date().toISOString(),
    readTime: readTime || '5 min read'
  }
}