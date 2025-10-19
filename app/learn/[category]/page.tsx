"use client"

import { useParams } from "next/navigation"
import { getModulesForCategory, getCategories } from "../categories"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"

export default function AlgorithmPage() {
  const params = useParams()
  const category = Array.isArray(params.category) ? params.category[0] : params.category

  const [models, setModels] = useState<any[]>([0,0,0])
  const [categoryDescription, setCategoryDescription] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string>("")
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const manualScrollTarget = useRef<string | null>(null)
  const rafIdRef = useRef<number | null>(null)

  // Load models and category description
  useEffect(() => {
    const loadData = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        
        // Load both models and categories data in parallel
        const [modelsData, categoriesData] = await Promise.all([
          getModulesForCategory(category),
          getCategories()
        ]);
        
        setModels(modelsData);
        
        // Get the description for this specific category
        const categoryData = categoriesData[category];
        if (categoryData && categoryData.description) {
          setCategoryDescription(categoryData.description);
        }
        
      } catch (err) {
        console.error(`Error loading data for category ${category}:`, err);
        setError(`Failed to load content for ${category}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category]);

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

  // Skeleton components for loading state
  const SkeletonCard = ({ index, reverse }: { index: number; reverse: boolean }) => (
    <div
      className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 rounded-xl glass-effect min-h-[280px] w-full ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Image skeleton */}
      <div className="w-full md:w-1/3 md:min-w-[200px] h-48 md:h-56 bg-dark-gray/50 rounded-lg animate-pulse flex-shrink-0"></div>
      
      {/* Text skeleton */}
      <div className="flex-1 text-center md:text-left min-w-0">
        <div className="h-6 bg-dark-gray/50 rounded mb-3 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-dark-gray/30 rounded animate-pulse"></div>
          <div className="h-4 bg-dark-gray/30 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-dark-gray/30 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const SidebarSkeleton = () => (
    <div className="hidden lg:flex flex-col gap-2 lg:w-1/4 sticky top-32 self-start">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-4 bg-dark-gray/30 rounded animate-pulse"></div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="relative mt-12 min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-5xl flex flex-col items-center gap-16">
          <div className="relative inline-block mb-10 text-center">
            <h1 className="text-2xl md:text-5xl font-bold  italic relative z-10 capitalize">
              Error Loading Content
            </h1>
          </div>
          <div className="text-center">
            <p className="text-lg text-light-gray/80 mb-6">{error}</p>
            <Link href="/learn">
              <button className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors">
                Back to Learning Hub
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!models.length) return <p className="text-center mt-20">Models not found.</p>

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 lg:px-12">

      <div className="w-full max-w-5xl mt-12 flex flex-col items-center gap-16">
        {/* Title */}
        <div className="relative inline-block mb-10 text-center">
          <h1 className="text-2xl md:text-5xl font-bold  italic relative z-10 capitalize">
            {category} Learning
          </h1>
          
          {/* Category Description */}
          {loading ? (
            <div className="mt-4 max-w-2xl mx-auto">
              <div className="h-4 bg-dark-gray/30 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-dark-gray/30 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
          ) : categoryDescription && (
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
          <motion.div             initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-12 w-full ">

            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} index={index} reverse={index % 2 !== 0}  />
              ))
            ) : (
              // Show actual models when loaded
              models.map((item, index) => {
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
                      <Link key={id} href={`/learn/${category}/${item.slug}`} className={`group flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 rounded-xl glass-effect  ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
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
              })
            )}
          </motion.div>

          {/* Sidebar (sticky, not fixed) */}
          {loading ? (
            <SidebarSkeleton />
          ) : (
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
          )}
        </div>

      </div>
    </div>
  )
}
