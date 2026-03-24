import type { LifeEvent } from "@/types/game";

/**
 * Catalog of all possible life events in the Life Simulator.
 *
 * Events are categorized as positive, negative, or neutral.
 * Probabilities are per-month chances (0.05 = 5% chance each month).
 * Balance effects are in dollars. Credit score and happiness are point changes.
 *
 * These events teach kids that real life has unexpected costs AND windfalls.
 * The key lesson: having savings (an emergency fund) protects you from
 * negative events, and good financial habits attract positive outcomes.
 */
export const LIFE_EVENTS: readonly LifeEvent[] = [
  // -------------------------------------------------------------------------
  // Positive Events
  // -------------------------------------------------------------------------
  {
    id: "tax-refund",
    name: "Tax Refund",
    description:
      "You filed your taxes and got money back from the government! This happens when you paid more taxes than you owed during the year.",
    category: "positive",
    balanceEffect: 500,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "job-bonus",
    name: "Job Bonus",
    description:
      "Your boss noticed your hard work and gave you a bonus! Doing a great job can lead to extra pay.",
    category: "positive",
    balanceEffect: 800,
    creditScoreEffect: 0,
    happinessEffect: 10,
    probability: 0.07,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "found-money",
    name: "Found Money",
    description:
      "You found $20 on the ground while walking to the store! It's a small surprise, but every dollar counts.",
    category: "positive",
    balanceEffect: 20,
    creditScoreEffect: 0,
    happinessEffect: 3,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "investment-win",
    name: "Investment Win",
    description:
      "The stocks you invested in went up! Investing can grow your money over time, though it doesn't always go up.",
    category: "positive",
    balanceEffect: 300,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.1,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "birthday-gift",
    name: "Birthday Gift",
    description:
      "Happy birthday! Grandma sent you some birthday money. What a nice surprise!",
    category: "positive",
    balanceEffect: 100,
    creditScoreEffect: 0,
    happinessEffect: 8,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "garage-sale",
    name: "Garage Sale",
    description:
      "You held a garage sale and sold a bunch of old stuff you didn't need anymore. One person's trash is another person's treasure!",
    category: "positive",
    balanceEffect: 150,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "credit-score-boost",
    name: "Credit Score Boost",
    description:
      "You've been paying all your bills on time and your credit score went up! Lenders trust you more now.",
    category: "positive",
    balanceEffect: 0,
    creditScoreEffect: 30,
    happinessEffect: 5,
    probability: 0.1,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "cashback-reward",
    name: "Cashback Reward",
    description:
      "Your credit card gave you cashback on purchases you already made. Using credit responsibly has its perks!",
    category: "positive",
    balanceEffect: 75,
    creditScoreEffect: 5,
    happinessEffect: 4,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "freelance-gig",
    name: "Freelance Gig",
    description:
      "A friend asked you to help with a project and paid you for it. Side jobs are a great way to earn extra money!",
    category: "positive",
    balanceEffect: 250,
    creditScoreEffect: 0,
    happinessEffect: 6,
    probability: 0.07,
    minAge: 18,
    maxAge: 65,
  },

  // -------------------------------------------------------------------------
  // Negative Events
  // -------------------------------------------------------------------------
  {
    id: "flat-tire",
    name: "Flat Tire",
    description:
      "Your car got a flat tire and you need to buy a new one. Unexpected car repairs are one of the most common surprise expenses.",
    category: "negative",
    balanceEffect: -200,
    creditScoreEffect: 0,
    happinessEffect: -5,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "medical-bill",
    name: "Medical Bill",
    description:
      "You had to visit the doctor and the bill was expensive. This is why having health insurance and an emergency fund is so important.",
    category: "negative",
    balanceEffect: -500,
    creditScoreEffect: 0,
    happinessEffect: -10,
    probability: 0.07,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "phone-broke",
    name: "Phone Broke",
    description:
      "You dropped your phone and the screen cracked! Getting it fixed or replaced costs a lot.",
    category: "negative",
    balanceEffect: -300,
    creditScoreEffect: 0,
    happinessEffect: -8,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "parking-ticket",
    name: "Parking Ticket",
    description:
      "You forgot to feed the parking meter and got a ticket. Small mistakes can cost you money!",
    category: "negative",
    balanceEffect: -75,
    creditScoreEffect: 0,
    happinessEffect: -3,
    probability: 0.1,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "appliance-broke",
    name: "Appliance Broke",
    description:
      "Your washing machine stopped working and needs to be replaced. Big appliances are expensive!",
    category: "negative",
    balanceEffect: -400,
    creditScoreEffect: 0,
    happinessEffect: -5,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "identity-theft-scare",
    name: "Identity Theft Scare",
    description:
      "Someone tried to use your personal information to open a credit card! You caught it in time, but your credit score took a hit. Always protect your personal info.",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: -20,
    happinessEffect: -15,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "late-payment",
    name: "Late Payment",
    description:
      "You forgot to pay a bill on time and got charged a late fee. Late payments also hurt your credit score. Setting up reminders can help!",
    category: "negative",
    balanceEffect: -50,
    creditScoreEffect: -15,
    happinessEffect: -5,
    probability: 0.1,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "pet-emergency",
    name: "Pet Emergency",
    description:
      "Your pet got sick and needed an emergency vet visit. Pets are family, but their care can be expensive.",
    category: "negative",
    balanceEffect: -350,
    creditScoreEffect: 0,
    happinessEffect: -10,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "home-repair",
    name: "Home Repair",
    description:
      "Your roof started leaking and needs to be fixed. Home ownership comes with maintenance costs that can pop up anytime.",
    category: "negative",
    balanceEffect: -600,
    creditScoreEffect: 0,
    happinessEffect: -8,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "speeding-ticket",
    name: "Speeding Ticket",
    description:
      "You were driving too fast and got pulled over. The fine plus higher insurance will cost you.",
    category: "negative",
    balanceEffect: -150,
    creditScoreEffect: 0,
    happinessEffect: -6,
    probability: 0.07,
    minAge: 18,
    maxAge: 65,
  },

  // -------------------------------------------------------------------------
  // Neutral Events
  // -------------------------------------------------------------------------
  {
    id: "new-neighbor",
    name: "New Neighbor",
    description:
      "Someone new moved in next door! They seem really friendly. Having good neighbors makes life nicer.",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 3,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "free-concert",
    name: "Free Concert",
    description:
      "A friend had an extra ticket to a concert and invited you for free! Great experiences don't always have to cost money.",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "library-card",
    name: "Library Card",
    description:
      "You got a library card and discovered tons of free books, movies, and classes. Libraries are an amazing free resource!",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "meal-prep-week",
    name: "Meal Prep Week",
    description:
      "You cooked all your meals at home this week instead of eating out. You saved money AND ate healthier!",
    category: "neutral",
    balanceEffect: 50,
    creditScoreEffect: 0,
    happinessEffect: 3,
    probability: 0.1,
    minAge: 18,
    maxAge: 65,
  },
  {
    id: "rainy-day",
    name: "Rainy Day",
    description:
      "It rained all weekend so you stayed home, watched movies, and didn't spend any money. Sometimes a cozy day in saves you cash!",
    category: "neutral",
    balanceEffect: 30,
    creditScoreEffect: 0,
    happinessEffect: 2,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },
] as const;
