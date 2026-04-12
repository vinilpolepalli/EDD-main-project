import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/shared/sidebar";
import { LegalDisclaimer } from "@/components/shared/legal-disclaimer";

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-20 lg:ml-64 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          {children}
        </div>
        <div className="px-4 py-3 opacity-60">
          <LegalDisclaimer />
        </div>
      </main>
    </div>
  );
}
