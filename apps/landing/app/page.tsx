import { Navigation } from "@/components/navigation/navigation";
import { SaasHero } from "@/components/hero/saas-hero";
import { ProcessSection } from "@/components/sections/process-section";
import { CoverageSection } from "@/components/sections/coverage-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <SaasHero />
        <CoverageSection />
        <ProcessSection />
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} OSITA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
