import { Sidebar } from "@/components/shared/sidebar";

export default function MinigamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-20 lg:ml-64 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
