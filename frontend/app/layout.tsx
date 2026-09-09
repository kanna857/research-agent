import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "KnowSure — Autonomous AI Research Intelligence Platform",
  description: "AI that investigates what the academic evidence actually supports. Evidence-backed claims, transparent trust scoring, and contradiction detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-gray-950">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-800/80 bg-[#0b0f19]/80 py-6 text-center text-xs font-mono text-gray-500">
          <p>KnowSure Research Intelligence Platform • Zero Hallucination Protocol • Powered by Peer-Reviewed Literature</p>
        </footer>
      </body>
    </html>
  );
}
