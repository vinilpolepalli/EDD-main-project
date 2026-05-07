"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./_primitives/button";

const NAV_LINKS = [
  { label: "Learn", href: "/learn" },
  { label: "Pricing", href: "#pricing" },
  { label: "Guide", href: "/guide" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Sentinel-based scroll-flip — observes a 30px sentinel at the top of the page
  useEffect(() => {
    const sentinel = document.getElementById("rogo-nav-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Mobile sheet: body scroll lock + Escape + focus management
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        // Trap focus inside the sheet
        const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      hamburgerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-200 ease-out",
          scrolled
            ? "border-b border-line bg-paper/95 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
        aria-label="Primary"
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-10">
          <Link
            href="/landing"
            className={cn(
              "font-serif text-[1.25rem] lowercase tracking-tight transition-colors",
              scrolled ? "text-ink" : "text-white",
            )}
          >
            cashquest
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    "font-sans text-[0.875rem] font-medium transition-colors",
                    scrolled
                      ? "text-ink/80 hover:text-ink"
                      : "text-white/80 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/login"
              className={cn(
                "font-sans text-[0.875rem] font-medium transition-colors",
                scrolled
                  ? "text-ink/80 hover:text-ink"
                  : "text-white/80 hover:text-white",
              )}
            >
              Log in
            </Link>
            <Button
              href="/signup"
              variant={scrolled ? "primary-on-paper" : "primary-on-ink"}
            >
              Get Started
            </Button>
          </div>

          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="rogo-mobile-sheet"
            aria-label="Open menu"
            className={cn(
              "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              scrolled ? "text-ink" : "text-white",
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={sheetRef}
          id="rogo-mobile-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 py-5 md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-[1.25rem] lowercase tracking-tight text-ink">
              cashquest
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <ul className="mt-12 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-[2rem] font-normal tracking-tight text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-4 pb-4">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="font-sans text-[0.875rem] font-medium text-muted"
            >
              Log in
            </Link>
            <Button href="/signup" variant="primary-on-paper">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
