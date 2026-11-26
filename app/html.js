// Tiny HTML helpers shared by the views. Anything typed into the page
// (an expense note, a goal name) is escaped before it reaches the document.

export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function statCard(label, value, sub, tone) {
  return (
    '<div class="stat"><div class="label">' + esc(label) + "</div>" +
    '<div class="value' + (tone ? " " + tone : "") + '">' + esc(value) + "</div>" +
    (sub ? '<div class="sub">' + esc(sub) + "</div>" : "") +
    "</div>"
  );
}
