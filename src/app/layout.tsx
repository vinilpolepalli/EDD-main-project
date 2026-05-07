import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
  variable: "--font-newsreader",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CashQuest — Financial literacy, gamified",
  description:
    "CashQuest is the gamified way kids learn personal finance — earning, saving, budgeting, and investing through quests built for how they actually think.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
        <body className="font-sans antialiased bg-paper text-ink min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
