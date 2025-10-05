"use client"

import React, { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronRight, ChevronDown, List } from "lucide-react"
import { MarkdownParser } from "@/lib/markdown-parser"
import { BlogVisualization } from "./blog-visualization"
import { VISUALIZATION_COMPONENTS } from "../visualizations/visualization-registry"
import { MarkdownRendererProps, TocItem, ParsedMarkdown } from "@/lib/types"

export function MarkdownRenderer({
  content,
  showTableOfContents = true,
  onTocUpdate,
  visualizationComponents = {},
  className = ""
}: MarkdownRendererProps) {
  const [parsedContent, setParsedContent] = useState<ParsedMarkdown | null>(null)
  const [activeHeadingId, setActiveHeadingId] = useState<string>("")
  const [tocVisible, setTocVisible] = useState(false)

  // Parse markdown content
  const parsed = useMemo(() => {
    if (!content) return null
    return MarkdownParser.parse(content)
  }, [content])

  useEffect(() => {
    if (parsed) {
      setParsedContent(parsed)
      onTocUpdate?.(parsed.tableOfContents)
    }
  }, [parsed, onTocUpdate])

  // Handle scroll to update active heading (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined' || !showTableOfContents || !parsedContent?.tableOfContents.length) return

    const handleScroll = () => {
      const headings = parsedContent.tableOfContents.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(item => item.element)

      const scrollPosition = window.scrollY + 100

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading.element && heading.element.offsetTop <= scrollPosition) {
          setActiveHeadingId(heading.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [parsedContent, showTableOfContents])

  // Render visualization components
  const renderWithVisualizations = (html: string) => {
    if (!parsedContent?.visualizationIds.length) {
      return <div dangerouslySetInnerHTML={{ __html: html }} />
    }

    const parts = html.split(/(<div class="markdown-visualization" data-component-id="[^"]+"><\/div>)/g)

    return parts.map((part, index) => {
      const match = part.match(/data-component-id="([^"]+)"/)
      if (match) {
        const componentId = match[1]
        const Component = visualizationComponents[componentId] || VISUALIZATION_COMPONENTS[componentId]

        return (
          <div key={index} className="markdown-visualization my-8">
            {Component ? (
              <Component />
            ) : (
              <BlogVisualization
                componentId={componentId}
                title={`Interactive Visualization: ${componentId}`}
              />
            )}
          </div>
        )
      }

      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
    })
  }

  const scrollToHeading = (id: string) => {
    if (typeof window === 'undefined') return

    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveHeadingId(id)
    }
  }

  const renderTocItem = (item: TocItem, level: number = 0) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: level * 0.05 }}
      className={`
        cursor-pointer transition-all duration-300
        ${level > 0 ? 'ml-4 text-sm' : 'text-base'}
        ${activeHeadingId === item.id
          ? 'text-purple font-semibold'
          : 'text-light-gray/70 hover:text-white'
        }
      `}
      onClick={() => scrollToHeading(item.id)}
    >
      <div className={`
        flex items-center gap-2 py-1 px-2 rounded-md transition-all duration-300
        ${activeHeadingId === item.id
          ? 'bg-purple/20 border-l-2 border-purple'
          : 'hover:bg-white/5'
        }
      `}>
        <span className={`
          w-2 h-2 rounded-full transition-all duration-300
          ${activeHeadingId === item.id
            ? 'bg-purple'
            : 'bg-light-gray/30'
          }
        `} />
        <span className="truncate">{item.title}</span>
      </div>
      {item.children && item.children.length > 0 && (
        <ul className="mt-1">
          {item.children.map(child => renderTocItem(child, level + 1))}
        </ul>
      )}
    </motion.li>
  )

  if (!parsedContent) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-purple border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Mobile TOC toggle */}
      {showTableOfContents && parsedContent.tableOfContents.length > 0 && (
        <div className="md:hidden mb-6">
          <button
            onClick={() => setTocVisible(!tocVisible)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10
                       border border-white/10 rounded-lg transition-all duration-300"
          >
            <List size={18} />
            <span>Table of Contents</span>
            {tocVisible ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {tocVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <nav>
                <ul className="space-y-1">
                  {MarkdownParser.buildHierarchicalToc(parsedContent.tableOfContents)
                    .map(item => renderTocItem(item))}
                </ul>
              </nav>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex gap-8">
        {/* Table of contents - Desktop */}
        {showTableOfContents && parsedContent.tableOfContents.length > 0 && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block w-64 flex-shrink-0"
          >
            <div className="sticky top-24">
              <div className="glass-effect rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold gradient-text mb-4">
                  Table of Contents
                </h3>
                <nav className="max-h-96 overflow-y-auto custom-scrollbar">
                  <ul className="space-y-1">
                    {MarkdownParser.buildHierarchicalToc(parsedContent.tableOfContents)
                      .map(item => renderTocItem(item))}
                  </ul>
                </nav>
              </div>
            </div>
          </motion.aside>
        )}

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`
            flex-1 min-w-0 markdown-content
            ${className}
          `}
        >
          {renderWithVisualizations(parsedContent.html)}
        </motion.div>
      </div>
    </div>
  )
}

// Custom scrollbar styles
const customScrollbarStyles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(58, 56, 142, 0.6);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(58, 56, 142, 0.8);
}
`

// Inject custom scrollbar styles (client-side only)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const existingStyle = document.getElementById('markdown-renderer-styles')
  if (!existingStyle) {
    const style = document.createElement('style')
    style.id = 'markdown-renderer-styles'
    style.textContent = customScrollbarStyles
    document.head.appendChild(style)
  }
}