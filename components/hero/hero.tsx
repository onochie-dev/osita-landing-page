"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const heroHighlights = [
  { label: "ETS certificates monitored", value: "42k+" },
  { label: "CBAM filings automated", value: "1.3k" },
  { label: "Policy alerts monthly", value: "22" },
];

/**
 * Hero renders the hero section with an EU-inspired gradient backdrop and animated overlays
 * that strengthen trust in Osita's institutional positioning.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.15, 0.65]);

  return (
    <motion.section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient pb-24 pt-28 text-neutral-900 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-[url('/globe.svg')] bg-cover bg-center mix-blend-screen dark:mix-blend-lighten"
          aria-hidden="true"
        />
        <motion.div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-primary/35 blur-3xl"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <Image
          src="/eu-hero-texture.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-lighten dark:opacity-20"
          sizes="(min-width: 1024px) 100vw, 100vw"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-10 px-6 md:px-10 lg:px-12">
        <motion.p
          className="rounded-full border border-white/20 bg-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white backdrop-blur dark:bg-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Carbon compliance intelligence
        </motion.p>

        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-8">
            <motion.h1
              className="font-display text-4xl leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Elevate CBAM & EU ETS compliance into strategic advantage.
            </motion.h1>
            <motion.p
              className="max-w-2xl text-lg text-neutral-100 dark:text-neutral-200"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Osita unifies customs, emissions, and procurement intelligence so your teams
              can defend every tonne of CO₂e. Automate filings, surface carbon price
              exposure, and forecast certificate strategy with a single evidence backbone.
            </motion.p>
            <motion.div
              className="flex flex-col items-start gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                id="demo"
                href="https://cal.com/osita/demo"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-card-sm transition hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Request Demo
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="space-y-6 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-card-sm backdrop-blur dark:bg-white/5"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white/80">
              Assurance dashboard
            </h2>
            <p className="text-sm text-white/85">
              Automated evidence packages, price signals, and EU policy monitoring built
              for compliance leads and CFOs.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((highlight) => (
                <motion.div
                  key={highlight.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="rounded-2xl border border-white/20 bg-white/15 p-4 text-left shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-white">{highlight.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                    {highlight.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

