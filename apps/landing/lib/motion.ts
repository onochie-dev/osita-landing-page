"use client";

import { Variants, useReducedMotion } from "framer-motion";

// Hook to get animation properties that respect reduced motion
export function useMotionPreference() {
  const shouldReduceMotion = useReducedMotion();
  
  return {
    shouldReduceMotion,
    // Return empty variants if user prefers reduced motion
    getVariants: <T extends Variants>(variants: T): T | { hidden: object; visible: object } => {
      if (shouldReduceMotion) {
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      }
      return variants;
    },
  };
}

// Shared easing curves - restrained, professional
export const easing = {
  // Standard ease for most transitions
  default: [0.25, 0.1, 0.25, 1] as const,
  // Slightly more pronounced for entrances
  entrance: [0.22, 1, 0.36, 1] as const,
  // Quick settle for micro-interactions
  micro: [0.32, 0.72, 0, 1] as const,
};

// Standard transition presets
export const transition = {
  default: { duration: 0.5, ease: easing.default },
  fast: { duration: 0.25, ease: easing.micro },
  entrance: { duration: 0.6, ease: easing.entrance },
};

// Entrance animation variants - subtle Y translation + opacity
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 16 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transition.entrance,
  },
};

// Stagger container for orchestrating child animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Fade in without translation (for items that shouldn't move)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transition.entrance,
  },
};

// Card entrance - very subtle scale + opacity
export const cardReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 12,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transition.entrance,
  },
};

// Section container with stagger for cards/grid items
export const sectionStagger: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

// Micro-interaction hover state for buttons
export const buttonHover = {
  scale: 1.02,
  transition: transition.fast,
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// Subtle hover for cards
export const cardHover = {
  y: -2,
  transition: transition.fast,
};

// Viewport detection settings - trigger animations when element enters
export const viewportOnce = {
  once: true,
  amount: 0.2,
  margin: "-50px",
};

// For sections that should animate slightly earlier
export const viewportEarly = {
  once: true,
  amount: 0.1,
  margin: "-100px",
};

