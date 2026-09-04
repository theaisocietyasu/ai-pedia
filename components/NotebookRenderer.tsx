import type React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type {
  Notebook,
  NotebookCodeCell,
  NotebookOutput,
} from "@/lib/notebook";
import MarkdownRenderer from "./MarkdownRenderer";

interface NotebookRendererProps {
  notebook: Notebook;
}

function Output({ output }: { output: NotebookOutput }) {
  switch (output.kind) {
    case "image":
      return (
        // biome-ignore lint/performance/noImgElement: base64 data URI from the notebook, nothing for the image optimizer to fetch
        <img
          src={output.src}
          alt={output.alt}
          className="notebook-output-image"
        />
      );
    case "html":
      return (
        <div
          className="notebook-output-html"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized at build time in lib/notebook.ts
          dangerouslySetInnerHTML={{ __html: output.html }}
        />
      );
    case "error":
      return <pre className="notebook-output-text is-error">{output.text}</pre>;
    default:
      return <pre className="notebook-output-text">{output.text}</pre>;
  }
}

function CodeCell({ cell }: { cell: NotebookCodeCell }) {
  return (
    <div className="notebook-cell notebook-cell-code">
      {cell.source.trim() && (
        <div className="notebook-source">
          <SyntaxHighlighter
            language={cell.language}
            style={oneLight}
            showLineNumbers={cell.source.trim().includes("\n")}
            customStyle={{
              margin: 0,
              padding: "1rem 1.25rem",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "6px",
            }}
            codeTagProps={{
              style: {
                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                fontSize: "0.875rem",
              },
            }}
          >
            {cell.source}
          </SyntaxHighlighter>
        </div>
      )}

      {cell.outputs.length > 0 && (
        <div className="notebook-outputs">
          {cell.outputs.map((output, i) => (
            <Output
              // biome-ignore lint/suspicious/noArrayIndexKey: outputs are a fixed build-time list with no stable id
              key={i}
              output={output}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const NotebookRenderer: React.FC<NotebookRendererProps> = ({ notebook }) => {
  return (
    <div className="notebook">
      {notebook.cells.map((cell, i) =>
        cell.type === "markdown" ? (
          <div
            className="notebook-cell notebook-cell-markdown"
            // biome-ignore lint/suspicious/noArrayIndexKey: cells are a fixed build-time list with no stable id
            key={i}
          >
            <MarkdownRenderer content={cell.source} />
          </div>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: cells are a fixed build-time list with no stable id
          <CodeCell cell={cell} key={i} />
        ),
      )}
    </div>
  );
};

export default NotebookRenderer;
