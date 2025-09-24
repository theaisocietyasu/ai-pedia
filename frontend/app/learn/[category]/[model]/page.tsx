"use client"

import { useParams } from "next/navigation"
import { modelData } from "../../categories"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { Button } from "@/components/ui/button"


// Sidebar Component
function Sidebar({ headings }: { headings: string[] }) {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      let current = ""
      headings.forEach(h => {
        const el = document.getElementById(h.replace(/\s+/g, "-"))
        if (el && window.scrollY >= el.offsetTop - 120) {
          current = h
        }
      })
      setActive(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [headings])

  return (
    <div className="hidden lg:flex flex-col gap-2 lg:w-1/4 sticky top-32 self-start">
      <h3 className="font-semibold mb-3 text-gray-200">On this page</h3>
      {headings.map(h => {
        const id = h.replace(/\s+/g, "-")
        return (
          <button
            key={id}
            onClick={() =>
              document.getElementById(id)?.scrollIntoView({
                behavior: "smooth",
                block: "start"
              })
            }
            className={`text-sm font-medium transition-colors py-1 px-2 text-left ${
              active === h
                ? "text-pink-400"
                : "text-gray-400 hover:text-gray-200 cursor-pointer"
            }`}
          >
            {h}
          </button>
        )
      })}
    </div>
  )
}

export default function AlgorithmPage() {
  const params = useParams()
  const modelSlug = Array.isArray(params.model) ? params.model[0] : params.model

  const prettyName = modelSlug
    ?.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const model =
    modelSlug && modelSlug in modelData
      ? modelData[modelSlug as keyof typeof modelData]
      : undefined

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
          <h1 className="text-2xl md:text-5xl font-bold font-sans italic relative z-10 capitalize">
            {prettyName}
          </h1>
        </div>

        {/* Wrapper for content + sidebar */}
        <div className="w-full flex justify-between gap-20 relative">
          {/* Main Content */}
          <main className="flex flex-col gap-16 w-full lg:w-3/4">
            {model.headings?.map((h: string, idx: number) => (
              <section
                key={h}
                id={h.replace(/\s+/g, "-")}
                className="my-16 scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold mb-4">{h}</h2>

                {model.paragraphs?.[idx] && (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {model.paragraphs[idx]}
                    </ReactMarkdown>
                  </div>
                  
                )}

                {model.images?.[idx] && (
                  <img
                    src={model.images[idx]}
                    alt={h}
                    className="my-6 rounded-lg shadow-lg w-full"
                  />
                )}

                {idx === model.headings.length - 1 && model.visualization && (
                  <div
                    id={model.visualization.replace("#", "")}
                    className="mt-8"
                  >
                    {/* Placeholder for React visualization */}
                  </div>
                )}
              </section>
            ))}

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

          {/* Sidebar */}
          {model.headings && <Sidebar headings={model.headings} />}
        </div>
      </div>
    </div>
  )
}
