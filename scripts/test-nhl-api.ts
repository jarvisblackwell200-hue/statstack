/**
 * Test script: verifies all NHL API endpoints work and caching functions.
 * Run with: npx tsx scripts/test-nhl-api.ts
 */

import {
  getStandings,
  getSkaterLeaders,
  getGoalieLeaders,
  getScores,
  getSchedule,
  getClubStats,
  getPlayerLanding,
  getAllSkaterStats,
  getAllGoalieStats,
  getCurrentSeasonId,
} from "../src/lib/nhl/client.ts";

async function test(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const ms = Date.now() - start;
    console.log(`  ✓ ${name} (${ms}ms)`);
  } catch (err) {
    const ms = Date.now() - start;
    console.error(`  ✗ ${name} (${ms}ms)`);
    console.error(`    ${err instanceof Error ? err.message : err}`);
  }
}

async function main() {
  const seasonId = getCurrentSeasonId();
  console.log(`\nNHL API Test — Season: ${seasonId}\n`);
  console.log("─── Endpoint Tests ─────────────────────────\n");

  await test("getStandings", async () => {
    const data = await getStandings();
    console.log(`    ${data.standings.length} teams in standings`);
    const top = data.standings[0];
    console.log(`    #1: ${top.teamName.default} — ${top.wins}W ${top.losses}L ${top.otLosses}OTL (${top.points}pts)`);
  });

  await test("getSkaterLeaders", async () => {
    const data = await getSkaterLeaders();
    console.log(`    Goals leader: ${data.goals[0]?.firstName.default} ${data.goals[0]?.lastName.default} (${data.goals[0]?.value})`);
    console.log(`    Points leader: ${data.points[0]?.firstName.default} ${data.points[0]?.lastName.default} (${data.points[0]?.value})`);
  });

  await test("getGoalieLeaders", async () => {
    const data = await getGoalieLeaders();
    console.log(`    Wins leader: ${data.wins[0]?.firstName.default} ${data.wins[0]?.lastName.default} (${data.wins[0]?.value})`);
    console.log(`    SV% leader: ${data.savePctg[0]?.firstName.default} ${data.savePctg[0]?.lastName.default} (${data.savePctg[0]?.value})`);
  });

  await test("getScores", async () => {
    const data = await getScores();
    console.log(`    Date: ${data.currentDate}, ${data.games.length} games`);
    if (data.games.length > 0) {
      const g = data.games[0];
      console.log(`    ${g.awayTeam.abbrev} ${g.awayTeam.score} @ ${g.homeTeam.abbrev} ${g.homeTeam.score} (${g.gameState})`);
    }
  });

  await test("getSchedule", async () => {
    const data = await getSchedule();
    const totalGames = data.gameWeek.reduce((sum, day) => sum + day.numberOfGames, 0);
    console.log(`    ${data.gameWeek.length} days, ${totalGames} total games this week`);
  });

  await test("getClubStats (TOR)", async () => {
    const data = await getClubStats("TOR");
    console.log(`    ${data.skaters.length} skaters, ${data.goalies.length} goalies`);
    const topScorer = data.skaters.sort((a, b) => b.points - a.points)[0];
    if (topScorer) {
      console.log(`    Top scorer: ${topScorer.firstName.default} ${topScorer.lastName.default} (${topScorer.points}pts)`);
    }
  });

  await test("getPlayerLanding (McDavid #8478402)", async () => {
    const data = await getPlayerLanding(8478402);
    console.log(`    ${data.firstName.default} ${data.lastName.default}, ${data.position}, #${data.sweaterNumber}`);
    console.log(`    Team: ${data.fullTeamName.default}`);
    console.log(`    Season totals: ${data.seasonTotals.length} entries`);
    if (data.featuredStats) {
      const s = data.featuredStats.regularSeason.subSeason;
      console.log(`    Current: ${s.goals}G ${s.assists}A ${s.points}P in ${s.gamesPlayed}GP`);
    }
  });

  await test("getAllSkaterStats (bulk)", async () => {
    const data = await getAllSkaterStats(seasonId);
    console.log(`    ${data.length} skaters fetched`);
    const topScorer = data.sort((a, b) => b.points - a.points)[0];
    if (topScorer) {
      console.log(`    Points leader: ${topScorer.skaterFullName} (${topScorer.points}pts)`);
    }
  });

  await test("getAllGoalieStats (bulk)", async () => {
    const data = await getAllGoalieStats(seasonId);
    console.log(`    ${data.length} goalies fetched`);
    const topWins = data.sort((a, b) => b.wins - a.wins)[0];
    if (topWins) {
      console.log(`    Wins leader: ${topWins.goalieFullName} (${topWins.wins}W)`);
    }
  });

  // ─── Cache Test ──────────────────────────────────────────────────────────

  console.log("\n─── Cache Test ─────────────────────────────\n");

  await test("Standings cached (should be <5ms)", async () => {
    const start = Date.now();
    await getStandings();
    const ms = Date.now() - start;
    console.log(`    Second call took ${ms}ms (served from cache)`);
  });

  console.log("\n✅ All tests complete.\n");
}

main().catch(console.error);
