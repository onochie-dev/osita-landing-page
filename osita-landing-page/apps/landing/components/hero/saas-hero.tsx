"use client";

import { motion } from "framer-motion";
import { GlobeVisualization } from "./globe-visualization";
import { 
  fadeInUp, 
  staggerContainer, 
  easing,
} from "@/lib/motion";

// Check items data for cleaner JSX
const checkItems = [
  "Reg. (EU) 2023/956 Compliant",
  "Reg. (EU) 2023/2083 Compliant",
  "Audit-Grade Documentation",
  "Accredited CBAM Verifiers",
  "CBAM Registry Filing Automation",
  "CBAM Liability Management",
];

export function SaasHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Full-page background image */}
      <div className="absolute inset-0 z-0">
        <GlobeVisualization />
      </div>

      {/* Dark overlay for text contrast - gradual fade */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/45 via-60% to-black/30"></div>

      {/* Content */}
      <div className="relative z-20 w-full px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-2xl space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Status badge */}
            <motion.div 
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full"
              variants={fadeInUp}
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Global CBAM Compliance Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              className="text-5xl lg:text-6xl tracking-tight text-white leading-tight"
              variants={fadeInUp}
            >
              The Only AI-Native
              <br />
              CBAM Engine
            </motion.h1>

            {/* CTA Buttons */}
            <motion.div className="flex items-center gap-4" variants={fadeInUp}>
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
                href={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/login`}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 rounded-md px-8 h-12 inline-flex items-center justify-center text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: easing.micro }}
              >
                Log In
              </motion.a>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
              className="text-xl text-gray-100 leading-relaxed"
              variants={fadeInUp}
            >
              End-to-end CBAM compliance automation
              <br />
              across Measurement, Reporting, Verification, Procurement
            </motion.p>
          </motion.div>

          {/* Compliance checkmarks */}
          <motion.div 
            className="pt-12 max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: easing.entrance }}
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-6 text-sm text-gray-100"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.6,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {checkItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { duration: 0.4, ease: easing.entrance },
                    },
                  }}
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="whitespace-nowrap">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

