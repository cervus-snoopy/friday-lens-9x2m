// HTML for Friday Lens: the deal cards, the list page and the deal detail page.
// Every value is escaped before it goes into the page. Prices are US dollars.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const pct = (d) => Math.round((1 - d.price / d.was) * 100);
const save = (d) => d.was - d.price;
const when = (iso) =>
  new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";

const VERDICT = {
  "true-low": { label: "TRUE LOW", hint: "Lowest price on record" },
  strong: { label: "STRONG DEAL", hint: "Deep cut vs the usual price" },
  good: { label: "GOOD DEAL", hint: "A real saving, not the floor" },
  routine: { label: "ROUTINE SALE", hint: "Seen at this price before" },
};

export function verdictBadge(d) {
  const v = VERDICT[d.verdict] || VERDICT.good;
  return `<span class="verdict verdict-${d.verdict}" title="${escape(v.hint)}">${v.label}</span>`;
}

export function card(d) {
  return `<article class="card">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="prices"><span class="price">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off">−${pct(d)}%</span></p>
  <p class="save-line">You save ${usd(save(d))}</p>
  <p class="card-verdict">${verdictBadge(d)}</p>
  <p class="checked">Checked ${when(d.checked)}</p>
  <p class="card-links"><a class="btn" href="#/deal/${encodeURIComponent(d.id)}">Why this is a deal</a>
  <a class="store-link" href="${escape(d.url)}" rel="noopener" target="_blank">At ${escape(d.store)} ↗</a></p>
</article>`;
}

export function listPage(deals, state, stats) {
  const cards = deals.map(card).join("\n");
  return `<section class="hero">
  <h1>Black Friday, checked deal by deal.</h1>
  <p class="lede">42 deals our agent read and priced itself on Black Friday, 27 November 2026 — every one with its store, its sale price, its usual price, when it was checked, and an honest verdict on whether it is really a deal.</p>
  <ul class="stats">
    <li><strong>${stats.total}</strong> deals</li>
    <li><strong>${stats.stores}</strong> stores</li>
    <li><strong>${stats.categories}</strong> categories</li>
    <li><strong>${stats.trueLows}</strong> true lows</li>
    <li><strong>${stats.avgOff}%</strong> average cut</li>
  </ul>
</section>
<section class="controls" aria-label="Search and filter">
  <label class="search-label">Search <input id="q" type="search" placeholder="Try “AirPods”, “OLED”, “Dyson”…" value="${escape(state.q)}"></label>
  <label>Store <select id="store">
    <option value="">All stores</option>
    ${stats.storeList.map((s) => `<option value="${escape(s)}"${state.store === s ? " selected" : ""}>${escape(s)}</option>`).join("")}
  </select></label>
  <label>Min. discount <select id="mindisc">
    <option value="0"${state.minDisc === 0 ? " selected" : ""}>Any</option>
    <option value="30"${state.minDisc === 30 ? " selected" : ""}>30% off or more</option>
    <option value="40"${state.minDisc === 40 ? " selected" : ""}>40% off or more</option>
    <option value="50"${state.minDisc === 50 ? " selected" : ""}>50% off or more</option>
  </select></label>
  <label>Sort <select id="sort">
    <option value="off"${state.sort === "off" ? " selected" : ""}>Biggest % off</option>
    <option value="save"${state.sort === "save" ? " selected" : ""}>Biggest saving $</option>
    <option value="price"${state.sort === "price" ? " selected" : ""}>Lowest price</option>
    <option value="verdict"${state.sort === "verdict" ? " selected" : ""}>Best verdict</option>
  </select></label>
</section>
<nav class="chips" aria-label="Categories">
  ${["All", ...stats.categoryList].map((c) => `<button type="button" class="chip${state.category === c ? " active" : ""}" data-cat="${escape(c)}">${escape(c)}</button>`).join(" ")}
</nav>
<p class="count" role="status">${deals.length === stats.total ? `Showing all ${deals.length} deals` : `Showing ${deals.length} of ${stats.total} deals`}</p>
<div class="grid">${cards || '<p class="empty">No deal matches. Try a different search or filter.</p>'}</div>`;
}

export function compareTable(d, others) {
  if (!others.length) return "";
  const rows = [d, ...others]
    .map(
      (x) =>
        `<tr${x.id === d.id ? ' class="here"' : ""}><td>${escape(x.store)}</td><td>${usd(x.price)}</td><td>${usd(x.was)}</td><td>−${pct(x)}%</td><td>${x.id === d.id ? "This deal" : `<a href="#/deal/${encodeURIComponent(x.id)}">View</a>`}</td></tr>`,
    )
    .join("");
  return `<section class="compare"><h2>Same product, other stores</h2>
<table><thead><tr><th>Store</th><th>Sale</th><th>Usual</th><th>Off</th><th></th></tr></thead><tbody>${rows}</tbody></table>
<p class="compare-note">The cheapest store wins — that is the whole point of comparing.</p></section>`;
}

export function dealPage(d, others) {
  const v = VERDICT[d.verdict] || VERDICT.good;
  return `<p><a class="back" href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="prices big"><span class="price">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off">−${pct(d)}%</span></p>
  <p class="save-line">You save ${usd(save(d))} against the usual price.</p>
  <p>${verdictBadge(d)} <span class="verdict-hint">${escape(v.hint)}.</span></p>
  <p class="evidence">${escape(d.note)}</p>
  ${compareTable(d, others)}
  <dl class="facts">
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${usd(d.price)}</dd>
    <dt>Usual price</dt><dd>${usd(d.was)}</dd>
    <dt>Checked</dt><dd>${when(d.checked)}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="btn big" href="${escape(d.url)}" rel="noopener" target="_blank">Find it at ${escape(d.store)} ↗</a></p>
  <p class="fineprint">Prices change during Black Friday week — confirm the price on the store page before you buy. Friday Lens takes no commission and lists no sponsored placement.</p>
</article>`;
}

export function missingPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all 42 deals</a>.</p>`;
}

export { pct, save, usd, when };
