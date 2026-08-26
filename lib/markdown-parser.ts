import type { ParsedMarkdown, TocItem } from "./types";

/**
 * Parses markdown content according to Ash's requirements
 * Supports:
 * - Standard markdown syntax (# ## #### headings)
 * - HTML images from Cloudinary: <img src="cloudinarylink"/>
 * - React visualization components: <div id="reactvisualizationcomponent id"></div>
 * - HTML links: <a>text</a>
 */
// biome-ignore lint/complexity/noStaticOnlyClass: converting to plain functions would break consumers outside this module's scope (e.g. components/ui/markdown-renderer.tsx)
export class MarkdownParser {
  private static readonly WORDS_PER_MINUTE = 200;

  /**
   * Parse markdown content into HTML with metadata
   */
  static parse(content: string): ParsedMarkdown {
    let html = content;
    const tableOfContents: TocItem[] = [];
    const extractedImages: string[] = [];
    const visualizationIds: string[] = [];

    // Parse headings and build table of contents
    html = MarkdownParser.parseHeadings(html, tableOfContents);

    // Parse images and extract URLs
    html = MarkdownParser.parseImages(html, extractedImages);

    // Parse visualization components
    html = MarkdownParser.parseVisualizationComponents(html, visualizationIds);

    // Parse other markdown elements
    html = MarkdownParser.parseLinks(html);
    html = MarkdownParser.parseCodeBlocks(html);
    html = MarkdownParser.parseInlineCode(html);
    html = MarkdownParser.parseEmphasis(html);
    html = MarkdownParser.parseParagraphs(html);

    // Calculate read time
    const wordCount = MarkdownParser.countWords(content);
    const estimatedReadTime = `${Math.ceil(wordCount / MarkdownParser.WORDS_PER_MINUTE)} min read`;

    // Generate excerpt
    const excerpt = MarkdownParser.generateExcerpt(content);

    return {
      html,
      tableOfContents,
      extractedImages,
      visualizationIds,
      estimatedReadTime,
      excerpt,
    };
  }

  /**
   * Parse headings and build table of contents, ignoring code blocks
   */
  private static parseHeadings(html: string, toc: TocItem[]): string {
    const lines = html.split("\n");
    let insideCodeBlock = false;
    const processedLines: string[] = [];

    for (const line of lines) {
      // Toggle code block state
      if (line.trim().startsWith("```")) {
        insideCodeBlock = !insideCodeBlock;
        processedLines.push(line);
        continue;
      }

      // Only process headings outside code blocks
      if (!insideCodeBlock) {
        const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const title = headingMatch[2].trim();
          const id = MarkdownParser.generateHeadingId(title);

          toc.push({
            id,
            title,
            level,
            children: [],
          });

          processedLines.push(
            `<h${level} id="${id}" class="markdown-heading markdown-h${level}">${title}</h${level}>`,
          );
          continue;
        }
      }

      // Keep other lines untouched
      processedLines.push(line);
    }

