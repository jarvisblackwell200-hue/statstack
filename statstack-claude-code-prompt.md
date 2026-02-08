# StatStack — Claude Code Development Prompt

## Project Overview

Build "StatStack," a visually stunning, high-performance web app for deep sports statistics. Start with NHL. The core value prop: every stat imaginable, sortable by anything, with beautiful data visualization. Think "Bloomberg Terminal meets Stripe's design sensibility, but for sports stats."

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + CSS variables for theming (dark mode default)
- **Tables:** TanStack Table v8 (virtualized rows, multi-sort, column filters, column visibility toggle, sticky headers)
- **Charts:** Recharts for standard charts, D3 for shot maps/heatmaps
- **Database:** PostgreSQL via Prisma ORM
- **Caching:** Redis (Upstash) — cache API responses aggressively (NHL data updates every ~30s during games, hourly otherwise)
- **Auth:** NextAuth.js or Clerk
- **Payments:** Stripe (freemium: Free / Pro $8/mo / Pro+ $15/mo)
- **Deployment:** Vercel

## Phase 1: NHL Core (MVP)

### Data Pipeline

1. **NHL API Integration** (`https://api-web.nhle.com/`)
   - `/v1/player/{id}/landing` — player bio + current season stats
   - `/v1/standings/now` — current standings
   - `/v1/schedule/now` — schedule
   - `/v1/player-stats-leaders/current` — league leaders
   - `/v1/club-stats/{team}/now` — team roster stats
   - `/v1/score/now` — live scores
   - Use the undocumented stats API: `https://api.nhle.com/stats/rest/en/skater/summary?cayenneExp=seasonId=20252026`

2. **Advanced Stats Sources**
   - Scrape or integrate: Natural Stat Trick, MoneyPuck (xG models), Evolving Hockey
   - Key advanced metrics to include: Corsi (CF%, CF/60), Fenwick (FF%, FF/60), expected goals (xGF%, xGA), PDO, zone starts (OZ%, DZ%), HDCF% (high-danger chances), WAR/GAR
   - Store all raw data in PostgreSQL with proper indexing for fast sorting

3. **Data Models (Prisma)**
   ```
   Player: id, name, team, position, age, height, weight, shoots, draftInfo, headshot_url
   PlayerSeasonStats: playerId, season, gamesPlayed, goals, assists, points, plusMinus, pim, ppGoals, ppPoints, shGoals, shots, shootingPct, toi, toiPerGame, faceoffPct, hits, blocks, takeaways, giveaways, ...all advanced stats
   PlayerGameLog: playerId, gameId, date, opponent, ...per-game stats
   GoalieSeasonStats: similar structure with SV%, GAA, QS, GSAA, xGA, etc.
   Team: id, name, abbreviation, division, conference, logo_url
   TeamStats: teamId, season, ...team-level stats
   ```

4. **ETL Cron Jobs**
   - Full refresh: nightly at 5 AM ET
   - Live/recent: every 5 minutes during game hours
   - Historical: one-time backfill from 2007-08 (when NHL tracking improved)

### Pages & Routes

```
/                        → Dashboard (today's scores, stat leaders, trending)
/nhl                     → NHL hub (standings, leaders, schedule)
/nhl/players             → Master player stat table (THE core page)
/nhl/players/[id]        → Player profile (career stats, charts, comparisons)
/nhl/goalies             → Goalie stat table
/nhl/teams               → Team stat table
/nhl/teams/[abbr]        → Team profile (roster, trends, lines)
/nhl/compare             → Player comparison tool (2-5 players)
/nhl/leaders             → Leaderboards by stat category
```

### Core Page: `/nhl/players` (Player Stats Table)

This is the product's centerpiece. Requirements:

**Columns (200+ available, user toggles visibility):**
- **Bio:** Name, Team, Pos, Age, GP
- **Scoring:** G, A, P, P/GP, PPG, PPA, SHG, SHA, GWG, OTG, First Goals
- **Shooting:** S, S%, SOG, Individual CF, ixG, Missed Shots, Shots/GP
- **Ice Time:** TOI, TOI/GP, EV TOI, PP TOI, SH TOI
- **Physical:** Hits, Hits/60, Blocks, Blocks/60, PIM, Fights, Giveaways, Takeaways
- **Possession (EV):** CF%, CF/60, CA/60, FF%, Relative CF%, Zone Start% (OZ/DZ/NZ)
- **Expected Goals (EV):** xGF, xGA, xGF%, xG+/-, xGAR
- **On-Ice Impact:** On-Ice SH%, On-Ice SV%, PDO, GF/60, GA/60, HDCF%, HDCA%
- **WAR/Value:** GAR, WAR, Offensive GAR, Defensive GAR
- **Situational:** All above split by EV/PP/SH, Home/Away, Period, Score State

