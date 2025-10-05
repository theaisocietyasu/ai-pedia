// Utility functions for markdown processing

// Hook for processing markdown content with VZ components
export const useMarkdownProcessor = () => {
  const processVZComponents = (content: string) => {
    // You can extend this to add custom processing for VZ components
    // For example, you might want to replace VZ component placeholders with actual React components
    return content;
  };

  const extractVZComponents = (content: string) => {
    const vzRegex = /<div\s+id="VZ-[^"]*"[^>]*>/g;
    const matches = content.match(vzRegex) || [];
    return matches.map(match => {
      const idMatch = match.match(/id="([^"]*)"/);
      const placeholderMatch = match.match(/data-placeholder="([^"]*)"/);
      return {
        id: idMatch ? idMatch[1] : '',
        placeholder: placeholderMatch ? placeholderMatch[1] : 'Interactive Visualization'
      };
    });
  };

  return {
    processVZComponents,
    extractVZComponents
  };
};

// Types for markdown content
export interface MarkdownContent {
  content: string;
  title?: string;
  author?: string;
  date?: string;
  tags?: string[];
}

export interface VZComponent {
  id: string;
  placeholder: string;
}

// Utility function to clean up markdown content
export const cleanMarkdownContent = (content: string): string => {
  return content
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newlines
};

// Utility function to extract metadata from markdown
export const extractMarkdownMetadata = (content: string): { metadata: MarkdownContent; content: string } => {
  const metadataRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(metadataRegex);
  
  if (!match) {
    return {
      metadata: { content: content },
      content: content
    };
  }

  const metadataStr = match[1];
  const markdownContent = match[2];
  
  // Simple YAML-like parsing
  const metadata: MarkdownContent = { content: markdownContent };
  const lines = metadataStr.split('\n');
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      
      if (key === 'tags') {
        metadata.tags = value.split(',').map(tag => tag.trim());
      } else {
        (metadata as any)[key] = value;
      }
    }
  });
  
  return { metadata, content: markdownContent };
};

// Heading extraction for table of contents
export interface Heading {
  id: string;
  text: string;
  level: number;
  children: Heading[];
}

/**
 * Generates a slug from heading text
 * Converts text to lowercase, removes special chars, replaces spaces with hyphens
 */
export function slugify(text: string): string {
  // Deprecated for headings: kept for backward compatibility in other places
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extracts headings from markdown content
 * Parses markdown and builds a hierarchical structure of headings
 */
export function extractHeadings(markdown: string): Heading[] {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const headings: Heading[] = [];
  const headingCounts: Record<string, number> = {}; // Track duplicate heading text

  // Stack to track the current hierarchy
  const stack: Heading[] = [];

  for (const line of lines) {
    // Match markdown headings (# H1, ## H2, ### H3)
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length; // Number of # symbols
    const text = match[2].trim();

    // Generate unique ID
  // Use heading-specific slugification to match renderer ids
  // We import lazily to avoid circular deps in some bundlers
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { slugifyHeading } = require('./slug');
  let baseId = slugifyHeading(text);
    headingCounts[baseId] = (headingCounts[baseId] || 0) + 1;
    const id = headingCounts[baseId] > 1 ? `${baseId}-${headingCounts[baseId] - 1}` : baseId;

    const heading: Heading = {
      id,
      text,
      level,
      children: [],
    };

    // Build hierarchy
    if (level === 1) {
      // Top level heading
      headings.push(heading);
      stack.length = 0;
      stack.push(heading);
    } else {
      // Find the appropriate parent in the stack
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        // No parent found, add to root
        headings.push(heading);
      } else {
        // Add as child to the last item in stack
        stack[stack.length - 1].children.push(heading);
      }
      stack.push(heading);
    }
  }

  return headings;
}

/**
 * Flattens hierarchical headings into a single array
 * Useful for simple list rendering
 */
export function flattenHeadings(headings: Heading[]): Heading[] {
  const result: Heading[] = [];

  function flatten(items: Heading[]) {
    for (const item of items) {
      result.push(item);
      if (item.children.length > 0) {
        flatten(item.children);
      }
    }
  }

  flatten(headings);
  return result;
}

/**
 * Normalizes markdown content from MongoDB for proper rendering
 * Handles LaTeX formula escaping issues
 */
export function normalizeMarkdownContent(content: string): string {
  if (!content) return '';

  // Log the raw content for debugging
  const sampleFormulas = content.match(/\$[^$]+\$/g)?.slice(0, 3);
  console.log('🔧 Raw formulas from DB:', sampleFormulas);

  // MongoDB stores raw markdown with single backslashes: \frac, \sum, \beta
  // But when this becomes a JavaScript string, we need proper escaping
  // The test page works because template literals auto-escape: \\beta → \beta in JS string

  // Check if content already has double backslashes (already escaped)
  const hasDoubleBackslash = content.includes('\\\\');
  console.log('🔧 Has double backslashes:', hasDoubleBackslash);

  if (hasDoubleBackslash) {
    // Content already escaped, return as-is
    console.log('🔧 Content already escaped, returning as-is');
    return content;
  }

  // Content has single backslashes - this is raw markdown
  // For template literal compatibility, we don't need to change anything
  // The markdown parser expects single backslashes in the actual string
  console.log('🔧 Content has single backslashes (raw markdown), returning as-is');
  return content;
}