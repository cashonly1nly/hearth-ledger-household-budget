// Expense tracker: every purchase in November, with an add form, a category
// filter, a text search and a delete button on each row. Totals move live.

import { CATEGORIES } from "./data.js";
import { state, spentCents, spentByCategory } from "./store.js";
import { money, moneyRound, parseMoney, shortDate } from "./format.js";
import { esc } from "./html.js";

let filterCategory = "all";
let filterText = "";

export function renderExpenses(view) {
  const spent = spentCents();
  const byCat = spentByCategory();

  const visible = state.expenses.filter((row) => {
    if (filterCategory !== "all" && row.category !== filterCategory) return false;
    if (filterText && !row.note.toLowerCase().includes(filterText)) return false;
    return true;
  });
  const visibleTotal = visible.reduce((sum, row) => sum + row.cents, 0);

  const options = ["<option value=\"all\">All categories</option>"].concat(
    CATEGORIES.map((c) => '<option value="' + c.id + '"' + (filterCategory === c.id ? " selected" : "") + ">" + esc(c.label) + "</option>"),
  ).join("");

  const rows = visible.map((row) => {
    const cat = CATEGORIES.find((c) => c.id === row.category);
    return (
      "<tr><td>" + shortDate(row.date) + "</td>" +
      "<td>" + esc(cat ? cat.label : row.category) + "</td>" +
      "<td>" + esc(row.note) + "</td>" +
      '<td class="num">' + money(row.cents) + "</td>" +
      '<td class="num"><button class="btn-danger" type="button" data-remove="' + row.id + '" aria-label="Delete ' + esc(row.note) + '">Delete</button></td></tr>'
    );
  }).join("");

  const topCats = CATEGORIES.map((c) => ({ label: c.label, value: byCat[c.id] || 0 }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  view.innerHTML =
    '<div class="page-head">' +
      "<h1>Expense tracker</h1>" +
      "<p>Every purchase in November, newest last. Add what you spend as you spend it — " +
      "the totals and the category ranking update the moment you do.</p>" +
    "</div>" +

    '<div class="stat-row">' +
      '<div class="stat"><div class="label">Spent in November</div><div class="value">' + moneyRound(spent) + '</div><div class="sub">' + state.expenses.length + " purchases recorded</div></div>" +
      '<div class="stat"><div class="label">Biggest category</div><div class="value">' + esc(topCats[0] ? topCats[0].label : "—") + '</div><div class="sub">' + (topCats[0] ? money(topCats[0].value) + " so far" : "") + "</div></div>" +
      '<div class="stat"><div class="label">Showing now</div><div class="value">' + moneyRound(visibleTotal) + '</div><div class="sub">' + visible.length + " of " + state.expenses.length + " purchases</div></div>" +
      '<div class="stat"><div class="label">Average purchase</div><div class="value">' + moneyRound(state.expenses.length ? Math.round(spent / state.expenses.length) : 0) + '</div><div class="sub">Across all categories</div></div>' +
    "</div>" +

    '<section class="card" style="margin-top:16px" aria-label="Add an expense">' +
      "<h2>Add an expense</h2>" +
      '<form id="add-expense" class="form-grid cols-4">' +
        "<div><label for=\"f-date\">Date</label><input type=\"date\" id=\"f-date\" value=\"2026-11-26\" required></div>" +
        "<div><label for=\"f-cat\">Category</label><select id=\"f-cat\">" +
          CATEGORIES.map((c) => '<option value="' + c.id + '">' + esc(c.label) + "</option>").join("") +
        "</select></div>" +
        "<div><label for=\"f-note\">What was it?</label><input type=\"text\" id=\"f-note\" placeholder=\"e.g. Weekly shop — Green Mart\" required></div>" +
        "<div><label for=\"f-amount\">Amount ($)</label><input type=\"number\" id=\"f-amount\" min=\"0.01\" step=\"0.01\" inputmode=\"decimal\" placeholder=\"0.00\" required></div>" +
        '<div><button class="btn-primary" type="submit">Add</button></div>' +
      "</form>" +
      '<p id="add-error" class="empty" role="alert"></p>' +
    "</section>" +

    '<section class="card" style="margin-top:16px" aria-label="Expense list">' +
      "<h2>November purchases</h2>" +
      '<div class="toolbar">' +
        '<div class="field"><label for="f-filter-cat">Category</label><select id="f-filter-cat">' + options + "</select></div>" +
        '<div class="field"><label for="f-filter-text">Search notes</label><input type="text" id="f-filter-text" placeholder="e.g. Green Mart" value="' + esc(filterText) + '"></div>' +
        (filterCategory !== "all" || filterText
          ? '<button class="btn-ghost btn-small" id="clear-filters" type="button">Clear filters</button>'
          : "") +
      "</div>" +
      (visible.length
        ? '<table class="expenses"><thead><tr><th>Date</th><th>Category</th><th>What</th><th class="num">Amount</th><th></th></tr></thead>' +
          "<tbody>" + rows + "</tbody>" +
          "<tfoot><tr><td colspan=\"3\">Total shown</td><td class=\"num\">" + money(visibleTotal) + "</td><td></td></tr></tfoot></table>"
        : '<p class="empty">Nothing matches those filters. Clear them to see the whole month again.</p>') +
    "</section>";

  const form = view.querySelector("#add-expense");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = view.querySelector("#f-date").value;
    const category = view.querySelector("#f-cat").value;
    const note = view.querySelector("#f-note").value;
    const cents = parseMoney(view.querySelector("#f-amount").value);
    const error = view.querySelector("#add-error");
    if (!date || !note.trim() || cents === null || cents <= 0) {
      error.textContent = "Fill in the date, a short note and an amount over $0.00.";
      return;
    }
    state.expenses.push({ id: "e" + state.nextExpense++, date, category, note: note.trim(), cents });
    state.expenses.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    renderExpenses(view);
  });

  view.querySelector("#f-filter-cat").addEventListener("change", (event) => {
    filterCategory = event.target.value;
    renderExpenses(view);
  });
  view.querySelector("#f-filter-text").addEventListener("input", (event) => {
    filterText = event.target.value.trim().toLowerCase();
    renderExpenses(view);
    const again = view.querySelector("#f-filter-text");
    again.focus();
    again.setSelectionRange(again.value.length, again.value.length);
  });
  const clear = view.querySelector("#clear-filters");
  if (clear) {
    clear.addEventListener("click", () => {
      filterCategory = "all";
      filterText = "";
      renderExpenses(view);
    });
  }
  view.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      state.expenses = state.expenses.filter((row) => row.id !== button.dataset.remove);
      renderExpenses(view);
    });
  });
}
