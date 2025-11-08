import React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getModelData } from "../../categories"
import { SignedIn } from "@/components/auth/auth-components"
import ReactMarkdown from "react-markdown"
import { extractHeadings } from "@/lib/markdown-utils"
import { LearnModuleClient } from "./LearnModuleClient"
import { EditButton } from "./EditButton"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipedia.ais-asu.com/'

interface LearnModulePageProps {
  params: Promise<{
    category: string
    model: string
  }>
}

export async function generateMetadata({ params }: LearnModulePageProps): Promise<Metadata> {
  const { category, model: modelSlug } = await params

  try {
    const modelData = await getModelData(modelSlug)

    if (!modelData || !modelData.title) {
      return {
        title: "Module Not Found",
        description: "The requested learning module could not be found."
      }
    }

    // Extract keywords from content (first 10 words from headings or content)
    const contentPreview = modelData.content?.substring(0, 200) || modelData.description
    const keywords = modelData.title.split(' ').concat(category.split('-'))

    return {
      title: modelData.title,
      description: modelData.description || `Learn about ${modelData.title} in our comprehensive guide.`,
      keywords: keywords,
      openGraph: {
        title: modelData.title,
        description: modelData.description || `Learn about ${modelData.title} in our comprehensive guide.`,
        url: `${baseUrl}/learn/${category}/${modelSlug}`,
        type: "article",
        images: [
          {
            url: modelData.imgPath || "/og-image.png",
            width: 1200,
            height: 630,
            alt: modelData.title
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: modelData.title,
        description: modelData.description || `Learn about ${modelData.title} in our comprehensive guide.`,
        images: [modelData.imgPath || "/og-image.png"]
      },
      alternates: {
        canonical: `${baseUrl}/learn/${category}/${modelSlug}`
      }
    }
  } catch (error) {
    console.error(`Error generating metadata for ${modelSlug}:`, error)
    return {
      title: "Module Not Found",
      description: "The requested learning module could not be found."
    }
  }
}

async function LearnModulePage({ params }: LearnModulePageProps) {
  const { category, model: modelSlug } = await params

  let model: any = null

  try {
    console.log("Fetching model data for slug:", modelSlug)
    model = await getModelData(modelSlug)
    if (!model || !model.title) {
      notFound()
    }
  } catch (error) {
    console.error('Error fetching model data:', error)
    notFound()
  }

  // Extract headings for table of contents
  const headings = model.content ? extractHeadings(model.content) : []

  // Use the actual title from the database, fallback to generated name from URL
  const displayTitle = model?.title || modelSlug
    ?.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Structured data for learning resource
  const learningResourceSchema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": model.title,
    "description": model.description,
    "image": model.imgPath || `${baseUrl}/og-image.png`,
    "educationalLevel": "Intermediate",
    "learningResourceType": "Tutorial",
    "inLanguage": "en-US",
    "provider": {
      "@type": "Organization",
      "name": "The AI Society at ASU",
      "url": baseUrl
    },
    "about": {
      "@type": "Thing",
      "name": category.replace(/-/g, ' '),
      "description": `Learning resources about ${category.replace(/-/g, ' ')}`
    }
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
        "name": "Learn",
        "item": `${baseUrl}/learn`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.replace(/-/g, ' '),
        "item": `${baseUrl}/learn/${category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": model.title,
        "item": `${baseUrl}/learn/${category}/${modelSlug}`
      }
    ]
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="w-full max-w-5xl flex flex-col items-center gap-16">
        {/* Title */}
        <div className="relative inline-block mb-10 text-center">
          <h1 className="text-2xl mt-12 md:text-5xl font-bold  italic relative z-10">
            {displayTitle}
          </h1>

          {/* Model Description */}
          {model?.description && (
            <div className="mt-4 text-base md:text-lg text-light-gray/80 max-w-2xl mx-auto">
              <ReactMarkdown>
                {model.description}
              </ReactMarkdown>
            </div>
          )}

          {/* Edit Button - Only visible to signed-in users */}
          <SignedIn>
            <EditButton category={category} modelSlug={modelSlug} />
          </SignedIn>
        </div>

        {/* Pass to client component for interactive features */}
        <LearnModuleClient
          model={model}
          displayTitle={displayTitle}
          headings={headings}
        />
      </div>
    </div>
  )
}

export default LearnModulePage
