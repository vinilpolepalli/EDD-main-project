import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "CashQuest — Learn Money, Level Up!",
  description:
    "A fun financial literacy game for kids aged 10-14. Learn about credit, taxes, budgeting, and more!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-1">{children}</main>
        <footer className="py-3 px-4 text-center text-xs text-muted-foreground border-t border-border">
          All game content and financial advice is for educational purposes only
          and does not constitute professional financial advice.
        </footer>
      </body>
    </html>
  );
}
