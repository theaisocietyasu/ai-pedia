// Upload helper functions for learning modules

export interface UploadFormData {
  title: string;
  description: string;
  categories: string[];
  content: string;
  thumbnail: File;
  action_buttons?: Array<{ name: string; link: string }>;
}

export function validateUploadForm(data: Partial<UploadFormData>): string | null {
  if (!data.title?.trim()) {
    return 'Title is required';
  }
  
  if (!data.description?.trim()) {
    return 'Description is required';
  }
  
  if (!data.categories || data.categories.length === 0) {
    return 'At least one category is required';
  }
  
  if (!data.content?.trim()) {
    return 'Content is required';
  }
  
  if (!data.thumbnail) {
    return 'Thumbnail image is required';
  }
  
  // Validate thumbnail file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(data.thumbnail.type)) {
    return 'Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.';
  }
  
  // Validate file size (5MB limit)
  if (data.thumbnail.size > 5 * 1024 * 1024) {
    return 'File too large. Please upload an image smaller than 5MB.';
  }
  
  return null;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export function createUploadFormData(data: UploadFormData): FormData {
  const formData = new FormData();
  
  formData.append('title', data.title.trim());
  formData.append('description', data.description.trim());
  formData.append('content', data.content);
  formData.append('categories', JSON.stringify(data.categories));
  formData.append('thumbnail', data.thumbnail);
  
  if (data.action_buttons && data.action_buttons.length > 0) {
    formData.append('action_buttons', JSON.stringify(data.action_buttons));
  }
  
  return formData;
}

export function getContentStats(content: string) {
  return {
    characters: content.length,
    words: content.split(/\s+/).filter(word => word.length > 0).length,
    lines: content.split('\n').length,
    paragraphs: content.split(/\n\s*\n/).length
  };
}