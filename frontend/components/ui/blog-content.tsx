"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { BlogContent as BlogContentType } from "@/lib/types"
import { BlogVisualization } from "./blog-visualization"

interface BlogContentProps {
  content: BlogContentType
  title: string
}

export function BlogContent({ content, title }: BlogContentProps) {
  if (content.type === "markdown") {
    return (
      <div className="space-y-8">
        {/* markdown content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-lg max-w-none
                     prose-headings:gradient-text prose-headings:font-bold
                     prose-p:text-light-gray/80 prose-p:leading-relaxed
                     prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded
                     prose-pre:bg-dark-gray prose-pre:border prose-pre:border-white/10
                     prose-blockquote:border-l-purple prose-blockquote:bg-white/5
                     prose-strong:text-white prose-a:text-purple prose-a:no-underline
                     hover:prose-a:text-pink prose-a:transition-colors"
          dangerouslySetInnerHTML={{ 
            __html: content.htmlReadMe?.replace(/\n/g, '<br>') || '' 
          }}
        />
        
        {/* visualization component */}
        {content.visualization && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="my-12"
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

  // structured content
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