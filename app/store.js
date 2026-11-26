// HearthLedger's in-memory store. One copy of the truth: the plan, the expense
// list and the goals. Everything on screen is derived from here, so every
// control that changes state re-renders the totals at once. Nothing is saved
// to the browser and nothing leaves the page — refresh restores November.

import { HOUSEHOLD, PLAN, EXPENSES, GOALS, BILLS, HISTORY, CATEGORIES } from "./data.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export const state = {
  plan: clone(PLAN),
  expenses: clone(EXPENSES),
  goals: clone(GOALS),
  bills: clone(BILLS),
  history: clone(HISTORY),
  nextExpense: 100,
};

export function incomeCents() {
  return HOUSEHOLD.income.reduce((sum, row) => sum + row.cents, 0);
}

export function plannedCents() {
  return Object.values(state.plan).reduce((sum, cents) => sum + cents, 0);
}

export function spentCents() {
  return state.expenses.reduce((sum, row) => sum + row.cents, 0);
}

export function spentByCategory() {
  const totals = {};
  for (const cat of CATEGORIES) totals[cat.id] = 0;
  for (const row of state.expenses) {
    if (totals[row.category] === undefined) totals[row.category] = 0;
    totals[row.category] += row.cents;
  }
  return totals;
}

export function remainingCents() {
  return incomeCents() - spentCents();
}

export function plannedRemainingCents() {
  return incomeCents() - plannedCents();
}

export function savedThisMonthCents() {
  return incomeCents() - spentCents();
}

export function splitCents() {
  const spent = spentByCategory();
  const needs = CATEGORIES.filter((c) => c.kind === "need")
    .reduce((sum, c) => sum + (spent[c.id] || 0), 0);
  const wants = CATEGORIES.filter((c) => c.kind === "want")
    .reduce((sum, c) => sum + (spent[c.id] || 0), 0);
  const saved = Math.max(0, incomeCents() - spentCents());
  return { needs, wants, saved };
}

export function monthHistory() {
  return state.history.map((row) => {
    if (row.month === HOUSEHOLD.month) {
      return { ...row, spentCents: spentCents() };
    }
    return row;
  });
}

export function setPlan(categoryId, cents) {
  if (cents === null || cents < 0) return false;
  state.plan[categoryId] = cents;
  return true;
}

export function addExpense({ date, category, note, cents }) {
  if (!date || !category || !note.trim() || cents === null || cents <= 0) return null;
  const row = {
    id: "e" + state.nextExpense++,
    date,
    category,
    note: note.trim(),
    cents,
  };
  state.expenses.push(row);
  state.expenses.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return row;
}

export function removeExpense(id) {
  const before = state.expenses.length;
  state.expenses = state.expenses.filter((row) => row.id !== id);
  return state.expenses.length !== before;
}

export function addContribution(goalId, cents) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal || cents === null || cents <= 0) return false;
  goal.savedCents = Math.min(goal.targetCents, goal.savedCents + cents);
  return true;
}

export function addGoal({ name, targetCents, monthlyCents }) {
  if (!name.trim() || targetCents === null || targetCents <= 0) return null;
  const goal = {
    id: "g" + Date.now().toString(36),
    name: name.trim(),
    why: "A new goal the household just started.",
    targetCents,
    savedCents: 0,
    monthlyCents: monthlyCents && monthlyCents > 0 ? monthlyCents : 0,
  };
  state.goals.push(goal);
  return goal;
}
