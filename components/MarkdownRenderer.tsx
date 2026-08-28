import type React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { LazyVisualization } from "./visualizations/LazyVisualization";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  // Process escaped HTML div tags for visualizations
  const processedContent = content
    // Handle escaped div tags: \<div ...\> to <div ...>
    .replace(
      /\\<div\s+id="(VZ-[^"]*)"([^>]*)\\><\/div\\>/g,
      '<div id="$1"$2></div>',
    )
    // Handle already unescaped div tags (just in case)
    .replace(/<div\s+id="(VZ-[^"]*)"([^>]*?)><\/div>/g, '<div id="$1"$2></div>')
    // Handle self-closing escaped div tags: \<div .../\>
    .replace(/\\<div\s+id="(VZ-[^"]*)"([^>]*)\/\\>/g, '<div id="$1"$2></div>');

  // Debug logging (only in development)
  if (process.env.NODE_ENV === "development" && content !== processedContent) {
    console.log("MarkdownRenderer: Processed escaped HTML divs");
    console.log("Original:", `${content.substring(0, 200)}...`);
    console.log("Processed:", `${processedContent.substring(0, 200)}...`);
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
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
          a: ({
            children,
            href,
            ...props
          }: React.ComponentPropsWithoutRef<"a">) => {
            const isExternal =
              href?.startsWith("http") || href?.startsWith("https");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="markdown-link"
                {...props}
              >
                {children}
              </a>
            );
          },
          img: ({
            src,
            alt,
            ...props
          }: React.ComponentPropsWithoutRef<"img">) => (
            <img
              src={src || ""}
              alt={alt || ""}
              className="markdown-image"
              {...props}
            />
          ),
          code: ({
            inline,
            className,
            children,
            ...props
          }: React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language) {
              // Convert children to string properly
              const code = String(children).replace(/\n$/, "");

              return (
                <div className="markdown-code-block" data-language={language}>
                  <SyntaxHighlighter
                    language={language}
                    style={oneLight}
                    showLineNumbers={true}
                    customStyle={{
                      margin: 0,
                      padding: "1rem 1.25rem",
                      borderRadius: "6px",
                      background: "var(--surface)",
                      border: "1px solid var(--line)",
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily:
                          "var(--font-geist-mono), ui-monospace, monospace",
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
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
            <div style={{ overflowX: "auto" }}>
              <table {...props}>{children}</table>
            </div>
          ),
          div: ({
            node: _node,
            className,
            children,
            ...props
          }: React.ComponentPropsWithoutRef<"div"> & {
            node?: unknown;
            "data-placeholder"?: string;
          }) => {
            const id = props.id;
            if (id?.startsWith("VZ-")) {
              const placeholder =
                props["data-placeholder"] || "Interactive Visualization";
              return (
                <div className={`markdown-visualization ${className || ""}`}>
                  <LazyVisualization
                    componentId={id}
                    fallbackTitle={placeholder}
                  />
                </div>
              );
            }
            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
