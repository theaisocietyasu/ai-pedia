import type { Collection, ObjectId } from "mongodb";
import { mongoConnection } from "@/lib/db/client";

export interface Author {
  name: string;
  social: string;
}

export interface ActionButton {
  name: string;
  link: string;
}

export interface BlogDocument {
  _id: ObjectId;
  title: string;
  content: string; // Raw markdown
  categories: string; // Single category string (field name is plural for legacy reasons)
  authors: Author[];
  actionButtons: ActionButton[];
  lastUpdated: Date;
  createdAt?: Date;
  // Legacy fields for backward compatibility
  excerpt?: string;
  slug?: string;
  tags?: string[];
  featuredImage?: string;
  publishDate?: Date;
  readTime?: string;
}

const BLOGS_COLLECTION = process.env.MONGODB_COLLECTION_NAME || "blogs";

export async function blogsCollection(): Promise<Collection<BlogDocument>> {
  const db = await mongoConnection.db();
  return db.collection<BlogDocument>(BLOGS_COLLECTION);
}
