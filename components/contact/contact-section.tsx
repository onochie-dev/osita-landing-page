"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: "", company: "", email: "" });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <motion.section
        id="contact"
        ref={ref}
        className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-black py-24 md:py-32"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/contact-hero.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-40"
            sizes="100vw"
            priority
          />
        </div>

        {/* Green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F8A4A]/20 via-[#0F8A4A]/10 to-transparent" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center md:px-10 lg:px-12">
          <motion.h2
            className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Stay ahead of CBAM
          </motion.h2>

          <motion.p
            className="mb-12 font-sans text-lg text-white/90 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            If your firm exports to the EU, we can help you prepare for Jan 1, 2026.
          </motion.p>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="font-sans rounded-lg bg-[#0F8A4A] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#0A6B38] md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Open Contact Form
          </motion.button>
        </div>
      </motion.section>

      <AnimatePresence>
        {isModalOpen && (
          <ContactModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setIsSubmitted(false);
              setFormData({ name: "", company: "", email: "" });
            }}
            onSubmit={handleSubmit}
            formData={formData}
            onInputChange={handleInputChange}
            isSubmitted={isSubmitted}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ContactModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  isSubmitted,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: { name: string; company: string; email: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitted: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Black translucent overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal box */}
      <motion.div
        className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green top border */}
        <div className="h-1 rounded-t-lg bg-[#0F8A4A]" />

        <div className="p-8">
          {isSubmitted ? (
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F8A4A]">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-sans text-center text-lg font-medium text-neutral-900">
                Thank you. We have received your information. A member of our team
                will contact you soon.
              </p>
            </motion.div>
          ) : (
            <>
              <h3 className="mb-6 font-display text-2xl font-bold text-black">Contact Us</h3>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="font-sans mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    required
                    className="font-sans w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-[#0F8A4A] focus:outline-none focus:ring-2 focus:ring-[#0F8A4A]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="font-sans mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={onInputChange}
                    required
                    className="font-sans w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-[#0F8A4A] focus:outline-none focus:ring-2 focus:ring-[#0F8A4A]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="font-sans mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    required
                    className="font-sans w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-[#0F8A4A] focus:outline-none focus:ring-2 focus:ring-[#0F8A4A]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="font-sans w-full rounded-lg bg-[#0F8A4A] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0A6B38]"
                >
                  Submit
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

