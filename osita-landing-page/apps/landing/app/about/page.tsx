"use client";

import { Navigation } from "@/components/navigation/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CTABand } from "@/components/sections/cta-band";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, sectionStagger, cardReveal, viewportOnce } from "@/lib/motion";

const platformPillars = [
  {
    title: "Measurement",
    description: "High-fidelity emissions modeling using production records, energy bills, and process parameters with EU MRV compliant emission factors.",
  },
  {
    title: "Reporting",
    description: "Automated quarterly submissions to the EU CBAM Registry with full audit trails linking filings to underlying measurement data.",
  },
  {
    title: "Verification",
    description: "Direct connection to accredited third-party verifiers on platform, accelerating verification timelines and lowering costs.",
  },
  {
    title: "Procurement",
    description: "Integrated CBAM certificate procurement with systematic hedging of carbon price risk aligned to EU ETS price dynamics.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <PageHero
          title="Building the infrastructure for carbon compliance"
          subtitle="OSITA helps industrial exporters navigate CBAM with confidence. We combine deep regulatory expertise with modern technology to simplify compliance and transform carbon data into strategic advantage."
          primaryCTA={{ label: "Let's Talk", href: "https://calendly.com/oan2105-columbia/30min" }}
        />

        {/* Mission Section */}
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
                Our mission
              </motion.h2>

              <motion.div className="space-y-6" variants={fadeInUp}>
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Make CBAM compliance seamless for every industrial exporter
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    The EU Carbon Border Adjustment Mechanism represents one of the most
                    significant shifts in global trade policy. For manufacturers and importers,
                    it creates new compliance obligations that require accurate emissions data,
                    rigorous verification, and strategic certificate procurement.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We built OSITA to address these challenges head-on. Our AI-native platform
                    automates the entire CBAM workflow—from measurement through procurement—so
                    compliance teams can focus on strategy rather than spreadsheets.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* The Challenge Section */}
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
                The challenge we solve
              </motion.h2>

              <motion.div
                className="grid md:grid-cols-3 gap-6"
                variants={fadeInUp}
              >
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-black mb-2">Fragmented Data</h3>
                  <p className="text-sm text-gray-600">
                    Multiple customs brokers and supplier attestations create version chaos
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-black mb-2">Volatile Exposure</h3>
                  <p className="text-sm text-gray-600">
                    Carbon price swings erode margins before teams can hedge
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-black mb-2">Manual Processes</h3>
                  <p className="text-sm text-gray-600">
                    Spreadsheet logic breaks under shifting regulations
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Platform Pillars Section */}
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
                Our platform
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                variants={fadeInUp}
              >
                End-to-end CBAM compliance automation across four integrated pillars.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={sectionStagger}
            >
              {platformPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                  variants={cardReveal}
                >
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Partners Section */}
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
                Our partners
              </motion.h2>

              <motion.div
                className="bg-gray-50 border border-gray-200 rounded-lg p-8"
                variants={fadeInUp}
              >
                <h3 className="text-xl font-semibold text-black mb-4">
                  Verification Partner
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We work with{" "}
                  <span className="font-medium text-black">Eurocert S.A.</span>, an
                  accredited third-party verifier recognized under EU regulations, to
                  provide seamless verification services directly through our platform.
                  This partnership accelerates verification timelines and reduces costs
                  for our customers.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <CTABand
          title="Join the future of carbon compliance"
          subtitle="Connect with our team to learn how OSITA can transform your CBAM workflow."
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
