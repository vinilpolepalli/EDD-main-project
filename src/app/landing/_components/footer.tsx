import Link from "next/link";
import { Twitter, Instagram, Youtube } from "lucide-react";

const LINK_GROUPS = [
  {
    title: "Product",
    links: ["Quests", "Pricing", "AI Tutor", "For schools"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Press", "Careers"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy", "COPPA", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="bg-rogo-ink text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <div className="border-t border-white/10 pt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Wordmark + tagline */}
            <div className="md:col-span-1">
              <div className="font-rogo-serif text-[1.5rem] lowercase tracking-tight text-white">
                cashquest
              </div>
              <p className="mt-3 max-w-[18rem] font-rogo-sans text-[0.9375rem] text-rogo-muted-dark">
                Financial literacy, gamified.
              </p>
            </div>

            {/* Link groups */}
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <div className="font-rogo-sans text-[0.75rem] font-medium uppercase tracking-[0.12em] text-rogo-muted-dark">
                  {group.title}
                </div>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="font-rogo-sans text-[0.9375rem] text-white/80 hover:text-white"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="font-rogo-sans text-[0.8125rem] text-rogo-muted-dark">
              © 2026 CashQuest. For educational purposes only. Not financial
              advice.
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
