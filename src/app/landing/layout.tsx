import type { Metadata } from "next";

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
  return <div className="bg-paper text-ink">{children}</div>;
}
