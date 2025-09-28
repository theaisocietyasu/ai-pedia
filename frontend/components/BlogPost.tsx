import React from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { cleanMarkdownContent, extractMarkdownMetadata } from '@/lib/markdown-utils';

interface BlogPostProps {
  rawContent: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ rawContent }) => {
  const { metadata, content } = extractMarkdownMetadata(rawContent);
  const cleanedContent = cleanMarkdownContent(content);

  return (
    <article className="max-w-4xl mx-auto py-8">
      {/* Blog post header */}
      {metadata.title && (
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            {metadata.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            {metadata.author && (
              <span>By {metadata.author}</span>
            )}
            {metadata.date && (
              <span>Published on {new Date(metadata.date).toLocaleDateString()}</span>
            )}
          </div>
          {metadata.tags && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {metadata.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs bg-purple-600/20 text-purple-300 rounded-full border border-purple-600/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
      )}

      {/* Markdown content */}
      <MarkdownRenderer content={cleanedContent} />
    </article>
  );
};

export default BlogPost;