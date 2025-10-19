"use client"

import { useState, useEffect } from "react"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import TableOfContents from "@/components/TableOfContents"
import type { Heading } from "@/lib/markdown-utils"

interface LearnModuleClientProps {
  model: any
  displayTitle: string
  headings: Heading[]
}

export function LearnModuleClient({ model, displayTitle, headings: initialHeadings }: LearnModuleClientProps) {
  const [headings, setHeadings] = useState<Heading[]>(initialHeadings)

  // Fallback: after first paint, if no headings were extracted, scan DOM
  useEffect(() => {
    if (initialHeadings.length === 0) {
      setTimeout(() => {
        const domHeadings = Array.from(document.querySelectorAll('h2[id], h3[id], h4[id]')) as HTMLElement[]
        if (domHeadings.length > 0) {
          const fallback = domHeadings.map((el) => ({
            id: el.id,
            text: el.textContent || '',
            level: Number(el.tagName.substring(1)),
            children: []
          }))
          setHeadings(fallback)
        }
      }, 100)
    }
  }, [initialHeadings])

  return (
    <div className="w-full flex justify-between gap-20 relative">
      {/* Main Content */}
      <main className="flex flex-col gap-16 w-full lg:w-3/4">
        {/* Markdown Content */}
        <section className="my-16 scroll-mt-24">
          <MarkdownRenderer content={model.content || 'No content available.'} />
        </section>

        {/* Images */}
        {model.images && model.images.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-semibold mb-4">Images</h2>
            <div className="grid gap-6">
              {model.images.map((image: string, idx: number) => (
                <img
                  key={idx}
                  src={image}
                  alt={`${displayTitle} image ${idx + 1}`}
                  className="rounded-lg shadow-lg w-full"
                />
              ))}
            </div>
          </section>
        )}

        {/* Code Blocks */}
        {model.code_blocks && model.code_blocks.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
            <div className="space-y-4">
              {model.code_blocks.map((code: string, idx: number) => (
                <div key={idx} className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sidebar - Table of Contents */}
      <aside className="hidden lg:flex flex-col gap-2 lg:w-1/4 sticky top-32 self-start">
        <TableOfContents headings={headings} />

        {/* Additional navigation items */}
        {(model.images?.length > 0 || model.code_blocks?.length > 0) && (
          <>
            <div className="border-t border-gray-700 mt-4 pt-4" />
            <h3 className="font-semibold mb-2 text-gray-200 text-sm uppercase tracking-wide">
              Additional Sections
            </h3>
            {model.images && model.images.length > 0 && (
              <button
                onClick={() => document.querySelector('section:nth-of-type(2)')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium transition-colors py-1.5 px-2 text-left text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                📷 Images
              </button>
            )}
            {model.code_blocks && model.code_blocks.length > 0 && (
              <button
                onClick={() => document.querySelector('section:nth-of-type(3)')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium transition-colors py-1.5 px-2 text-left text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                💻 Code Examples
              </button>
            )}
          </>
        )}
      </aside>
    </div>
  )
}
