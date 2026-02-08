import { prisma } from "@/lib/prisma";
import type { SkaterRow, GoalieRow } from "@/components/stat-table/types";

const CURRENT_SEASON = "20252026";

export async function getSkaterRows(
  season: string = CURRENT_SEASON,
): Promise<SkaterRow[]> {
  const stats = await prisma.playerSeasonStats.findMany({
    where: {
      season,
      gameType: "regular",
      player: {
        position: { not: "G" },
      },
    },
    include: {
      player: {
        include: {
          team: true,
        },
      },
    },
    orderBy: { points: "desc" },
  });

  return stats.map((s) => ({
    id: s.player.id,
    nhlId: s.player.nhlId,
    firstName: s.player.firstName,
    lastName: s.player.lastName,
    fullName: s.player.fullName,
    position: s.player.position,
    headshotUrl: s.player.headshotUrl,
    teamAbbreviation: s.player.team?.abbreviation ?? "—",
    teamLogoUrl: s.player.team?.logoUrl ?? null,

    gamesPlayed: s.gamesPlayed,
    goals: s.goals,
    assists: s.assists,
    points: s.points,
    plusMinus: s.plusMinus,
    pim: s.pim,

    ppGoals: s.ppGoals,
    ppAssists: s.ppAssists,
    ppPoints: s.ppPoints,
    shGoals: s.shGoals,
    shAssists: s.shAssists,
    shPoints: s.shPoints,

    gameWinningGoals: s.gameWinningGoals,
    overtimeGoals: s.overtimeGoals,

    shots: s.shots,
    shootingPct: s.shootingPct,

    toi: s.toi,
    toiPerGame: s.toiPerGame,
    evToi: s.evToi,
    ppToi: s.ppToi,
    shToi: s.shToi,

    hits: s.hits,
    blocks: s.blocks,
    takeaways: s.takeaways,
    giveaways: s.giveaways,

    faceoffPct: s.faceoffPct,
    faceoffsWon: s.faceoffsWon,
    faceoffsLost: s.faceoffsLost,

    corsiForPct: s.corsiForPct,
    corsiRelPct: s.corsiRelPct,
    fenwickForPct: s.fenwickForPct,
    xGoalsForPct: s.xGoalsForPct,
    xGoalsDiff: s.xGoalsDiff,
    war: s.war,
  }));
}

export async function getGoalieRows(
  season: string = CURRENT_SEASON,
): Promise<GoalieRow[]> {
  const stats = await prisma.goalieSeasonStats.findMany({
    where: {
      season,
      gameType: "regular",
    },
    include: {
      player: {
        include: {
          team: true,
        },
      },
    },
    orderBy: { wins: "desc" },
  });

  return stats.map((s) => ({
    id: s.player.id,
    nhlId: s.player.nhlId,
    firstName: s.player.firstName,
    lastName: s.player.lastName,
    fullName: s.player.fullName,
    headshotUrl: s.player.headshotUrl,
    teamAbbreviation: s.player.team?.abbreviation ?? "—",
    teamLogoUrl: s.player.team?.logoUrl ?? null,

    gamesPlayed: s.gamesPlayed,
    gamesStarted: s.gamesStarted,
    wins: s.wins,
    losses: s.losses,
    otLosses: s.otLosses,

    savePercentage: s.savePercentage,
    goalsAgainstAvg: s.goalsAgainstAvg,
    shutouts: s.shutouts,
    saves: s.saves,
    shotsAgainst: s.shotsAgainst,
    goalsAgainst: s.goalsAgainst,
    toi: s.toi,

    qualityStarts: s.qualityStarts,
    qualityStartsPct: s.qualityStartsPct,
    goalsSavedAboveAverage: s.goalsSavedAboveAverage,
    goalsPrevented: s.goalsPrevented,

    evSavePercentage: s.evSavePercentage,
    ppSavePercentage: s.ppSavePercentage,
    shSavePercentage: s.shSavePercentage,
  }));
}
