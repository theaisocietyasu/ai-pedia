import React from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  BookOpen,
  ChevronRight
} from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import { BlogContent } from "@/components/ui/blog-content"
import { BlogCard } from "@/components/ui/blog-card"
import { getBlogPost, getRelatedBlogs } from "@/lib/blog-data"
import type { LegacyBlogPost } from "@/lib/types"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipedia.ais-asu.com/'

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const blog = await getBlogPost(slug)

    if (!blog) {
      return {
        title: "Blog Not Found",
        description: "The requested blog post could not be found."
      }
    }

    const publishDate = new Date(blog.publishDate).toISOString()
    const modifiedDate = blog.lastUpdated ? new Date(blog.lastUpdated).toISOString() : publishDate
    const authorName = typeof blog.author === 'string' ? blog.author : blog.author

    return {
      title: blog.title,
      description: blog.excerpt,
      keywords: blog.tags,
      authors: [{ name: authorName }],
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        url: `${baseUrl}/blogs/${slug}`,
        type: "article",
        publishedTime: publishDate,
        modifiedTime: modifiedDate,
        authors: [authorName],
        tags: blog.tags,
        images: [
          {
            url: blog.featuredImage || "/og-image.png",
            width: 1200,
            height: 630,
            alt: blog.title
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt,
        images: [blog.featuredImage || "/og-image.png"]
      },
      alternates: {
        canonical: `${baseUrl}/blogs/${slug}`
      }
    }
  } catch (error) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found."
    }
  }
}

async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params

  let blog: LegacyBlogPost | null = null
  let relatedBlogs: LegacyBlogPost[] = []

  try {
    console.log("Fetching blog post for slug:", slug)
    blog = await getBlogPost(slug)
    if (!blog) {
      notFound()
    }
    relatedBlogs = await getRelatedBlogs(slug, 3)
  } catch (error) {
    console.error('Error fetching blog data:', error)
    notFound()
  }

  const authorName = typeof blog.author === 'string' ? blog.author : blog.author

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.featuredImage || `${baseUrl}/og-image.png`,
    "datePublished": new Date(blog.publishDate).toISOString(),
    "dateModified": blog.lastUpdated ? new Date(blog.lastUpdated).toISOString() : new Date(blog.publishDate).toISOString(),
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "The AI Society at ASU",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blogs/${slug}`
    },
    "keywords": blog.tags.join(", "),
    "articleSection": blog.category
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `${baseUrl}/blogs/${slug}`
      }
    ]
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* back navigation */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-light-gray/80 hover:text-white
                         transition-colors duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* hero section */}
      <section className="pb-12">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          {/* breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-light-gray/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={16} />
            <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={16} />
            <span className="text-white">{blog.category}</span>
          </nav>

          {/* category badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                           bg-purple/20 text-purple border border-purple/30">
              {blog.category}
            </span>
          </div>

          {/* title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <GradientText animate={false}>{blog.title}</GradientText>
          </h1>

          {/* excerpt */}
          <p className="text-xl text-light-gray/80 leading-relaxed mb-8">
            {blog.excerpt}
          </p>

          {/* meta information */}
          <div className="flex flex-wrap items-center gap-6 text-light-gray/60 mb-8">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{typeof blog.author === 'string' ? blog.author : blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(blog.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{blog.readTime}</span>
            </div>
          </div>

          {/* tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm
                           bg-white/5 text-light-gray/70 border border-white/10
                           hover:bg-white/10 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* share button */}
          <div className="flex items-center gap-4 pb-8 border-b border-white/10">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10
                              text-light-gray hover:text-white border border-white/10 rounded-lg
                              transition-all duration-300">
              <Share2 size={18} />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </section>

      {/* featured image */}
      <section className="pb-16">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            {blog.featuredImage && (
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* blog content */}
      <section className="pb-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <article>
            <BlogContent
              content={blog.content}
              title={blog.title}
              visualizationComponents={{}}
            />
          </article>
        </div>
      </section>

      {/* related articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Related Articles
              </h2>
              <p className="text-light-gray/60 max-w-2xl mx-auto">
                Continue your learning journey with these related articles from the same category.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {relatedBlogs.map((relatedBlog, index) => (
                <BlogCard
                  key={relatedBlog.id}
                  blog={relatedBlog}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

     
    </main>
  )
}

export default BlogDetailPage