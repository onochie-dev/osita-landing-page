"use client";

import { motion } from "framer-motion";
import { cardReveal, cardHover } from "@/lib/motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  items?: string[];
}

export function FeatureCard({ icon, title, description, items }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg p-6 h-full"
      variants={cardReveal}
      whileHover={cardHover}
    >
      {icon && (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-gray-700">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      {items && items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
