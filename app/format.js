// Money and date formatting for HearthLedger. Plain functions, no dependencies.

export function money(cents) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  return sign + "$" + dollars.toLocaleString("en-US") + "." + rest;
}

export function moneyRound(cents) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return sign + "$" + Math.round(abs / 100).toLocaleString("en-US");
}

export function moneyInput(cents) {
  return (cents / 100).toFixed(2);
}

export function parseMoney(text) {
  const cleaned = String(text ?? "").replace(/[$,\s]/g, "");
  if (cleaned === "" || Number.isNaN(Number(cleaned))) return null;
  return Math.round(Number(cleaned) * 100);
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function monthsToGo(goal) {
  const left = goal.targetCents - goal.savedCents;
  if (left <= 0) return 0;
  if (!goal.monthlyCents || goal.monthlyCents <= 0) return null;
  return Math.ceil(left / goal.monthlyCents);
}

export function shortDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[m - 1] + " " + d;
}

export function monthName(isoMonth) {
  const [y, m] = isoMonth.split("-").map(Number);
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return names[m - 1] + " " + y;
}
