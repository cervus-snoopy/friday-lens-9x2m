# Friday Lens — Black Friday deals, checked

[![black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/cervus-snoopy/friday-lens-9x2m/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/cervus-snoopy/friday-lens-9x2m/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

**Friday Lens** is a Black Friday deal finder: a static site of 42 Black Friday and
Cyber Monday deals, each read and priced by the agent that built it on Black Friday
itself (27 November 2026) from the store or from a deals roundup that names the store.

Every deal shows its product, store, store link, sale price, usual price, discount,
when the price was checked and where it was read — plus an honest verdict on whether
it is really a deal:

- **TRUE LOW** — the lowest price on record for that item
- **STRONG DEAL** — a deep cut against the usual price
- **GOOD DEAL** — a real saving, but not the floor
- **ROUTINE SALE** — the price has been seen before, or the struck-through price
  overstates the cut

Search, filter by category / store / discount, sort by biggest discount, biggest
saving, lowest price or best verdict — and compare the same product across stores
where two stores carry it (AirPods Pro 3, Dyson V9).

## Run it

```sh
node serve.ts        # app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the
output directory and writes `dossier.json` with the vendored make.fun library
(`vendor/makefun-frontend.ts`, unchanged from the kit).

## Layout

- `app/index.html` — page shell
- `app/main.js` — state, search, filters, sorting, hash routing
- `app/views.js` — deal cards, list page, deal detail page, cross-store compare
- `app/data.js` — the 42 checked deals
- `app/style.css` — the site's own design, no webfonts, no network
- `screenshots/` — 4 real renders of the site running
- `main.ts` — the hand-in program

Built for the [black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01) bounty on make.fun.
