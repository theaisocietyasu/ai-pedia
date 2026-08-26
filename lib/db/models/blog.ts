import mongoose, { type Document, Schema } from "mongoose";

// Author subdocument interface and schema
export interface IAuthor {
  name: string;
  social: string; // Changed from socials array to single social string
}

const AuthorSchema = new Schema<IAuthor>({
  name: { type: String, required: true },
  social: { type: String, required: true }, // Changed from array to single string
});

// Action button interface and schema
export interface IActionButton {
  name: string;
  link: string;
}

const ActionButtonSchema = new Schema<IActionButton>(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false },
);

// Main blog document interface
export interface IBlog extends Document {
  title: string;
  content: string; // Raw markdown content as string
  categories: string; // Changed from category to categories (single string)
  authors: IAuthor[]; // Changed from author to authors
  actionButtons: IActionButton[]; // New field for action buttons
  lastUpdated: Date; // Changed from updatedAt to lastUpdated
  createdAt: Date;
  // Legacy fields for backward compatibility
  excerpt?: string;
  slug?: string;
  tags?: string[];
  featuredImage?: string;
  publishDate?: Date;
  readTime?: string;
}

// Main blog schema
const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Raw markdown content
    categories: { type: String, required: true }, // Single category string
    authors: [AuthorSchema], // Array of authors with name and social
    actionButtons: [ActionButtonSchema], // Array of action buttons
    lastUpdated: { type: Date, default: Date.now },
    // Legacy fields for backward compatibility
    excerpt: { type: String },
    slug: { type: String, unique: true, sparse: true }, // sparse allows null values
    tags: [{ type: String }],
    featuredImage: { type: String },
    publishDate: { type: Date },
    readTime: { type: String },
  },
  {
    timestamps: true,
    collection: process.env.MONGODB_COLLECTION_NAME || "blogs",
  },
);

// Create indexes for better performance
BlogSchema.index({ categories: 1 }); // Updated to new field name
BlogSchema.index({ lastUpdated: -1 }); // Index on lastUpdated instead of publishDate
BlogSchema.index({ publishDate: -1 }); // Keep for legacy compatibility
BlogSchema.index({ tags: 1 });
BlogSchema.index({ title: "text", content: "text" }); // Full text search on title and content

// Prevent re-compilation during hot reloads
const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
