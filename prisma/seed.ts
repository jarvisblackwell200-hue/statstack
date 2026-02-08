import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import {
  getStandings,
  getClubStats,
  getAllSkaterStats,
  getAllGoalieStats,
  getPlayerLanding,
  getCurrentSeasonId,
} from "../src/lib/nhl/client.ts";
import type { StandingsTeam } from "../src/lib/nhl/types.ts";

// Use direct TCP connection for seed operations (the HTTP/accelerate
// connection doesn't support all Prisma operations in prisma dev)
const DIRECT_URL = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";
const pool = new pg.Pool({ connectionString: DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const seasonId = getCurrentSeasonId();
const season = String(seasonId);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ls(value: { default: string } | string): string {
  if (typeof value === "string") return value;
  return value.default;
}

function progress(current: number, total: number, label: string) {
  process.stdout.write(`\r  ${label}: ${current}/${total}`);
  if (current === total) process.stdout.write("\n");
}

// ─── Seed Teams (from standings — gives us all 32 teams + stats) ─────────────

async function seedTeams() {
  console.log("Seeding teams from standings...");
  const standings = await getStandings();

  // We need numeric team IDs. The standings don't have them, but we can
  // get them from club-stats. Fetch one team's club-stats to get roster
  // player IDs, but actually the simplest approach: use the team abbrev
  // as unique key and fill nhlId from club-stats later.
  // For now, use a deterministic mapping from the score/schedule APIs.
  // OR: just assign nhlId = 0 for now and update when we fetch club stats.

  // Actually, let's get team IDs by fetching club stats for each team.
  // The club-stats response itself doesn't include team ID either.
  // The standings have team logo URLs which encode the abbreviation.
  // Let's just use abbreviation as the unique identifier and set nhlId
  // from the player landing data when we seed players.

  const teamAbbrevs: string[] = [];

  for (let idx = 0; idx < standings.standings.length; idx++) {
    const t = standings.standings[idx];
    const abbrev = ls(t.teamAbbrev);
    teamAbbrevs.push(abbrev);

    // Check if team exists already
    const existing = await prisma.team.findUnique({ where: { abbreviation: abbrev } });

    if (existing) {
      await prisma.team.update({
        where: { abbreviation: abbrev },
        data: {
          name: ls(t.teamCommonName),
          fullName: `${ls(t.placeName)} ${ls(t.teamCommonName)}`,
          division: t.divisionName,
          conference: t.conferenceName,
          logoUrl: t.teamLogo,
        },
      });
    } else {
      // Use a negative placeholder nhlId (unique per team) until we get the real ID
      await prisma.team.create({
        data: {
          nhlId: -(idx + 1),
          name: ls(t.teamCommonName),
          abbreviation: abbrev,
          fullName: `${ls(t.placeName)} ${ls(t.teamCommonName)}`,
          division: t.divisionName,
          conference: t.conferenceName,
          logoUrl: t.teamLogo,
        },
      });
    }
  }

  console.log(`  ✓ ${standings.standings.length} teams upserted`);
  return { standings: standings.standings, teamAbbrevs };
}

// ─── Seed Team Stats (from standings data) ───────────────────────────────────

async function seedTeamStats(standingsData: StandingsTeam[]) {
  console.log("Seeding team season stats...");

  for (const t of standingsData) {
    const abbrev = ls(t.teamAbbrev);
    const team = await prisma.team.findUnique({ where: { abbreviation: abbrev } });
    if (!team) continue;

    await prisma.teamSeasonStats.upsert({
      where: {
        teamId_season_gameType: { teamId: team.id, season, gameType: "regular" },
      },
      create: {
        teamId: team.id,
        season,
        gameType: "regular",
        gamesPlayed: t.gamesPlayed,
        wins: t.wins,
        losses: t.losses,
        otLosses: t.otLosses,
        points: t.points,
        pointsPct: t.pointPctg,
        goalsFor: t.goalFor,
        goalsAgainst: t.goalAgainst,
        goalDiff: t.goalDifferential,
      },
      update: {
        gamesPlayed: t.gamesPlayed,
        wins: t.wins,
        losses: t.losses,
        otLosses: t.otLosses,
        points: t.points,
        pointsPct: t.pointPctg,
        goalsFor: t.goalFor,
        goalsAgainst: t.goalAgainst,
        goalDiff: t.goalDifferential,
      },
    });
  }

  console.log(`  ✓ ${standingsData.length} team stats upserted`);
}

// ─── Seed Players + Skater Stats (from bulk stats API) ───────────────────────

async function seedSkatersFromBulkApi() {
  console.log("Fetching bulk skater stats...");
  const skaters = await getAllSkaterStats(seasonId);
  console.log(`  Fetched ${skaters.length} skaters from stats API`);

  // Build team abbreviation → DB ID lookup
  const teams = await prisma.team.findMany();
  const teamByAbbrev = new Map(teams.map((t) => [t.abbreviation, t]));

  let created = 0;
  let updated = 0;

  for (let i = 0; i < skaters.length; i++) {
    const s = skaters[i];
    progress(i + 1, skaters.length, "Upserting skaters");

    // Parse name parts from fullName
    const nameParts = s.skaterFullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || s.lastName;

    // Resolve team (use first team if traded mid-season)
    const primaryAbbrev = s.teamAbbrevs.split(",")[0]?.trim();
    const team = primaryAbbrev ? teamByAbbrev.get(primaryAbbrev) : null;

    // Upsert player
    const player = await prisma.player.upsert({
      where: { nhlId: s.playerId },
      create: {
        nhlId: s.playerId,
        firstName,
        lastName,
        fullName: s.skaterFullName,
        position: s.positionCode,
        shootsCatches: s.shootsCatches,
        teamId: team?.id ?? null,
        isActive: true,
      },
      update: {
        fullName: s.skaterFullName,
        position: s.positionCode,
        shootsCatches: s.shootsCatches,
        teamId: team?.id ?? null,
        isActive: true,
      },
    });

    // Update team nhlId if we can infer it from player data
    // (we'll do this from player landing pages in enrichPlayers)

    // Upsert season stats
    const existing = await prisma.playerSeasonStats.findUnique({
      where: {
        playerId_season_gameType: { playerId: player.id, season, gameType: "regular" },
      },
    });

    const statsData = {
      gamesPlayed: s.gamesPlayed,
      goals: s.goals,
      assists: s.assists,
      points: s.points,
      plusMinus: s.plusMinus,
      pim: s.penaltyMinutes,
      ppGoals: s.ppGoals,
      ppPoints: s.ppPoints,
      shGoals: s.shGoals,
      shPoints: s.shPoints,
      gameWinningGoals: s.gameWinningGoals,
      overtimeGoals: s.otGoals,
      shots: s.shots,
      shootingPct: s.shootingPct,
      toiPerGame: s.timeOnIcePerGame,
      faceoffPct: s.faceoffWinPct,
    };

    if (existing) {
      await prisma.playerSeasonStats.update({
        where: { id: existing.id },
        data: statsData,
      });
      updated++;
    } else {
      await prisma.playerSeasonStats.create({
        data: {
          playerId: player.id,
          season,
          gameType: "regular",
          ...statsData,
        },
      });
      created++;
    }
  }

  console.log(`  ✓ ${skaters.length} skaters processed (${created} created, ${updated} updated)`);
}

// ─── Seed Goalie Stats (from bulk stats API) ─────────────────────────────────

async function seedGoaliesFromBulkApi() {
  console.log("Fetching bulk goalie stats...");
  const goalies = await getAllGoalieStats(seasonId);
  console.log(`  Fetched ${goalies.length} goalies from stats API`);

  const teams = await prisma.team.findMany();
  const teamByAbbrev = new Map(teams.map((t) => [t.abbreviation, t]));

  let created = 0;
  let updated = 0;

  for (let i = 0; i < goalies.length; i++) {
    const g = goalies[i];
    progress(i + 1, goalies.length, "Upserting goalies");

    const nameParts = g.goalieFullName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || g.lastName;

    const primaryAbbrev = g.teamAbbrevs.split(",")[0]?.trim();
    const team = primaryAbbrev ? teamByAbbrev.get(primaryAbbrev) : null;

    // Upsert player record (goalies are also in the Player table)
    const player = await prisma.player.upsert({
      where: { nhlId: g.playerId },
      create: {
        nhlId: g.playerId,
        firstName,
        lastName,
        fullName: g.goalieFullName,
        position: "G",
        shootsCatches: g.shootsCatches,
        teamId: team?.id ?? null,
        isActive: true,
      },
      update: {
        fullName: g.goalieFullName,
        position: "G",
        shootsCatches: g.shootsCatches,
        teamId: team?.id ?? null,
        isActive: true,
      },
    });

    // Upsert goalie season stats
    const existing = await prisma.goalieSeasonStats.findUnique({
      where: {
        playerId_season_gameType: { playerId: player.id, season, gameType: "regular" },
      },
    });

    const statsData = {
      gamesPlayed: g.gamesPlayed,
      gamesStarted: g.gamesStarted,
      wins: g.wins,
      losses: g.losses,
      otLosses: g.otLosses,
      savePercentage: g.savePct,
      goalsAgainstAvg: g.goalsAgainstAverage,
      shutouts: g.shutouts,
      saves: g.saves,
      shotsAgainst: g.shotsAgainst,
      goalsAgainst: g.goalsAgainst,
      toi: g.timeOnIce,
    };

    if (existing) {
      await prisma.goalieSeasonStats.update({
        where: { id: existing.id },
        data: statsData,
      });
      updated++;
    } else {
      await prisma.goalieSeasonStats.create({
        data: {
          playerId: player.id,
          season,
          gameType: "regular",
          ...statsData,
        },
      });
      created++;
    }
  }

  console.log(`  ✓ ${goalies.length} goalies processed (${created} created, ${updated} updated)`);
}

// ─── Enrich Players (headshots, bio from club-stats) ─────────────────────────

async function enrichPlayersFromClubStats(teamAbbrevs: string[]) {
  console.log("Enriching players with headshots from club stats...");

  const teams = await prisma.team.findMany();
  const teamByAbbrev = new Map(teams.map((t) => [t.abbreviation, t]));

  let enriched = 0;

  for (let i = 0; i < teamAbbrevs.length; i++) {
    const abbrev = teamAbbrevs[i];
    progress(i + 1, teamAbbrevs.length, "Fetching club stats");

    try {
      const clubStats = await getClubStats(abbrev);

      // Update skaters with headshot URLs
      for (const s of clubStats.skaters) {
        await prisma.player.updateMany({
          where: { nhlId: s.playerId },
          data: { headshotUrl: s.headshot },
        });
        enriched++;
      }

      // Update goalies with headshot URLs
      for (const g of clubStats.goalies) {
        await prisma.player.updateMany({
          where: { nhlId: g.playerId },
          data: { headshotUrl: g.headshot },
        });
        enriched++;
      }
    } catch (err) {
      console.warn(`\n  ⚠ Failed to fetch club stats for ${abbrev}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`  ✓ ${enriched} players enriched with headshots`);
}

// ─── Enrich a sample of players with full bio data ───────────────────────────

async function enrichTopPlayerBios() {
  console.log("Enriching top players with full bio data...");

  // Get top 50 scorers to enrich with full profile data (height, weight, birthdate, draft)
  const topPlayers = await prisma.playerSeasonStats.findMany({
    where: { season, gameType: "regular" },
    orderBy: { points: "desc" },
    take: 50,
    include: { player: true },
  });

  let enriched = 0;

  for (let i = 0; i < topPlayers.length; i++) {
    const stat = topPlayers[i];
    progress(i + 1, topPlayers.length, "Enriching bios");

    try {
      const landing = await getPlayerLanding(stat.player.nhlId);

      await prisma.player.update({
        where: { id: stat.player.id },
        data: {
          height: landing.heightInInches,
          weight: landing.weightInPounds,
          birthDate: new Date(landing.birthDate),
          birthCity: ls(landing.birthCity),
          birthCountry: landing.birthCountry,
          draftYear: landing.draftDetails?.year ?? null,
          draftRound: landing.draftDetails?.round ?? null,
          draftPick: landing.draftDetails?.overallPick ?? null,
          headshotUrl: landing.headshot,
        },
      });

      // Also update the team's nhlId if we have it
      if (landing.currentTeamId && landing.currentTeamAbbrev) {
        await prisma.team.updateMany({
          where: { abbreviation: landing.currentTeamAbbrev, nhlId: 0 },
          data: { nhlId: landing.currentTeamId },
        });
      }

      enriched++;
    } catch (err) {
      // Player landing may 404 for some players — skip
      if (err instanceof Error && err.message.includes("404")) continue;
      console.warn(`\n  ⚠ Failed to enrich ${stat.player.fullName}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`  ✓ ${enriched} players enriched with full bio`);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

async function printSummary() {
  const [teamCount, playerCount, skaterStatCount, goalieStatCount, teamStatCount] =
    await Promise.all([
      prisma.team.count(),
      prisma.player.count(),
      prisma.playerSeasonStats.count(),
      prisma.goalieSeasonStats.count(),
      prisma.teamSeasonStats.count(),
    ]);

  console.log("\n─── Database Summary ───────────────────────");
  console.log(`  Teams:              ${teamCount}`);
  console.log(`  Players:            ${playerCount}`);
  console.log(`  Skater stat rows:   ${skaterStatCount}`);
  console.log(`  Goalie stat rows:   ${goalieStatCount}`);
  console.log(`  Team stat rows:     ${teamStatCount}`);
  console.log("────────────────────────────────────────────\n");
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏒 StatStack Seed — Season ${season}\n`);
  const startTime = Date.now();

  // 1. Teams from standings
  const { standings, teamAbbrevs } = await seedTeams();

  // 2. Team season stats from standings
  await seedTeamStats(standings);

  // 3. All skaters (player records + season stats)
  await seedSkatersFromBulkApi();

  // 4. All goalies (player records + season stats)
  await seedGoaliesFromBulkApi();

  // 5. Enrich with headshots from club stats
  await enrichPlayersFromClubStats(teamAbbrevs);

  // 6. Enrich top players with full bios
  await enrichTopPlayerBios();

  // Summary
  await printSummary();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Seed complete in ${elapsed}s\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("\n❌ Seed failed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
