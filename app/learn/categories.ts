import { fetchAllCategories, fetchModulesByCategory, transformCategoriesToUIFormat, transformModulesToUIFormat } from '@/lib/api';

// Cache for categories and modules to avoid repeated API calls
let categoriesCache: Record<string, any> | null = null;
let modulesCache: Record<string, any[]> = {};

// Function to get all categories with their basic info
export async function getCategories() {
  if (categoriesCache) {
    console.log('Returning cached categories');
    return categoriesCache;
  }

  try {
    const categories = await fetchAllCategories();
    // console.log('Fetched categories from API:', categories);
    categoriesCache = transformCategoriesToUIFormat(categories);
    return categoriesCache;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to empty object if API fails
    return {};
  }
}

// Function to get modules for a specific category
export async function getModulesForCategory(category: string) {
  if (modulesCache[category]) {
    return modulesCache[category];
  }

  try {
    const modules = await fetchModulesByCategory(category);
    const transformedModules = transformModulesToUIFormat(modules);
    modulesCache[category] = transformedModules;
    return transformedModules;
  } catch (error) {
    console.error(`Error fetching modules for category ${category}:`, error);
    // Fallback to empty array if API fails
    return [];
  }
}

// Invalidate modules cache for a given category slug
export function invalidateModulesCache(category: string) {
  if (modulesCache[category]) {
    delete modulesCache[category];
  }
}

// Legacy export for backward compatibility - this will be populated dynamically
export const categories = {};

// Function to get model data by ID
export async function getModelData(modelId: string) {
  try {
    const { fetchModuleById, transformModuleToModelFormat } = await import('@/lib/api');
    const module = await fetchModuleById(modelId);
    return transformModuleToModelFormat(module);
  } catch (error) {
    console.error(`Error fetching model data for ${modelId}:`, error);
    // Return empty structure if API fails
    return {
      headings: [],
      paragraphs: [],
      images: [],
      visualization: ''
    };
  }
}

// Legacy export for backward compatibility - this will be populated dynamically
export const modelData = {};  
