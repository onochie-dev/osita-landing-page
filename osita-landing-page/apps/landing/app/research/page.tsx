"use client";

import { Navigation } from "@/components/navigation/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CTABand } from "@/components/sections/cta-band";
import { FeatureCard } from "@/components/ui/feature-card";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, sectionStagger, viewportOnce } from "@/lib/motion";

const researchAreas = [
  {
    title: "CBAM Policy Analysis",
    description: "Deep dives into EU CBAM regulation, implementing regulation updates, and registry requirements.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
  },
  {
    title: "Emissions Measurement",
    description: "Methodology research, MRV standards, and uncertainty quantification for industrial emissions.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
  {
    title: "Carbon Markets",
    description: "EU ETS price dynamics, CBAM certificate pricing, and market structure analysis.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Industrial Decarbonization",
    description: "Sector-specific insights, technology pathways, and cost-benefit analysis for heavy industry.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
];

const regulatoryTimeline = [
  { date: "May 2023", event: "CBAM adopted (Reg. EU 2023/956)" },
  { date: "October 2023", event: "Transitional reporting begins" },
  { date: "January 2026", event: "Definitive phase starts - CBAM certificates required" },
  { date: "December 2028", event: "ETS alignment checks" },
  { date: "January 2030", event: "Scope expansion expected" },
];

export default function ResearchPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <PageHero
          title="Research & Insights"
          subtitle="Exploring the intersection of carbon policy, industrial decarbonization, and compliance technology. Stay informed on the latest developments in CBAM and carbon markets."
          primaryCTA={{ label: "Let's Talk", href: "https://calendly.com/oan2105-columbia/30min" }}
        />

        {/* Research Areas Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="mb-12"
            >
              <motion.h2
                className="text-3xl font-bold text-black mb-4 tracking-tight"
                variants={fadeInUp}
              >
                Research areas
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                variants={fadeInUp}
              >
                Our team explores key topics shaping the future of carbon compliance.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={sectionStagger}
            >
              {researchAreas.map((area) => (
                <FeatureCard key={area.title} {...area} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Regulatory Timeline Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-3xl font-bold text-black mb-8 tracking-tight"
                variants={fadeInUp}
              >
                CBAM regulatory timeline
              </motion.h2>

              <motion.div
                className="relative"
                variants={fadeInUp}
              >
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-8">
                  {regulatoryTimeline.map((item, index) => (
                    <div key={index} className="relative pl-12">
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= 1 ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        {index <= 1 ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-500 mb-1">{item.date}</p>
                        <p className="text-gray-800">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Publications Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-3xl font-bold text-black mb-8 tracking-tight"
                variants={fadeInUp}
              >
                Publications
              </motion.h2>

              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-8 text-center"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Coming soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Research publications and white papers on CBAM compliance, carbon markets, and industrial decarbonization.
                </p>
                <p className="text-sm text-gray-500">
                  Connect with us to be notified when new research is available.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Market Data Preview */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.h2
                className="text-3xl font-bold text-black mb-8 tracking-tight"
                variants={fadeInUp}
              >
                EU ETS price history
              </motion.h2>

              <motion.div
                className="bg-gray-50 border border-gray-200 rounded-lg p-8"
                variants={fadeInUp}
              >
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-black">€7</p>
                    <p className="text-sm text-gray-500">2015</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">€25</p>
                    <p className="text-sm text-gray-500">2019</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">€53</p>
                    <p className="text-sm text-gray-500">2021</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">€88</p>
                    <p className="text-sm text-gray-500">2022 (Peak)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">€72</p>
                    <p className="text-sm text-gray-500">2024</p>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-6">
                  EU ETS carbon allowance prices per tonne CO₂
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <CTABand
          title="Stay informed on CBAM developments"
          subtitle="Connect with our team for the latest insights on carbon compliance."
          ctaLabel="Let's Talk"
          ctaHref="https://calendly.com/oan2105-columbia/30min"
        />

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} OSITA. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
