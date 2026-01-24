"use client";

import { motion } from "framer-motion";

const solutions = [
  {
    title: "Evidence control room",
    description:
      "Centralise customs filings, supplier attestations, and verification statements with lineage tracking and audit trails.",
    bullets: [
      "Automated ingestion from brokers and ERPs",
      "Flag data anomalies with severity tiers",
      "Generate regulator-ready evidence packages",
    ],
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10 fill-none stroke-current stroke-[1.6]">
        <rect x="6" y="10" width="36" height="28" rx="4" />
        <path d="M12 16h12M12 24h10M12 32h8" />
        <path d="M26 16h10v16H26z" />
      </svg>
    ),
  },
  {
    title: "Carbon strategy intelligence",
    description:
      "Model ETS procurement windows and CBAM certificate exposure against live market and policy signals.",
    bullets: [
      "Scenario planning for price corridors",
      "Auto-generated hedging alerts",
      "Board-ready cost impact briefings",
    ],
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10 fill-none stroke-current stroke-[1.6]">
        <path d="M8 36 20 20l8 8 12-16" />
        <circle cx="20" cy="20" r="3" />
        <circle cx="28" cy="28" r="3" />
        <circle cx="40" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Regulatory operations",
    description:
      "Orchestrate CBAM quarterly filings and ETS obligations with SLA monitoring, approvals, and digital sign-off.",
    bullets: [
      "Task playbooks aligned to EU cadence",
      "Role-based access and immutable logs",
      "Exportable dossier with signature capture",
    ],
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10 fill-none stroke-current stroke-[1.6]">
        <rect x="10" y="8" width="28" height="32" rx="4" />
        <path d="M16 18h16M16 26h16M16 34h10" />
        <path d="M16 12h6" />
      </svg>
    ),
  },
];

/**
 * SolutionGrid outlines the primary Osita modules with supporting bullet points to give clarity to stakeholders.
 */
export function SolutionGrid() {
  return (
    <section
      id="solutions"
      className="bg-white py-24 dark:bg-night"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 md:px-10 lg:px-12">
        <header className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-white/80">
            Platform capabilities
          </p>
          <h2 className="font-display text-3xl text-neutral-900 dark:text-white md:text-4xl">
            Institutional-grade control across carbon reporting, assurance, and procurement.
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-300">
            Osita spans the full lifecycle from evidence capture to policy monitoring, enabling
            CBAM and ETS teams to collaborate securely with complete transparency.
          </p>
        </header>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <motion.article
              key={solution.title}
              className="flex h-full flex-col gap-4 rounded-3xl border border-neutral-200 bg-accent/50 p-8 shadow-card-sm transition hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-white/5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-white/15 dark:text-white">
                {solution.icon}
              </div>
              <div>
                <h3 className="font-display text-xl text-neutral-900 dark:text-white">
                  {solution.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                  {solution.description}
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-200">
                {solution.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

