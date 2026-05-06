import { Coins } from "lucide-react";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-500 px-4 py-8">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent shadow-lg">
          <Coins className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-4xl">
          <span className="text-white">Cash</span>
          <span className="text-amber-300">Quest</span>
        </h1>
      </div>

      {/* Page content */}
      <div className="w-full max-w-md">{children}</div>

      {/* Legal disclaimer */}
      <div className="mt-8 max-w-md">
        <LegalDisclaimer className="text-white/80" />
      </div>
    </div>
  );
}
