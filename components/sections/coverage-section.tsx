"use client";

import { motion } from "framer-motion";
import { 
  fadeInUp, 
  cardReveal, 
  sectionStagger, 
  cardHover,
  viewportOnce,
  easing,
} from "@/lib/motion";

export function CoverageSection() {
  const industries = [
    {
      name: "Steel & Iron",
      coverage: "Full process coverage",
      details: ["Blast furnace, Electric arc, Direct reduction", "Indirect emissions calculations (electric grid usage)", "Precursor emissions calculations"],
    },
    {
      name: "Cement",
      coverage: "Clinker & grinding",
      details: ["Wet process, Dry process, Semi-dry process", "Indirect emissions calculations (electric grid usage)", "Precursor emissions calculations"],
    },
    {
      name: "Aluminum",
      coverage: "Primary & secondary",
      details: ["Primary smelting, Secondary smelting, Casting", "Indirect emissions calculations (electric grid usage)", "Precursor emissions calculations"],
    },
    {
      name: "Fertilizers",
      coverage: "Nitrogen-based",
      details: ["Ammonia, Nitric acid, Urea", "Indirect emissions calculations (electric grid usage)", "Precursor emissions calculations"],
    },
  ];

  return (
    <section id="coverage" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
        >
          <h2 className="text-4xl tracking-tight text-gray-900 mb-4">
            Industry Coverage
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={sectionStagger}
        >
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-colors"
              variants={cardReveal}
              whileHover={cardHover}
              transition={{ duration: 0.2, ease: easing.micro }}
            >
              <h3 className="text-xl text-gray-900 mb-2">{industry.name}</h3>
              <div className="text-sm text-gray-500 mb-4">{industry.coverage}</div>
              <div className="space-y-2">
                {industry.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                    {detail}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


