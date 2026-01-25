"use client";

import { Navigation } from "@/components/navigation/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CTABand } from "@/components/sections/cta-band";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, sectionStagger, cardReveal, viewportOnce } from "@/lib/motion";

const platformPillars = [
  {
    number: 1,
    title: "Measurement",
    subtitle: "High-fidelity emissions modeling",
    description: "OSITA ingests production records, energy bills, and process parameters to model embedded emissions with high-fidelity.",
    details: [
      "EU MRV compliant emission factors",
      "Full data traceability and quantified certainty",
      "Lightweight hardware for incomplete instrumentation",
      "Retrofit pathways to meet CBAM MRV requirements",
    ],
  },
  {
    number: 2,
    title: "Reporting",
    subtitle: "Automated quarterly submissions",
    description: "OSITA automates quarterly submissions to the EU CBAM Registry with complete documentation.",
    details: [
      "Embedded emissions reporting",
      "Precursor allocations",
      "Carbon price adjustments",
      "Full audit trails linking filings to measurement data",
    ],
  },
  {
    number: 3,
    title: "Verification",
    subtitle: "Direct verifier connection",
    description: "OSITA connects emissions data, reports, and calculations directly to accredited third-party verifiers on platform.",
    details: [
      "Accelerated verification timelines",
      "Lowered verification costs",
      "Currently working with Eurocert S.A.",
      "In-platform collaboration workflow",
    ],
  },
  {
    number: 4,
    title: "Procurement",
    subtitle: "Certificate hedging",
    description: "Integrated CBAM certificate procurement enables systematic hedging of carbon price risk.",
    details: [
      "Links forecasted CBAM liabilities to EU ETS price dynamics",
      "Aligns certificate demand with EUA spot and forward curves",
      "Optimizes quarterly procurement strategy",
      "Real-time carbon price exposure tracking",
    ],
  },
];

const industryCoverage = [
  { name: "Steel & Iron", description: "Full process coverage" },
  { name: "Cement", description: "Clinker & grinding" },
  { name: "Aluminum", description: "Primary & secondary" },
  { name: "Fertilizers", description: "Nitrogen-based" },
];

const complianceStandards = [
  "Reg. (EU) 2023/956 Compliant",
  "Reg. (EU) 2023/2083 Compliant",
  "Audit-Grade Documentation",
  "Accredited CBAM Verifiers",
  "CBAM Registry Filing Automation",
  "CBAM Liability Management",
];

export default function CbamEnginePage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <PageHero
          title="The AI-Native CBAM Engine"
          subtitle="High-fidelity emissions modeling, automated reporting, and intelligent compliance workflows—all in one platform. Transform CBAM compliance from burden to competitive advantage."
          primaryCTA={{ label: "Let's Talk", href: "https://calendly.com/oan2105-columbia/30min" }}
          secondaryCTA={{ label: "See the Platform", href: "https://cal.com/osita/demo" }}
        />

        {/* Four Pillars Section */}
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
                End-to-end CBAM compliance
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                variants={fadeInUp}
              >
                Four integrated pillars covering the complete compliance workflow.
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={sectionStagger}
            >
              {platformPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                  variants={cardReveal}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold">
                        {pillar.number}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black">
                          {pillar.title}
                        </h3>
                        <p className="text-gray-500">{pillar.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {pillar.description}
                    </p>
                    <ul className="space-y-3">
                      {pillar.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`bg-white border border-gray-200 rounded-xl p-8 aspect-video flex items-center justify-center ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-bold text-gray-400">{pillar.number}</span>
                      </div>
                      <p className="text-gray-400 font-medium">{pillar.title} Visualization</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Industry Coverage Section */}
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
                Industry coverage
              </motion.h2>

              <motion.div
                className="grid md:grid-cols-4 gap-4"
                variants={fadeInUp}
              >
                {industryCoverage.map((industry) => (
                  <div
                    key={industry.name}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center"
                  >
                    <h3 className="font-semibold text-black mb-1">{industry.name}</h3>
                    <p className="text-sm text-gray-500">{industry.description}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Compliance Standards Section */}
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
                Compliance standards
              </motion.h2>

              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-8"
                variants={fadeInUp}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {complianceStandards.map((standard) => (
                    <div key={standard} className="flex items-center gap-3">
                      <svg
                        className="w-6 h-6 text-green-600 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{standard}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <CTABand
          title="Experience the AI-native difference"
          subtitle="See how OSITA transforms CBAM compliance from burden to competitive advantage."
          ctaLabel="Request Demo"
          ctaHref="https://cal.com/osita/demo"
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
