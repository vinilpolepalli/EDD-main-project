import { Nav } from "@/components/shared/nav";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {children}
      </div>
    </div>
  );
}
