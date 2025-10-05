import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="markdown-heading markdown-h1" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="markdown-heading markdown-h2" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="markdown-heading markdown-h3" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="markdown-heading markdown-h4" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="markdown-heading markdown-h5" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="markdown-heading markdown-h6" {...props}>
              {children}
            </h6>
          ),
          p: ({ children, ...props }) => (
            <p className="markdown-paragraph" {...props}>
              {children}
            </p>
          ),
          a: ({ children, href, ...props }: any) => {
            const isExternal = href?.startsWith('http') || href?.startsWith('https');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="markdown-link"
                {...props}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt, ...props }: any) => (
            <img src={src || ''} alt={alt || ''} className="markdown-image" {...props} />
          ),
          code: ({ inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            if (!inline && language) {
              return (
                <pre className={`markdown-code-block language-${language}`} data-language={language}>
                  <code {...props}>{children}</code>
                </pre>
              );
            }
            return (
              <code className="markdown-inline-code" {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({ children, ...props }) => (
            <blockquote {...props}>{children}</blockquote>
          ),
          strong: ({ children, ...props }) => (
            <strong className="markdown-bold" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="markdown-italic" {...props}>
              {children}
            </em>
          ),
          table: ({ children, ...props }) => (
            <div style={{ overflowX: 'auto' }}>
              <table {...props}>{children}</table>
            </div>
          ),
          div: ({ node, className, children, ...props }: any) => {
            const id = props.id;
            if (id && id.startsWith('VZ-')) {
              const placeholder = props['data-placeholder'] || 'Interactive Visualization';
              return (
                <div id={id} data-placeholder={placeholder} className={`markdown-visualization ${className || ''}`} {...props}>
                  <div className="vz-placeholder">{placeholder}</div>
                </div>
              );
            }
            return <div className={className} {...props}>{children}</div>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
