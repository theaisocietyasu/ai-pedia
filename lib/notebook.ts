import { fromHtml } from "hast-util-from-html";
import { defaultSchema, sanitize } from "hast-util-sanitize";
import { toHtml } from "hast-util-to-html";
import { extractHeadings, type Heading } from "@/lib/markdown-utils";

/**
 * Jupyter notebook (.ipynb) parsing.
 *
 * Notebooks are read at build time and flattened into a shape the renderer can
 * walk directly: markdown cells stay markdown, code cells carry their source
 * plus a normalized list of outputs. Rich HTML outputs (pandas tables and the
 * like) are sanitized here, on the server, so the renderer never handles
 * untrusted markup.
 */

export interface NotebookImageOutput {
  kind: "image";
  /** data: URI built from the notebook's base64 payload. */
  src: string;
  alt: string;
}

export interface NotebookHtmlOutput {
  kind: "html";
  /** Already sanitized. */
  html: string;
}

export interface NotebookTextOutput {
  kind: "text";
  text: string;
}

export interface NotebookErrorOutput {
  kind: "error";
  text: string;
}

export type NotebookOutput =
  | NotebookImageOutput
  | NotebookHtmlOutput
  | NotebookTextOutput
  | NotebookErrorOutput;

export interface NotebookMarkdownCell {
  type: "markdown";
  source: string;
}

export interface NotebookCodeCell {
  type: "code";
  source: string;
  language: string;
  executionCount: number | null;
  outputs: NotebookOutput[];
}

export type NotebookCell = NotebookMarkdownCell | NotebookCodeCell;

export interface Notebook {
  cells: NotebookCell[];
  language: string;
  /** Frontmatter-style fields from the notebook's `metadata["ai-pedia"]`. */
  meta: Record<string, unknown>;
}

/** Sanitizer for `text/html` outputs: GitHub's schema plus what notebooks need. */
const OUTPUT_SCHEMA = {
  ...defaultSchema,
  // Dropped subtrees rather than unwrapped, so their text never leaks into the page.
  strip: ["script", "style", "head", "title"],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "style"],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: [...(defaultSchema.protocols?.src ?? []), "data"],
  },
};

/** ANSI colour escapes, which show up in tracebacks and rich reprs. */
// biome-ignore lint/suspicious/noControlCharactersInRegex: matching the escape character is the point
const ANSI = /\u001B\[[0-9;]*[A-Za-z]/g;

/** Notebook `source` fields are either a string or an array of lines. */
function joinSource(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((v) => String(v)).join("");
  return "";
}

function stripAnsi(text: string): string {
  return text.replace(ANSI, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeHtml(html: string): string {
  return toHtml(sanitize(fromHtml(html, { fragment: true }), OUTPUT_SCHEMA));
}

/**
 * Picks the richest representation a mime bundle offers, in the same order
 * Jupyter and GitHub prefer: images, then HTML, then plain text.
 */
function fromMimeBundle(data: Record<string, unknown>): NotebookOutput | null {
  for (const mime of ["image/png", "image/jpeg", "image/gif"]) {
    const payload = data[mime];
    if (typeof payload === "string" && payload.trim()) {
      return {
        kind: "image",
        src: `data:${mime};base64,${payload.replace(/\s+/g, "")}`,
        alt: "Cell output",
      };
    }
  }

  const svg = joinSource(data["image/svg+xml"]);
  if (svg.trim()) {
    const encoded = Buffer.from(svg, "utf8").toString("base64");
    return {
      kind: "image",
      src: `data:image/svg+xml;base64,${encoded}`,
      alt: "Cell output",
    };
  }

  const html = joinSource(data["text/html"]);
  if (html.trim()) {
    return { kind: "html", html: sanitizeHtml(html) };
  }

  const text = joinSource(data["text/plain"]);
  if (text.trim()) {
    return { kind: "text", text: stripAnsi(text) };
  }

  return null;
}

function toOutput(raw: unknown): NotebookOutput | null {
  if (!isRecord(raw)) return null;

  switch (raw.output_type) {
    case "stream": {
      const text = stripAnsi(joinSource(raw.text));
      return text.trim() ? { kind: "text", text } : null;
    }
    case "error": {
      const traceback = Array.isArray(raw.traceback)
        ? raw.traceback.map((l) => String(l)).join("\n")
        : `${raw.ename}: ${raw.evalue}`;
      return { kind: "error", text: stripAnsi(traceback) };
    }
    case "execute_result":
    case "display_data":
      return isRecord(raw.data) ? fromMimeBundle(raw.data) : null;
    default:
      return null;
  }
}

/** Parses raw .ipynb JSON. Returns null when the file is not a v4 notebook. */
export function parseNotebook(raw: string): Notebook | null {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(json) || !Array.isArray(json.cells)) return null;

  const metadata = isRecord(json.metadata) ? json.metadata : {};
  const kernelspec = isRecord(metadata.kernelspec) ? metadata.kernelspec : {};
  const langInfo = isRecord(metadata.language_info)
    ? metadata.language_info
    : {};
  const language =
    (typeof langInfo.name === "string" && langInfo.name) ||
    (typeof kernelspec.language === "string" && kernelspec.language) ||
    "python";

  const cells: NotebookCell[] = [];
  for (const cell of json.cells) {
    if (!isRecord(cell)) continue;
    const source = joinSource(cell.source).replace(/\s+$/, "");

    if (cell.cell_type === "markdown") {
      if (source.trim()) cells.push({ type: "markdown", source });
      continue;
    }

    if (cell.cell_type === "code") {
      const outputs = (Array.isArray(cell.outputs) ? cell.outputs : [])
        .map(toOutput)
        .filter((o): o is NotebookOutput => o !== null);
      if (!source.trim() && outputs.length === 0) continue;
      cells.push({
        type: "code",
        source,
        language,
        executionCount:
          typeof cell.execution_count === "number"
            ? cell.execution_count
            : null,
        outputs,
      });
    }
    // raw cells are skipped: they carry no rendering intent on the web
  }

  return {
    cells,
    language,
    meta: isRecord(metadata["ai-pedia"]) ? metadata["ai-pedia"] : {},
  };
}

/**
 * A markdown rendering of the notebook: prose verbatim, code in fenced blocks.
 * Used for the copy-as-markdown action and for the table of contents.
 */
export function notebookToMarkdown(notebook: Notebook): string {
  return notebook.cells
    .map((cell) =>
      cell.type === "markdown"
        ? cell.source
        : `\`\`\`${cell.language}\n${cell.source}\n\`\`\``,
    )
    .join("\n\n");
}

export function notebookHeadings(notebook: Notebook): Heading[] {
  return extractHeadings(notebookToMarkdown(notebook));
}

/** First `# heading` in the notebook, used when no explicit title is set. */
export function notebookTitle(notebook: Notebook): string | undefined {
  for (const cell of notebook.cells) {
    if (cell.type !== "markdown") continue;
    const match = cell.source.match(/^#\s+(.+)$/m);
    if (match) return match[1].trim();
  }
  return undefined;
}

/**
 * Drops the notebook's leading `# heading`. Article pages already render the
 * title in the page header, so keeping it would show it twice.
 */
export function withoutLeadingTitle(notebook: Notebook): Notebook {
  const cells = [...notebook.cells];
  const first = cells[0];
  if (!first || first.type !== "markdown") return notebook;

  const stripped = first.source.replace(/^\s*#\s+.+\n?/, "").trim();
  if (stripped === first.source.trim()) return notebook;

  if (stripped) cells[0] = { type: "markdown", source: stripped };
  else cells.shift();

  return { ...notebook, cells };
}
