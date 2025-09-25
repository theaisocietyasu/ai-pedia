import mongoose, { Schema, Document } from 'mongoose'

// Author subdocument interface and schema
export interface IAuthor {
  name: string
  socials: string[]
}

const AuthorSchema = new Schema<IAuthor>({
  name: { type: String, required: true },
  socials: [{ type: String }]
})

// Content block interface for dynamic content structure
export interface IContentBlock {
  heading?: string
  content?: string | IContentBlock | IContentBlock[]
  images?: string[]
  code_blocks?: string[]
  visualization?: string[] // React component names as strings
}

const ContentBlockSchema = new Schema<IContentBlock>({
  heading: { type: String },
  content: { type: Schema.Types.Mixed }, // Allows string or nested objects
  images: [{ type: String }],
  code_blocks: [{ type: String }],
  visualization: [{ type: String }] // Store React component names
}, { _id: false })

// Main blog document interface
export interface IBlog extends Document {
  _id: string
  title: string
  excerpt: string
  slug: string
  category: string
  tags: string[]
  featuredImage: string
  publishDate: Date
  readTime: string
  author: IAuthor[]
  content: IContentBlock[]
  createdAt: Date
  updatedAt: Date
}

// Main blog schema
const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  featuredImage: { type: String, required: true },
  publishDate: { type: Date, required: true },
  readTime: { type: String, required: true },
  author: [AuthorSchema],
  content: [ContentBlockSchema]
}, {
  timestamps: true,
  collection: process.env.MONGODB_COLLECTION_NAME || 'blogs'
})

// Create indexes for better performance
BlogSchema.index({ slug: 1 })
BlogSchema.index({ category: 1 })
BlogSchema.index({ publishDate: -1 })
BlogSchema.index({ tags: 1 })

// Prevent re-compilation during hot reloads
const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)

export default Blog