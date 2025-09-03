import { HeroSection } from "@/components/home/hero-section"
import { FeaturesGrid } from "@/components/home/features-grid"
import { AudienceSection } from "@/components/home/audience-section"
import { VisionSection } from "@/components/home/vision-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesGrid />
      <AudienceSection />
      <VisionSection />
    </main>
  );
}
