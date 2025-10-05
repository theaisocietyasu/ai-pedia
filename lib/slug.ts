// Utility to create URL-friendly slugs for categories
export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/[\s_-]+/g, '-')   // collapse whitespace/underscores to hyphen
    .replace(/^-+|-+$/g, '');    // trim leading/trailing hyphens
}

// Utility to slugify heading text similar to markdown heading anchors
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}
