"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { BlogsClient } from "@/components/blogs/blogs-client";
import { GradientText } from "@/components/ui/gradient-text";
import { getAllBlogs } from "@/lib/blog-data";
import type { LegacyBlogPost } from "@/lib/types";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<LegacyBlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const blogData = await getAllBlogs();
        setBlogs(blogData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError(
          "Unable to connect to the blog database. Please check your MongoDB connection or try again later.",
        );
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

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
              ease: "easeInOut",
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
              delay: 1,
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-pink/30 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            {/* badge */}

            {/* title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8"
            >
              <GradientText animate={false}>Blogs</GradientText>
            </motion.h1>

            {/* subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-light-gray/80 max-w-3xl mx-auto leading-relaxed"
            >
              Explore the latest insights, tutorials, and research in artificial
              intelligence. From fundamentals to cutting-edge developments,
              discover knowledge that advances your AI journey.
            </motion.p>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 mb-6 rounded-full bg-purple/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Loading Articles...
              </h3>
              <p className="text-light-gray/60 max-w-md">
                Please wait while we fetch the latest blog posts.
              </p>
            </motion.div>
          </div>
        </section>
      ) : error ? (
        <section className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <BookOpen size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Unable to Load Articles
              </h3>
              <p className="text-light-gray/60 max-w-md">{error}</p>
            </motion.div>
          </div>
        </section>
      ) : (
        <BlogsClient blogs={blogs} />
      )}
    </main>
  );
}
