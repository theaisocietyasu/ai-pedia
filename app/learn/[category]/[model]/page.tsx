"use client"

import { useParams } from "next/navigation"
import { getModelData } from "../../categories"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import TableOfContents from "@/components/TableOfContents"
import { extractHeadings, Heading } from "@/lib/markdown-utils"



export default function AlgorithmPage() {
  const params = useParams()
  const modelSlug = Array.isArray(params.model) ? params.model[0] : params.model

  const [model, setModel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [headings, setHeadings] = useState<Heading[]>([])

  // Load model data
  useEffect(() => {
    const loadModelData = async () => {
      if (!modelSlug) return;
      
      try {
        setLoading(true);
        const modelData = await getModelData(modelSlug);

        // Debug logging (temporary)
        console.log('📊 Content sample:', modelData.content?.substring(0, 300));
        console.log('🔍 Checking for formulas:', modelData.content?.match(/\$[^$]+\$/g)?.slice(0, 3));

        setModel(modelData);

        // Extract headings from markdown content
        if (modelData.content) {
          const extractedHeadings = extractHeadings(modelData.content);
          setHeadings(extractedHeadings);
          
          // Fallback: after first paint, if no headings were extracted, scan DOM
          // for heading elements with ids and construct headings list
          setTimeout(() => {
            if (extractedHeadings.length === 0) {
              const domHeadings = Array.from(document.querySelectorAll('h2[id], h3[id], h4[id]')) as HTMLElement[];
              if (domHeadings.length > 0) {
                const fallback = domHeadings.map((el) => ({
                  id: el.id,
                  text: el.textContent || '',
                  level: Number(el.tagName.substring(1)),
                  children: []
                }));
                setHeadings(fallback);
              }
            }
          }, 0);
        }
      } catch (err) {
        console.error(`Error loading model data for ${modelSlug}:`, err);
        setError(`Failed to load model data. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    loadModelData();
  }, [modelSlug]);

  // Use the actual title from the database, fallback to generated name from URL
  const displayTitle = model?.title || modelSlug
    ?.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-5xl flex flex-col items-center gap-16">
          <div className="relative inline-block mb-10 text-center">
            <h1 className="text-2xl md:text-5xl font-bold font-sans italic relative z-10">
              Loading Learning Content...
            </h1>
          </div>
          <div className="text-center">
            <p className="text-lg text-light-gray/80">Please wait while we fetch the latest content.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-5xl flex flex-col items-center gap-16">
          <div className="relative inline-block mb-10 text-center">
            <h1 className="text-2xl md:text-5xl font-bold font-sans italic relative z-10 capitalize">
              Error Loading Content
            </h1>
          </div>
          <div className="text-center">
            <p className="text-lg text-light-gray/80 mb-6">{error}</p>
            <Link href={`/learn/${params.category}`}>
              <button className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors">
                Back to {params.category} Learning
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!model) return <p className="text-center mt-20">Algorithm not found.</p>

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl flex flex-col items-center gap-16">
        {/* Title */}
        <div className="relative inline-block mb-10 text-center">
          <h1 className="text-2xl md:text-5xl font-bold font-sans italic relative z-10">
            {displayTitle}
          </h1>
        </div>

        {/* Wrapper for content + sidebar */}
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

            {/* Try button placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12"
            >
              <Link href={`/learn/${params.category}/${modelSlug}/try`}>
                <Button className="cursor-pointer" variant="primary">Try</Button>
              </Link>
            </motion.div>
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
      </div>
    </div>
  )
}
