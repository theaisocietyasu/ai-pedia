import { type NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Blog from '@/lib/models/blog'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase()

    const { slug } = await params

    // First try to find by slug field
    let blog = await Blog.findOne({ slug }).exec()

    // If not found, try to find by auto-generated slug from title
    if (!blog) {
      // Generate slug from title for blogs that don't have explicit slug
      const blogs = await Blog.find({}).exec()
      blog = blogs.find(b => {
        if (!b.slug && b.title) {
          const autoSlug = b.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
          return autoSlug === slug
        }
        return false
      })
    }

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog not found',
          message: `No blog found with slug: ${slug}`
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: blog
    })

  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blog',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}