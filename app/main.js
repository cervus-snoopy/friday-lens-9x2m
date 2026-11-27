// Friday Lens: the deal finder itself. State lives in this module; the list re-renders
// on every search keystroke, filter change and hash change. No network is used — the
// deals are the site's own data.js, and the only links out are the store links.
//
//   #/            the deal list, with search, filters and sorting
//   #/deal/<id>   one deal, with its evidence and a cross-store comparison
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { deals, CATEGORIES, STORES, CHECKED_AT } from "./data.js";
import { listPage, dealPage, missingPage, pct, save } from "./views.js";

const app = document.getElementById("app");

const VERDICT_RANK = { "true-low": 0, strong: 1, good: 2, routine: 3 };

const state = { q: "", category: "All", store: "", minDisc: 0, sort: "off" };

function stats() {
  const totalOff = deals.reduce((sum, d) => sum + pct(d), 0);
  return {
    total: deals.length,
    stores: STORES.length,
    categories: CATEGORIES.length,
    trueLows: deals.filter((d) => d.verdict === "true-low").length,
    avgOff: Math.round(totalOff / deals.length),
    storeList: STORES,
    categoryList: CATEGORIES,
    checked: CHECKED_AT,
  };
}

function applyFilters() {
  const q = state.q.trim().toLowerCase();
  let shown = deals.filter(
    (d) =>
      (state.category === "All" || d.category === state.category) &&
      (state.store === "" || d.store === state.store) &&
      pct(d) >= state.minDisc &&
      (q === "" || `${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)),
  );
  const by = {
    off: (a, b) => pct(b) - pct(a) || save(b) - save(a),
    save: (a, b) => save(b) - save(a),
    price: (a, b) => a.price - b.price,
    verdict: (a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || pct(b) - pct(a),
  };
  shown = [...shown].sort(by[state.sort] || by.off);
  return shown;
}

function wireControls() {
  const q = document.getElementById("q");
  const store = document.getElementById("store");
  const mindisc = document.getElementById("mindisc");
  const sort = document.getElementById("sort");
  if (q) q.addEventListener("input", () => { state.q = q.value; renderList(true); });
  if (store) store.addEventListener("change", () => { state.store = store.value; renderList(true); });
  if (mindisc) mindisc.addEventListener("change", () => { state.minDisc = Number(mindisc.value); renderList(true); });
  if (sort) sort.addEventListener("change", () => { state.sort = sort.value; renderList(true); });
  for (const chip of document.querySelectorAll(".chip")) {
    chip.addEventListener("click", () => { state.category = chip.dataset.cat; renderList(true); });
  }
}

function renderList(keepFocus) {
  const focusId = keepFocus ? document.activeElement?.id : null;
  const caret = keepFocus && focusId === "q" ? document.getElementById("q")?.selectionStart : null;
  app.innerHTML = listPage(applyFilters(), state, stats());
  wireControls();
  if (focusId === "q") {
    const input = document.getElementById("q");
    if (input) { input.focus(); if (caret !== null) input.setSelectionRange(caret, caret); }
  }
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    if (found) {
      const others = found.group ? deals.filter((d) => d.group === found.group && d.id !== found.id) : [];
      document.title = `${found.title} at ${found.store} | Friday Lens`;
      app.innerHTML = dealPage(found, others);
    } else {
      document.title = "Not found | Friday Lens";
      app.innerHTML = missingPage();
    }
  } else {
    document.title = "Friday Lens — Black Friday deals, checked";
    renderList(false);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
