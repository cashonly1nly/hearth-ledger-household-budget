# hearth-ledger-household-budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/cashonly1nly/hearth-ledger-household-budget/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/cashonly1nly/hearth-ledger-household-budget/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

HearthLedger is a household budget site for a fictional family of four: a dashboard for the month at a glance, an editable monthly budget planner with a 50/30/20 check, an expense tracker with add/filter/delete, savings goals with a months-to-go calculator, six months of insights with canvas charts, and a plain-language budget guide. Everything runs from static files with no network requests, and every control works.

## Run it

```sh
cd app && python3 -m http.server 8000
```

Then open http://localhost:8000 — and `#/planner`, `#/expenses`, `#/goals`, `#/insights`, `#/guide` for the other sections.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — Node 22, standard library only. Copies `app/` and `screenshots/` to the output dir and writes `dossier.json`.
- `app/index.html` — the shell: header nav, `#view`, footer.
- `app/styles.css` — the whole design system (warm paper, deep ink, saffron accent).
- `app/main.js` — entry point; starts the hash router.
- `app/router.js` — hash routes for the six sections.
- `app/data.js` — the Ellison household's November 2026 figures (fictional).
- `app/store.js` — in-memory state: plan, expenses, goals; every total derives from it.
- `app/format.js` — money and date formatting.
- `app/charts.js` — donut and bar charts drawn on plain canvas, no libraries.
- `app/html.js` — HTML escaping and the stat-card helper.
- `app/views-dashboard.js` — month at a glance: totals, donut chart, closest goal, bills, latest expenses.
- `app/views-planner.js` — monthly budget planner with editable plan amounts and the 50/30/20 check.
- `app/views-expenses.js` — expense tracker: add, filter, search, remove; totals update live.
- `app/views-goals.js` — savings goals, contributions, months-to-go calculator, new goal form.
- `app/views-insights.js` — six months of spending, category ranking, what the numbers say.
- `app/views-guide.js` — the household budget guide in plain language.
- `screenshots/` — 4 real renders of the site in headless Chromium (desktop dashboard, planner, expenses, phone dashboard).
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.
- `LICENSE` — MIT.

---

<sub>Entered on [make.fun](https://make.fun/?ref=prprbmdv&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
