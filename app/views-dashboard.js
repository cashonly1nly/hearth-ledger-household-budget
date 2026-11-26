// Dashboard: November at a glance — the four headline numbers, where the
// money went, the savings goals, the bills still to pay and the latest buys.

import { HOUSEHOLD, CATEGORIES } from "./data.js";
import { state, incomeCents, plannedCents, spentCents, remainingCents, spentByCategory } from "./store.js";
import { money, moneyRound, pct, shortDate } from "./format.js";
import { esc, statCard } from "./html.js";
import { drawDonut } from "./charts.js";

export function renderDashboard(view) {
  const spent = spentCents();
  const income = incomeCents();
  const planned = plannedCents();
  const left = remainingCents();
  const byCat = spentByCategory();
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: byCat[c.id] || 0 }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);

  const latest = [...state.expenses].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const unpaid = state.bills.filter((b) => !b.paid);
  const topGoal = [...state.goals].sort((a, b) => (b.savedCents / b.targetCents) - (a.savedCents / a.targetCents))[0];

  view.innerHTML =
    '<div class="page-head">' +
      "<h1>November at a glance</h1>" +
      "<p>" + esc(HOUSEHOLD.members) + ". Take-home pay this month is <strong>" + money(income) +
      "</strong>, the plan sets aside <strong>" + money(planned) +
      "</strong>, and <strong>" + money(left) + "</strong> is still unspent.</p>" +
    "</div>" +

    '<div class="stat-row">' +
      statCard("Take-home pay", moneyRound(income), "Maya $4,100 · Jordan $3,750") +
      statCard("Spent so far", moneyRound(spent), pct(spent, income) + "% of take-home pay", spent > planned ? "warn" : "") +
      statCard("Planned", moneyRound(planned), "Across " + CATEGORIES.length + " categories") +
      statCard("Still to spend", moneyRound(left), left >= 0 ? "On track for the month" : "Over the month's income", left >= 0 ? "good" : "warn") +
    "</div>" +

    '<div class="grid grid-main" style="margin-top:16px">' +
      '<section class="card" aria-label="Where the money went">' +
        "<h2>Where the money went</h2>" +
        '<p class="lede">Spending by category, from the expense list. Housing is the biggest slice, as it should be.</p>' +
        '<div class="chart-wrap"><canvas class="chart" id="donut" role="img" aria-label="Donut chart of spending by category"></canvas>' +
        '<div class="chart-center"><div><b>' + moneyRound(spent) + '</b><span>spent in Nov</span></div></div></div>' +
        '<p class="legend">' + slices.slice(0, 5).map((s) => "<span>" + esc(s.label) + " " + moneyRound(s.value) + "</span>").join("") + "</p>" +
      "</section>" +

      '<section class="card" aria-label="Closest savings goal">' +
        "<h2>Closest to done</h2>" +
        '<p class="lede">The savings goal nearest its target.</p>' +
        "<p><strong>" + esc(topGoal.name) + "</strong> — " + money(topGoal.savedCents) + " of " + money(topGoal.targetCents) + " saved.</p>" +
        '<div class="bar-track"><div class="bar-fill" style="width:' + pct(topGoal.savedCents, topGoal.targetCents) + '%"></div></div>' +
        '<p style="margin-top:10px"><a href="#/goals">See all savings goals &rarr;</a></p>' +
        "<h3 style=\"margin-top:18px\">Bills still to pay</h3>" +
        (unpaid.length
          ? '<ul class="plain">' + unpaid.map((b) =>
              "<li><span>" + esc(b.name) + '<span class="meta">due the ' + esc(b.due) + "</span></span>" +
              '<span class="money">' + money(b.cents) + "</span></li>").join("") + "</ul>"
          : '<p class="empty">Every bill this month is paid. Nice work.</p>') +
      "</section>" +
    "</div>" +

    '<div class="grid grid-2" style="margin-top:16px">' +
      '<section class="card" aria-label="Latest expenses">' +
        "<h2>Latest expenses</h2>" +
        '<p class="lede">The five most recent purchases.</p>' +
        '<ul class="plain">' + latest.map((row) =>
          "<li><span>" + esc(row.note) + '<span class="meta">' + shortDate(row.date) + " · " + esc(CATEGORIES.find((c) => c.id === row.category).label) + "</span></span>" +
          '<span class="money">' + money(row.cents) + "</span></li>").join("") + "</ul>" +
        '<p style="margin-top:12px"><a href="#/expenses">Open the expense tracker &rarr;</a></p>' +
      "</section>" +

      '<section class="card" aria-label="How the month is shaping up">' +
        "<h2>How the month is shaping up</h2>" +
        '<p class="lede">Three numbers worth a glance before the weekend.</p>' +
        "<p><strong>" + money(income - spent) + "</strong> would be left if spending stopped today — " +
          "and the plan still holds <strong>" + money(planned - spent) + "</strong> of unspent plan.</p>" +
        "<p>Groceries are the category to watch: " + money(byCat.groceries || 0) + " spent of " +
          money(state.plan.groceries) + " planned, with one weekly shop still to go.</p>" +
        '<p><a href="#/insights">See six months of insights &rarr;</a> &middot; <a href="#/guide">Read the budget guide &rarr;</a></p>' +
      "</section>" +
    "</div>";

  drawDonut(view.querySelector("#donut"), slices);
}
