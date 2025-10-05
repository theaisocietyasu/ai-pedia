"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { BlogCard } from "@/components/ui/blog-card"
import type { LegacyBlogPost, BlogCategory } from "@/lib/types"


interface BlogsClientProps {
  blogs: LegacyBlogPost[]
  blogCategories: BlogCategory[]
}

export function BlogsClient({ blogs, blogCategories }: BlogsClientProps) {
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
      {/* filters and search */}
      <section className="py-6 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col gap-6 items-center justify-center">
            {/* search bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-gray/60" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10
                           text-white placeholder-light-gray/60 focus:outline-none focus:border-purple/50
                           transition-colors duration-300"
              />
            </motion.div>

            {/* category filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-purple text-white"
                    : "bg-white/5 text-light-gray/80 hover:bg-white/10"
                }`}
              >
                All Articles
              </button>
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.name
                      ? "bg-purple text-white"
                      : "bg-white/5 text-light-gray/80 hover:bg-white/10"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* blog grid */}
      <section className="pt-4 pb-12">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          {/* results header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: '-2rem', marginBottom: '1.5rem' }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` :
               selectedCategory === "all" ? "All Articles" : selectedCategory}
            </h2>
            <p className="text-light-gray/60">
              {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

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
                <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                <p className="text-light-gray/60 max-w-md">
                  Try adjusting your search terms or browse different categories to find what you're looking for.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}