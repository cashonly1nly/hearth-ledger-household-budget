// Savings goals: what the household is saving for, how far along each goal is,
// and a months-to-go calculator that updates as money goes in.

import { state } from "./store.js";
import { money, moneyRound, moneyInput, parseMoney, pct, monthsToGo } from "./format.js";
import { esc } from "./html.js";

export function renderGoals(view) {
  const totalSaved = state.goals.reduce((s, g) => s + g.savedCents, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.targetCents, 0);

  const cards = state.goals.map((goal) => {
    const done = pct(goal.savedCents, goal.targetCents);
    const months = monthsToGo(goal);
    const eta = goal.savedCents >= goal.targetCents
      ? "Reached — time to celebrate, then pick the next goal."
      : months === null
        ? "Set a monthly amount to see when this finishes."
        : months === 0
          ? "Almost there — less than a month to go."
          : "About " + months + " month" + (months === 1 ? "" : "s") + " to go at " + money(goal.monthlyCents) + " a month.";
    return (
      '<article class="card goal-row" aria-label="' + esc(goal.name) + '">' +
        '<div class="goal-head"><b>' + esc(goal.name) + "</b><span class=\"money\">" + money(goal.savedCents) + " of " + money(goal.targetCents) + "</span></div>" +
        '<p class="goal-meta">' + esc(goal.why) + "</p>" +
        '<div class="bar-track"><div class="bar-fill' + (done >= 100 ? "" : done >= 60 ? " amber" : "") + '" style="width:' + Math.min(100, done) + '%"></div></div>' +
        '<p style="margin:8px 0 0"><strong>' + done + '% saved.</strong> ' + esc(eta) + "</p>" +
        '<form class="inline-form" data-contribute="' + goal.id + '">' +
          '<label for="add-' + goal.id + '">Add to this goal ($)</label>' +
          '<input type="number" id="add-' + goal.id + '" min="0.01" step="0.01" inputmode="decimal" placeholder="0.00" required>' +
          '<button class="btn-primary btn-small" type="submit">Add money</button>' +
        "</form>" +
      "</article>"
    );
  }).join("");

  view.innerHTML =
    '<div class="page-head">' +
      "<h1>Savings goals</h1>" +
      "<p>Four things the Ellisons are saving for, worth <strong>" + money(totalTarget) +
      "</strong> altogether. <strong>" + money(totalSaved) + " (" + pct(totalSaved, totalTarget) +
      "%)</strong> is already put aside. Add money to any goal and its months-to-go updates at once.</p>" +
    "</div>" +

    '<div class="grid grid-2">' + cards + "</div>" +

    '<section class="card" style="margin-top:16px" aria-label="Start a new goal">' +
      "<h2>Start a new goal</h2>" +
      '<p class="lede">Name it, set the target, and say what the household can put aside each month. ' +
      "The months-to-go figure appears as soon as the goal exists.</p>" +
      '<form id="new-goal" class="form-grid cols-3">' +
        "<div><label for=\"g-name\">Goal name</label><input type=\"text\" id=\"g-name\" placeholder=\"e.g. New washing machine\" required></div>" +
        "<div><label for=\"g-target\">Target amount ($)</label><input type=\"number\" id=\"g-target\" min=\"1\" step=\"0.01\" inputmode=\"decimal\" placeholder=\"0.00\" required></div>" +
        "<div><label for=\"g-monthly\">Monthly amount ($)</label><input type=\"number\" id=\"g-monthly\" min=\"0\" step=\"0.01\" inputmode=\"decimal\" placeholder=\"0.00\"></div>" +
      "</form>" +
      '<p style="margin-top:12px"><button class="btn-primary" id="new-goal-btn" type="button">Create goal</button> ' +
      '<span id="new-goal-error" class="empty" role="alert"></span></p>' +
      '<p class="lede" style="margin-top:12px">How months-to-go works: the money still needed, divided by the ' +
      "monthly amount, rounded up. Put in a lump sum and the date pulls closer; skip a month and it pushes out. " +
      "That is the whole trick — there is no magic, only arithmetic the household can check.</p>" +
    "</section>";

  view.querySelectorAll("[data-contribute]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const goalId = form.dataset.contribute;
      const input = form.querySelector("input");
      const cents = parseMoney(input.value);
      if (cents === null || cents <= 0) {
        input.focus();
        return;
      }
      const goal = state.goals.find((g) => g.id === goalId);
      if (goal) goal.savedCents = Math.min(goal.targetCents, goal.savedCents + cents);
      renderGoals(view);
    });
  });

  view.querySelector("#new-goal-btn").addEventListener("click", () => {
    const name = view.querySelector("#g-name").value;
    const target = parseMoney(view.querySelector("#g-target").value);
    const monthly = parseMoney(view.querySelector("#g-monthly").value);
    const error = view.querySelector("#new-goal-error");
    if (!name.trim() || target === null || target <= 0) {
      error.textContent = "Give the goal a name and a target over $0.00.";
      return;
    }
    state.goals.push({
      id: "g" + Date.now().toString(36),
      name: name.trim(),
      why: "A new goal the household just started.",
      targetCents: target,
      savedCents: 0,
      monthlyCents: monthly && monthly > 0 ? monthly : 0,
    });
    renderGoals(view);
    view.querySelector("#new-goal")?.scrollIntoView?.();
  });
}
