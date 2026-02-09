"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/nhl", label: "NHL" },
  { href: "/nhl/players", label: "Players" },
  { href: "/nhl/teams", label: "Teams" },
  { href: "/nhl/leaders", label: "Leaders" },
  { href: "/nhl/compare", label: "Compare" },
];

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="hidden items-center gap-2 text-sm text-text-secondary md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-11 items-center rounded-md px-3 transition-colors hover:text-text-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary md:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <path d="M3 6h18M3 12h18M3 18h18" />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            id="mobile-nav-drawer"
            className="fixed right-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-72 max-w-[85vw] flex-col border-l border-border bg-bg-card p-3 shadow-2xl md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-11 items-center rounded-md px-3 text-base text-text-secondary transition-colors hover:bg-bg-hover hover:text-text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
