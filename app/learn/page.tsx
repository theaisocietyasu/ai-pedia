import { getCategories } from "@/lib/content";
import { CategoryList } from "./CategoryList";

export default function LearnPage() {
  const categories = getCategories();

  return (
    <main className="min-h-screen">
      <section className="container pt-24 pb-12">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <p className="eyebrow mb-5">
            The AI Society · Arizona State University
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl mb-6">
            Learn
          </h1>
          <p className="font-display italic text-xl sm:text-2xl text-ink-2">
            Beginner and deep-dive tutorials in artificial intelligence.
          </p>
        </div>
      </section>

      <section className="container pb-24">
        <CategoryList categories={categories} />
      </section>
    </main>
  );
}
