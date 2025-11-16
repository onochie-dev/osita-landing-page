"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useTheme } from "./theme-provider";

/**
 * DarkModeToggle animates between sun and moon states while announcing changes for screen readers.
 */
export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  const ariaLabel = useMemo(
    () => (theme === "dark" ? "Switch to light mode" : "Switch to dark mode"),
    [theme],
  );

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-white text-primary transition hover:border-primary/60 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/20 dark:bg-night dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
      <motion.span
        key={theme}
        initial={{ opacity: 0, rotate: theme === "dark" ? -90 : 90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center"
        aria-hidden="true"
      >
        {theme === "dark" ? <MoonIcon /> : <SunIcon />}
      </motion.span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
    >
      <path d="M12 5.5a1.25 1.25 0 0 1-1.25-1.25V2a1.25 1.25 0 1 1 2.5 0v2.25A1.25 1.25 0 0 1 12 5.5zm0 16a1.25 1.25 0 0 1-1.25-1.25V18a1.25 1.25 0 1 1 2.5 0v2.25A1.25 1.25 0 0 1 12 21.5zM5.5 12A1.25 1.25 0 0 1 4.25 13.25H2a1.25 1.25 0 0 1 0-2.5h2.25A1.25 1.25 0 0 1 5.5 12zm16 0a1.25 1.25 0 0 1-1.25 1.25H18a1.25 1.25 0 0 1 0-2.5h2.25A1.25 1.25 0 0 1 21.5 12zM6.22 6.22a1.25 1.25 0 0 1 0-1.77L7.8 2.87a1.25 1.25 0 1 1 1.77 1.77L7.99 6.22a1.25 1.25 0 0 1-1.77 0zm11.02 11.02a1.25 1.25 0 0 1 0 1.77l-1.58 1.58a1.25 1.25 0 0 1-1.77-1.77l1.58-1.58a1.25 1.25 0 0 1 1.77 0zm-11.02 1.77a1.25 1.25 0 0 1-1.77 0L2.87 17.8a1.25 1.25 0 0 1 1.77-1.77l1.58 1.58a1.25 1.25 0 0 1 0 1.77zm11.02-13.56a1.25 1.25 0 0 1 1.77-1.77l1.58 1.58a1.25 1.25 0 1 1-1.77 1.77l-1.58-1.58zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
    >
      <path d="M21 14.87A8.13 8.13 0 0 1 10.13 4a.75.75 0 0 0-.87-.75A9.62 9.62 0 1 0 20.63 18.74a.75.75 0 0 0-.75-.87c-.56 0-1.11 0-1.67-.13c-.1-.03-.21-.04-.31-.04c-.32 0-.63.12-.87.37a.91.91 0 0 0 .19 1.38a10.41 10.41 0 0 1-3.1.53a8.12 8.12 0 0 1-8.12-8.12a8.21 8.21 0 0 1 .6-3.05a.92.92 0 0 0-.19-1.04a.89.89 0 0 0-.95-.23A10.61 10.61 0 1 0 21 14.87z" />
    </svg>
  );
}

