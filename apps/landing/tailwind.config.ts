import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F8A4A",
          dark: "#0A6B38",
          light: "#E6F5ED",
        },
        accent: {
          DEFAULT: "#0F8A4A",
          light: "#E6F5ED",
        },
        grey: {
          light: "#F7F7F7",
        },
        night: "#000000",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-plex-sans)", "sans-serif"],
      },
      boxShadow: {
        "card-sm":
          "0 10px 30px rgba(5, 20, 45, 0.08), 0 1px 0 rgba(255, 255, 255, 0.7)",
        "card-hover":
          "0 18px 40px rgba(5, 20, 45, 0.12), 0 1px 0 rgba(255, 255, 255, 0.7)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(160% 120% at 20% 20%, rgba(0, 82, 180, 0.18) 0%, rgba(0, 82, 180, 0.05) 35%, rgba(12, 29, 54, 0.65) 100%)",
        "section-gradient":
          "linear-gradient(180deg, rgba(245, 247, 250, 0.85) 0%, rgba(255, 255, 255, 0.9) 60%, rgba(230, 238, 249, 0.9) 100%)",
        "section-gradient-dark":
          "linear-gradient(180deg, rgba(5, 13, 28, 0.95) 0%, rgba(13, 19, 33, 0.95) 60%, rgba(0, 47, 109, 0.55) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

