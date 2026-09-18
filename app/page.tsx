import type { Metadata } from "next";
import { GraphStage } from "@/components/graph/graph-stage";
import { getGraph } from "@/lib/graph";
import { SITE_URL as baseUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "AI Pedia" },
  alternates: { canonical: baseUrl },
  openGraph: { url: baseUrl },
};

export default function Home() {
  return (
    <main className="h-[calc(100svh-3rem)] overflow-hidden bg-background">
      <GraphStage graph={getGraph()} />
    </main>
  );
}
