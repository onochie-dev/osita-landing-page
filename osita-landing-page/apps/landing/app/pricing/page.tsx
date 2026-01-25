"use client";

import { Navigation } from "@/components/navigation/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { CTABand } from "@/components/sections/cta-band";
import { PricingCard } from "@/components/pricing/pricing-card";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, sectionStagger, viewportOnce } from "@/lib/motion";

const pricingTiers = [
  {
    tier: "Starter",
    price: "$1,990",
    priceNote: "/installation/year",
    description: "For smaller operations with up to 1,000 tons of imports annually.",
    features: [
      "Up to 1,000 tons/year",
      "Core emissions measurement",
      "Quarterly CBAM reporting",
      "EU CBAM Registry submission",
      "Standard audit trails",
      "Email support",
    ],
    highlighted: false,
  },
  {
    tier: "Growth",
    price: "$3,990",
    priceNote: "/installation/year",
    description: "For mid-size importers with up to 15,000 tons of imports annually.",
    features: [
      "Up to 15,000 tons/year",
      "Everything in Starter",
      "Advanced emissions modeling",
      "Verification workflow integration",
      "Carbon price forecasting",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    tier: "Enterprise",
    price: "$5,000–$25,000+",
    priceNote: "/installation/year",
    description: "Custom pricing for large-scale industrial importers with unlimited tonnage.",
    features: [
      "Unlimited tonnage",
      "Everything in Growth",
      "Enhanced data protection",
      "Compliance controls",
      "Bespoke integrations",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        <PageHero
          title="Transparent pricing for CBAM compliance"
          subtitle="Scalable plans designed for installations of any size. No hidden fees, no surprises—just straightforward pricing that grows with your compliance needs."
          primaryCTA={{ label: "Let's Talk", href: "https://calendly.com/oan2105-columbia/30min" }}
          secondaryCTA={{ label: "View Demo", href: "https://cal.com/osita/demo" }}
        />

        {/* Pricing Cards Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={sectionStagger}
            >
              {pricingTiers.map((tier) => (
                <PricingCard
                  key={tier.tier}
                  {...tier}
                  ctaLabel="Let's Talk"
                  ctaHref="https://calendly.com/oan2105-columbia/30min"
                />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Verification Brokerage Section */}
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
                Verification Brokerage
              </motion.h2>
              <motion.div
                className="bg-gray-50 border border-gray-200 rounded-lg p-8"
                variants={fadeInUp}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-2">
                      20% brokerage fee
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      We broker annual verification services with accredited, on-platform
                      verification providers, including coordination of on-site inspections
                      where required.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Currently partnered with{" "}
                      <span className="font-medium text-black">Eurocert S.A.</span>, an
                      accredited third-party verifier recognized under EU regulations.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Average Contract Value Section */}
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
                What our customers typically invest
              </motion.h2>
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={fadeInUp}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Mid-size industrial clients
                  </p>
                  <p className="text-3xl font-bold text-black">~$30,000</p>
                  <p className="text-gray-600 mt-1">annually</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Enterprise clients
                  </p>
                  <p className="text-3xl font-bold text-black">$150,000+</p>
                  <p className="text-gray-600 mt-1">annually</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <CTABand
          title="Not sure which plan fits?"
          subtitle="Our team will help you find the right solution for your compliance needs."
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
