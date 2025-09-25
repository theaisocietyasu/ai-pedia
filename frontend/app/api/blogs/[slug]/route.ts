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
    const blog = await Blog.findOne({ slug }).exec()

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