import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/shared/sidebar";

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <Sidebar />
      <main className="flex-1 pb-24 lg:ml-16 lg:pb-0">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
