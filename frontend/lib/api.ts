// API client functions for fetching learning data from MongoDB

const API_BASE_URL = '/api';

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
  categories: string[];
  thumbnail: string;
  description: string;
  content?: string;
  action_buttions?: { name: string; link: string }[];
}

// API client functions
export async function fetchAllCategories(): Promise<LearnCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function fetchModulesByCategory(category: string): Promise<LearnModule[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch modules for category ${category}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching modules for category ${category}:`, error);
    throw error;
  }
}

export async function fetchModuleById(id: string): Promise<LearnModule> {
  try {
    const response = await fetch(`${API_BASE_URL}/learn/content/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch module ${id}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching module ${id}:`, error);
    throw error;
  }
}

// Utility function to convert API data to the format expected by the UI
export function transformCategoriesToUIFormat(categories: LearnCategory[]): Record<string, any> {
  const result: Record<string, any> = {};
  
  categories.forEach(category => {
    const key = category.name.toLowerCase().replace(/\s+/g, '-');
    result[key] = {
      description: category.description,
      imgPath: category.image,
      models: [] // Will be populated when modules are fetched
    };
  });
  
  return result;
}

// Utility function to transform modules to the format expected by the UI
export function transformModulesToUIFormat(modules: LearnModule[]): any[] {
  return modules.map(module => ({
    name: module.title,
    description: module.description,
    imgPath: module.thumbnail,
    actionButtons: module.action_buttions || [],
    _id: module._id
  }));
}

// Utility function to transform a single module to the format expected by the model page
export function transformModuleToModelFormat(module: LearnModule): any {
  return {
    title: module.title || '',
    content: module.content || '',
    description: module.description || '',
    imgPath: module.thumbnail || '',
    actionButtons: module.action_buttions || []
  };
}
