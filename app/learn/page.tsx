import { GraphStage } from "@/components/graph/graph-stage";
import { getGraph } from "@/lib/graph";

export default function LearnPage() {
  return (
    <main className="h-[calc(100svh-3rem)] overflow-hidden bg-background">
      <GraphStage graph={getGraph()} />
    </main>
  );
}
