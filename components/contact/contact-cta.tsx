"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * ContactCTA invites visitors to engage with sales while reinforcing compliance messaging.
 */
export function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-section-gradient py-24 dark:bg-section-gradient-dark"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-10 top-10 h-36 w-36 rounded-full border border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 right-[-80px] h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center md:px-10 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-white/70">
          Ready for day-one assurance
        </p>
        <h2 className="max-w-3xl font-display text-3xl text-neutral-900 dark:text-white md:text-4xl">
          Demonstrate CBAM and ETS compliance with confidence in every executive review.
        </h2>
        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
          Book a walkthrough to see how Osita orchestrates filings, automates carbon cost
          forecasting, and keeps your compliance posture aligned with EU regulators.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="https://cal.com/osita/demo"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-card-sm transition hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Request Demo
          </Link>
          <Link
            href="mailto:hello@osita.eu"
            className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-white/80 px-7 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Email our team
          </Link>
        </div>
      </div>
    </section>
  );
}

