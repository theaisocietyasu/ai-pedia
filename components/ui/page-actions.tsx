"use client";

import { Check, Copy, PencilLine } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/** Actions a content page can offer in the navbar (edit link, raw markdown). */
export interface PageActions {
  editUrl?: string;
  markdown?: string;
}

const ActionsContext = createContext<{
  actions: PageActions | null;
  setActions: (a: PageActions | null) => void;
}>({ actions: null, setActions: () => {} });

export function PageActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<PageActions | null>(null);
  return (
    <ActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </ActionsContext.Provider>
  );
}

/** Rendered by a content page to publish its actions while it is mounted. */
export function RegisterPageActions({ editUrl, markdown }: PageActions) {
  const { setActions } = useContext(ActionsContext);
  useEffect(() => {
    setActions({ editUrl, markdown });
    return () => setActions(null);
  }, [editUrl, markdown, setActions]);
  return null;
}

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3 py-1 text-sm text-muted hover:text-foreground hover:border-foreground/30 transition-colors";

/** The buttons themselves; renders nothing when no page has registered. */
export function PageActionButtons() {
  const { actions } = useContext(ActionsContext);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!actions?.markdown) return;
    try {
      await navigator.clipboard.writeText(actions.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }, [actions]);

  if (!actions) return null;

  return (
    <div className="hidden sm:flex items-center gap-2">
      {actions.markdown && (
        <button
          type="button"
          onClick={copy}
          className={buttonClass}
          title="Copy this page as Markdown"
        >
          {copied ? (
            <Check size={14} className="text-purple-deep" aria-hidden="true" />
          ) : (
            <Copy size={14} aria-hidden="true" />
          )}
          <span>{copied ? "Copied" : "Copy Markdown"}</span>
        </button>
      )}
      {actions.editUrl && (
        <a
          href={actions.editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          title="Edit this page on GitHub"
        >
          <PencilLine size={14} aria-hidden="true" />
          <span>Edit</span>
        </a>
      )}
    </div>
  );
}
