"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
);

const etsPriceData = [
  { date: "2015-01-01", price: 7 },
  { date: "2016-01-01", price: 6 },
  { date: "2017-01-01", price: 7.5 },
  { date: "2018-01-01", price: 15 },
  { date: "2019-01-01", price: 25 },
  { date: "2020-01-01", price: 33 },
  { date: "2021-01-01", price: 53 },
  { date: "2022-01-01", price: 88 },
  { date: "2023-01-01", price: 84 },
  { date: "2024-01-01", price: 72 },
];

const regulatoryEvents = [
  {
    id: "adoption",
    date: "2023-05-17",
    title: "CBAM adopted",
    detail:
      "Regulation (EU) 2023/956 took effect, outlining the transitional methodology and data requirements.",
  },
  {
    id: "transitional",
    date: "2023-10-01",
    title: "Transitional reporting begins",
    detail:
      "Importers file quarterly CBAM reports covering embedded direct and indirect emissions per CN code.",
  },
  {
    id: "definitive",
    date: "2026-01-01",
    title: "Definitive phase",
    detail:
      "CBAM certificates must be purchased and surrendered. Free ETS allowances begin to phase out more aggressively.",
  },
  {
    id: "alignment",
    date: "2028-12-31",
    title: "ETS alignment checks",
    detail:
      "Commission assesses carbon leakage measures; sectors under review include downstream metals and fertilisers.",
  },
  {
    id: "expansion",
    date: "2030-01-01",
    title: "Scope expansion",
    detail:
      "Expected integration of chemicals and additional manufacturing flows into CBAM and ETS regimes.",
  },
];

/**
 * DataInsights combines a Chart.js price history view with an interactive regulatory timeline.
 */
export function DataInsights() {
  const [activeEventId, setActiveEventId] = useState(regulatoryEvents[0].id);

const chartData = useMemo<ChartData<"line", { x: Date; y: number }[]>>(
    () => ({
      datasets: [
        {
          label: "EU ETS Spot Price (€ / tonne CO₂e)",
          data: etsPriceData.map((point) => ({
          x: new Date(point.date),
            y: point.price,
          })),
          borderColor: "#0052B4",
          backgroundColor: "rgba(0, 82, 180, 0.18)",
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#0052B4",
          pointHoverBorderWidth: 2,
        },
      ],
    }),
    [],
  );

  const chartOptions = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#0D1321",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          padding: 12,
          borderColor: "#1b2840",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (context: any) => `€${context.parsed.y.toFixed(0)}`,
          },
        },
      },
      scales: {
        x: {
          type: "time" as const,
          time: {
            unit: "year",
          },
          ticks: {
            color: "#4b5563",
            font: { size: 12 },
          },
          grid: {
            color: "rgba(148, 163, 184, 0.2)",
          },
        },
        y: {
          beginAtZero: false,
          ticks: {
            color: "#4b5563",
            font: { size: 12 },
            callback: (value: number | string) => `€${value}`,
          },
          grid: {
            color: "rgba(148, 163, 184, 0.2)",
          },
        },
      },
    }),
    [],
  );

  const activeEvent = regulatoryEvents.find((event) => event.id === activeEventId);

  return (
    <section
      id="insights"
      className="border-t border-neutral-200/70 bg-white py-24 dark:border-white/5 dark:bg-night"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-16 px-6 md:px-10 lg:px-12">
        <header className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-white/80">
            ETS & CBAM data
          </p>
          <h2 className="font-display text-3xl text-neutral-900 dark:text-white md:text-4xl">
            Evidence-backed market intelligence to time certificate strategy.
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-300">
            Osita blends ETS market data, customs declarations, and scope 1-3 emissions to
            contextualise carbon price exposure by product line and jurisdiction.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-neutral-200 bg-accent/60 p-6 shadow-card-sm dark:border-white/10 dark:bg-white/5">
            <div className="h-[420px] w-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          <aside className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-card-sm dark:border-white/10 dark:bg-white/5">
            <h3 className="font-display text-lg text-neutral-900 dark:text-white">
              Automated intelligence
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-neutral-600 dark:text-neutral-200">
              <li>ETS curve stress tests against energy price and FX scenarios.</li>
              <li>CBAM certificate needs forecasted by customs value and emissions factors.</li>
              <li>Watchlists for counterparties with delayed MRV reporting cycles.</li>
            </ul>
          </aside>
        </div>

        <div id="timeline" className="space-y-10">
          <header className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-white/80">
              Regulatory cadence
            </p>
            <h2 className="font-display text-3xl text-neutral-900 dark:text-white md:text-4xl">
              Stay aligned with Brussels in real time.
            </h2>
            <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
              Our policy engine mirrors EU milestones with proactive alerts for delegated
              acts, implementing regulations, and national authority guidance.
            </p>
          </header>

          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[2fr_1fr]">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-card-sm dark:border-white/10 dark:bg-white/5">
              <motion.div
                className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                aria-hidden="true"
              />
              <ol className="relative flex flex-col gap-8">
                {regulatoryEvents.map((event, index) => {
                  const isActive = event.id === activeEventId;
                  return (
                    <li key={event.id} className="relative pl-14">
                      <button
                        type="button"
                        onClick={() => setActiveEventId(event.id)}
                        className="group flex flex-col gap-2 text-left focus-visible:outline-none"
                        aria-pressed={isActive}
                      >
                        <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center">
                          <span className="absolute inset-0 rounded-full border border-primary/40 bg-primary/15 group-hover:border-primary/70 group-hover:bg-primary/25 dark:border-white/30 dark:bg-white/10" />
                          {isActive ? (
                            <motion.span
                              layoutId="timeline-dot"
                              className="relative inline-block h-2 w-2 rounded-full bg-primary"
                            />
                          ) : (
                            <span className="relative inline-block h-2 w-2 rounded-full bg-primary/60 dark:bg-white/70" />
                          )}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-300">
                          {new Date(event.date).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="font-display text-lg text-neutral-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary-light">
                          {event.title}
                        </span>
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">
                          {event.detail}
                        </span>
                      </button>
                      {index !== regulatoryEvents.length - 1 && (
                        <span
                          className="absolute left-3 top-6 h-full w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent dark:from-white/30 dark:via-white/10"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            {activeEvent ? (
              <motion.div
                key={activeEvent.id}
                layout
                className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-accent/60 p-6 shadow-card-sm dark:border-white/10 dark:bg-white/5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-white/80">
                    Upcoming impact
                  </p>
                  <h3 className="mt-4 font-display text-2xl text-neutral-900 dark:text-white">
                    {activeEvent.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                    {activeEvent.detail}
                  </p>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-neutral-500 dark:text-neutral-300">
                  <li>Osita syncs delegated acts instantly across your methodology library.</li>
                  <li>Policy nudges route to relevant stakeholders with SLA tracking.</li>
                  <li>Generate impact briefings for audit committees in one click.</li>
                </ul>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

