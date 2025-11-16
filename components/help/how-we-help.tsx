"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "MEASURE",
    description:
      "A carbon measurement system that uses machine learning models and rudimentary hardware tools to produce EU compliant emissions data in environments where monitoring infrastructure is scarce.",
    icon: (
      <svg
        className="h-12 w-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "VERIFY",
    description:
      "A marketplace for third-party verification, addressing the regional shortage of certified auditors by connecting exporters with accredited validators who can certify results quickly, affordably, and at competitive market rates.",
    icon: (
      <svg
        className="h-12 w-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "REPORT",
    description:
      "An LLM-driven CBAM filing engine that produces accurate and compliant submissions for EU importers, applying consistency checks and negating carbon price double counting.",
    icon: (
      <svg
        className="h-12 w-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export function HowWeHelp() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      id="how-we-help"
      ref={ref}
      className="bg-white py-24 text-black md:py-32"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-12">
        <motion.h2
          className="mb-8 font-display text-4xl font-bold text-black md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          A simple path to credible emissions data
        </motion.h2>

        <motion.div
          className="mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="font-sans text-lg leading-relaxed text-neutral-700 md:text-xl">
            Osita provides an end-to-end CBAM compliance platform by integrating
            emissions modelling, verification, and filing into a single intelligent
            workflow.
          </p>
          <p className="font-sans text-lg leading-relaxed text-neutral-700 md:text-xl">
            Together, these components create a unified compliance architecture that
            reduces cost, increases accuracy and expands market access for exporters in
            emerging markets.
          </p>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col items-start"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
            >
              <div className="mb-6 text-[#0F8A4A]">{feature.icon}</div>
              <h3 className="mb-4 font-display text-2xl font-bold text-black">{feature.title}</h3>
              <p className="font-sans text-base leading-relaxed text-neutral-700 md:text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

