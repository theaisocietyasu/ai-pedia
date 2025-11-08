import { fetchAllCategories, fetchModulesByCategory, transformCategoriesToUIFormat, transformModulesToUIFormat } from '@/lib/api';

// Cache for categories and modules to avoid repeated API calls
let categoriesCache: Record<string, any> | null = null;
let modulesCache: Record<string, any[]> = {};
// Cache for individual module data by slug
let modelDataCache: Record<string, any> = {};
// Cache timestamps to support automatic invalidation (1 hour TTL)
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
let cacheTimestamps: Record<string, number> = {};

// Helper function to check if cache is still valid
function isCacheValid(key: string): boolean {
  const timestamp = cacheTimestamps[key];
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_TTL;
}

// Function to get all categories with their basic info
export async function getCategories() {
  if (categoriesCache && isCacheValid('categories')) {
    console.log('Returning cached categories');
    return categoriesCache;
  }

  try {
    const categories = await fetchAllCategories();
    // console.log('Fetched categories from API:', categories);
    categoriesCache = transformCategoriesToUIFormat(categories);
    cacheTimestamps['categories'] = Date.now();
    return categoriesCache;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to empty object if API fails
    return {};
  }
}

// Function to get modules for a specific category
export async function getModulesForCategory(category: string) {
  const cacheKey = `modules_${category}`;
  if (modulesCache[category] && isCacheValid(cacheKey)) {
    console.log(`Returning cached modules for category: ${category}`);
    return modulesCache[category];
  }

  try {
    const modules = await fetchModulesByCategory(category);
    const transformedModules = transformModulesToUIFormat(modules);
    modulesCache[category] = transformedModules;
    cacheTimestamps[cacheKey] = Date.now();
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
    delete cacheTimestamps[`modules_${category}`];
  }
}

// Invalidate model data cache for a given slug
export function invalidateModelDataCache(slug: string) {
  if (modelDataCache[slug]) {
    delete modelDataCache[slug];
    delete cacheTimestamps[`model_${slug}`];
  }
}

// Invalidate all caches (useful after updates)
export function invalidateAllCaches() {
  categoriesCache = null;
  modulesCache = {};
  modelDataCache = {};
  cacheTimestamps = {};
  console.log('All caches invalidated');
}

// Legacy export for backward compatibility - this will be populated dynamically
export const categories = {};

// Function to get model data by slug with caching
export async function getModelData(slug: string) {
  const cacheKey = `model_${slug}`;
  
  // Check if we have a valid cached version
  if (modelDataCache[slug] && isCacheValid(cacheKey)) {
    console.log(`Returning cached model data for slug: ${slug}`);
    return modelDataCache[slug];
  }

  try {
    const { fetchModuleBySlug, transformModuleToModelFormat } = await import('@/lib/api');
    const module = await fetchModuleBySlug(slug);
    const transformedData = transformModuleToModelFormat(module);
    
    // Store in cache with timestamp
    modelDataCache[slug] = transformedData;
    cacheTimestamps[cacheKey] = Date.now();
    
    console.log(`Cached model data for slug: ${slug}`);
    return transformedData;
  } catch (error) {
    console.error(`Error fetching model data for ${slug}:`, error);
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
