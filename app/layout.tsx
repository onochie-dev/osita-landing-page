import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  display: "swap",
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Osita | Carbon Compliance Intelligence",
  description: "European-grade carbon compliance intelligence for CBAM and EU ETS teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white text-[#111] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
