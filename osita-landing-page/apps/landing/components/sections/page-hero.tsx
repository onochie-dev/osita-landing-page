"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, easing } from "@/lib/motion";

interface PageHeroProps {
  title: string;
  subtitle: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export function PageHero({ title, subtitle, primaryCTA, secondaryCTA }: PageHeroProps) {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight"
            variants={fadeInUp}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 leading-relaxed mb-8"
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
          {(primaryCTA || secondaryCTA) && (
            <motion.div className="flex items-center gap-4" variants={fadeInUp}>
              {primaryCTA && (
                <motion.a
                  href={primaryCTA.href}
                  target={primaryCTA.href.startsWith("http") ? "_blank" : undefined}
                  rel={primaryCTA.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-8 h-12 inline-flex items-center justify-center text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: easing.micro }}
                >
                  {primaryCTA.label}
                </motion.a>
              )}
              {secondaryCTA && (
                <motion.a
                  href={secondaryCTA.href}
                  target={secondaryCTA.href.startsWith("http") ? "_blank" : undefined}
                  rel={secondaryCTA.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-gray-700 hover:text-black border border-gray-300 rounded-md px-8 h-12 inline-flex items-center justify-center text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15, ease: easing.micro }}
                >
                  {secondaryCTA.label}
                </motion.a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
