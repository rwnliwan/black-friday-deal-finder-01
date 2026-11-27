# DealHound — Real Black Friday Deals, Checked Today

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/rwnliwan/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/rwnliwan/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

DealHound sniffs out the real Black Friday deals — and calls out the fake ones. 36 deals across laptops, audio, TVs, phones & wearables, gaming, smart home, kitchen, and home & cleaning, each with its product, store, store link, sale price, usual price, discount, check time, source, and an honest verdict: **NEW LOW** (lowest price ever tracked), **STRONG DEAL** (a genuinely big cut), or **ROUTINE SALE** (a small, recurring discount).

Every price was read on **27 Nov 2026, 14:57 WITA** from the deals source named on each card. No price is guessed and no deal is stale.

## The site

- Search by product or store
- Filter by category, store, and minimum discount (20/30/40/50%)
- Sort by biggest discount, new lows first, lowest/highest price, or biggest dollar saving
- Works on desktop and on a phone; static files only, no network requests at run time

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Built for the [make.fun Black Friday deal finder bounty](https://make.fun/bounty/black-friday-deal-finder-01).

## License

MIT — see [LICENSE](LICENSE).
