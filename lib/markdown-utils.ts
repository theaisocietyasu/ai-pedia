// Heading extraction for the table of contents

export interface Heading {
  id: string;
  text: string;
  level: number;
  children: Heading[];
}

/** Slugify heading text the same way rehype-slug does for anchor ids. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Parses `#`, `##`, `###` headings out of markdown and builds a tree.
 * Duplicate heading text gets a numeric suffix to match rehype-slug.
 */
export function extractHeadings(markdown: string): Heading[] {
  if (!markdown) return [];

  const headings: Heading[] = [];
  const headingCounts: Record<string, number> = {};
  const stack: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{1,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();
    const baseId = slugifyHeading(text);
    headingCounts[baseId] = (headingCounts[baseId] || 0) + 1;
    const id =
      headingCounts[baseId] > 1
        ? `${baseId}-${headingCounts[baseId] - 1}`
        : baseId;

    const heading: Heading = { id, text, level, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    if (stack.length === 0) {
      headings.push(heading);
    } else {
      stack[stack.length - 1].children.push(heading);
    }
    stack.push(heading);
  }

  return headings;
}
