"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easing } from "@/lib/motion";

export function Navigation() {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: easing.entrance }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="tracking-tight font-bold text-[26.4px] text-black hover:text-gray-600 transition-colors">
              OSITA
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {/* Product Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setProductDropdownOpen(true)}
                onMouseLeave={() => setProductDropdownOpen(false)}
              >
                <button
                  className="text-black hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  Product
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: productDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: easing.micro }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {productDropdownOpen && (
                    <motion.div 
                      className="absolute top-full left-0 pt-3"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: easing.micro }}
                    >
                      <div className="flex flex-nowrap gap-1.5">
                        <motion.a 
                          href="/compliance-platform" 
                          className="whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-md hover:border-gray-400 hover:text-black transition-colors shadow-sm"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.02, ease: easing.micro }}
                          whileHover={{ y: -1 }}
                        >
                          EU CBAM Verification
                        </motion.a>
                        <motion.a 
                          href="/cbam-engine" 
                          className="whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-md hover:border-gray-400 hover:text-black transition-colors shadow-sm"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05, ease: easing.micro }}
                          whileHover={{ y: -1 }}
                        >
                          AI Native CBAM Engine
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a
                href="/about"
                className="text-black hover:text-gray-600 transition-colors"
              >
                About
              </a>
              {/* Resources Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setResourcesDropdownOpen(true)}
                onMouseLeave={() => setResourcesDropdownOpen(false)}
              >
                <button
                  className="text-black hover:text-gray-600 transition-colors flex items-center gap-1"
                >
                  Resources
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: resourcesDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: easing.micro }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {resourcesDropdownOpen && (
                    <motion.div 
                      className="absolute top-full left-0 pt-3"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: easing.micro }}
                    >
                      <div className="flex flex-nowrap gap-1.5">
                        <motion.a 
                          href="#knowledge-base" 
                          className="whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-md hover:border-gray-400 hover:text-black transition-colors shadow-sm"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.02, ease: easing.micro }}
                          whileHover={{ y: -1 }}
                        >
                          Knowledge Base
                        </motion.a>
                        <motion.a 
                          href="/research" 
                          className="whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-md hover:border-gray-400 hover:text-black transition-colors shadow-sm"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05, ease: easing.micro }}
                          whileHover={{ y: -1 }}
                        >
                          Our Research
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a
                href="/pricing"
                className="text-black hover:text-gray-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="/security"
                className="text-black hover:text-gray-600 transition-colors"
              >
                Security
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <motion.a
              href={`${process.env.NEXT_PUBLIC_WEBAPP_URL}/login`}
              className="text-black hover:text-gray-600 transition-colors border border-gray-300 rounded-md px-6 h-12 flex items-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: easing.micro }}
            >
              Log In
            </motion.a>
            <motion.a 
              href="https://calendly.com/oan2105-columbia/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-900 text-white hover:bg-gray-800 rounded-md px-8 h-12 inline-flex items-center justify-center text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: easing.micro }}
            >
              Let&apos;s Talk
            </motion.a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
