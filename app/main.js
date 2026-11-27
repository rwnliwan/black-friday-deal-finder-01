// DealHound: renders the deals from data.js and wires up search, category
// chips, store and discount filters, and sorting. Everything runs from the
// local data file — no network requests at run time.
//
// window.__shotReady is false while a render is in flight and true once the
// grid is on screen, so a screenshot script knows when to capture.

import { deals, CHECKED_LABEL } from "./data.js";

const grid = document.getElementById("deals");
const countEl = document.getElementById("count");
const emptyEl = document.getElementById("empty");
const statsEl = document.getElementById("stats");
const searchEl = document.getElementById("search");
const chipsEl = document.getElementById("category-chips");
const storeEl = document.getElementById("store-filter");
const discountEl = document.getElementById("discount-filter");
const sortEl = document.getElementById("sort");

const VERDICT_LABEL = {
  "new-low": "NEW LOW",
  strong: "STRONG DEAL",
  routine: "ROUTINE SALE",
};

const VERDICT_ORDER = { "new-low": 0, strong: 1, routine: 2 };

function pctOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, "");
}

const categories = [...new Set(deals.map((d) => d.category))];
const stores = [...new Set(deals.map((d) => d.store))].sort();

let activeCategory = "All";

for (const store of stores) {
  const opt = document.createElement("option");
  opt.value = store;
  opt.textContent = store;
  storeEl.appendChild(opt);
}

for (const cat of ["All", ...categories]) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip-btn";
  btn.textContent = cat === "All" ? `All (${deals.length})` : `${cat} (${deals.filter((d) => d.category === cat).length})`;
  btn.setAttribute("aria-pressed", cat === "All" ? "true" : "false");
  btn.addEventListener("click", () => {
    activeCategory = cat;
    for (const b of chipsEl.querySelectorAll(".chip-btn")) {
      b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    }
    render();
  });
  chipsEl.appendChild(btn);
}

// Shareable filter state: ?q=…&cat=…&store=…&min=…&sort=… pre-applies the
// controls on load, so a filtered view has its own link.
const params = new URLSearchParams(location.search);
if (params.get("q")) searchEl.value = params.get("q");
if (params.get("cat") && ["All", ...categories].includes(params.get("cat"))) {
  activeCategory = params.get("cat");
}
if (params.get("store") && stores.includes(params.get("store"))) storeEl.value = params.get("store");
if (params.get("min") && ["0", "20", "30", "40", "50"].includes(params.get("min"))) discountEl.value = params.get("min");
if (params.get("sort") && ["discount", "newlow", "price-asc", "price-desc", "saving"].includes(params.get("sort"))) {
  sortEl.value = params.get("sort");
}
for (const b of chipsEl.querySelectorAll(".chip-btn")) {
  b.setAttribute("aria-pressed", b.textContent.startsWith(activeCategory) ? "true" : "false");
}

const totalSaving = deals.reduce((sum, d) => sum + (d.was - d.price), 0);
const newLows = deals.filter((d) => d.verdict === "new-low").length;
statsEl.textContent =
  `${deals.length} deals · ${stores.length} stores · ${newLows} new lows · $${Math.round(totalSaving).toLocaleString("en-US")} total savings · Prices checked today`;

function cardHTML(d) {
  const pct = pctOff(d);
  return `<article class="card">
    <h2>${d.title}</h2>
    <p class="meta">${d.store} · ${d.category}</p>
    <p class="prices"><span class="sale">${money(d.price)}</span><span class="was">${money(d.was)}</span><span class="off">${pct}% off</span></p>
    <span class="chip ${d.verdict}">${VERDICT_LABEL[d.verdict]}</span>
    <p class="evidence">${d.evidence}</p>
    <p class="checked">Checked ${CHECKED_LABEL} · via ${d.source}</p>
    <a class="store-link" href="${d.url}" target="_blank" rel="noopener">View deal at ${d.store} ↗</a>
  </article>`;
}

function visibleDeals() {
  const q = searchEl.value.trim().toLowerCase();
  const minPct = Number(discountEl.value);
  let list = deals.filter((d) => {
    if (activeCategory !== "All" && d.category !== activeCategory) return false;
    if (storeEl.value && d.store !== storeEl.value) return false;
    if (pctOff(d) < minPct) return false;
    if (q && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
  const mode = sortEl.value;
  if (mode === "discount") list.sort((a, b) => pctOff(b) - pctOff(a));
  else if (mode === "newlow") list.sort((a, b) => VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict] || pctOff(b) - pctOff(a));
  else if (mode === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (mode === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (mode === "saving") list.sort((a, b) => b.was - b.price - (a.was - a.price));
  return list;
}

function render() {
  window.__shotReady = false;
  const list = visibleDeals();
  grid.innerHTML = list.map(cardHTML).join("");
  countEl.textContent = `Showing ${list.length} of ${deals.length} deals`;
  emptyEl.hidden = list.length > 0;
  window.__shotReady = true;
}

for (const el of [searchEl, storeEl, discountEl, sortEl]) {
  el.addEventListener("input", render);
}

render();
