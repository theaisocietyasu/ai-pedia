"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { BlogCard } from "@/components/ui/blog-card"
import type { LegacyBlogPost, BlogCategory } from "@/lib/types"


interface BlogsClientProps {
  blogs: LegacyBlogPost[]
}

export function BlogsClient({ blogs }: BlogsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // filter blogs based on category and search
  const filteredBlogs = useMemo(() => {
    let filteredBlogs = selectedCategory === "all"
      ? blogs
      : blogs.filter(blog => blog.category.toLowerCase() === selectedCategory.toLowerCase())

    if (searchQuery.trim()) {
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filteredBlogs
  }, [blogs, selectedCategory, searchQuery])

  return (
    <>

      {/* blog grid */}
      <section className="pt-4 pb-12">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        

          {/* blog cards grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {filteredBlogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-start justify-center pt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Search size={24} className="text-light-gray/60" />
                </div>
                {/* <h3 className="text-xl font-bold text-white mb-2">No articles found</h3> */}
                <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
                <p className="text-light-gray/60 max-w-md">
                  {/* Try adjusting your search terms or browse different categories to find what you're looking for. */}
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}