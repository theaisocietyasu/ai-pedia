# Markdown Rendering System Documentation

This documentation explains how to use the markdown rendering system in the ML Visualization frontend.

## Overview

The markdown rendering system consists of:

1. **MarkdownRenderer Component** - The main component for rendering markdown content
2. **markdown.css** - Comprehensive styling for all markdown elements
3. **Utility functions** - Helper functions for processing markdown content
4. **BlogPost Component** - Example implementation for blog posts

## Quick Start

### Basic Usage

```tsx
import MarkdownRenderer from '@/components/MarkdownRenderer';

const MyComponent = () => {
  const markdownContent = `
# Hello World

This is a **bold** text with some *italic* text.

## Code Example

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

## Math Equations

The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

Display equation:
$$E = mc^2$$

## Interactive Visualization

<div id="VZ-example-chart" data-placeholder="Example Interactive Chart"></div>
  `;

  return <MarkdownRenderer content={markdownContent} />;
};
```

### With Metadata

```tsx
import BlogPost from '@/components/BlogPost';

const MyBlogPost = () => {
  const contentWithMetadata = `---
title: Understanding Linear Regression
author: John Doe
date: 2025-01-15
tags: machine learning, regression, statistics
---

# Understanding Linear Regression

Your markdown content here...
  `;

  return <BlogPost rawContent={contentWithMetadata} />;
};
```

## Supported Features

### 1. Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### 2. Text Formatting
```markdown
**Bold text**
*Italic text*
`Inline code`
```

### 3. Lists
```markdown
- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
```

### 4. Links and Images
```markdown
[Link text](https://example.com)
![Alt text](image-url.jpg)
```

### 5. Code Blocks
````markdown
```python
def example_function():
    return "Hello, World!"
```
````

### 6. Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### 7. Blockquotes
```markdown
> This is a blockquote.
> It can span multiple lines.
```

### 8. Mathematical Equations
```markdown
Inline math: $E = mc^2$

Display math:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$
```

### 9. Interactive Visualizations (VZ Components)
```markdown
<div id="VZ-component-name" data-placeholder="Visualization Description"></div>
```

## VZ Component System

The system automatically detects div elements with IDs starting with "VZ-" and styles them as interactive visualization placeholders.

### Naming Convention
- Use kebab-case for VZ component IDs
- Start with "VZ-" prefix
- Be descriptive: `VZ-linear-regression-plot`, `VZ-neural-network-diagram`

### Example VZ Components
```markdown
<div id="VZ-scatter-plot" data-placeholder="Interactive Scatter Plot"></div>
<div id="VZ-decision-boundary" data-placeholder="Decision Boundary Visualization"></div>
<div id="VZ-loss-function" data-placeholder="Loss Function 3D Plot"></div>
```

## Styling Customization

The markdown styles are defined in `/styles/markdown.css`. Key features:

### Color Scheme
- Uses CSS custom properties from the main theme
- Purple/pink gradient accents
- Dark background optimized

### Typography
- Responsive font sizes
- Proper line heights for readability
- Code syntax highlighting ready

### Interactive Elements
- Hover effects on links and images
- VZ component styling with gradients
- Table hover states

## Best Practices

### 1. Content Structure
```markdown
# Main Title (H1) - Use once per document
## Major Sections (H2)
### Subsections (H3)
#### Details (H4)
```

### 2. Code Examples
- Use appropriate language tags for syntax highlighting
- Keep code blocks reasonably short
- Add comments for complex examples

### 3. Math Equations
- Use `$...$` for inline math
- Use `$$...$$` for display equations
- Escape backslashes properly: `\\frac{a}{b}`

### 4. VZ Components
- Use descriptive placeholders
- Plan component placement for good flow
- Consider mobile responsiveness

## Integration with Your Content Management

### Static Content
```tsx
// For static markdown files
import { promises as fs } from 'fs';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export async function getStaticProps() {
  const markdown = await fs.readFile('content/post.md', 'utf8');
  return { props: { content: markdown } };
}

const Post = ({ content }) => <MarkdownRenderer content={content} />;
```

### Dynamic Content
```tsx
// For CMS or API content
import { useEffect, useState } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const DynamicPost = ({ postId }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(data => setContent(data.content));
  }, [postId]);

  return <MarkdownRenderer content={content} />;
};
```

## Customization

### Adding Custom Components
You can extend the MarkdownRenderer to handle custom markdown elements:

```tsx
// In MarkdownRenderer.tsx
components={{
  // Existing components...
  
  // Custom component example
  p: ({ node, children, ...props }: any) => {
    // Custom paragraph processing
    return <p className="custom-paragraph" {...props}>{children}</p>;
  },
  
  // Custom HTML element handling
  span: ({ node, children, className, ...props }: any) => {
    if (className?.includes('highlight')) {
      return <span className="bg-yellow-200 px-1 rounded">{children}</span>;
    }
    return <span className={className} {...props}>{children}</span>;
  },
}}
```

### Custom CSS Classes
Add custom classes in your markdown and style them in CSS:

```markdown
<div class="custom-callout">
This is a custom callout box.
</div>
```

```css
.markdown-content .custom-callout {
  background: var(--gradient-primary);
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
}
```

## Troubleshooting

### Common Issues

1. **LaTeX not rendering**: Make sure KaTeX CSS is imported
2. **VZ components not styled**: Check if the ID starts with "VZ-"
3. **Code highlighting not working**: Verify language tags are correct
4. **Mobile responsiveness**: Test on different screen sizes

### Performance Tips

1. Pre-process large markdown content
2. Use React.memo for static content
3. Consider pagination for very long documents
4. Optimize images and media

## Example Complete Implementation

See `/app/test/page.tsx` for a complete example of a blog post with:
- Mathematical equations
- Code blocks in multiple languages
- Tables with data
- Interactive VZ component placeholders
- Proper heading hierarchy
- Links and formatting

This example demonstrates all features of the markdown rendering system.