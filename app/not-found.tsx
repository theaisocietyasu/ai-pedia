import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100svh-3rem)] flex flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-5">404</p>
      <h1 className="font-display text-5xl md:text-6xl mb-5">Page not found</h1>
      <p className="text-ink-2 max-w-md mb-10">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 font-medium hover:bg-ink-2 transition-colors"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Browse the encyclopedia
      </Link>
    </main>
  );
}
