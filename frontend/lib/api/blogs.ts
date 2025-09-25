import type { BlogPost, Author, ContentBlock } from '@/lib/types'

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
    
    if (options?.category) params.append('category', options.category)
    if (options?.search) params.append('search', options.search)
    if (options?.limit) params.append('limit', options.limit.toString())

    const url = `${API_BASE}${params.toString() ? `?${params.toString()}` : ''}`
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
  return blogs.filter(blog => blog.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedBlogs(blogs: BlogPost[], limit: number = 3): BlogPost[] {
  return blogs.slice(0, limit)
}

export function getRelatedBlogs(blogs: BlogPost[], currentSlug: string, limit: number = 3): BlogPost[] {
  const currentBlog = blogs.find(blog => blog.slug === currentSlug)
  if (!currentBlog) return []
  
  return blogs
    .filter(blog => blog.slug !== currentSlug && blog.category === currentBlog.category)
    .slice(0, limit)
}

// Helper function to convert MongoDB blog to legacy format for backward compatibility
export function convertToLegacyBlog(blog: BlogPost): any {
  // Get primary author
  const primaryAuthor = blog.author[0] || { name: 'Unknown Author', socials: [] }
  
  // Convert content blocks to legacy format
  const legacyContent = convertContentBlocksToLegacy(blog.content)

  return {
    id: blog._id,
    title: blog.title,
    excerpt: blog.excerpt,
    author: primaryAuthor.name,
    authorImage: `/authors/${primaryAuthor.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    publishDate: blog.publishDate,
    readTime: blog.readTime,
    category: blog.category,
    tags: blog.tags,
    featuredImage: blog.featuredImage,
    slug: blog.slug,
    content: legacyContent
  }
}

function convertContentBlocksToLegacy(contentBlocks: ContentBlock[]): any {
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

  // If no structured content, try to create markdown
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
    htmlReadMe: markdownContent
  }
}