import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StatStack — Deep Sports Analytics",
  description:
    "Lightning-fast, beautifully designed deep sports statistics with full sorting, filtering, and comparison capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary`}
      >
        <nav className="sticky top-0 z-50 border-b border-border bg-bg-card/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-accent">
                Stat
              </span>
              <span className="text-xl font-bold tracking-tight">Stack</span>
            </a>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <a
                href="/nhl"
                className="transition-colors hover:text-text-primary"
              >
                NHL
              </a>
              <a
                href="/nhl/players"
                className="transition-colors hover:text-text-primary"
              >
                Players
              </a>
              <a
                href="/nhl/teams"
                className="transition-colors hover:text-text-primary"
              >
                Teams
              </a>
              <a
                href="/nhl/compare"
                className="transition-colors hover:text-text-primary"
              >
                Compare
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
