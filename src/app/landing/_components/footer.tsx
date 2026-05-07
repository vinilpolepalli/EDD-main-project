import Link from "next/link";
import { Twitter, Instagram, Youtube } from "lucide-react";

const LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Learn", href: "/learn" },
      { label: "Simulator", href: "/simulator" },
      { label: "Mini-games", href: "/minigames" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "App",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Guide", href: "/guide" },
      { label: "Log in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "COPPA", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <div className="border-t border-white/10 pt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Wordmark + tagline */}
            <div className="md:col-span-1">
              <div className="font-serif text-[1.5rem] lowercase tracking-tight text-white">
                cashquest
              </div>
              <p className="mt-3 max-w-[18rem] font-sans text-[0.9375rem] text-muted-dark">
                Financial literacy, gamified.
              </p>
            </div>

            {/* Link groups */}
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.12em] text-muted-dark">
                  {group.title}
                </div>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-sans text-[0.9375rem] text-white/80 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1 font-sans text-[0.8125rem] text-muted-dark">
              <span>
                © 2026 CashQuest. For educational purposes only. Not financial
                advice.
              </span>
              <span>Landing page inspired by rogo.ai.</span>
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="#"
                aria-label="Twitter"
                className="text-white/60 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="text-white/60 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="text-white/60 hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
