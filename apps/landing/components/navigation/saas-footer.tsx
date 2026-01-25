"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";

export function SaasFooter() {
  return (
    <motion.footer 
      className="bg-white border-t border-gray-200"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <motion.div className="col-span-2" variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-4">
              <span className="tracking-tight font-bold text-xl">OSITA</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              AI-native CBAM compliance platform for industrial exporters. Built for
              regulatory certainty.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 text-gray-900 font-medium">Product</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#features" className="hover:text-gray-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#coverage" className="hover:text-gray-900 transition-colors">
                  Coverage
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-gray-900 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-gray-900 transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 text-gray-900 font-medium">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a
                  href="#documentation"
                  className="hover:text-gray-900 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-gray-900 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#guides" className="hover:text-gray-900 transition-colors">
                  Guides
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-gray-900 transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 text-gray-900 font-medium">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#about" className="hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-gray-900 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-gray-900 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 text-gray-900 font-medium">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#privacy" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-gray-900 transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-gray-900 transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
          variants={fadeInUp}
        >
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} OSITA. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#linkedin"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="#twitter"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}


