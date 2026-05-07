import { Sidebar } from "@/components/shared/sidebar";

export default function MinigamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <Sidebar />
      <main className="flex-1 pb-24 lg:ml-16 lg:pb-0">{children}</main>
    </div>
  );
}
