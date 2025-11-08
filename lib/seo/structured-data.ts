import React from 'react'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipedia.ais-asu.com/'

export interface ArticleSchemaProps {
  title: string
  description: string
  image: string
  datePublished: string
  author: string
  slug: string
  tags: string[]
  category: string
}

export interface BreadcrumbItem {
  name: string
  item: string
}

export interface CourseSchemaProps {
  name: string
  description: string
  provider: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

export function generateArticleSchema(props: ArticleSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": props.title,
    "description": props.description,
    "image": props.image || `${baseUrl}/og-image.png`,
    "datePublished": props.datePublished,
    "author": {
      "@type": "Person",
      "name": props.author
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
      "@id": `${baseUrl}/blogs/${props.slug}`
    },
    "keywords": props.tags.join(", "),
    "articleSection": props.category
  }
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "The AI Society at ASU",
    "alternateName": "AI Pedia",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": "Master artificial intelligence through interactive visualizations and hands-on projects. Join ASU's premier AI learning platform powered by The AI Society.",
    "sameAs": [
      "https://www.instagram.com/theaisociety.asu/"
    ],
    "parentOrganization": {
      "@type": "CollegeOrUniversity",
      "name": "Arizona State University"
    }
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Pedia",
    "url": baseUrl,
    "description": "Master artificial intelligence through interactive visualizations and hands-on projects.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/blogs?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}

export function generateCourseSchema(props: CourseSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": props.name,
    "description": props.description,
    "provider": {
      "@type": "Organization",
      "name": props.provider,
      "sameAs": baseUrl
    },
    "url": props.url,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT"
    }
  }
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

export function generateVideoSchema(props: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration: string
  contentUrl: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": props.name,
    "description": props.description,
    "thumbnailUrl": props.thumbnailUrl,
    "uploadDate": props.uploadDate,
    "duration": props.duration,
    "contentUrl": props.contentUrl
  }
}
