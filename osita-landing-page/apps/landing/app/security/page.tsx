"use client";

import { Navigation } from "@/components/navigation/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CTABand } from "@/components/sections/cta-band";
import { FeatureCard } from "@/components/ui/feature-card";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, sectionStagger, viewportOnce } from "@/lib/motion";

const securityFeatures = [
  {
    title: "Data Encryption",
    description: "Your data is protected at every layer with industry-standard encryption protocols.",
    items: [
      "AES-256 encryption at rest",
      "TLS 1.3 encryption in transit",
      "End-to-end encryption for sensitive data",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "Access Control",
    description: "Granular permissions ensure only authorized users access your compliance data.",
    items: [
      "Role-based access control (RBAC)",
      "Multi-factor authentication (MFA)",
      "Single sign-on (SSO) support",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Compliance & Certifications",
    description: "Built to meet the highest standards for data protection and regulatory compliance.",
    items: [
      "GDPR compliant",
      "ISO 27001 roadmap underway",
      "EU data residency guaranteed",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Infrastructure",
    description: "Enterprise-grade infrastructure designed for reliability and performance.",
    items: [
      "Hosted on EU-based cloud infrastructure",
      "99.9% uptime SLA",
      "Automated backups & disaster recovery",
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
];

export default function SecurityPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <PageHero
          title="Enterprise-grade security"
          subtitle="Your compliance data deserves the highest level of protection. We build security into every layer of our platform to ensure your emissions data, calculations, and reports remain secure and confidential."
          primaryCTA={{ label: "Let's Talk", href: "https://calendly.com/oan2105-columbia/30min" }}
        />

        {/* Security Features Grid */}
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
                Security at every layer
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600"
                variants={fadeInUp}
              >
                Comprehensive security measures to protect your CBAM compliance data.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={sectionStagger}
            >
              {securityFeatures.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Data Handling Section */}
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
                How we handle your data
              </motion.h2>

              <motion.div className="space-y-6" variants={fadeInUp}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    Emissions Data Protection
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your production records, energy bills, and process parameters are encrypted
                    and stored securely. We maintain strict data isolation between customers,
                    ensuring your sensitive emissions data is never exposed to other users.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    Verifier Access Controls
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    When you grant access to accredited verifiers, they receive read-only
                    permissions scoped to specific reporting periods. Verifiers cannot modify
                    your underlying data, and all access is logged for full audit traceability.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-black mb-3">
                    Data Retention & Deletion
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We retain your compliance data for the duration required by EU CBAM
                    regulations. You maintain full control over your data and can request
                    deletion at any time, subject to regulatory retention requirements.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Compliance Standards */}
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
                Regulatory compliance built-in
              </motion.h2>

              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-8"
                variants={fadeInUp}
              >
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-black">Reg. (EU) 2023/956 Compliant</span>
                      <p className="text-gray-600">Full compliance with the EU CBAM regulation.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-black">Reg. (EU) 2023/2083 Compliant</span>
                      <p className="text-gray-600">Aligned with implementing regulation requirements.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-black">GDPR Compliant</span>
                      <p className="text-gray-600">Full compliance with EU data protection requirements.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-black">Audit-Grade Documentation</span>
                      <p className="text-gray-600">Complete audit trails for all calculations and submissions.</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <CTABand
          title="Security questions?"
          subtitle="Our team is ready to discuss your security requirements and compliance needs."
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
