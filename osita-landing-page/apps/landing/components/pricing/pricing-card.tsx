"use client";

import { motion } from "framer-motion";
import { cardReveal, easing } from "@/lib/motion";

interface PricingCardProps {
  tier: string;
  price: string;
  priceNote?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export function PricingCard({
  tier,
  price,
  priceNote,
  description,
  features,
  highlighted = false,
  ctaLabel,
  ctaHref,
}: PricingCardProps) {
  return (
    <motion.div
      className={`rounded-xl p-8 h-full flex flex-col ${
        highlighted
          ? "bg-gray-900 text-white border-2 border-gray-900 relative"
          : "bg-white border border-gray-200"
      }`}
      variants={cardReveal}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="mb-6">
        <h3
          className={`text-lg font-semibold mb-2 ${
            highlighted ? "text-white" : "text-black"
          }`}
        >
          {tier}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-4xl font-bold ${
              highlighted ? "text-white" : "text-black"
            }`}
          >
            {price}
          </span>
          {priceNote && (
            <span
              className={`text-sm ${highlighted ? "text-gray-300" : "text-gray-500"}`}
            >
              {priceNote}
            </span>
          )}
        </div>
        <p
          className={`mt-3 text-sm ${
            highlighted ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                highlighted ? "text-green-400" : "text-green-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span
              className={`text-sm ${highlighted ? "text-gray-200" : "text-gray-600"}`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <motion.a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full rounded-md h-12 inline-flex items-center justify-center text-sm font-medium ${
          highlighted
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: easing.micro }}
      >
        {ctaLabel}
      </motion.a>
    </motion.div>
  );
}
