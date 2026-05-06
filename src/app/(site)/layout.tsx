import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${nunito.variable} font-sans antialiased min-h-screen flex flex-col`}
    >
      <main className="flex-1">{children}</main>
      <footer className="py-3 px-4 text-center text-xs text-muted-foreground border-t border-border">
        All game content and financial advice is for educational purposes only
        and does not constitute professional financial advice.
      </footer>
    </div>
  );
}
