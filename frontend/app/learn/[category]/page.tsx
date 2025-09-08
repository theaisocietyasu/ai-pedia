"use client"

import { useParams } from "next/navigation"
import { categories } from "../categories"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AlgorithmPage() {
  const { category } = useParams()
  console.log("category is: " + category);
  
  const algorithm = categories.find(item => item.title.toLowerCase().replace(/\s+/g, "-") === category)

  if (!algorithm) return <p className="text-center mt-20">Algorithm not found.</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12 text-center">
      {/* background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center justify-center gap-15">
        <div className="relative inline-block">
          <h1 className="text-2xl md:text-5xl font-bold font-sans italic relative z-10">
            {algorithm.title}
          </h1>

          {/* Curvy underline */}
          <svg
            className="absolute left-0 right-0 -bottom-3 w-full h-6 z-0"
            viewBox="0 0 200 20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7e22ce" /> {/* purple-700 */}
                <stop offset="50%" stopColor="#ec4899" /> {/* pink-500 */}
                <stop offset="100%" stopColor="#4f46e5" /> {/* indigo-600 */}
              </linearGradient>
            </defs>
            <path
              d="M5 15 Q 50 25, 100 15 T 195 15"
              stroke="url(#titleGradient)"
              strokeWidth="4"
              fill="transparent"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {algorithm.items.map((item, index) => (
            <Link
              key={index}
              href={`/learn/${category}/${item.slug}`}
              className="relative group w-[150px] sm:w-[200px] md:w-[220px] lg:w-[240px] h-36"
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition duration-100 blur-sm"></div>

              {/* Card */}
              <div className="relative z-20 glass-effect rounded-lg border border-white/10 h-full w-full flex items-center justify-center px-4 cursor-pointer transition-transform duration-300 group-hover:scale-105">
                <span className="text-md font-medium text-light-gray">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  )
}

