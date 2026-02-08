# StatStack — Deep Sports Analytics for Everyone

## The Problem

Sports fans, fantasy managers, bettors, and analysts are stuck with surface-level stats on official league sites. Want to know which NHL defenseman leads in blocked shots per 60 minutes at even strength? Or which forward has the highest Corsi-for percentage in the third period of away games? You're either scraping multiple sites, paying for expensive API access, or building your own spreadsheets. There's a gap between the casual box score and expensive enterprise analytics platforms.

## The Product

**StatStack** is a beautifully designed, lightning-fast web app that surfaces deep, granular sports statistics with full sorting, filtering, and comparison capabilities — starting with the NHL and expanding league by league.

### Core Features

**Deep Stat Tables** — Every metric available from public APIs and data sources, not just what the league highlights. For NHL alone this means 200+ sortable columns: standard stats, advanced analytics (Corsi, Fenwick, xG, PDO), situational splits (even strength, power play, shorthanded, by period, home/away), on-ice impact metrics, and rate stats (per 60 min, per game).

**Universal Sort & Filter** — Click any column header to sort. Stack filters: "Show me all left wingers, age 22–26, with 15+ goals, sorted by expected goals above replacement." Save filter presets. Share them via URL.

**Player Comparison Tool** — Side-by-side radar charts and stat tables for 2–5 players. Overlay historical seasons. Visual percentile rankings against position peers.

**Team Dashboards** — Rolling 10/20/82-game trends, lineup combination stats, special teams breakdowns, goalie matchup analysis.

**Visual-First Design** — No Excel-dump aesthetics. Sparklines in table cells, heatmaps for shot locations, gradient-colored stat cells (green-to-red relative to league), micro-charts everywhere. Dark mode default with light option.

### League Roadmap

1. **NHL** (launch) — richest free public data via NHL API + Natural Stat Trick-style advanced stats
2. **NFL** — massive audience, complex stats (PFF-style grades, route data, pressure rates)
3. **NBA** — tracking data, shot charts, lineup combinations
4. **MLB** — Statcast data, spray charts, pitch movement
5. **Soccer** (EPL/top 5 leagues) — xG, progressive passes, pressing stats
6. **Esports** — underserved, data-rich, young demographic

## Target Users

- **Fantasy sports players** — 60M+ in North America, need granular data for draft/trade decisions
- **Sports bettors** — fastest-growing segment, prop bets demand obscure stat access
- **Content creators & podcasters** — need quick stat lookups and shareable visuals
- **Casual fans** — want to settle debates and explore "who's actually better"
- **Coaches & scouts** (amateur/semi-pro) — can't afford enterprise tools

## Monetization

**Freemium Model:**

| Tier | Price | Access |
|------|-------|--------|
| Free | $0 | Current season basic + advanced stats, limited filters, ads |
| Pro | $8/mo or $60/yr | All seasons, unlimited filters, saved presets, comparisons, CSV export, no ads |
| Pro+ | $15/mo or $120/yr | All sports, API access (rate-limited), custom dashboards, alerts |
| Data API | $49–199/mo | Full programmatic access, bulk exports, webhook alerts for stat thresholds |

**Additional Revenue Streams:**

- **Affiliate partnerships** — Link to sportsbooks, fantasy platforms, merchandise (context-aware: viewing a player → link to their jersey)
- **Embedded widgets** — Bloggers/media pay to embed live stat widgets ($5–20/mo)
- **Sponsored "Stat of the Day"** — Non-intrusive native ad format, presented as daily featured insight
- **Premium content** — Weekly "StatStack Insights" newsletter with data-driven analysis
- **White-label / B2B** — License the engine to media companies, team websites, or fantasy platforms

## Competitive Landscape

| Competitor | Gap StatStack Fills |
|-----------|-------------------|
| NHL.com / league sites | Surface-level stats, no advanced metrics, poor UX |
| Hockey Reference | Comprehensive but ugly, slow, no interactivity |
| Natural Stat Trick | NHL-only, functional but dated design, limited filtering |
| MoneyPuck | Narrow focus (expected goals), not a general stat browser |
| Elite Prospects | Prospect-focused, limited advanced NHL stats |
| ESPN/The Athletic | Editorial-first, stats are secondary |

**StatStack's edge:** Beautiful UX + comprehensive depth + universal sort/filter + multi-sport ambition. Think "the Bloomberg Terminal of sports stats, but designed by Stripe."

## Tech Stack (Recommended)

- **Frontend:** Next.js + React, TanStack Table (virtualized, sortable), Tailwind CSS, Recharts/D3
- **Backend:** Next.js API routes or FastAPI (Python), Redis for caching
- **Data:** NHL API (free), web scraping pipelines for advanced stats, PostgreSQL
- **Infra:** Vercel (frontend) + Railway/Fly.io (API + DB), Upstash Redis
- **Auth:** Clerk or NextAuth, Stripe for billing

## Key Metrics to Track

- MAU and DAU (target 10K MAU within 6 months of NHL launch)
- Free → Pro conversion rate (target 3–5%)
- Session duration (target 5+ min, indicates exploration)
- Saved filters / comparisons per user (engagement proxy)
- API subscription MRR

## Why Now

The sports betting market is exploding ($10B+ US revenue in 2024, still growing 20%+ YoY). Prop betting specifically drives demand for granular stats. Fantasy sports continues growing. Yet the tools available to individual fans haven't meaningfully improved in design or capability in a decade. AI can now help generate insights on top of the data, creating a moat through intelligent stat narratives and anomaly detection.
