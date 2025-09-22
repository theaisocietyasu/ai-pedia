"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Filter, BookOpen } from "lucide-react"
import { GradientText } from "@/components/ui/gradient-text"
import { BlogCard } from "@/components/ui/blog-card"
import { blogPosts, blogCategories, getBlogsByCategory } from "@/lib/blog-data"
import type { BlogPost } from "@/lib/types"

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // filter blogs based on category and search
  const filteredBlogs = useMemo(() => {
    let blogs = selectedCategory === "all" ? blogPosts : getBlogsByCategory(selectedCategory)
    
    if (searchQuery.trim()) {
      blogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    return blogs
  }, [selectedCategory, searchQuery])

  return (
    <main className="min-h-screen bg-background">
      {/* hero section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-20 w-96 h-96 bg-purple/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1], 
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-pink/30 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            {/* badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full 
                       bg-white/5 border border-white/10"
              style={{ padding: '8px 16px', marginBottom: '2rem' }}
            >
              <BookOpen size={16} className="text-purple" />
              <span className="text-sm text-light-gray">Latest AI Insights</span>
            </motion.div>

            {/* title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold"
              style={{ marginBottom: '2rem' }}
            >
              <GradientText animate={false}>Blog</GradientText>
            </motion.h1>

            {/* subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-light-gray/80 max-w-3xl leading-relaxed"
              style={{ 
                margin: '0 auto',
                textAlign: 'center',
                display: 'block',
                width: '100%',
                maxWidth: '48rem'
              }}
            >
              Explore the latest insights, tutorials, and research in artificial intelligence. 
              From fundamentals to cutting-edge developments, discover knowledge that advances your AI journey.
            </motion.p>
          </div>
        </div>
      </section>

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Search size={24} className="text-light-gray/60" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-light-gray/60 max-w-md mx-auto">
                Try adjusting your search terms or browse different categories to find what you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}