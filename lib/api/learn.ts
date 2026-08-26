// API client functions for fetching learning data from MongoDB
import { normalizeMarkdownContent } from "@/lib/markdown-utils";

// Helper function to get base URL for API calls
function getApiBaseUrl(): string {
  // In server-side context
  if (typeof window === "undefined") {
    // Use localhost for development, or environment variable for production
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }
  // In client-side context, we can use relative URLs
  return "";
}

const API_BASE_URL = `${getApiBaseUrl()}/api`;

// Types for API responses
export interface LearnCategory {
  _id: string;
  name: string;
  image: string;
  description: string;
}

export interface LearnModule {
  _id: string;
  title: string;
  slug: string;
  categories: string[];
  thumbnail: string;
  description: string;
  content?: string;
  action_buttions?: { name: string; link: string }[];
  createdAt?: string;
  updatedAt?: string;
  contributors?: Array<{
    id: string;
    name: string;
    email?: string;
    addedAt?: string;
  }>;
}

// API client functions
export async function fetchAllCategories(): Promise<LearnCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function fetchModulesByCategory(
  category: string,
): Promise<LearnModule[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/category/${category}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch modules for category ${category}: ${response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching modules for category ${category}:`, error);
    throw error;
  }
}

export async function fetchModuleBySlug(slug: string): Promise<LearnModule> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/content/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch module ${slug}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching module ${slug}:`, error);
    throw error;
  }
}

// UI-facing shapes produced by the transform helpers below
export interface UIActionButton {
  name: string;
  link: string;
  /** Legacy aliases still referenced by some UI consumers */
  label?: string;
  url?: string;
}

export interface LearnModuleUIFormat {
  name: string;
  description: string;
  imgPath: string;
  actionButtons: UIActionButton[];
  _id: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LearnCategoryUIFormat {
  description: string;
  imgPath: string;
  models: LearnModuleUIFormat[];
}

export interface LearnModelFormat {
  title: string;
  content: string;
  description: string;
  imgPath: string;
  actionButtons: UIActionButton[];
  contributors: NonNullable<LearnModule["contributors"]>;
}

// Utility function to convert API data to the format expected by the UI
export function transformCategoriesToUIFormat(
  categories: LearnCategory[],
): Record<string, LearnCategoryUIFormat> {
  const result: Record<string, LearnCategoryUIFormat> = {};

  categories.forEach((category) => {
    const key = category.name.toLowerCase().replace(/\s+/g, "-");
    result[key] = {
      description: category.description,
      imgPath: category.image,
      models: [], // Will be populated when modules are fetched
    };
  });

  return result;
}

// Utility function to transform modules to the format expected by the UI
export function transformModulesToUIFormat(
  modules: LearnModule[],
): LearnModuleUIFormat[] {
  return modules.map((module) => ({
    name: module.title,
    description: module.description,
    imgPath: module.thumbnail,
    actionButtons: module.action_buttions || [],
    _id: module._id,
    slug: module.slug,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
  }));
}

// Utility function to transform a single module to the format expected by the model page
export function transformModuleToModelFormat(
  module: LearnModule,
): LearnModelFormat {
  return {
    title: module.title || "",
    content: normalizeMarkdownContent(module.content || ""),
    description: module.description || "",
    imgPath: module.thumbnail || "",
    actionButtons: module.action_buttions || [],
    contributors: module.contributors || [],
  };
}

// Image upload response type
export interface ImageUploadResponse {
  success: boolean;
  imageId: string;
  url: string;
  author: {
    id: string;
    name: string;
  };
}

// Upload image to GridFS
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Failed to upload image: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

// API responses for learn module mutations
export type UploadLearnModuleResponse = {
  success: boolean;
  id: string;
  slug: string;
  message: string;
  module?: LearnModule;
};

export type UpdateLearnModuleResponse = {
  success: boolean;
  message: string;
  slugChanged?: boolean;
  oldSlug?: string;
  newSlug?: string;
  module?: LearnModule;
};

export type DeleteLearnModuleResponse = {
  success: boolean;
  message?: string;
};

// Upload learn module with markdown content
export async function uploadLearnModule(
  formData: FormData,
): Promise<UploadLearnModuleResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/content/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Failed to upload learn module: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading learn module:", error);
    throw error;
  }
}

// Update existing learn module
export async function updateLearnModule(
  slug: string,
  formData: FormData,
): Promise<UpdateLearnModuleResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/content/${slug}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Failed to update learn module: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating learn module:", error);
    throw error;
  }
}

// Delete existing learn module
export async function deleteLearnModule(
  slug: string,
): Promise<DeleteLearnModuleResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/content/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Failed to delete learn module: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting learn module:", error);
    throw error;
  }
}
