// Insights: six months of spending on one bar chart, the categories ranked
// for November, and three plain-language takeaways computed from the numbers.

import { HOUSEHOLD, CATEGORIES } from "./data.js";
import { state, monthHistory, spentByCategory, incomeCents, spentCents } from "./store.js";
import { money, moneyRound, monthName, pct } from "./format.js";
import { esc } from "./html.js";
import { drawBars } from "./charts.js";

const SHORT_MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export function renderInsights(view) {
  const months = monthHistory().map((row, i) => ({
    ...row,
    short: SHORT_MONTHS[i] || row.month.slice(5),
    savedCents: row.incomeCents - row.spentCents,
  }));
  const byCat = spentByCategory();
  const ranked = CATEGORIES.map((c) => ({ label: c.label, plan: state.plan[c.id] || 0, spent: byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);

  const totalSpent6 = months.reduce((s, m) => s + m.spentCents, 0);
  const avgSpent = Math.round(totalSpent6 / months.length);
  const bestMonth = months.reduce((best, m) => (m.spentCents < best.spentCents ? m : best), months[0]);
  const worstMonth = months.reduce((worst, m) => (m.spentCents > worst.spentCents ? m : worst), months[0]);
  const november = months[months.length - 1];
  const overPlan = ranked.filter((c) => c.spent > c.plan);

  const rows = ranked.map((c, i) =>
    "<tr><td>" + (i + 1) + "</td><td><strong>" + esc(c.label) + "</strong></td>" +
    '<td class="num">' + money(c.spent) + '</td><td class="num">' + money(c.plan) + '</td>' +
    '<td class="num">' + money(c.plan - c.spent) + "</td></tr>",
  ).join("");

  view.innerHTML =
    '<div class="page-head">' +
      "<h1>Six months of insights</h1>" +
      "<p>June to November 2026. Spending averaged <strong>" + money(avgSpent) + " a month</strong> " +
      "against take-home pay of <strong>" + money(incomeCents()) + "</strong> — the household saved " +
      "about <strong>" + money(incomeCents() - avgSpent) + " a month</strong> on average.</p>" +
    "</div>" +

    '<section class="card" aria-label="Monthly spending chart">' +
      "<h2>Spending by month</h2>" +
      '<p class="lede">Total spent each month. November (amber) is live — it moves as expenses are added or removed.</p>' +
      '<canvas class="chart" id="bars" role="img" aria-label="Bar chart of monthly spending, June to November 2026"></canvas>' +
      '<table style="margin-top:10px"><thead><tr><th>Month</th><th class="num">Spent</th><th class="num">Saved</th><th class="num">Saved %</th></tr></thead><tbody>' +
      months.map((m) =>
        "<tr><td>" + esc(monthName(m.month)) + "</td>" +
        '<td class="num">' + money(m.spentCents) + '</td><td class="num">' + money(m.savedCents) + '</td>' +
        '<td class="num">' + pct(m.savedCents, m.incomeCents) + "%</td></tr>",
      ).join("") +
      "</tbody></table>" +
    "</section>" +

    '<div class="grid grid-2" style="margin-top:16px">' +
      '<section class="card" aria-label="Category ranking">' +
        "<h2>November ranked</h2>" +
        '<p class="lede">Every category, biggest spend first, against its plan.</p>' +
        '<table><thead><tr><th>#</th><th>Category</th><th class="num">Spent</th><th class="num">Planned</th><th class="num">Left</th></tr></thead>' +
        "<tbody>" + rows + "</tbody></table>" +
      "</section>" +

      '<section class="card" aria-label="What the numbers say">' +
        "<h2>What the numbers say</h2>" +
        "<p><strong>1. " + esc(monthName(bestMonth.month)) + " was the cheapest month</strong> at " + money(bestMonth.spentCents) +
        ", and " + esc(monthName(worstMonth.month)) + " the dearest at " + money(worstMonth.spentCents) +
        ". The gap is " + money(worstMonth.spentCents - bestMonth.spentCents) +
        " — mostly groceries and one-off household buys, not a change in lifestyle.</p>" +
        (overPlan.length
          ? "<p><strong>2. " + overPlan.length + " categor" + (overPlan.length === 1 ? "y is" : "ies are") + " over plan:</strong> " +
            overPlan.map((c) => esc(c.label) + " by " + money(c.spent - c.plan)).join(", ") +
            ". Small overspends are fine when the month's total still fits — the total is the number that matters.</p>"
          : "<p><strong>2. Nothing is over plan.</strong> Every category is inside its November amount, with " +
            money(incomeCents() - spentCents()) + " of income still unspent.</p>") +
        "<p><strong>3. November is " + (november.spentCents > avgSpent ? "running hotter than average" : "running cooler than average") +
        "</strong> — " + money(november.spentCents) + " against a six-month average of " + money(avgSpent) +
        ". Thanksgiving week always lifts the grocery bill; the plan already expects it.</p>" +
        '<p><a href="#/planner">Adjust the plan &rarr;</a> &middot; <a href="#/expenses">Review the expenses &rarr;</a></p>' +
      "</section>" +
    "</div>";

  drawBars(view.querySelector("#bars"), months);
}
