"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface CaseStudy {
  country: string;
  data: {
    share: string;
    emissions: string;
    exportLoss: string;
    specialNote: string;
  };
}

const caseStudies: CaseStudy[] = [
  {
    country: "TURKEY",
    data: {
      share: "~4% of total exports",
      emissions: "Ferrous metals ≈ 226 tCO2e per million USD vs EU ≈ 124",
      exportLoss: "US$430M now, up to US$4B under expanded future coverage",
      specialNote: "~40% of Turkey's iron & steel exports go to the EU",
    },
  },
  {
    country: "INDIA",
    data: {
      share: "~25% of steel and aluminium exports",
      emissions: "High relative to EU benchmarks",
      exportLoss: "Among the highest relative CBAM cost burdens",
      specialNote: "Heavy-industry exporters especially vulnerable",
    },
  },
  {
    country: "EGYPT",
    data: {
      share: "<5% of total exports",
      emissions: "Significant MRV gaps → reliance on estimated values",
      exportLoss: "GDP impact ~0.013% to 0.017%",
      specialNote: "Exposure index ≈0.2% of GDP",
    },
  },
  {
    country: "ZIMBABWE",
    data: {
      share: "~87%",
      emissions: "Iron & steel ≈ 1.17 kg CO2e/USD vs EU ≈ 0.16",
      exportLoss: "Sector extremely exposed",
      specialNote: "91.7% of Zimbabwe's iron & steel exports go to the EU",
    },
  },
  {
    country: "KAZAKHSTAN",
    data: {
      share: "€697M (2022)",
      emissions: "Aluminium ≈ 7.63 tCO2e/ton vs EU ≈ 2.33",
      exportLoss: "Up to US$1.4B under expanded CBAM",
      specialNote: "Exposure <0.5% now, could exceed 3% under expansion",
    },
  },
];

export function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      id="case-studies"
      ref={ref}
      className="bg-grey-light py-24 md:py-32"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.country}
              study={study}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function CaseStudyCard({
  study,
  index,
  isInView,
}: {
  study: CaseStudy;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="group rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#0F8A4A] hover:shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
    >
      <h3 className="mb-6 font-display text-xl font-bold text-black">{study.country}</h3>

      <div className="font-sans space-y-4 text-sm text-neutral-700">
        <div>
          <p className="mb-1 font-semibold text-neutral-900">
            1. Share of CBAM-covered exports to EU:
          </p>
          <p>{study.data.share}</p>
        </div>

        <div>
          <p className="mb-1 font-semibold text-neutral-900">
            2. Emissions intensity:
          </p>
          <p>{study.data.emissions}</p>
        </div>

        <div>
          <p className="mb-1 font-semibold text-neutral-900">
            3. Export loss estimate:
          </p>
          <p>{study.data.exportLoss}</p>
        </div>

        <div>
          <p className="mb-1 font-semibold text-neutral-900">4. Special note:</p>
          <p>{study.data.specialNote}</p>
        </div>
      </div>
    </motion.div>
  );
}

