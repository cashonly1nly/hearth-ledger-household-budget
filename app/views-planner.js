// Monthly budget planner: the plan for November, one editable amount per
// category, with the 50/30/20 check and the running totals underneath.

import { CATEGORIES } from "./data.js";
import { state, incomeCents, plannedCents, plannedRemainingCents, spentByCategory } from "./store.js";
import { money, moneyRound, moneyInput, parseMoney, pct } from "./format.js";
import { esc } from "./html.js";

const SUGGESTED = {
  housing: 195000, groceries: 72000, transport: 38000, utilities: 31000,
  childcare: 64000, health: 15000, dining: 26000, fun: 18000,
  clothing: 12000, household: 14000, subscriptions: 8500,
};

export function renderPlanner(view) {
  const income = incomeCents();
  const planned = plannedCents();
  const unplanned = plannedRemainingCents();
  const spent = spentByCategory();

  const rows = CATEGORIES.map((cat) => {
    const plan = state.plan[cat.id] || 0;
    const used = spent[cat.id] || 0;
    const left = plan - used;
    const tone = left < 0 ? "color:#c2502e" : left < plan * 0.15 ? "color:#9a6a00" : "";
    return (
      "<tr><td><strong>" + esc(cat.label) + '</strong><br><span style="color:#5a6a72;font-size:13px">' +
        (cat.kind === "need" ? "Need" : "Want") + "</span></td>" +
      '<td class="num"><input type="number" min="0" step="0.01" inputmode="decimal" data-plan-for="' + cat.id +
        '" value="' + moneyInput(plan) + '" aria-label="Planned amount for ' + esc(cat.label) + '"></td>' +
      '<td class="num">' + money(used) + "</td>" +
      '<td class="num" style="font-weight:700;' + tone + '">' + money(left) + "</td></tr>"
    );
  }).join("");

  const needsPlan = CATEGORIES.filter((c) => c.kind === "need").reduce((s, c) => s + (state.plan[c.id] || 0), 0);
  const wantsPlan = CATEGORIES.filter((c) => c.kind === "want").reduce((s, c) => s + (state.plan[c.id] || 0), 0);
  const savePlan = Math.max(0, income - planned);
  const needsPct = pct(needsPlan, income);
  const wantsPct = pct(wantsPlan, income);
  const savePct = pct(savePlan, income);

  view.innerHTML =
    '<div class="page-head">' +
      "<h1>Monthly budget planner</h1>" +
      "<p>Set what November is allowed to cost, category by category. Change any amount " +
      "and the totals below move at once — the plan always has to fit inside take-home pay.</p>" +
    "</div>" +

    (unplanned < 0
      ? '<div class="note coral"><p><strong>The plan is ' + money(-unplanned) +
        " over income.</strong> Trim a want or two — eating out and fun money are the usual places — " +
        "until the unplanned line below is back above zero.</p></div>"
      : '<div class="note"><p><strong>' + money(unplanned) +
        " of take-home pay is not yet planned.</strong> Give every dollar a job before the month starts: " +
        "unplanned money is the money that quietly disappears.</p></div>") +

    '<section class="card" aria-label="Planned amounts">' +
      "<h2>November's plan</h2>" +
      '<p class="lede">Amounts are dollars. Spent figures come straight from the expense tracker.</p>' +
      '<table><thead><tr><th>Category</th><th class="num">Planned</th><th class="num">Spent</th><th class="num">Left</th></tr></thead>' +
      "<tbody>" + rows + "</tbody>" +
      "<tfoot><tr><td>Total</td><td class=\"num\">" + money(planned) + '</td><td class="num">' + money(Object.values(spent).reduce((s, v) => s + v, 0)) + '</td><td class="num">' + money(planned - Object.values(spent).reduce((s, v) => s + v, 0)) + "</td></tr></tfoot></table>" +
      '<p style="margin-top:14px"><button class="btn-ghost" id="reset-plan" type="button">Reset to the suggested plan</button> ' +
      '<button class="btn-ghost" id="clear-wants" type="button">Set all wants to $0</button></p>' +
    "</section>" +

    '<div class="grid grid-2" style="margin-top:16px">' +
      '<section class="card" aria-label="Totals">' +
        "<h2>Totals</h2>" +
        '<ul class="plain">' +
        "<li><span>Take-home pay</span><span class=\"money\">" + money(income) + "</span></li>" +
        "<li><span>Total planned</span><span class=\"money\">" + money(planned) + "</span></li>" +
        "<li><span>Not yet planned</span><span class=\"money\">" + money(unplanned) + "</span></li>" +
        "</ul>" +
      "</section>" +

      '<section class="card" aria-label="50 30 20 check">' +
        "<h2>The 50/30/20 check</h2>" +
        '<p class="lede">A classic rule of thumb: about 50% needs, 30% wants, 20% saving. The Ellisons&rsquo; plan sits at:</p>' +
        '<div class="split-rule" role="img" aria-label="Needs ' + needsPct + ' percent, wants ' + wantsPct + ' percent, saving ' + savePct + ' percent">' +
          '<span class="split-needs" style="width:' + needsPct + '%"></span>' +
          '<span class="split-wants" style="width:' + wantsPct + '%"></span>' +
          '<span class="split-save" style="width:' + savePct + '%"></span>' +
        "</div>" +
        '<p class="legend"><span><i style="background:#14655e"></i>Needs ' + needsPct + '% (' + moneyRound(needsPlan) + ')</span>' +
        '<span><i style="background:#d9930d"></i>Wants ' + wantsPct + '% (' + moneyRound(wantsPlan) + ')</span>' +
        '<span><i style="background:#8a9ba8"></i>Saving ' + savePct + '% (' + moneyRound(savePlan) + ")</span></p>" +
        "<p>Needs run high because childcare and rent are fixed — that is normal for a family of four. " +
        "The fix is not a smaller rent, it is keeping the wants slice honest.</p>" +
      "</section>" +
    "</div>";

  view.querySelectorAll("[data-plan-for]").forEach((input) => {
    input.addEventListener("change", () => {
      const cents = parseMoney(input.value);
      if (cents === null) {
        input.value = moneyInput(state.plan[input.dataset.planFor] || 0);
        return;
      }
      state.plan[input.dataset.planFor] = cents;
      renderPlanner(view);
      const again = view.querySelector('[data-plan-for="' + input.dataset.planFor + '"]');
      if (again) again.focus();
    });
  });

  view.querySelector("#reset-plan").addEventListener("click", () => {
    Object.assign(state.plan, SUGGESTED);
    renderPlanner(view);
  });

  view.querySelector("#clear-wants").addEventListener("click", () => {
    for (const cat of CATEGORIES) {
      if (cat.kind === "want") state.plan[cat.id] = 0;
    }
    renderPlanner(view);
  });
}
