import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "Silicon Atlas — holographic CPU & GPU lab",
    template: "%s · Silicon Atlas",
  },
  description:
    "A holographic field guide to CPU and GPU parts, memory, and the inference pipeline.",
  openGraph: {
    title: "Silicon Atlas",
    description: "See the die. Understand the token.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silicon Atlas",
    description: "Holographic CPU / GPU lab for inference engineers.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-bg text-ink">
        <SiteHeader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
