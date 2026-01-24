"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const complianceFeatures = [
  "Reg. (EU) 2023/956 Compliant",
  "Reg. (EU) 2023/2083 Compliant",
  "Audit-Grade Documentation",
  "Accredited CBAM Verifiers",
  "CBAM Registry Filing Automation",
  "CBAM Liability Management",
];

/**
 * Hero renders a minimal, high-tech hero section with network globe visualization
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-neutral-950"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
      
      {/* Grid pattern overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 lg:px-12">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Content */}
        <motion.div
            className="z-10 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-4 py-1.5 text-xs font-medium tracking-wide text-neutral-300 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Global CBAM Compliance Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              The Only AI-Native
              <br />
              <span className="text-neutral-400">CBAM Engine</span>
            </motion.h1>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link
                href="https://cal.com/osita/demo"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Let&apos;s Talk
              </Link>
            </motion.div>

            {/* Subheadline */}
          <motion.div
              className="space-y-2 pt-4"
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="text-lg font-medium text-white">
                End-to-end CBAM compliance automation
              </p>
              <p className="text-base text-neutral-400">
                Across Measurement, Reporting, Verification, Procurement
              </p>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
              className="grid grid-cols-2 gap-x-8 gap-y-3 pt-6 sm:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {complianceFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05, duration: 0.4 }}
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-emerald-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-neutral-900">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow effect behind image */}
            <div className="absolute h-[500px] w-[500px] rounded-full bg-neutral-800/30 blur-3xl lg:h-[600px] lg:w-[600px]" />
            
            {/* Image container with filters */}
            <div className="relative h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] lg:h-[580px] lg:w-[580px]">
              <Image
                src="/network-globe.png"
                alt="Global compliance network visualization"
                fill
                priority
                className="object-contain grayscale brightness-90 contrast-110 opacity-90"
                sizes="(max-width: 768px) 400px, (max-width: 1024px) 500px, 580px"
              />
              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral-950/40 via-transparent to-neutral-950/40" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
