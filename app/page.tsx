"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const heroCopy = {
  title: ["Forging carbon compliance", "into a competitive advantage."],
  summary:
    "Osita unifies customs, emissions, and procurement data so CBAM and EU ETS teams can act with confidence. We surface exposure, automate reporting, and inform certificate strategy in one institutional-grade workspace.",
  secondary:
    "Built with regulators, auditors, and trade specialists in mind, the platform provides audit-ready evidence, transparent assumptions, and alerts calibrated to EU policy cadence.",
};

const features = [
  {
    title: "Fragmented evidence packages",
    pain: "Disparate customs declarations, supplier attestations, and lifecycle assessments slow quarterly submissions.",
    solution:
      "Osita reconciles inputs into a single control room, highlighting gaps and allowing policy teams to export regulator-ready dossiers instantly.",
  },
  {
    title: "Volatile carbon price exposure",
    pain: "ETS certificates are procured ad hoc, often after price spikes have already eroded margins.",
    solution:
      "We model procurement windows against market signals and internal forecasts, surfacing optimal purchasing tranches and coverage buffers.",
  },
  {
    title: "Manual CBAM calculations",
    pain: "Spreadsheet-driven approaches make it hard to defend emission factors and tariff impacts during audits.",
    solution:
      "Rule-based automation applies the latest delegated acts, with transparent audit trails and versioned methodologies for every calculation.",
  },
];

const etsPriceData = [
  { year: "2015", price: 7 },
  { year: "2016", price: 6 },
  { year: "2017", price: 7.5 },
  { year: "2018", price: 15 },
  { year: "2019", price: 25 },
  { year: "2020", price: 33 },
  { year: "2021", price: 53 },
  { year: "2022", price: 88 },
  { year: "2023", price: 84 },
  { year: "2024", price: 72 },
];

