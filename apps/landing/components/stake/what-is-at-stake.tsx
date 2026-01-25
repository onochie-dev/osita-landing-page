"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function WhatIsAtStake() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      id="what-is-at-stake"
      ref={ref}
      className="bg-white py-24 md:py-32"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 md:px-10 lg:px-12">
        <motion.h2
          className="mb-12 font-display text-4xl font-bold text-black md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          CBAM is reshaping global trade
        </motion.h2>

        <div className="font-sans space-y-6 text-lg leading-relaxed text-neutral-700 md:text-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The EU now requires importers to report and pay for embedded carbon in
            steel, aluminium, fertilizer, cement and hydrogen.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Many exporters lack MRV systems. Without credible emissions data, they
            are charged at the EU's most punitive default levels.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Verified emissions data now determines competitiveness and access to EU
            markets.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}

