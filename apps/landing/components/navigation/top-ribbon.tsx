"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#what-is-at-stake", label: "What is at stake" },
  { href: "#how-we-help", label: "How we help" },
  { href: "#contact", label: "Contact" },
];

export function TopRibbon() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm"
          : "bg-white"
      } border-b border-neutral-200`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10 lg:px-12">
        <Link
          href="/"
          className="font-display text-xl font-bold text-[#0F8A4A] transition hover:text-[#0A6B38]"
          aria-label="OSITA homepage"
        >
          OSITA
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans font-medium text-neutral-800 transition-colors hover:text-[#0F8A4A]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex h-8 w-8 items-center justify-center md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="relative h-4 w-4">
            <motion.span
              className="absolute left-0 top-0 h-0.5 w-full rounded bg-neutral-800"
              animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-neutral-800"
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 w-full rounded bg-neutral-800"
              animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-neutral-200 bg-white px-6 pb-4 pt-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="font-sans rounded-lg px-3 py-2 text-base font-medium text-neutral-800 transition-colors hover:bg-grey-light hover:text-[#0F8A4A]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

