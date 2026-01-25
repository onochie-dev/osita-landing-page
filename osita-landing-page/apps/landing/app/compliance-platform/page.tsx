"use client";

import { Navigation } from "@/components/navigation/navigation";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce, easing } from "@/lib/motion";

// Verification Graphic - Checkmarks cascading top to bottom
function VerificationGraphic() {
  const checkItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="w-48 h-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="space-y-3">
          {checkItems.map((i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                initial={{ backgroundColor: "#e5e7eb", scale: 0.8 }}
                animate={{
                  backgroundColor: ["#e5e7eb", "#10B981", "#10B981"],
                  scale: [0.8, 1.1, 1],
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.35,
                  repeat: Infinity,
                  repeatDelay: 4,
                }}
              >
                <motion.svg
                  className="w-2.5 h-2.5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1] }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.35 + 0.2,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                >
                  <path d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
              <div className="flex-1 space-y-1">
                <motion.div
                  className="h-1.5 bg-gray-300 rounded"
                  style={{ width: `${95 - (i % 3) * 20}%` }}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.8, 0.8] }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.35,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompliancePlatformPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight"
                variants={fadeInUp}
              >
                EU CBAM Verification, end-to-end
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed mb-8"
                variants={fadeInUp}
              >
                OSITA connects emissions data, reports, and calculations directly to
                accredited third-party verifiers on platform—accelerating verification
                timelines and lowering costs through audit-grade traceability.
              </motion.p>
              <motion.div 
                className="flex items-center gap-4"
                variants={fadeInUp}
              >
                <motion.a
                  href="https://calendly.com/oan2105-columbia/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-8 h-12 inline-flex items-center justify-center text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: easing.micro }}
                >
                  Let&apos;s Talk
                </motion.a>
                <motion.a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-black border border-gray-300 rounded-md px-8 h-12 inline-flex items-center justify-center text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: easing.micro }}
                >
                  How it works
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              {/* Text content */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-4xl font-bold text-black mb-8 tracking-tight">
                  How it works
                </h2>
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Ingest evidence
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Upload activity data, energy consumption logs, production records,
                        and process parameters. OSITA structures all source data with
                        period-scoped metadata for audit readiness.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Calculate embedded emissions
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Apply IPCC methodologies and EU MRV-compliant emission factors.
                        Every calculation maintains a complete audit trail linking outputs
                        to source inputs.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Compile verification package
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Automatically assemble period-scoped evidence bundles with
                        methodology disclosures, calculation worksheets, and supporting
                        documentation. Version control preserves compliance history.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        Collaborate with accredited verifier
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Grant read-only platform access to your verifier. They validate
                        emission factors, activity data, and calculation logic directly—
                        eliminating back-and-forth document cycles. Track findings and
                        corrective actions in-platform.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Graphic */}
              <motion.div
                className="flex items-center justify-center"
                variants={fadeInUp}
              >
                <div className="w-full max-w-md aspect-square rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50 border border-gray-200 p-6">
                  <VerificationGraphic />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* What Verifiers Get Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl font-bold text-black mb-6 tracking-tight"
                variants={fadeInUp}
              >
                What verifiers access
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                variants={fadeInUp}
              >
                Accredited verifiers receive comprehensive platform access to validate
                your CBAM submissions:
              </motion.p>
              <motion.ul 
                className="space-y-4"
                variants={fadeInUp}
              >
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-black">
                      Read-only access to calculation logic and source data
                    </span>
                    <p className="text-gray-600">
                      Verifiers inspect emission factors, activity streams, and
                      methodology without modifying underlying records.
                    </p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-black">
                      Period-scoped evidence packages
                    </span>
                    <p className="text-gray-600">
                      Each reporting period includes complete documentation bundles
                      aligned with EU Transitional Registry requirements.
                    </p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-black">
                      Findings and corrective action tracking
                    </span>
                    <p className="text-gray-600">
                      Manage verification observations, non-conformities, and resolution
                      workflows within a single interface.
                    </p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-black">
                      Exportable verification statement support
                    </span>
                    <p className="text-gray-600">
                      Generate ISO 14065-conformant verification statements with
                      supporting evidence attachments.
                    </p>
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold text-black">
                      Installation and product-level verification scope
                    </span>
                    <p className="text-gray-600">
                      Support both facility-wide and product-specific verification
                      requirements across reporting periods.
                    </p>
                  </div>
                </li>
              </motion.ul>
            </motion.div>
          </div>
        </section>

        {/* Verification Partner Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.div 
                className="bg-white border border-gray-200 rounded-lg p-8"
                variants={fadeInUp}
              >
                <h2 className="text-2xl font-semibold text-black mb-3">
                  Current verification partner
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We are working with{" "}
                  <span className="font-medium text-black">Eurocert S.A.</span>, an
                  accredited third-party verifier recognized under EU regulations. Additional
                  verifier integrations are available upon request.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Band */}
        <section className="py-20 px-6 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
            >
              <motion.h2 
                className="text-3xl font-bold text-white mb-4"
                variants={fadeInUp}
              >
                Reduce verification cycles, lower costs
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-300 mb-8"
                variants={fadeInUp}
              >
                Connect with our team to discuss how OSITA can accelerate your CBAM
                verification workflow.
              </motion.p>
              <motion.a
                href="https://calendly.com/oan2105-columbia/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-md px-10 h-14 inline-flex items-center justify-center text-base font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: easing.micro }}
                variants={fadeInUp}
              >
                Let&apos;s Talk
              </motion.a>
            </motion.div>
          </div>
        </section>

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
