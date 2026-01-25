"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce, easing } from "@/lib/motion";

interface CTABandProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "dark" | "light";
}

export function CTABand({
  title,
  subtitle,
  ctaLabel = "Let's Talk",
  ctaHref = "https://calendly.com/oan2105-columbia/30min",
  variant = "dark",
}: CTABandProps) {
  const isDark = variant === "dark";

  return (
    <section className={`py-20 px-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          <motion.h2
            className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}
            variants={fadeInUp}
          >
            {title}
          </motion.h2>
          <motion.p
            className={`text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
          <motion.a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-md px-10 h-14 inline-flex items-center justify-center text-base font-medium ${
              isDark
                ? "bg-white text-gray-900 hover:bg-gray-100"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: easing.micro }}
            variants={fadeInUp}
          >
            {ctaLabel}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
