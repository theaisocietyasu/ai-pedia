import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { slugifyHeading } from '@/lib/slug';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeSlug]}
        components={{
          // Enhanced heading handling with IDs for scroll navigation
          h1: ({ node, children, ...props }: any) => {
            const text = children?.toString() || '';
            const id = slugifyHeading(text);
            return <h1 id={id} {...props}>{children}</h1>;
          },
          h2: ({ node, children, ...props }: any) => {
            const text = children?.toString() || '';
            const id = slugifyHeading(text);
            return <h2 id={id} {...props}>{children}</h2>;
          },
          h3: ({ node, children, ...props }: any) => {
            const text = children?.toString() || '';
            const id = slugifyHeading(text);
            return <h3 id={id} {...props}>{children}</h3>;
          },
          // Custom component for handling VZ- divs
          div: ({ node, className, children, ...props }: any) => {
            const id = props.id;
            if (id && id.startsWith('VZ-')) {
              const placeholder = props['data-placeholder'] || 'Interactive Visualization';
              return (
                <div id={id} data-placeholder={placeholder} className={className} {...props}>
                  <div className="vz-placeholder">
                    {placeholder}
                  </div>
                </div>
              );
            }
            return <div className={className} {...props}>{children}</div>;
          },
          // Enhanced code block handling
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (!inline && language) {
              return (
                <pre className={className} data-language={language}>
                  <code {...props}>{children}</code>
                </pre>
              );
            }
            
            return <code className={className} {...props}>{children}</code>;
          },
          // Enhanced link handling
          a: ({ node, children, href, ...props }: any) => {
            // Check if it's an external link
            const isExternal = href && (href.startsWith('http') || href.startsWith('https'));
            return (
              <a 
                href={href} 
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          // Enhanced table handling
          table: ({ node, children, ...props }: any) => (
            <div style={{ overflowX: 'auto' }}>
              <table {...props}>{children}</table>
            </div>
          ),
          thead: ({ node, children, ...props }: any) => (
            <thead {...props}>{children}</thead>
          ),
          tbody: ({ node, children, ...props }: any) => (
            <tbody {...props}>{children}</tbody>
          ),
          tr: ({ node, children, ...props }: any) => (
            <tr {...props}>{children}</tr>
          ),
          th: ({ node, children, ...props }: any) => (
            <th {...props}>{children}</th>
          ),
          td: ({ node, children, ...props }: any) => (
            <td {...props}>{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;