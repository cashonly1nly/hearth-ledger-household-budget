// The budget guide: plain-language advice for a household keeping its money
// in order. No jargon, no lectures — the working rules the Ellisons use.

export function renderGuide(view) {
  view.innerHTML =
    '<div class="page-head">' +
      '<p class="kicker">The HearthLedger guide</p>' +
      "<h1>Budgeting in plain language</h1>" +
      "<p>Everything on this page is a rule the Ellison household actually uses. " +
      "None of it needs a spreadsheet degree — just a monthly look at the numbers on this site.</p>" +
    "</div>" +

    '<div class="guide">' +
    "<section><h2>1. Pay yourself first</h2>" +
    "<p>On payday, move the savings out before anything else — the goals on the " +
    "<a href=\"#/goals\">Goals page</a> get their monthly amount the day the salaries land. " +
    "Money that stays in the current account gets spent; money that moved already is safe. " +
    "If $1,000 a month is too much, start with $200. The habit matters more than the amount.</p></section>" +

    "<section><h2>2. The 50/30/20 starting point</h2>" +
    "<p>A classic split of take-home pay: about <strong>50% for needs</strong> (rent, groceries, " +
    "transport, childcare), <strong>30% for wants</strong> (eating out, fun, streaming) and " +
    "<strong>20% for saving</strong>. Check the household's own split on the " +
    "<a href=\"#/planner\">Planner page</a>. Families with young children often sit near 65% needs — " +
    "that is not failure, it is arithmetic. The point of the rule is to notice when wants creep past 30%, " +
    "because wants are the only slice you can shrink without moving house.</p></section>" +

    "<section><h2>3. Give every dollar a job</h2>" +
    "<p>A budget is not a diet, it is a plan. At the start of the month, the plan should add up to the " +
    "whole take-home pay — every dollar assigned to a category or a goal, none left \"spare\". " +
    "Spare money is the money that vanishes on takeaways and one-click orders by the 20th.</p></section>" +

    "<section><h2>4. Sinking funds beat surprises</h2>" +
    "<p>Some costs are not monthly but they are certain: car insurance in November, school shoes in " +
    "September, a new washing machine sooner or later. Divide the yearly cost by twelve and save that " +
    "slice every month, in its own goal. When the bill arrives it is already paid for — that is what " +
    "the emergency cushion on the <a href=\"#/goals\">Goals page</a> is for.</p></section>" +

    "<section><h2>5. One money date a week</h2>" +
    "<p>Ten minutes, same time each week, both adults: open the " +
    "<a href=\"#/expenses\">Expense tracker</a>, add anything missed, and look at what is left in each " +
    "category. A budget reviewed weekly never has a nasty surprise at month's end; a budget reviewed " +
    "never does.</p></section>" +

    "<section><h2>6. When a category goes over</h2>" +
    "<ul><li><strong>First, check the total.</strong> One category over plan is fine if the month's total still fits — move money from a category with room.</li>" +
    "<li><strong>Then ask why.</strong> A one-off (winter coats, a dentist visit) is not a habit. Three months over in the same category means the plan was wrong, not the spending — raise the plan.</li>" +
    "<li><strong>Never borrow from a goal quietly.</strong> If savings have to cover a shortfall, say so out loud and put the money back next month. Silent borrowing is how goals die.</li></ul></section>" +

    "<section><h2>7. The numbers on this site</h2>" +
    "<p>Everything here is the Ellison household's real November: <strong>$7,850</strong> take-home pay, " +
    "a <strong>$4,935</strong> plan across eleven categories, and four savings goals worth " +
    "<strong>$18,200</strong> between them. Change any figure on the Planner, Expenses or Goals pages " +
    "and every total on the site follows — that is the whole point of keeping it in one place.</p>" +
    '<p><a href="#/">Back to the dashboard &rarr;</a></p></section>' +
    "</div>";
}
