// The Ellison household's November 2026 figures. A fictional family of four —
// Maya (teacher) and Jordan (nurse), with Leo, 7, and June, 4 — keeping one
// budget for the whole house. All money is stored in cents.

export const HOUSEHOLD = {
  name: "The Ellison household",
  month: "2026-11",
  monthLabel: "November 2026",
  members: "Maya & Jordan, with Leo (7) and June (4)",
  income: [
    { source: "Maya — teaching salary", cents: 410000 },
    { source: "Jordan — nursing shifts", cents: 375000 },
  ],
};

export const CATEGORIES = [
  { id: "housing", label: "Housing", kind: "need" },
  { id: "groceries", label: "Groceries", kind: "need" },
  { id: "transport", label: "Transport", kind: "need" },
  { id: "utilities", label: "Utilities", kind: "need" },
  { id: "childcare", label: "Childcare", kind: "need" },
  { id: "health", label: "Health", kind: "need" },
  { id: "dining", label: "Eating out", kind: "want" },
  { id: "fun", label: "Fun & treats", kind: "want" },
  { id: "clothing", label: "Clothing", kind: "want" },
  { id: "household", label: "Household", kind: "want" },
  { id: "subscriptions", label: "Subscriptions", kind: "want" },
];

// The monthly plan: what the Ellisons mean to spend in each category.
export const PLAN = {
  housing: 195000,
  groceries: 72000,
  transport: 38000,
  utilities: 31000,
  childcare: 64000,
  health: 15000,
  dining: 26000,
  fun: 18000,
  clothing: 12000,
  household: 14000,
  subscriptions: 8500,
};

// What the household actually spent so far in November, one row per purchase.
export const EXPENSES = [
  { id: "e01", date: "2026-11-01", category: "housing", note: "Rent — November", cents: 195000 },
  { id: "e02", date: "2026-11-02", category: "groceries", note: "Weekly shop — Green Mart", cents: 16840 },
  { id: "e03", date: "2026-11-03", category: "transport", note: "Bus passes for Maya & Jordan", cents: 11200 },
  { id: "e04", date: "2026-11-04", category: "childcare", note: "After-school club — Leo", cents: 16000 },
  { id: "e05", date: "2026-11-06", category: "dining", note: "Pizza night with the kids", cents: 4250 },
  { id: "e06", date: "2026-11-07", category: "groceries", note: "Weekly shop — Green Mart", cents: 15475 },
  { id: "e07", date: "2026-11-08", category: "fun", note: "Cinema — Leo's birthday pick", cents: 3890 },
  { id: "e08", date: "2026-11-09", category: "utilities", note: "Electric bill", cents: 12800 },
  { id: "e09", date: "2026-11-10", category: "health", note: "June's dentist check-up", cents: 6500 },
  { id: "e10", date: "2026-11-11", category: "transport", note: "Fuel — family car", cents: 5230 },
  { id: "e11", date: "2026-11-12", category: "subscriptions", note: "Streaming + music", cents: 2890 },
  { id: "e12", date: "2026-11-13", category: "groceries", note: "Weekly shop — Green Mart", cents: 17110 },
  { id: "e13", date: "2026-11-14", category: "clothing", note: "Winter coats for the kids", cents: 9850 },
  { id: "e14", date: "2026-11-15", category: "household", note: "Light bulbs, batteries, mop", cents: 3425 },
  { id: "e15", date: "2026-11-16", category: "dining", note: "Takeaway — late shift night", cents: 3640 },
  { id: "e16", date: "2026-11-17", category: "fun", note: "Board game for family night", cents: 2490 },
  { id: "e17", date: "2026-11-18", category: "childcare", note: "Nursery — June, week 3", cents: 16000 },
  { id: "e18", date: "2026-11-19", category: "groceries", note: "Weekly shop — Green Mart", cents: 15980 },
  { id: "e19", date: "2026-11-20", category: "transport", note: "Fuel — family car", cents: 4875 },
  { id: "e20", date: "2026-11-21", category: "utilities", note: "Internet + phone", cents: 14900 },
  { id: "e21", date: "2026-11-22", category: "dining", note: "Lunch out after Leo's match", cents: 5120 },
  { id: "e22", date: "2026-11-23", category: "household", note: "Laundry detergent & soap", cents: 2180 },
  { id: "e23", date: "2026-11-24", category: "health", note: "Pharmacy — cough syrup, vitamins", cents: 2840 },
  { id: "e24", date: "2026-11-25", category: "groceries", note: "Thanksgiving food shop", cents: 21330 },
  { id: "e25", date: "2026-11-25", category: "fun", note: "Thanksgiving movie rental", cents: 1490 },
];

export const GOALS = [
  {
    id: "g-car",
    name: "New family car",
    why: "The old hatchback is on its last legs — a reliable replacement before winter.",
    targetCents: 900000,
    savedCents: 540000,
    monthlyCents: 45000,
  },
  {
    id: "g-trip",
    name: "Summer holiday by the coast",
    why: "Two weeks near the sea next July, with a cottage the kids can run around in.",
    targetCents: 240000,
    savedCents: 115000,
    monthlyCents: 20000,
  },
  {
    id: "g-cushion",
    name: "Emergency cushion",
    why: "Three months of essentials, so a broken boiler or a missed shift never becomes a crisis.",
    targetCents: 600000,
    savedCents: 480000,
    monthlyCents: 30000,
  },
  {
    id: "g-gifts",
    name: "Birthdays & Christmas",
    why: "June turns five in December — presents, a cake, and a small party at home.",
    targetCents: 80000,
    savedCents: 52000,
    monthlyCents: 14000,
  },
];

export const BILLS = [
  { name: "Rent", cents: 195000, due: "1st", paid: true },
  { name: "Electric", cents: 12800, due: "9th", paid: true },
  { name: "Internet & phone", cents: 14900, due: "21st", paid: true },
  { name: "Car insurance", cents: 14200, due: "27th", paid: false },
  { name: "Water", cents: 5400, due: "28th", paid: false },
];

export const HISTORY = [
  { month: "2026-06", incomeCents: 785000, spentCents: 612000 },
  { month: "2026-07", incomeCents: 785000, spentCents: 638000 },
  { month: "2026-08", incomeCents: 785000, spentCents: 659000 },
  { month: "2026-09", incomeCents: 785000, spentCents: 624000 },
  { month: "2026-10", incomeCents: 785000, spentCents: 647000 },
  { month: "2026-11", incomeCents: 785000, spentCents: 0 }, // filled in live from the expense list
];

export function categoryLabel(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}
