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
      name: "Cement",
      coverage: "Clinker & grinding",
      details: ["Process emissions", "Fuel emissions", "Electricity"],
    },
    {
      name: "Fertilizers",
      coverage: "Nitrogen-based",
      details: ["Ammonia", "Nitric acid", "Urea"],
    },
    {
      name: "Steel & Iron",
      coverage: "Full process coverage",
      details: ["Blast furnace", "Electric arc", "Direct reduction"],
    },
    {
      name: "Aluminum",
      coverage: "Primary & secondary",
      details: ["Smelting", "Casting", "Recycling"],
    },
    {
      name: "Electricity",
      coverage: "Generation & import",
      details: ["Fossil fuel", "Renewable", "Grid mix"],
    },
    {
      name: "Hydrogen",
      coverage: "All production routes",
      details: ["Steam reforming", "Electrolysis", "Gasification"],
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Delivering comprehensive support for our clients across all CBAM-regulated
            sectors
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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


