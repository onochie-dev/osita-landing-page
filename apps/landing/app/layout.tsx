import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  display: "swap",
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-sans",
});

export const metadata: Metadata = {
  title: "OSITA",
  description: "Digital infrastructure for industrial decarbonisation & CBAM compliance.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${plexSans.variable} bg-white antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
