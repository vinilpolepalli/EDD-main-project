import type { LifeEvent } from "@/types/game";

/**
 * Catalog of all possible life events in the Life Simulator.
 *
 * Events come in two flavors:
 *
 * 1. **Auto-apply events** (no `choices` array) — the effect happens
 *    automatically, modeling unavoidable life surprises.
 *
 * 2. **Choice-based events** (`choices` array present) — the player
 *    picks a response. Each option teaches a different financial lesson.
 *    The `balanceEffect` / `creditScoreEffect` / `happinessEffect` on the
 *    event itself are zero because the consequences come from the choice.
 *
 * Probabilities are per-month chances (0.07 = 7% chance each month).
 */
export const LIFE_EVENTS: readonly LifeEvent[] = [
  // =========================================================================
  // CHOICE-BASED EVENTS
  // These are the BitLife-style decision points that teach financial literacy
  // through player agency.
  // =========================================================================

  {
    id: "car-breakdown",
    name: "Car Breakdown",
    description:
      "Your car broke down on the highway. The mechanic says it'll cost $800 to fix.",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.07,
    minAge: 20,
    maxAge: 65,
    choices: [
      {
        id: "pay-cash",
        label: "Pay Cash ($800)",
        explanation:
          "Paying upfront avoids interest charges. Emergency funds exist for exactly this!",
        effects: { balance: -800, creditScore: 3 },
      },
      {
        id: "credit-card",
        label: "Charge Credit Card",
        explanation:
          "Convenient now, but credit card debt at 20%+ APR means this $800 repair could cost over $1,000 long-term.",
        effects: { debt: 800, creditScore: -8 },
      },
      {
        id: "ignore",
        label: "Ignore It",
        explanation:
          "Ignoring car problems leads to bigger, more expensive breakdowns later. A $800 fix becomes $1,500!",
        effects: { happiness: -15, balance: -1500, creditScore: -5 },
      },
    ],
  },

  {
    id: "medical-bill",
    name: "Medical Bill",
    description:
      "You visited the doctor for a persistent cough and the bill is $1,200. Ouch!",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
    choices: [
      {
        id: "pay-full",
        label: "Pay in Full ($1,200)",
        explanation:
          "Paying medical bills promptly keeps your credit clean and avoids collection agencies.",
        effects: { balance: -1200, creditScore: 5, happiness: -5 },
      },
      {
        id: "payment-plan",
        label: "Set Up Payment Plan",
        explanation:
          "Many hospitals offer 0% interest payment plans. Smart move \u2014 you keep cash available for emergencies!",
        effects: { debt: 1200, happiness: -3 },
      },
      {
        id: "skip-payment",
        label: "Skip It & Hope",
        explanation:
          "Unpaid medical bills get sent to collections, destroying your credit score. Never ignore bills!",
        effects: { creditScore: -25, happiness: -10, debt: 1200 },
      },
    ],
  },

  {
    id: "rent-increase",
    name: "Rent Increase",
    description:
      "Your landlord just announced a $200/month rent increase starting next month!",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
    choices: [
      {
        id: "accept",
        label: "Accept the Increase",
        explanation:
          "Sometimes rent goes up and you absorb the cost. Budget for it!",
        effects: { expensesMod: 200, happiness: -5 },
      },
      {
        id: "find-cheaper",
        label: "Move Somewhere Cheaper",
        explanation:
          "Moving costs money upfront (security deposit, movers), but can save you hundreds per month long-term.",
        effects: { balance: -1500, expensesMod: -100, happiness: -8 },
      },
      {
        id: "negotiate",
        label: "Negotiate with Landlord",
        explanation:
          "Negotiating is a life skill! Sometimes it works, sometimes it doesn't. This time, you got a smaller increase.",
        effects: { expensesMod: 100, happiness: -2 },
      },
    ],
  },

  {
    id: "job-offer",
    name: "Job Offer",
    description:
      "A recruiter called! A different company is offering you $500 more per month than your current job.",
    category: "positive",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.05,
    minAge: 22,
    maxAge: 60,
    choices: [
      {
        id: "accept-offer",
        label: "Accept the Offer",
        explanation:
          "New job, higher pay! Switching jobs is one of the fastest ways to increase your salary in real life.",
        effects: { salaryMod: 500, happiness: 5 },
      },
      {
        id: "stay-loyal",
        label: "Stay at Current Job",
        explanation:
          "Loyalty can pay off through promotions and relationships, but sometimes staying means leaving money on the table.",
        effects: { happiness: 3 },
      },
      {
        id: "counter-offer",
        label: "Ask for a Counter-Offer",
        explanation:
          "Using a competing offer to negotiate a raise is a proven strategy. Your boss matched part of it!",
        effects: { salaryMod: 300, happiness: 8 },
      },
    ],
  },

  {
    id: "friend-borrow-money",
    name: "Friend Needs Money",
    description:
      "Your close friend asks to borrow $500 because they're short on rent this month.",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
    choices: [
      {
        id: "lend-money",
        label: "Lend the $500",
        explanation:
          "Helping friends is kind, but mixing money and friendships is risky. Only lend what you can afford to lose.",
        effects: { balance: -500, happiness: 8 },
      },
      {
        id: "decline",
        label: "Politely Decline",
        explanation:
          "It's okay to say no. Protecting your finances isn't selfish \u2014 it's responsible. Suggest they look into community resources.",
        effects: { happiness: -5 },
      },
    ],
  },

  {
    id: "stock-market-crash",
    name: "Stock Market Crash!",
    description:
      "Breaking news: the stock market dropped 30% overnight! Your investments are way down.",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
    choices: [
      {
        id: "sell-everything",
        label: "Panic Sell Everything",
        explanation:
          "Selling during a crash locks in your losses! Historically, markets recover \u2014 patience is key.",
        effects: { investments: -5000, happiness: -15, creditScore: -3 },
      },
      {
        id: "hold-steady",
        label: "Hold & Wait",
        explanation:
          "Smart move! 'Time in the market beats timing the market.' Your investments will likely recover over months.",
        effects: { investments: -2000, happiness: -5 },
      },
      {
        id: "buy-more",
        label: "Buy More at Low Prices",
        explanation:
          "Buying during a dip is called 'buying low.' If the market recovers, you'll see bigger gains. Bold strategy!",
        effects: { balance: -500, investments: -1000, happiness: -3 },
      },
    ],
  },

  {
    id: "unexpected-inheritance",
    name: "Unexpected Inheritance",
    description:
      "A distant relative you barely knew left you $3,000 in their will. What will you do with it?",
    category: "positive",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.03,
    minAge: 18,
    maxAge: 65,
    choices: [
      {
        id: "invest-it",
        label: "Invest All of It",
        explanation:
          "Investing a windfall lets compound interest work its magic. In 10 years at 8%, this could become $6,500!",
        effects: { investments: 3000, happiness: 5 },
      },
      {
        id: "spend-it",
        label: "Treat Yourself!",
        explanation:
          "Spending windfalls feels great in the moment, but you miss out on long-term growth. Balance is key!",
        effects: { balance: 3000, happiness: 15 },
      },
      {
        id: "pay-debt",
        label: "Pay Off Debt",
        explanation:
          "Using windfalls to eliminate high-interest debt saves you money on interest payments. Very smart!",
        effects: { debt: -3000, creditScore: 10, happiness: 8 },
      },
    ],
  },

  {
    id: "health-insurance-enrollment",
    name: "Health Insurance Open Enrollment",
    description:
      "It's open enrollment season. You can change your health insurance plan.",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
    choices: [
      {
        id: "upgrade",
        label: "Upgrade Plan (+$150/mo)",
        explanation:
          "Better coverage costs more monthly, but protects you from huge surprise medical bills. Insurance is protection!",
        effects: { expensesMod: 150, happiness: 5 },
      },
      {
        id: "downgrade",
        label: "Downgrade Plan (-$100/mo)",
        explanation:
          "Saving on premiums is risky \u2014 if something bad happens, you'll pay much more out-of-pocket.",
        effects: { expensesMod: -100, happiness: -3 },
      },
      {
        id: "keep-current",
        label: "Keep Current Plan",
        explanation:
          "If your current plan works for you, sticking with it avoids the hassle of switching.",
        effects: { happiness: 2 },
      },
    ],
  },

  {
    id: "performance-review",
    name: "Performance Review",
    description:
      "Your annual performance review is coming up. Your boss says you've been doing well.",
    category: "positive",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.06,
    minAge: 22,
    maxAge: 65,
    choices: [
      {
        id: "ask-raise",
        label: "Ask for a Raise",
        explanation:
          "Advocating for yourself is important! Research shows people who negotiate earn 7% more on average.",
        effects: { salaryMod: 400, happiness: 10 },
      },
      {
        id: "accept-quietly",
        label: "Accept Positive Feedback",
        explanation:
          "Good feedback is nice, but without asking for a raise, your salary stays the same. Don't leave money on the table!",
        effects: { happiness: 5 },
      },
      {
        id: "look-elsewhere",
        label: "Start Job Hunting",
        explanation:
          "Using your good review as leverage elsewhere can lead to a bigger jump, but job hunting takes time and energy.",
        effects: { salaryMod: 600, happiness: -3, balance: -200 },
      },
    ],
  },

  {
    id: "housing-opportunity",
    name: "Housing Opportunity",
    description:
      "You found a home for sale in your area. The mortgage would be similar to your rent. Should you buy?",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.03,
    minAge: 25,
    maxAge: 55,
    choices: [
      {
        id: "buy-home",
        label: "Buy the Home",
        explanation:
          "Homeownership builds equity (you own something!), but comes with maintenance costs, taxes, and a long commitment.",
        effects: {
          balance: -5000,
          debt: 20000,
          happiness: 10,
          creditScore: 5,
          expensesMod: 200,
        },
      },
      {
        id: "keep-renting",
        label: "Keep Renting",
        explanation:
          "Renting gives flexibility and no maintenance worries. Neither option is always better \u2014 it depends on your situation!",
        effects: { happiness: 2 },
      },
    ],
  },

  {
    id: "subscription-trap",
    name: "Subscription Overload",
    description:
      "You just realized you're paying for 6 different streaming services, gym, and meal kits. That's $180/month!",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 0,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
    choices: [
      {
        id: "cancel-most",
        label: "Cancel Most of Them",
        explanation:
          "Subscription audits save hundreds per year! Keep only what you actually use regularly.",
        effects: { expensesMod: -120, happiness: -3 },
      },
      {
        id: "keep-all",
        label: "Keep Everything",
        explanation:
          "Convenience is nice, but subscription creep is one of the biggest budget leaks. $180/month = $2,160/year!",
        effects: { expensesMod: 50, happiness: 3 },
      },
      {
        id: "downgrade-plans",
        label: "Downgrade to Cheaper Tiers",
        explanation:
          "Smart compromise! Many services offer cheaper tiers with ads. You keep access while saving money.",
        effects: { expensesMod: -60, happiness: 1 },
      },
    ],
  },

  // =========================================================================
  // AUTO-APPLY POSITIVE EVENTS
  // These happen automatically — modeling unavoidable windfalls.
  // =========================================================================

  {
    id: "tax-refund",
    name: "Tax Refund!",
    description:
      "You filed your taxes and got money back! This happens when you paid more taxes than you owed during the year.",
    category: "positive",
    balanceEffect: 600,
    creditScoreEffect: 0,
    happinessEffect: 8,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "promotion",
    name: "Promotion!",
    description:
      "Your hard work paid off \u2014 you got promoted! Your salary just went up permanently.",
    category: "positive",
    balanceEffect: 500,
    creditScoreEffect: 5,
    happinessEffect: 15,
    probability: 0.04,
    minAge: 22,
    maxAge: 60,
  },

  {
    id: "side-gig",
    name: "Side Gig",
    description:
      "A friend asked you to help with a freelance project and paid you $250! Side income is a great way to boost savings.",
    category: "positive",
    balanceEffect: 250,
    creditScoreEffect: 0,
    happinessEffect: 6,
    probability: 0.07,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "insurance-discount",
    name: "Insurance Discount",
    description:
      "Your car insurance company gave you a safe-driver discount! You saved $200 this month.",
    category: "positive",
    balanceEffect: 200,
    creditScoreEffect: 0,
    happinessEffect: 4,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "birthday-bonus",
    name: "Birthday Money!",
    description:
      "Happy birthday! Family sent you $300 in birthday money. What a nice surprise!",
    category: "positive",
    balanceEffect: 300,
    creditScoreEffect: 0,
    happinessEffect: 10,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "cashback-reward",
    name: "Cashback Reward",
    description:
      "Your credit card gave you $75 cashback on purchases. Using credit responsibly has its perks!",
    category: "positive",
    balanceEffect: 75,
    creditScoreEffect: 3,
    happinessEffect: 4,
    probability: 0.07,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "credit-score-boost",
    name: "Credit Score Boost",
    description:
      "You've been paying all your bills on time! Lenders trust you more now.",
    category: "positive",
    balanceEffect: 0,
    creditScoreEffect: 20,
    happinessEffect: 5,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "garage-sale",
    name: "Garage Sale Success",
    description:
      "You sold old stuff you didn't need anymore at a garage sale. One person's trash is another's treasure!",
    category: "positive",
    balanceEffect: 150,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "investment-dividend",
    name: "Investment Dividend",
    description:
      "Your investments paid out dividends this quarter! Passive income is money earned while you sleep.",
    category: "positive",
    balanceEffect: 120,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "found-coupon",
    name: "Found a Great Coupon",
    description:
      "You found a 50% off coupon for your grocery shopping this month! Being a savvy shopper saves money.",
    category: "positive",
    balanceEffect: 80,
    creditScoreEffect: 0,
    happinessEffect: 3,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "student-loan-forgiveness",
    name: "Partial Loan Forgiveness",
    description:
      "Great news! A government program forgave $2,000 of your student loans. Loan forgiveness programs exist \u2014 research them!",
    category: "positive",
    balanceEffect: 0,
    creditScoreEffect: 5,
    happinessEffect: 12,
    probability: 0.02,
    minAge: 22,
    maxAge: 40,
  },

  // =========================================================================
  // AUTO-APPLY NEGATIVE EVENTS
  // These happen automatically — modeling unavoidable setbacks.
  // =========================================================================

  {
    id: "job-loss",
    name: "Layoff Notice",
    description:
      "Your company is downsizing and you've been laid off. You'll receive only 40% of your normal income for the next 3 months while you look for a new job.",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: -10,
    happinessEffect: -20,
    probability: 0.03,
    minAge: 22,
    maxAge: 60,
  },

  {
    id: "utility-spike",
    name: "Utility Bill Spike",
    description:
      "Your electricity bill was way higher than usual because of extreme weather. AC and heating are expensive!",
    category: "negative",
    balanceEffect: -120,
    creditScoreEffect: 0,
    happinessEffect: -3,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "grocery-price-increase",
    name: "Grocery Prices Up",
    description:
      "Inflation hit grocery prices hard this month. Your food bill is $90 more than usual. Budgeting for essentials matters!",
    category: "negative",
    balanceEffect: -90,
    creditScoreEffect: 0,
    happinessEffect: -4,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "parking-ticket",
    name: "Parking Ticket",
    description:
      "You forgot to feed the meter and got a $75 parking ticket. Small mistakes cost real money!",
    category: "negative",
    balanceEffect: -75,
    creditScoreEffect: 0,
    happinessEffect: -3,
    probability: 0.09,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "phone-broke",
    name: "Phone Screen Cracked",
    description:
      "You dropped your phone and the screen shattered. Repair costs $300. Accidents happen!",
    category: "negative",
    balanceEffect: -300,
    creditScoreEffect: 0,
    happinessEffect: -8,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "identity-theft-scare",
    name: "Identity Theft Scare",
    description:
      "Someone tried to open a credit card using your info! You caught it in time, but your credit score took a hit. Always protect your personal information!",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: -20,
    happinessEffect: -15,
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "late-payment",
    name: "Late Bill Payment",
    description:
      "You forgot to pay a bill on time and got a late fee. Late payments hurt your credit score. Set up autopay!",
    category: "negative",
    balanceEffect: -50,
    creditScoreEffect: -15,
    happinessEffect: -5,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "pet-emergency",
    name: "Pet Emergency",
    description:
      "Your pet got sick and needs an emergency vet visit. Pets are family, but vet care can be expensive \u2014 $350!",
    category: "negative",
    balanceEffect: -350,
    creditScoreEffect: 0,
    happinessEffect: -10,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "speeding-ticket",
    name: "Speeding Ticket",
    description:
      "You were driving too fast and got pulled over. The $150 fine plus higher insurance will cost you.",
    category: "negative",
    balanceEffect: -150,
    creditScoreEffect: 0,
    happinessEffect: -6,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "home-repair",
    name: "Home Repair Needed",
    description:
      "Your plumbing burst and flooded the bathroom! $600 repair bill. Homeownership has hidden costs!",
    category: "negative",
    balanceEffect: -600,
    creditScoreEffect: 0,
    happinessEffect: -8,
    probability: 0.05,
    minAge: 22,
    maxAge: 65,
  },

  {
    id: "car-totaled",
    name: "Car Accident",
    description:
      "You were in a fender bender (not your fault, thankfully). But your deductible is $1,000 and you need a rental car too. Total: $1,500.",
    category: "negative",
    balanceEffect: -1500,
    creditScoreEffect: 0,
    happinessEffect: -12,
    probability: 0.03,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "appliance-broke",
    name: "Appliance Breakdown",
    description:
      "Your washing machine stopped working. A replacement costs $400. Big appliances don't last forever!",
    category: "negative",
    balanceEffect: -400,
    creditScoreEffect: 0,
    happinessEffect: -5,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "investment-crash",
    name: "Market Dip",
    description:
      "The stock market had a bad week and your investments lost value. Remember: short-term dips are normal!",
    category: "negative",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: -5,
    probability: 0.06,
    minAge: 18,
    maxAge: 65,
  },

  // =========================================================================
  // AUTO-APPLY NEUTRAL EVENTS
  // These have minimal financial impact but add flavor and life lessons.
  // =========================================================================

  {
    id: "new-neighbor",
    name: "New Neighbor",
    description:
      "Someone friendly moved in next door! Having good neighbors makes life nicer.",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 5,
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "free-concert",
    name: "Free Concert",
    description:
      "A friend had an extra concert ticket and invited you for free! Great experiences don't always cost money.",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 8,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "library-card",
    name: "Library Discovery",
    description:
      "You got a library card and discovered free books, movies, and workshops. Libraries are incredible free resources!",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 6,
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "meal-prep",
    name: "Meal Prep Week",
    description:
      "You cooked all your meals at home instead of eating out. You saved money AND ate healthier!",
    category: "neutral",
    balanceEffect: 50,
    creditScoreEffect: 0,
    happinessEffect: 3,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "holiday-spending",
    name: "Holiday Season",
    description:
      "The holidays are here! You bought gifts for family and friends. Spreading joy costs a bit, but it's worth it.",
    category: "neutral",
    balanceEffect: -200,
    creditScoreEffect: 0,
    happinessEffect: 10,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "rainy-day",
    name: "Rainy Weekend",
    description:
      "It rained all weekend so you stayed home, watched movies, and saved money. Sometimes a cozy day in is the best plan!",
    category: "neutral",
    balanceEffect: 30,
    creditScoreEffect: 0,
    happinessEffect: 4,
    probability: 0.07,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "volunteer-day",
    name: "Volunteer Day",
    description:
      "You volunteered at a local food bank. No money earned, but the happiness and community connection are priceless!",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 10,
    probability: 0.04,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "friend-dinner",
    name: "Dinner with Friends",
    description:
      "You went out to dinner with friends. It cost $45 but the memories are worth it. Social spending has value too!",
    category: "neutral",
    balanceEffect: -45,
    creditScoreEffect: 0,
    happinessEffect: 7,
    probability: 0.08,
    minAge: 18,
    maxAge: 65,
  },

  {
    id: "fitness-challenge",
    name: "Fitness Challenge",
    description:
      "You started a free fitness challenge online! No gym membership needed \u2014 health is wealth!",
    category: "neutral",
    balanceEffect: 0,
    creditScoreEffect: 0,
    happinessEffect: 8,
    probability: 0.05,
    minAge: 18,
    maxAge: 65,
  },
] as const;
