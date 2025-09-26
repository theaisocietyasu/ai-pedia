"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { BlogContent as BlogContentType, TocItem } from "@/lib/types"
import { BlogVisualization } from "./blog-visualization"
import { MarkdownRenderer } from "./markdown-renderer"

interface BlogContentProps {
  content: BlogContentType | string  // Support both legacy and new formats
  title: string
  visualizationComponents?: Record<string, React.ComponentType>
}

export function BlogContent({
  content,
  title,
  visualizationComponents = {}
}: BlogContentProps) {
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([])

  // Safety check for content
  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-light-gray/60">No content available</p>
      </div>
    )
  }

  // Handle new markdown format (string content)
  if (typeof content === 'string') {
    return (
      <MarkdownRenderer
        content={content}
        showTableOfContents={true}
        onTocUpdate={setTableOfContents}
        visualizationComponents={visualizationComponents}
        className="space-y-8"
      />
    )
  }

  // Handle legacy markdown format
  if (content.type === "markdown") {
    const markdownContent = content.rawMarkdown || content.htmlReadMe || ''

    if (!markdownContent) {
      return (
        <div className="text-center py-12">
          <p className="text-light-gray/60">No markdown content available</p>
        </div>
      )
    }

    return (
      <MarkdownRenderer
        content={markdownContent}
        showTableOfContents={true}
        onTocUpdate={setTableOfContents}
        visualizationComponents={visualizationComponents}
        className="space-y-8"
      />
    )
  }

  // Legacy structured content
  return (
    <div className="space-y-12">
      {content.headings?.map((heading, index) => {
        const paragraph = content.paragraphs?.[index]
        const image = content.images?.[index]

        return (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* section heading */}
            <h2 className="text-3xl font-bold gradient-text">
              {heading}
            </h2>

            {/* paragraph content */}
            {paragraph && (
              <div className="space-y-4">
                {typeof paragraph === "string" ? (
                  <p className="text-lg text-light-gray/80 leading-relaxed">
                    {paragraph}
                  </p>
                ) : (
                  Object.entries(paragraph).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      {key !== "introduction" && (
                        <h3 className="text-xl font-semibold text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                      )}
                      <p className={`text-lg leading-relaxed ${
                        key === "introduction"
                          ? "text-light-gray/90 bg-white/5 p-6 rounded-xl border border-white/10"
                          : "text-light-gray/80"
                      }`}>
                        {value}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* section image */}
            {image && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-xl overflow-hidden border border-white/10"
              >
                <Image
                  src={image}
                  alt={`Illustration for ${heading}`}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </motion.div>
            )}
          </motion.section>
        )
      })}

      {/* visualization component */}
      {content.visualization && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="my-16"
        >
          <BlogVisualization
            componentId={content.visualization}
            title={`${title} - Interactive Demo`}
          />
        </motion.div>
      )}
    </div>
  )
}