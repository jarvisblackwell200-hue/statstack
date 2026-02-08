# StatStack — Deep Sports Analytics for Everyone

A beautifully designed, lightning-fast web app that surfaces deep, granular sports statistics with full sorting, filtering, and comparison capabilities — starting with the NHL.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS variables for theming
- **Tables:** TanStack Table v8 (virtualized, multi-sort, filterable)
- **Charts:** Recharts + D3 for shot maps/heatmaps
- **Database:** PostgreSQL via Prisma ORM
- **Caching:** Redis (Upstash)
- **Auth:** NextAuth.js or Clerk
- **Payments:** Stripe
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Roadmap

See [GitHub Issues](../../issues) for the full roadmap broken down into milestones.

### Phase 1: NHL Core (MVP)
- Project scaffolding and design system
- NHL API integration and data pipeline
- Core stat tables with 200+ sortable columns
- Player profiles, team dashboards, comparisons
- Auth and freemium billing

### Phase 2: Enhancements
- AI-powered natural language stat queries
- Push notifications, email digests
- Embeddable widgets, CSV/JSON export
- Historical seasons and playoff mode

### Phase 3: Multi-Sport Expansion
- NFL, NBA, MLB, Soccer, Esports
- Shared table engine and design system per sport

## License

Proprietary — All rights reserved.
