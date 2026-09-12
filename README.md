# ♻️ LoopPack — B2B Circular Packaging & Surplus Materials Exchange Platform

LoopPack is an enterprise B2B platform designed to eliminate single-use industrial packaging waste across manufacturing supply chains. By combining a 6-Factor AI Matchmaker Engine, ISO-14040 Digital Material Passports, and commercial EV fleet backhaul route optimization, LoopPack turns post-industrial waste streams into high-value circular inputs.

---

## 🚀 Live Demo

🌐 **Public Demo URL**: [https://propecia-miscellaneous-brunswick-possession.trycloudflare.com](https://propecia-miscellaneous-brunswick-possession.trycloudflare.com)

> ⚠️ **Note**: This live URL is served via a temporary **Cloudflare Quick Tunnel** for hackathon demonstration. It is accessible only while the local development servers and tunnel process remain active.

---

## 📌 Project Overview

Industrial manufacturing generates millions of tons of surplus corrugated cardboard, wooden pallets, HDPE drums, steel containers, and bio-foam packaging. LoopPack connects packaging producers (manufacturers) directly with buyers, recyclers, and commercial EV logistics fleets to create closed-loop material exchanges that reduce Scope 3 embodied carbon emissions.

---

## ✨ Key Features

- 🏢 **Role-Based Workflows**: Tailored executive dashboards for **Manufacturers**, **Buyers & Recyclers**, and **Logistics Fleets**.
- 🤖 **6-Factor AI Matchmaker**: Intelligent recommendation engine matching material compatibility, carbon benefit, availability, quantity fit, unit price, and transport distance.
- 📜 **ISO-14040 Digital Material Passports**: QR-code traceable digital passports providing lifecycle assessments, virgin vs. recycled ratios, and cryptographic audit trails.
- 🚛 **EV Backhaul Eco-Logistics**: Circular route planner optimizing commercial EV truck routes to eliminate empty return trips and reduce freight emissions by up to 72%.
- 📊 **Real-time Carbon Analytics**: Live platform stats tracking embodied CO₂e avoided, landfill waste diverted, circular economy rates, and industry cost savings.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts
- **Backend**: Node.js, Express.js API
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Deployment & Tunnels**: Cloudflare Quick Tunnels

---

## 📡 API & Backend Architecture

The Express API server (`server/index.ts`) interacts with PostgreSQL via Prisma ORM:

| Route | Description |
| :--- | :--- |
| `GET /api/health` | PostgreSQL database connection health check |
| `GET /api/listings` | Fetch surplus material packaging listings |
| `POST /api/listings` | Post new surplus listing & auto-generate Digital Passport |
| `GET /api/matches` | AI buyer match recommendations & score breakdown |
| `POST /api/matches/:id/accept` | Accept AI match proposal & trigger dispatch |
| `GET /api/passports` | Digital Material Passports & cryptographic movement audit logs |
| `GET /api/logistics` | EV fleet backhaul route loops and waypoint nodes |
| `GET /api/claims` | Material exchange claim transactions |
| `GET /api/notifications` | Real-time user alert notifications |
| `GET /api/stats` | Global carbon ticker & summary statistics |
| `GET /api/stats/carbon` | Material category breakdown & Scope 3 partner compliance |
| `GET /api/companies` | Enterprise company directory |
| `GET /api/users` | User directory (sensitive authentication data excluded) |

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or remote)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Ensure `.env` contains your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5000/looppack"
```

### 3. Database Migration & Seeding
```bash
npx prisma migrate dev
npx tsx prisma/seed.ts
```

### 4. Run Development Servers
```bash
# Start Express Backend API (Port 5000)
npm run server

# Start Vite Frontend Dev Server (Port 5173)
npm run dev
```

---

## 🛠️ Tooling & Linting

Template expanded with Vite, React HMR, and Oxlint rules.
```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```
