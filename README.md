# WAC Logistics — Digital Freight Desk

> Portfolio project: a **corporate logistics website** with a working **air Instant Quote** product and an internal **Origin Cost Desk** (variable trucking slots + local charge master).

**Live demo:** [https://wac-logistics.vercel.app](https://wac-logistics.vercel.app)

---

## Why this exists

WAC-style forwarders still quote many lanes via **Excel + email**. Even with rate APIs (e.g. CargoAI), **Hong Kong origin trucking and field fees** (cartage, tunnel, parking) change per job and cannot be fully automated.

This project demonstrates:

1. **UI** — full company landing (Hero, Solutions, Network, About, W Networks) in WAC brand colors  
2. **Product logic** — chargeable weight, multi-carrier indicative air rates, and a desk cost sheet  
3. **Real ops framing** — cost lines grounded in `cost item_origin.xlsx` + a real invoice (`INV_AE260703101`)

---

## Two quote modes

| Mode | Who | What |
|------|-----|------|
| **Public Quote** | Shipper / nominee | Origin–dest, dims, weight → **indicative air** only → Request Quote |
| **WAC Desk** | Internal staff | Same cargo + **auto local master** + **Cartage / Tunnel / Parking** slots → formal HKD/USD sheet |

Shippers never enter tunnel/parking. Desk enters only what changes per job; Terminal / Document / CFS etc. auto-calc from a monthly-style master (`max(Min, Flat × C.W.)`).

---

## Features

- Full-bleed React **Hero** (parallax + brand CTA)
- **Solutions** (Air → Instant Quote; Ocean / Road / Warehouse → official WAC; E-Com → Favvy)
- Instant Quote: 12 carriers, weight breaks, MYC / extras, email draft copy
- Desk: EXP local master, variable slots, FX, optional X-ray / ULD / DG / WH Reg
- Network, About, W Networks, responsive layout, scroll reveal

---

## Tech stack

- React 19 + TypeScript + Vite  
- Tailwind CSS v4  
- Lucide icons  
- Deployed on **Vercel**

---

## Project structure

```
src/
  App.tsx          # Page shell + Quote / Desk UI
  Hero.tsx         # Enterprise hero
  originCost.ts    # Local master + variable-slot cost engine
  index.css        # Brand tokens + motion
public/
  solutions/       # Solution card art
  services/        # Photo covers
  hero-cargo-takeoff.png
docs/              # Cost analysis & weekly-report notes (KR)
```

---

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

---

## Notes / limits (honest)

- Air rates are **mock** until CargoAI / a rate DB is connected  
- Local master numbers are from a sample Excel sheet (monthly validity pattern)  
- Variable slot defaults come from one sample HK invoice — desk must edit per job  
- Not a production WAC system; built as an **internship / portfolio MVP**

---

## Docs (Korean)

- [`docs/변동비-고정비-UI방향.md`](./docs/변동비-고정비-UI방향.md) — fixed vs variable costs, DHL / Pantos notes  
- [`docs/주간보고-Public-vs-Desk.md`](./docs/주간보고-Public-vs-Desk.md) — Public vs Desk + questions for ops (plain language)

---

## Author

Built as a portfolio piece around WAC logistics quote workflows.  
Repo: [hyunseook0606-dev/WAC-Logistics](https://github.com/hyunseook0606-dev/WAC-Logistics)