const timelineEvents = [
  {
    date: "17 May 2023",
    title: "CBAM adopted",
    detail: "Regulation (EU) 2023/956 enters into force and sets the transitional methodology.",
  },
  {
    date: "1 Oct 2023",
    title: "Transitional reporting",
    detail: "Importers begin quarterly CBAM reports covering embedded emissions and indirect costs.",
  },
  {
    date: "1 Jan 2026",
    title: "Definitive phase",
    detail: "CBAM certificates must be purchased and surrendered against verified emissions.",
  },
  {
    date: "2026–2034",
    title: "ETS alignment",
    detail: "Free allowances phase out while CBAM scope expands, tightening cost exposure.",
  },
  {
    date: "2030+",
    title: "Broader coverage",
    detail: "Chemicals, downstream metals, and additional sectors expected to enter both regimes.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 0.83, 0.44, 1] as const },
};

export default function Home() {
  return (
    <main className="w-full">
      <SiteHeader />
      <Hero />
      <WhyOsita />
      <DataVisualisation />
      <RegulationTimeline />
      <SiteFooter />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-neutral-200/80 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-10 px-6 py-6 md:px-10 lg:px-16">
        <Link
          href="/"
          className="text-base font-bold uppercase tracking-[0.32em] text-[#1a1a1a]"
        >
          Osita
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[#111] md:flex">
          <details className="group relative flex">
            <summary className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 font-medium tracking-[0.18em] uppercase text-[#111] transition hover:text-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB]">
              Solutions
              <span className="text-lg leading-none text-[#111] transition group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 shadow-md">
              <Link
                href="/solutions/eu-importers"
                className="flex w-full items-start gap-2 px-5 py-4 text-left text-sm font-medium text-[#111] transition hover:bg-neutral-200"
              >
                EU Importers
              </Link>
              <Link
                href="/solutions/third-country-exporters"
                className="flex w-full items-start gap-2 px-5 py-4 text-left text-sm font-medium text-[#111] transition hover:bg-neutral-200"
              >
                Third-country exporters
              </Link>
            </div>
          </details>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <motion.section
      {...fadeUp}
      className="border-b border-neutral-200/60 bg-white"
    >
      <div className="relative isolate overflow-hidden">
        <BackgroundFlagTexture />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 md:px-10 lg:px-16">
          {/* Hero uses generous whitespace and restrained palette for an institutional tone */}
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Carbon compliance intelligence
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[#111] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1]">
            {heroCopy.title.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>
          <div className="max-w-3xl space-y-4 text-base text-[#1a1a1a]/80 sm:text-lg">
            <p>{heroCopy.summary}</p>
            <p>{heroCopy.secondary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:hello@osita.co"
              className="inline-flex items-center justify-center rounded-full border border-[#0047AB] bg-[#0047AB] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003d94] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB]"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function BackgroundFlagTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <Image
        src="/eu-hero-texture.jpg"
        alt=""
        fill
        priority
        className="hero-flag-image"
        sizes="(min-width: 1024px) 900px, 80vw"
      />
    </div>
  );
}

function WhyOsita() {
  return (
    <section className="border-b border-neutral-200/60 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10 lg:px-16">
        {/* Section header anchored by neutral grid to mimic EU institutional layouts */}
        <SectionHeader
          eyebrow="Why Osita"
          title="Designed for compliance officers and procurement leads."
          description="We address the operational frictions that slow CBAM readiness and EU ETS decision-making."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              {...fadeUp}
              className="flex h-full flex-col gap-4 rounded-2xl border border-neutral-200/70 bg-neutral-50/60 p-6 transition hover:border-neutral-400/80"
            >
              <h3 className="text-base font-semibold text-[#111]">
                {feature.title}
              </h3>
              <p className="text-sm font-semibold text-[#1a1a1a]/60">
                {feature.pain}
              </p>
              <p className="text-sm text-[#1a1a1a]/80">{feature.solution}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DataVisualisation() {
  return (
    <motion.section
      {...fadeUp}
      className="border-b border-neutral-200/60 bg-neutral-50"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20 md:px-10 lg:px-16">
        {/* Chart focuses on neutral scaffolding with a single blue stroke to maintain clarity */}
        <SectionHeader
          eyebrow="ETS & CBAM data"
          title="EU ETS carbon price reference (2015 – 2024)"
          description="Daily closing prices, expressed in EUR per tonne of CO₂e. Osita overlays this with procurement obligations to plan certificate purchases."
        />
        <div className="w-full rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={etsPriceData}>
                <CartesianGrid stroke="#d6d6d6" strokeDasharray="4 4" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#3f3f46", fontSize: 12 }}
                  axisLine={{ stroke: "#bababa" }}
                  tickLine={false}
                />
                <YAxis
                  width={70}
                  tick={{ fill: "#3f3f46", fontSize: 12 }}
                  axisLine={{ stroke: "#bababa" }}
                  tickLine={false}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip
                  cursor={{ stroke: "#0047AB", strokeWidth: 0.6, strokeDasharray: "4 2" }}
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#d1d5db",
                    fontSize: 12,
                    padding: 12,
                  }}
                  formatter={(value: number) => [`€${value.toFixed(0)}`, "Price"]}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#0047AB"
                  strokeWidth={2.5}
                  dot={{ r: 0 }}
                  activeDot={{ r: 4, fill: "#0047AB", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function RegulationTimeline() {
  return (
    <motion.section
      {...fadeUp}
      className="border-b border-neutral-200/60 bg-white"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Regulatory cadence"
          title="Key milestones for CBAM and ETS alignment"
          description="Our policy engine mirrors this cadence to keep risk teams aligned with the Commission’s rollout."
        />
        <div className="overflow-x-auto overflow-y-visible">
          <ol className="flex min-w-full gap-8 border-t border-neutral-200/70 pt-10">
            {timelineEvents.map((event, index) => (
              <motion.li
                key={event.date}
                {...fadeUp}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative flex w-64 shrink-0 flex-col gap-3 pt-6"
              >
                <span className="absolute left-0 top-0 h-3 w-3 -translate-y-1/2 rounded-full border border-[#0047AB]/40 bg-[#0047AB]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  {event.date}
                </span>
                <h3 className="text-base font-semibold text-[#111]">
                  {event.title}
                </h3>
                <p className="text-sm text-[#1a1a1a]/75">{event.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </motion.section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold leading-snug text-[#111] sm:text-4xl">
        {title}
      </h2>
      <p className="text-base text-[#1a1a1a]/70">{description}</p>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-[#1a1a1a]/60 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
        <span>© {new Date().getFullYear()} Osita. All rights reserved.</span>
        <a
          className="font-medium text-[#0047AB] hover:text-[#003d94]"
          href="mailto:oan2105@columbia.edu"
        >
          oan2105@columbia.edu
        </a>
      </div>
    </footer>
  );
}

