"use client"

import { useParams } from "next/navigation"
import { getModelData } from "../../categories"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { Button } from "@/components/ui/button"



export default function AlgorithmPage() {
  const params = useParams()
  const modelSlug = Array.isArray(params.model) ? params.model[0] : params.model

  const [model, setModel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load model data
  useEffect(() => {
    const loadModelData = async () => {
      if (!modelSlug) return;
      
      try {
        setLoading(true);
        const modelData = await getModelData(modelSlug);
        setModel(modelData);
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
            <h1 className="text-2xl md:text-5xl font-bold font-sans italic relative z-10 capitalize">
              Loading {displayTitle}...
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
              <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-pink-400 prose-pre:bg-gray-900 prose-blockquote:border-blue-400">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl font-semibold text-white mb-3 mt-8">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl font-semibold text-white mb-2 mt-6">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300">{children}</li>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      if (isInline) {
                        return <code className="bg-gray-800 text-pink-400 px-1 py-0.5 rounded text-sm">{children}</code>;
                      }
                      return (
                        <code className="block bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-400 my-4">
                        {children}
                      </blockquote>
                    ),
                    a: ({ children, href }) => (
                      <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    img: ({ src, alt }) => (
                      <img src={src} alt={alt} className="rounded-lg shadow-lg w-full my-4" />
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border-collapse border border-gray-600">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-gray-600 bg-gray-800 text-white px-4 py-2 text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 text-gray-300 px-4 py-2">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {model.content || 'No content available.'}
                </ReactMarkdown>
              </div>
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

          {/* Sidebar - Simplified for markdown content */}
          <div className="hidden lg:flex flex-col gap-2 lg:w-1/4 sticky top-32 self-start">
            <h3 className="font-semibold mb-3 text-gray-200">Quick Navigation</h3>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-medium transition-colors py-1 px-2 text-left text-gray-400 hover:text-gray-200 cursor-pointer"
            >
              Back to Top
            </button>
            {model.images && model.images.length > 0 && (
              <button
                onClick={() => document.querySelector('section:nth-of-type(2)')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium transition-colors py-1 px-2 text-left text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                Images
              </button>
            )}
            {model.code_blocks && model.code_blocks.length > 0 && (
              <button
                onClick={() => document.querySelector('section:nth-of-type(3)')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium transition-colors py-1 px-2 text-left text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                Code Examples
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
