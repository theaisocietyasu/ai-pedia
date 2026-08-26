"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { BlogPost, LegacyBlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: LegacyBlogPost | BlogPost;
  index?: number;
}

export function BlogCard({ blog, index = 0 }: BlogCardProps) {
  const gradients = [
    "var(--gradient-primary)",
    "var(--gradient-secondary)",
    "var(--gradient-accent)",
  ];

  const cardGradient = gradients[index % gradients.length];

  // Handle author field for both legacy and new formats
  const authorName =
    "author" in blog && typeof blog.author === "string"
      ? blog.author
      : "author" in blog && Array.isArray(blog.author) && blog.author.length > 0
        ? blog.author[0].name
        : "Unknown Author";

  // Handle category field for both legacy and new formats
  const categoryName =
    "category" in blog
      ? blog.category
      : "categories" in blog
        ? blog.categories
        : "Uncategorized";

  // Handle publishDate for both formats
  const publishDate =
    "publishDate" in blog && blog.publishDate
      ? blog.publishDate
      : "createdAt" in blog && blog.createdAt
        ? blog.createdAt
        : new Date().toISOString();

  // Handle readTime for both formats
  const readTime =
    "readTime" in blog && blog.readTime ? blog.readTime : "5 min read";

  // Handle tags for both formats
  const tags = "tags" in blog && blog.tags ? blog.tags : [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group h-full"
      style={{
        border: "none",
        outline: "none",
      }}
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative h-full"
        style={{
          border: "none",
          outline: "none",
        }}
      >
        {/* gradient border wrapper */}
        <div
          className="relative h-full p-[1px] rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, 
                 rgba(139, 92, 246, 0.4) 0%, 
                 rgba(168, 85, 247, 0.3) 25%, 
                 rgba(236, 72, 153, 0.3) 50%, 
                 rgba(59, 130, 246, 0.4) 75%, 
                 rgba(16, 185, 129, 0.3) 100%)`,
            filter: "blur(0px)",
          }}
        >
          {/* card content */}
          <div
            className="relative h-full overflow-hidden rounded-2xl
                          transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, 
                   rgba(15, 15, 25, 0.95) 0%, 
                   rgba(20, 20, 35, 0.95) 50%, 
                   rgba(15, 15, 25, 0.95) 100%)`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "0",
              borderWidth: "0",
              borderStyle: "none",
              outline: "none",
              outlineWidth: "0",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              padding: "0",
              margin: "0",
            }}
          >
            {/* featured image */}
            <div
              className="relative w-full h-48 overflow-hidden"
              style={{
                backgroundColor: "#0a0a0f",
                border: "0",
                borderWidth: "0",
                borderStyle: "none",
                outline: "none",
                outlineWidth: "0",
                boxShadow: "none",
                borderTopLeftRadius: "1rem",
                borderTopRightRadius: "1rem",
                margin: "0",
                padding: "0",
                position: "relative",
                top: "0",
                left: "0",
                right: "0",
              }}
            >
              <Image
                src={blog.featuredImage || ""}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
                style={{
                  border: "0",
                  borderWidth: "0",
                  borderStyle: "none",
                  outline: "none",
                  outlineWidth: "0",
                  margin: "0",
                  padding: "0",
                  objectFit: "cover",
                  transform: "scale(1.02)",
                  transformOrigin: "center",
                }}
                unoptimized
              />

              {/* gradient overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-75"
                style={{
                  background: `linear-gradient(135deg, 
                  rgba(139, 92, 246, 0.3) 0%, 
                  rgba(168, 85, 247, 0.2) 25%, 
                  rgba(236, 72, 153, 0.2) 50%, 
                  rgba(59, 130, 246, 0.3) 75%, 
                  rgba(16, 185, 129, 0.2) 100%)`,
                  mixBlendMode: "overlay",
                }}
              />

              {/* category badge */}
              <div className="absolute top-4 left-4 z-20">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                           bg-black/60 backdrop-blur-md text-white"
                >
                  {categoryName}
                </motion.span>
              </div>
            </div>

            {/* content */}
            <div className="p-6 space-y-4">
              {/* meta information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-light-gray/60">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{authorName}</span>
                </div>
              </div>

              {/* title */}
              <h3
                className="text-xl font-bold text-white leading-tight
                           group-hover:gradient-text transition-all duration-300
                           line-clamp-2"
              >
                {blog.title}
              </h3>

              {/* excerpt */}
              <p className="text-light-gray/80 line-clamp-3 leading-relaxed">
                {blog.excerpt}
              </p>

              {/* tags */}
              <div className="flex flex-wrap gap-2">
                {tags?.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs
                             text-white/80 transition-all duration-300 hover:text-white"
                    style={{
                      background: `linear-gradient(135deg, 
                      rgba(139, 92, 246, 0.2) 0%, 
                      rgba(168, 85, 247, 0.15) 50%, 
                      rgba(236, 72, 153, 0.2) 100%)`,
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {tags && tags.length > 3 && (
                  <span className="text-xs text-light-gray/50">
                    +{tags.length - 3} more
                  </span>
                )}
              </div>

              {/* read more button */}
              <div className="pt-2">
                <Link href={`/blogs/${blog.slug}`}>
                  <motion.div
                    whileHover={{ x: 5, scale: 1.05 }}
                    className="inline-flex items-center gap-2 text-sm font-medium
                             px-4 py-2 rounded-lg transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, 
                      rgba(139, 92, 246, 0.3) 0%, 
                      rgba(168, 85, 247, 0.25) 50%, 
                      rgba(236, 72, 153, 0.3) 100%)`,
                      color: "rgba(255, 255, 255, 0.9)",
                      border: "1px solid rgba(139, 92, 246, 0.4)",
                      boxShadow: "0 2px 8px rgba(139, 92, 246, 0.15)",
                    }}
                  >
                    <span>Read Article</span>
                    <ArrowRight size={16} />
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
