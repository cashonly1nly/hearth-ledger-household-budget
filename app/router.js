// Hash router for HearthLedger. Each section of the site is a hash route, and
// every route is reachable from the header nav and the footer links.

import { renderDashboard } from "./views-dashboard.js";
import { renderPlanner } from "./views-planner.js";
import { renderExpenses } from "./views-expenses.js";
import { renderGoals } from "./views-goals.js";
import { renderInsights } from "./views-insights.js";
import { renderGuide } from "./views-guide.js";

const ROUTES = {
  "": renderDashboard,
  planner: renderPlanner,
  expenses: renderExpenses,
  goals: renderGoals,
  insights: renderInsights,
  guide: renderGuide,
};

export function currentRoute() {
  const hash = window.location.hash || "#/";
  const route = hash.replace(/^#\/?/, "").split("/")[0].split("?")[0];
  return ROUTES[route] ? route : "";
}

export function render() {
  const route = currentRoute();
  const view = document.getElementById("view");
  document.querySelectorAll(".mainnav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });
  ROUTES[route](view);
  window.scrollTo(0, 0);
}

export function startRouter() {
  window.addEventListener("hashchange", render);
  render();
}
