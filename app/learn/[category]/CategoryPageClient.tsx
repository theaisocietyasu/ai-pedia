"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface CategoryPageClientProps {
  category: string
  models: any[]
  categoryDescription: string
}

export function CategoryPageClient({ category, models, categoryDescription }: CategoryPageClientProps) {
  const [activeId, setActiveId] = useState<string>("")
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const manualScrollTarget = useRef<string | null>(null)
  const rafIdRef = useRef<number | null>(null)

  // compute the card whose center is closest to viewport center
  const computeClosestId = () => {
    const centerY = window.innerHeight / 2
    let closestId = ""
    let minDistance = Infinity

    cardRefs.current.forEach((card) => {
      if (!card) return
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.top + rect.height / 2
      const distance = Math.abs(centerY - cardCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestId = card.id
      }
    })

    return closestId
  }

  // raf-throttled scroll handler
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      rafIdRef.current = requestAnimationFrame(() => {
        // if a manual scroll to a target is in progress, do not update activeId here
        if (!manualScrollTarget.current) {
          const closest = computeClosestId()
          if (closest && closest !== activeId) {
            setActiveId(closest)
          }
        }
        ticking = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    // initialize activeId on mount
    rafIdRef.current = requestAnimationFrame(() => {
      const closest = computeClosestId()
      if (closest) setActiveId(closest)
    })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models]) // re-run if models change

  // Programmatic scroll to center + watch until centered
  const scrollToCenter = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    // mark manual scroll in progress and immediately set activeId
    manualScrollTarget.current = id
    setActiveId(id)

    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" })

    const start = performance.now()
    const maxDuration = 2000 // fallback: stop watching after 2s

    const watch = () => {
      const rect = el.getBoundingClientRect()
      const elCenter = rect.top + rect.height / 2
      const centerY = window.innerHeight / 2
      const distance = Math.abs(elCenter - centerY)

      // consider centered if within 8 pixels (tweakable)
      if (distance <= 8 || performance.now() - start > maxDuration) {
        manualScrollTarget.current = null
        setActiveId(id) // ensure final state
        return
      }

      rafIdRef.current = requestAnimationFrame(watch)
    }

    // start watching
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = requestAnimationFrame(watch)
  }

  // cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  return (
    <div className="w-full max-w-5xl mt-12 flex flex-col items-center gap-16">
      {/* Title */}
      <div className="relative inline-block mb-10 text-center">
        <h1 className="text-2xl md:text-5xl font-bold  italic relative z-10 capitalize">
          {category} Learning
        </h1>

        {/* Category Description */}
        {categoryDescription && (
          <div className="mt-4 text-base md:text-lg text-light-gray/80 max-w-2xl mx-auto">
            <ReactMarkdown>
              {categoryDescription}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Wrapper for cards + sidebar */}
      <div className="w-full flex justify-between gap-20 relative">
        {/* Cards */}
        <div className="flex flex-col gap-12 w-full ">
          {models.map((item, index) => {
            const id = item.slug
            return (
              <div
                key={id}
                id={id}
                ref={(el) => { cardRefs.current[index] = el }}
                className={`cursor-pointer group  flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 rounded-xl     ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <Link
                  key={id}
                  href={`/learn/${category}/${item.slug}`}
                  className={`group flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 rounded-xl glass-effect  ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Image */}
                  <img
                    src={item.imgPath}
                    alt={item.name}
                    className="w-full md:w-1/3 md:min-w-[200px] h-48 md:h-56 rounded-lg shadow-lg object-cover flex-shrink-0"
                  />

                  {/* Text */}
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <h2 className="text-xl md:text-2xl font-semibold text-light-gray mb-3 line-clamp-2">
                      {item.name}
                    </h2>
                    <p className="text-sm md:text-base text-light-gray/80 line-clamp-4">{item.description}</p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Sidebar (sticky, not fixed) */}
        <div className="hidden lg:flex flex-col gap-2 lg:w-1/4 sticky top-32 self-start">
          {models.map((item) => {
            const id = item.slug
            const isActive = activeId === id
            return (
              <button
                key={id}
                onClick={() => scrollToCenter(id)}
                className={`text-sm font-medium transition-colors py-1 px-2 text-left ${
                  isActive ? "text-pink-400" : "text-gray-400 hover:text-gray-200 cursor-pointer"
                }`}
              >
                {item.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
