import { cachedFetch, TTL } from "./cache";
import type {
  StandingsResponse,
  SkaterLeadersResponse,
  GoalieLeadersResponse,
  ScoreResponse,
  ScheduleResponse,
  ClubStatsResponse,
  PlayerLandingResponse,
  StatsApiResponse,
  SkaterSummary,
  GoalieSummary,
} from "./types";

// ─── Base URLs ───────────────────────────────────────────────────────────────

const WEB_API = "https://api-web.nhle.com/v1";
const STATS_API = "https://api.nhle.com/stats/rest/en";

// ─── Fetch Wrapper ───────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function fetchJSON<T>(url: string, retries = MAX_RETRIES): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        redirect: "follow",
      });

      if (res.status === 404) {
        throw new NHLApiError(`Not found: ${url}`, 404);
      }
      if (res.status === 429) {
        // Rate limited — wait and retry
        const waitMs = RETRY_DELAY_MS * attempt * 2;
        console.warn(`[NHL API] Rate limited on ${url}, waiting ${waitMs}ms...`);
        await sleep(waitMs);
        continue;
      }
      if (!res.ok) {
        throw new NHLApiError(`HTTP ${res.status} from ${url}`, res.status);
      }

      return (await res.json()) as T;
    } catch (err) {
      if (err instanceof NHLApiError) throw err;
      if (attempt === retries) {
        throw new NHLApiError(
          `Failed after ${retries} attempts: ${url} — ${err instanceof Error ? err.message : err}`,
          0,
        );
      }
      console.warn(`[NHL API] Attempt ${attempt} failed for ${url}, retrying...`);
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  // Unreachable, but TypeScript needs it
  throw new NHLApiError(`Exhausted retries for ${url}`, 0);
}

export class NHLApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "NHLApiError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── API Methods ─────────────────────────────────────────────────────────────

/** Current standings */
export async function getStandings(): Promise<StandingsResponse> {
  return cachedFetch("nhl:standings", () => fetchJSON(`${WEB_API}/standings/now`), TTL.RECENT);
}

/** Skater stat leaders (top 5 per category) */
export async function getSkaterLeaders(): Promise<SkaterLeadersResponse> {
  return cachedFetch(
    "nhl:leaders:skater",
    () => fetchJSON(`${WEB_API}/skater-stats-leaders/current`),
    TTL.RECENT,
  );
}

/** Goalie stat leaders (top 5 per category) */
export async function getGoalieLeaders(): Promise<GoalieLeadersResponse> {
  return cachedFetch(
    "nhl:leaders:goalie",
    () => fetchJSON(`${WEB_API}/goalie-stats-leaders/current`),
    TTL.RECENT,
  );
}

/** Today's scores */
export async function getScores(): Promise<ScoreResponse> {
  return cachedFetch("nhl:scores", () => fetchJSON(`${WEB_API}/score/now`), TTL.LIVE);
}

/** This week's schedule */
export async function getSchedule(): Promise<ScheduleResponse> {
  return cachedFetch("nhl:schedule", () => fetchJSON(`${WEB_API}/schedule/now`), TTL.RECENT);
}

/** Team roster stats for a given team abbreviation (e.g. "TOR") */
export async function getClubStats(teamAbbrev: string): Promise<ClubStatsResponse> {
  return cachedFetch(
    `nhl:club:${teamAbbrev}`,
    () => fetchJSON(`${WEB_API}/club-stats/${teamAbbrev}/now`),
    TTL.RECENT,
  );
}

/** Single player profile / landing page */
export async function getPlayerLanding(playerId: number): Promise<PlayerLandingResponse> {
  return cachedFetch(
    `nhl:player:${playerId}`,
    () => fetchJSON(`${WEB_API}/player/${playerId}/landing`),
    TTL.RECENT,
  );
}

// ─── Legacy Stats API (Bulk Data) ───────────────────────────────────────────

const STATS_PAGE_SIZE = 100;

/**
 * Fetch ALL skater summaries for a season, paginating automatically.
 * seasonId format: 20252026
 */
export async function getAllSkaterStats(seasonId: number): Promise<SkaterSummary[]> {
  return cachedFetch(
    `nhl:stats:skaters:${seasonId}`,
    () => fetchAllPages<SkaterSummary>(`${STATS_API}/skater/summary`, seasonId),
    TTL.STANDARD,
  );
}

/**
 * Fetch ALL goalie summaries for a season, paginating automatically.
 */
export async function getAllGoalieStats(seasonId: number): Promise<GoalieSummary[]> {
  return cachedFetch(
    `nhl:stats:goalies:${seasonId}`,
    () => fetchAllPages<GoalieSummary>(`${STATS_API}/goalie/summary`, seasonId),
    TTL.STANDARD,
  );
}

async function fetchAllPages<T>(baseUrl: string, seasonId: number): Promise<T[]> {
  const allData: T[] = [];
  let start = 0;

  // First request to get total
  const firstPage = await fetchJSON<StatsApiResponse<T>>(
    `${baseUrl}?cayenneExp=seasonId=${seasonId}&limit=${STATS_PAGE_SIZE}&start=0`,
  );
  allData.push(...firstPage.data);
  const total = firstPage.total;

  // Fetch remaining pages
  while (allData.length < total) {
    start += STATS_PAGE_SIZE;
    const page = await fetchJSON<StatsApiResponse<T>>(
      `${baseUrl}?cayenneExp=seasonId=${seasonId}&limit=${STATS_PAGE_SIZE}&start=${start}`,
    );
    allData.push(...page.data);
    if (page.data.length === 0) break; // safety
  }

  return allData;
}

// ─── Convenience: get current season ID ─────────────────────────────────────

export function getCurrentSeasonId(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed
  // NHL season spans Oct-Jun: if before October, it's still last year's season
  if (month >= 10) {
    return year * 10000 + (year + 1);
  }
  return (year - 1) * 10000 + year;
}
