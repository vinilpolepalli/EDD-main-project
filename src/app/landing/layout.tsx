import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";

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

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${newsreader.variable} ${inter.variable} font-rogo-sans antialiased bg-rogo-paper text-rogo-ink min-h-screen`}
    >
      {children}
    </div>
  );
}
