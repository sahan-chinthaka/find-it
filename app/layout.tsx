import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FindIt",
  description: "AI based lost thing founding helper",
};

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${bodyFont.variable} [font-family:var(--font-body)] antialiased`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-300/35 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-200/35 blur-3xl" />
        </div>
        <Navbar />
        <main className="app-shell">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