    return processedLines.join("\n");
  }

  /**
   * Parse images and preserve Cloudinary URLs
   */
  private static parseImages(html: string, extractedImages: string[]): string {
    const imageRegex = /<img\s+src=["']([^"']+)["']\s*\/?>/gi;

    return html.replace(imageRegex, (_match, src) => {
      extractedImages.push(src);
      return `<img src="${src}" alt="" class="markdown-image" loading="lazy" />`;
    });
  }

  /**
   * Parse React visualization components
   */
  private static parseVisualizationComponents(
    html: string,
    visualizationIds: string[],
  ): string {
    const visualizationRegex = /<div\s+id=["']([^"']+)["']\s*><\/div>/gi;

    return html.replace(visualizationRegex, (_match, id) => {
      visualizationIds.push(id);
      return `<div class="markdown-visualization" data-component-id="${id}"></div>`;
    });
  }

  /**
   * Parse HTML links
   */
  private static parseLinks(html: string): string {
    // Handle HTML links: <a href="url">text</a>
    const htmlLinkRegex = /<a(\s+href=["']([^"']+)["'])?[^>]*>([^<]+)<\/a>/gi;
    html = html.replace(htmlLinkRegex, (_match, _hrefAttr, href, text) => {
      const url = href || "#";
      const isExternal = url.startsWith("http");
      const target = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${url}" class="markdown-link"${target}>${text}</a>`;
    });

    // Handle markdown links: [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    html = html.replace(markdownLinkRegex, (_match, text, url) => {
      const isExternal = url.startsWith("http");
      const target = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${url}" class="markdown-link"${target}>${text}</a>`;
    });

    return html;
  }

  /**
   * Parse code blocks
   */
  private static parseCodeBlocks(html: string): string {
    // Fenced code blocks with optional language
    const fencedCodeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    html = html.replace(fencedCodeRegex, (_match, lang, code) => {
      const language = lang ? ` data-language="${lang}"` : "";
      return `<pre class="markdown-code-block"${language}><code>${MarkdownParser.escapeHtml(code.trim())}</code></pre>`;
    });

    // Indented code blocks (4+ spaces)
    const indentedCodeRegex = /^( {4}.+)$/gm;
    html = html.replace(indentedCodeRegex, (_match, code) => {
      return `<pre class="markdown-code-block"><code>${MarkdownParser.escapeHtml(code.substring(4))}</code></pre>`;
    });

    return html;
  }

  /**
   * Parse inline code
   */
  private static parseInlineCode(html: string): string {
    const inlineCodeRegex = /`([^`]+)`/g;
    return html.replace(inlineCodeRegex, (_match, code) => {
      return `<code class="markdown-inline-code">${MarkdownParser.escapeHtml(code)}</code>`;
    });
  }

  /**
   * Parse emphasis (bold and italic)
   */
  private static parseEmphasis(html: string): string {
    // Bold: **text** or __text__
    html = html.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="markdown-bold">$1</strong>',
    );
    html = html.replace(
      /__([^_]+)__/g,
      '<strong class="markdown-bold">$1</strong>',
    );

    // Italic: *text* or _text_
    html = html.replace(/\*([^*]+)\*/g, '<em class="markdown-italic">$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em class="markdown-italic">$1</em>');

    return html;
  }

  /**
   * Parse paragraphs
   */
  private static parseParagraphs(html: string): string {
    // Split content into blocks (separated by double newlines)
    const blocks = html.split(/\n\s*\n/);

    return blocks
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";

        // Skip blocks that are already HTML elements
        if (trimmed.startsWith("<")) return trimmed;

        // Wrap in paragraph
        return `<p class="markdown-paragraph">${trimmed}</p>`;
      })
      .filter(Boolean)
      .join("\n\n");
  }

  /**
   * Generate heading ID from title
   */
  private static generateHeadingId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  /**
   * Count words in content
   */
  private static countWords(content: string): number {
    return content
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  /**
   * Generate excerpt from content
   */
  private static generateExcerpt(
    content: string,
    maxLength: number = 160,
  ): string {
    // Remove markdown syntax and HTML tags
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // Remove heading markers
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic
      .replace(/`([^`]+)`/g, "$1") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
      .replace(/<[^>]+>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    if (plainText.length <= maxLength) return plainText;

    return `${plainText.substring(0, maxLength).replace(/\s+\w*$/, "")}...`;
  }

  /**
   * Escape HTML characters (server-safe)
   */
  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Build hierarchical table of contents
   */
  static buildHierarchicalToc(flatToc: TocItem[]): TocItem[] {
    const result: TocItem[] = [];
    const stack: TocItem[] = [];

    for (const item of flatToc) {
      const newItem: TocItem = { ...item, children: [] };

      // Find the appropriate parent
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.push(newItem);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(newItem);
      }

      stack.push(newItem);
    }

    return result;
  }
}
