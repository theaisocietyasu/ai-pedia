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