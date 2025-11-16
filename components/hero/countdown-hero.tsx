"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CountdownHero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-01-01T00:00:00Z").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Industrial background image */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: "url('/industrial-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
        aria-hidden="true"
      />

      {/* Green gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F8A4A]/20 via-[#0F8A4A]/10 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <motion.h1
          className="mb-6 font-display text-6xl font-bold text-white md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          OSITA
        </motion.h1>

        <motion.p
          className="mb-12 font-sans text-xl text-white/80 md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Climate compliance for exporters in growth markets.
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <p className="font-sans text-lg text-white/70 md:text-xl">
            CBAM enforcement begins in:
          </p>
          <div className="flex gap-4 md:gap-6">
            <div className="flex flex-col items-center">
              <div className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {timeLeft.days}
              </div>
              <div className="font-sans text-xs text-white/60 md:text-sm">Days</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {timeLeft.hours}
              </div>
              <div className="font-sans text-xs text-white/60 md:text-sm">Hours</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {timeLeft.minutes}
              </div>
              <div className="font-sans text-xs text-white/60 md:text-sm">Minutes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {timeLeft.seconds}
              </div>
              <div className="font-sans text-xs text-white/60 md:text-sm">Seconds</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

