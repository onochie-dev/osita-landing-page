"use client";
import { motion } from "framer-motion";

const partnerLogos = [
  { name: "EurTrade", width: 112 },
  { name: "CarbonDesk", width: 126 },
  { name: "RegTech North", width: 142 },
  { name: "AuditLink", width: 118 },
  { name: "EuroSteel", width: 110 },
];

/**
 * PartnersBand displays trusted partner logos over a subtle animated EU motif for validation.
 */
export function PartnersBand() {
  return (
    <section className="relative overflow-hidden border-y border-neutral-200/70 bg-accent py-12 dark:border-white/5 dark:bg-night">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,82,180,0.12),transparent_60%)]" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 text-center md:px-10 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-600 dark:text-white/70">
          Trusted by compliance partners
        </p>
        <div className="flex w-full flex-wrap items-center justify-center gap-10 opacity-80">
          {partnerLogos.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="flex items-center justify-center rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 shadow-card-sm backdrop-blur dark:bg-white/10 dark:text-white/70"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{ minWidth: partner.width }}
            >
              {partner.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