**Table UX:**
- Virtualized rendering (react-window or TanStack Virtual) — must handle 800+ rows × 200+ columns smoothly
- Multi-column sort (Shift+click for secondary sort)
- Column groups collapsible (e.g., expand "Possession" to show CF%, FF%, etc.)
- Quick filter bar: position, team, age range, min GP
- Advanced filter builder: "WHERE goals > 20 AND cf_pct > 52 AND age < 25"
- Column search (type to find a stat)
- Conditional formatting: cell background gradient (red-yellow-green) based on percentile rank
- Sparklines in cells for trend data (last 10 games)
- Sticky first 2 columns (Name, Team)
- URL state: all sorts/filters encoded in URL params for sharing
- Saved views: logged-in users save filter/sort/column presets

**Visual Design:**
- Dark theme default (charcoal #1a1a2e background, subtle card borders)
- Light theme option
- Monospace numbers in tables for alignment
- Hover rows highlight with subtle glow
- Team colors used as accents (small color bar next to team abbreviation)
- Player headshots in table rows (small, 24px circular)
- Responsive: on mobile, switch to card view with swipeable stat groups

### Player Profile Page: `/nhl/players/[id]`

- Hero section: headshot, name, team logo, key stats, bio
- Career stats table (each season as a row, same sortable format)
- Charts: goals/points trend by season (line), shooting % rolling (area), ice time distribution (stacked bar)
- Shot map: D3 heatmap on rink SVG
- Percentile rankings: horizontal bar chart vs. position peers
- Game log: expandable, sortable
- "Compare" button → pre-populates comparison page

### Player Comparison Page: `/nhl/compare`

- Select 2-5 players via search autocomplete
- Radar chart with selectable stat categories
- Side-by-side stat table with winner highlighting
- Percentile overlay chart
- Season-over-season line charts overlaid
- Share as image (html2canvas) or URL

### Team Page: `/nhl/teams/[abbr]`

- Roster stats table (same sortable engine as main table, scoped to team)
- Line combinations with combined stats
- Team trends: rolling 10-game charts for GF/GA, CF%, xGF%
- Special teams breakdowns: PP%, PK%, PP formation stats
- Schedule with results

### Design System

```
Colors:
  --bg-primary: #0f0f1a (deep navy-black)
  --bg-card: #1a1a2e
  --bg-hover: #252542
  --text-primary: #e8e8f0
  --text-secondary: #8888a0
  --accent: #6366f1 (indigo)
  --positive: #22c55e
  --negative: #ef4444
  --warning: #f59e0b

Typography:
  Headings: Inter or Geist
  Body: Inter or Geist
  Table numbers: JetBrains Mono or Geist Mono

Spacing: 4px base grid
Border radius: 8px cards, 6px buttons, 4px inputs
```

### Performance Requirements

- First Contentful Paint < 1.5s
- Table renders 800 rows in < 100ms (virtual scrolling)
- Sort operation < 50ms (client-side on pre-loaded data)
- Filter updates < 100ms
- API response (cached) < 200ms

## Phase 2: Enhancements

- AI-powered insights: "StatStack AI" — natural language stat queries ("Who leads the league in goals by Swedish players under 25?")
- Push notifications for stat milestones
- Weekly email digest with personalized stat highlights
- Embeddable widgets for blogs/media
- CSV/JSON export (Pro feature)
- Historical season selector (back to 2007-08)
- Playoff stats mode

## Phase 3: Multi-Sport Expansion

Replicate the architecture for NFL, NBA, MLB, Soccer. Each sport gets its own data pipeline, stat taxonomy, and visual components (e.g., shot charts for NBA, spray charts for MLB, passing networks for soccer). The table engine, comparison tool, and design system are shared.

## Key Development Principles

1. **Data density without clutter** — Show lots of data but use visual hierarchy, whitespace, and progressive disclosure (column groups, expandable sections)
2. **Speed is a feature** — Pre-load data, use virtual scrolling, cache aggressively, avoid layout shifts
3. **URL as state** — Every view should be shareable via URL (sorts, filters, columns, comparisons)
4. **Mobile-aware** — Tables become card-based on small screens; swipe between stat groups
5. **Accessibility** — Keyboard navigation for tables, screen reader support, color-blind-friendly palettes

## Getting Started (First Session)

1. `npx create-next-app@latest statstack --typescript --tailwind --app --src-dir`
2. Set up Prisma with PostgreSQL schema for NHL data models
3. Build the NHL API client with caching layer
4. Create the data seeding script (fetch current season data)
5. Build the core stat table component with TanStack Table
6. Implement the `/nhl/players` page with basic sorting and filtering
7. Add dark theme and design system tokens
8. Deploy to Vercel for staging
