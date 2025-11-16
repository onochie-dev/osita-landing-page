"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DarkModeToggle } from "../ui/dark-mode-toggle";

const navLinks = [
  { href: "#solutions", label: "Platform" },
  { href: "#features", label: "Why Osita" },
  { href: "#insights", label: "Insights" },
  { href: "#timeline", label: "Roadmap" },
  { href: "#contact", label: "Contact" },
];

/**
 * Navbar renders the global navigation with a sticky, translucent background and
 * animated mobile drawer to emphasise clarity and trust.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur dark:bg-night/70"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 md:px-10 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em]"
          aria-label="Osita homepage"
        >
          <motion.span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-card-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            O
          </motion.span>
          <span className="hidden text-sm text-neutral-800 dark:text-white md:block">
            Osita
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-1 py-2 font-medium text-neutral-700 transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary dark:text-neutral-200 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <Link
            href="#demo"
            className="hidden items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-card-sm transition hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:inline-flex"
          >
            Request Demo
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-white/20 dark:bg-white/5 dark:text-white md:hidden"
            aria-label="Toggle navigation"
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="border-t border-neutral-200/70 bg-white/95 px-6 pb-6 pt-4 shadow-lg dark:border-white/5 dark:bg-night/95 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition hover:bg-primary/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-neutral-100 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#demo"
                onClick={() => setIsOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-card-sm transition hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Request Demo
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="relative h-4 w-4" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-0 h-0.5 w-full rounded bg-current"
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-current"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 w-full rounded bg-current"
        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
      />
    </span>
  );
}

