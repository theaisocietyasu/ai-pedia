import MarkdownRenderer from "@/components/MarkdownRenderer";
import TableOfContents from "@/components/TableOfContents";
import { RegisterPageActions } from "@/components/ui/page-actions";
import type { Article } from "@/lib/content";

interface ArticleViewProps {
  article: Article;
  editUrl: string;
  /** Raw source file (frontmatter included) for the copy-as-markdown action. */
  source: string;
}

export function ArticleView({ article, editUrl, source }: ArticleViewProps) {
  return (
    <div className="w-full flex justify-between gap-12 relative">
      <RegisterPageActions editUrl={editUrl} markdown={source} />
      <main className="flex flex-col gap-12 w-full min-w-0 max-w-3xl">
        <article className="my-8 scroll-mt-24">
          <MarkdownRenderer content={article.content} />
        </article>

        <footer className="border-t border-line pt-8 pb-16 text-sm text-muted space-y-4">
          {article.contributors.length > 0 && (
            <p>
              <span className="eyebrow mr-3">Contributors</span>
              {article.contributors.join(", ")}
            </p>
          )}
          {article.updatedAt && (
            <p>
              <span className="eyebrow mr-3">Last updated</span>
              {article.updatedAt}
            </p>
          )}
        </footer>
      </main>

      <aside className="hidden lg:flex flex-col gap-2 lg:w-64 shrink-0 sticky top-20 self-start">
        <TableOfContents headings={article.headings} />
      </aside>
    </div>
  );
}
