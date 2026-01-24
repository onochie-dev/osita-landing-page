"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FeatureCard {
  title: string;
  pain: string;
  solution: string;
  icon: "network" | "carbon" | "automation";
}

const cards: FeatureCard[] = [
  {
    title: "Fragmented evidence packages",
    pain: "Multiple customs brokers and supplier attestations create version chaos.",
    solution:
      "Osita consolidates source data with validation scores, so dossier owners submit regulator-ready evidence in minutes.",
    icon: "network",
  },
  {
    title: "Volatile carbon price exposure",
    pain: "Market swings erode margins before procurement teams can hedge.",
    solution:
      "Live price feeds, risk corridors, and alerts benchmarked against your strategy make ETS procurement proactive.",
    icon: "carbon",
  },
  {
    title: "Manual CBAM calculations",
    pain: "Spreadsheet logic breaks under shifting delegated acts and scope updates.",
    solution:
      "Dynamic rules engine applies the latest methodology, with transparent audit trails and version history for every tonne.",
    icon: "automation",
  },
];

const sparklinePaths = {
  network: "M2 12 C4 7 8 15 12 10 C14 7 18 14 22 9",
  carbon: "M2 16 C6 9 9 19 12 8 C15 4 18 14 22 6",
  automation: "M2 18 C6 10 8 17 12 11 C16 6 19 15 22 9",
};

/**
 * FeatureScroller surfaces Osita's core value props as horizontally swipeable cards with micro visualisations.
 */
export function FeatureScroller() {
  const cardsWithIcons = useMemo(
    () =>
      cards.map((card) => ({
        ...card,
        sparkline: sparklinePaths[card.icon],
      })),
    [],
  );

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-section-gradient py-24 dark:bg-section-gradient-dark"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
        <div className="absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-white/80">
            Why Osita
          </p>
          <h2 className="font-display text-3xl text-neutral-900 dark:text-white md:text-4xl">
            Built for compliance officers, procurement strategists, and sustainability leads.
          </h2>
          <p className="text-base text-neutral-700 dark:text-neutral-200">
            Harmonise fragmented evidence, anticipate carbon cost exposure, and automate CBAM
            logic without compromising audit traceability.
          </p>
        </div>

        <div className="mt-12 flex gap-6 overflow-x-auto pb-4 pt-2 [scrollbar-width:none] sm:pb-6">
          <div className="pointer-events-none sticky left-0 top-0 hidden h-full w-24 bg-gradient-to-r from-section-gradient via-section-gradient to-transparent dark:from-section-gradient-dark dark:via-section-gradient-dark sm:block" />
          <div className="flex snap-x snap-mandatory gap-6">
            {cardsWithIcons.map((card, index) => (
              <motion.article
                key={card.title}
                className="group flex w-[280px] min-w-[260px] snap-center flex-col gap-5 rounded-3xl border border-white/40 bg-white/70 p-6 text-left shadow-card-sm transition hover:shadow-card-hover dark:border-white/5 dark:bg-white/10 md:w-[320px]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <IconBadge icon={card.icon} />
                <div>
                  <h3 className="font-display text-xl text-neutral-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-200">
                    {card.pain}
                  </p>
                </div>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
                  {card.solution}
                </p>
                <Sparkline ariaLabel={`${card.title} trend`} path={card.sparkline} />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IconBadge({ icon }: { icon: FeatureCard["icon"] }) {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
      <div className="absolute inset-0 rounded-2xl border border-primary/20" />
      {icon === "network" && (
        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-none stroke-current stroke-2">
          <circle cx="16" cy="16" r="5" />
          <path d="M16 3v8M16 21v8M29 16h-8M11 16H3" />
          <path d="m25.61 8.39-5.66 5.65M12.05 18-6e-3 29.94" />
        </svg>
      )}
      {icon === "carbon" && (
        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-none stroke-current stroke-2">
          <path d="m8 12 8-5 8 5v8l-8 5-8-5z" />
          <circle cx="16" cy="16" r="2.5" />
          <path d="M16 8v3M16 21v3M9 16h3M20 16h3" />
        </svg>
      )}
      {icon === "automation" && (
        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-none stroke-current stroke-2">
          <path d="M8 10h9l7 6-7 6H8l7-6z" />
          <path d="M13 4v5M13 23v5M4 13H9M17 27h5" />
        </svg>
      )}
    </div>
  );
}

function Sparkline({ path, ariaLabel }: { path: string; ariaLabel: string }) {
  return (
    <figure className="mt-auto">
      <figcaption className="sr-only">{ariaLabel}</figcaption>
      <svg
        viewBox="0 0 24 24"
        role="img"
        className="h-20 w-full stroke-primary"
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="22"
          cy={path.endsWith("9") ? 9 : 6}
          r="1.6"
          className="fill-current"
        />
      </svg>
    </figure>
  );
}

