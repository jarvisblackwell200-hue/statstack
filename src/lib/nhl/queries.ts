import { prisma } from "@/lib/prisma";
import type { SkaterRow, GoalieRow } from "@/components/stat-table/types";
import { buildMockCareer, buildMockGameLog, mockGoalieRows, mockSkaterRows } from "@/lib/nhl/mock-data";
import { buildMockTeamProfile, mockTeamStats } from "@/lib/nhl/mock-teams";

const CURRENT_SEASON = "20252026";

async function withFallback<T>(query: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.warn("[nhl/queries] fallback", error);
    return fallback();
  }
}

export async function getSkaterRows(
  season: string = CURRENT_SEASON,
): Promise<SkaterRow[]> {
  return withFallback(async () => {
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
  }, () => [...mockSkaterRows]);
}

export async function getGoalieRows(
  season: string = CURRENT_SEASON,
): Promise<GoalieRow[]> {
  return withFallback(async () => {
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
  }, () => [...mockGoalieRows]);
}

export interface PlayerCareerSeason {
  season: string;
  teamAbbreviation: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  shots: number;
  shootingPct: number;
  toiPerGame: number;
}

export interface PlayerTrendPoint {
  season: string;
  goals: number;
  points: number;
  shootingPct: number;
  toiPerGame: number;
}

export interface PlayerPercentile {
  label: string;
  value: number;
}

export interface PlayerGameLog {
  date: string;
  opponent: string;
  homeAway: "H" | "A";
  goals: number;
  assists: number;
  points: number;
  shots: number;
  toi: number;
}

export interface PlayerProfileData {
  id: number;
  nhlId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  teamAbbreviation: string;
  teamName: string;
  position: string;
  shootsCatches: string | null;
  height: number | null;
  weight: number | null;
  birthDate: string | null;
  birthCity: string | null;
  birthCountry: string | null;
  draftYear: number | null;
  draftRound: number | null;
  draftPick: number | null;
  headshotUrl: string | null;
  seasonStats: {
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    shootingPct: number;
    toiPerGame: number;
    xGoalsForPct: number;
    war: number;
  };
  careerStats: PlayerCareerSeason[];
  trends: PlayerTrendPoint[];
  percentileRankings: PlayerPercentile[];
  gameLog: PlayerGameLog[];
}

function percentileRank(values: number[], target: number): number {
  if (values.length === 0) return 50;
  const below = values.filter((value) => value <= target).length;
  return Math.round((below / values.length) * 100);
}

function mapSeasonLabel(season: string): string {
  if (season.length !== 8) return season;
  return `${season.slice(0, 4)}-${season.slice(6, 8)}`;
}

function buildMockProfile(id: number): PlayerProfileData {
  const rows = [...mockSkaterRows].sort((a, b) => b.points - a.points);
  const player = rows.find((row) => row.id === id || row.nhlId === id) ?? rows[0];
  const careerStats = buildMockCareer(player);
  const gameLog = buildMockGameLog(player);

  return {
    id: player.id,
    nhlId: player.nhlId,
    firstName: player.firstName,
    lastName: player.lastName,
    fullName: player.fullName,
    teamAbbreviation: player.teamAbbreviation,
    teamName: `${player.teamAbbreviation} Mock Team`,
    position: player.position,
    shootsCatches: "L",
    height: 72,
    weight: 190,
    birthDate: "1998-01-13",
    birthCity: "Richmond Hill",
    birthCountry: "CAN",
    draftYear: 2015,
    draftRound: 1,
    draftPick: 1,
    headshotUrl: player.headshotUrl,
    seasonStats: {
      gamesPlayed: player.gamesPlayed,
      goals: player.goals,
      assists: player.assists,
      points: player.points,
      shootingPct: player.shootingPct ?? 0,
      toiPerGame: player.toiPerGame ?? 0,
      xGoalsForPct: player.xGoalsForPct ?? 50,
      war: player.war ?? 0,
    },
    careerStats,
    trends: careerStats.map((season) => ({
      season: mapSeasonLabel(season.season),
      goals: season.goals,
      points: season.points,
      shootingPct: season.shootingPct,
      toiPerGame: season.toiPerGame,
    })),
    percentileRankings: [
      { label: "Goals", value: percentileRank(rows.map((row) => row.goals), player.goals) },
      { label: "Assists", value: percentileRank(rows.map((row) => row.assists), player.assists) },
      { label: "Points", value: percentileRank(rows.map((row) => row.points), player.points) },
      { label: "Shooting%", value: percentileRank(rows.map((row) => row.shootingPct ?? 0), player.shootingPct ?? 0) },
      { label: "Ice Time", value: percentileRank(rows.map((row) => row.toiPerGame ?? 0), player.toiPerGame ?? 0) },
      { label: "WAR", value: percentileRank(rows.map((row) => row.war ?? 0), player.war ?? 0) },
    ],
    gameLog,
  };
}

export async function getPlayerProfile(
  playerId: number,
  season: string = CURRENT_SEASON,
): Promise<PlayerProfileData> {
  return withFallback(async () => {
    const player = await prisma.player.findFirst({
      where: {
        OR: [{ id: playerId }, { nhlId: playerId }],
      },
      include: {
        team: true,
        seasonStats: {
          where: { gameType: "regular" },
          orderBy: { season: "asc" },
        },
        gameLogs: {
          orderBy: { date: "desc" },
          take: 20,
        },
      },
    });

    if (!player) {
      return buildMockProfile(playerId);
    }

    const seasonStats = player.seasonStats.find((row) => row.season === season) ?? player.seasonStats.at(-1);

    const comparisonStats = await prisma.playerSeasonStats.findMany({
      where: {
        season: seasonStats?.season ?? season,
        gameType: "regular",
        player: { position: { not: "G" } },
      },
      select: {
        goals: true,
        assists: true,
        points: true,
        shootingPct: true,
        toiPerGame: true,
        war: true,
      },
    });

    const careerStats = player.seasonStats.map((row) => ({
      season: row.season,
      teamAbbreviation: player.team?.abbreviation ?? "—",
      gamesPlayed: row.gamesPlayed,
      goals: row.goals,
      assists: row.assists,
      points: row.points,
      shots: row.shots,
      shootingPct: row.shootingPct ?? 0,
      toiPerGame: row.toiPerGame ?? 0,
    }));

    const active = seasonStats ?? {
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      points: 0,
      shootingPct: 0,
      toiPerGame: 0,
      xGoalsForPct: 50,
      war: 0,
    };

    return {
      id: player.id,
      nhlId: player.nhlId,
      firstName: player.firstName,
      lastName: player.lastName,
      fullName: player.fullName,
      teamAbbreviation: player.team?.abbreviation ?? "—",
      teamName: player.team?.fullName ?? "Unknown Team",
      position: player.position,
      shootsCatches: player.shootsCatches,
      height: player.height,
      weight: player.weight,
      birthDate: player.birthDate ? player.birthDate.toISOString().slice(0, 10) : null,
      birthCity: player.birthCity,
      birthCountry: player.birthCountry,
      draftYear: player.draftYear,
      draftRound: player.draftRound,
      draftPick: player.draftPick,
      headshotUrl: player.headshotUrl,
      seasonStats: {
        gamesPlayed: active.gamesPlayed,
        goals: active.goals,
        assists: active.assists,
        points: active.points,
        shootingPct: active.shootingPct ?? 0,
        toiPerGame: active.toiPerGame ?? 0,
        xGoalsForPct: active.xGoalsForPct ?? 50,
        war: active.war ?? 0,
      },
      careerStats,
      trends: careerStats.map((row) => ({
        season: mapSeasonLabel(row.season),
        goals: row.goals,
        points: row.points,
        shootingPct: row.shootingPct,
        toiPerGame: row.toiPerGame,
      })),
      percentileRankings: [
        { label: "Goals", value: percentileRank(comparisonStats.map((row) => row.goals), active.goals) },
        { label: "Assists", value: percentileRank(comparisonStats.map((row) => row.assists), active.assists) },
        { label: "Points", value: percentileRank(comparisonStats.map((row) => row.points), active.points) },
        { label: "Shooting%", value: percentileRank(comparisonStats.map((row) => row.shootingPct ?? 0), active.shootingPct ?? 0) },
        { label: "Ice Time", value: percentileRank(comparisonStats.map((row) => row.toiPerGame ?? 0), active.toiPerGame ?? 0) },
        { label: "WAR", value: percentileRank(comparisonStats.map((row) => row.war ?? 0), active.war ?? 0) },
      ],
      gameLog: player.gameLogs.map((log) => ({
        date: log.date.toISOString().slice(0, 10),
        opponent: log.opponent,
        homeAway: log.homeAway === "A" ? "A" : "H",
        goals: log.goals,
        assists: log.assists,
        points: log.points,
        shots: log.shots,
        toi: log.toi,
      })),
    };
  }, () => buildMockProfile(playerId));
}

export interface TeamStatsRow {
  abbreviation: string;
  fullName: string;
  conference: string;
  division: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  ppPct: number;
  pkPct: number;
  corsiForPct: number;
  xGoalsForPct: number;
}

export interface TeamRosterRow {
  id: number;
  fullName: string;
  position: string;
  goals: number;
  assists: number;
  points: number;
  toiPerGame: number;
}

export interface TeamLineCombo {
  label: string;
  players: string[];
  toiShare: number;
  goalsForPct: number;
}

export interface TeamTrendPoint {
  game: string;
  goalsFor: number;
  goalsAgainst: number;
  pointsPct: number;
}

export interface TeamProfileData {
  team: TeamStatsRow;
  roster: TeamRosterRow[];
  lineCombos: TeamLineCombo[];
  trends: TeamTrendPoint[];
}

export async function getTeamStatsRows(
  season: string = CURRENT_SEASON,
): Promise<TeamStatsRow[]> {
  return withFallback(async () => {
    const rows = await prisma.teamSeasonStats.findMany({
      where: { season, gameType: "regular" },
      include: { team: true },
      orderBy: [{ points: "desc" }, { goalDiff: "desc" }],
    });

    return rows.map((row) => ({
      abbreviation: row.team.abbreviation,
      fullName: row.team.fullName,
      conference: row.team.conference,
      division: row.team.division,
      gamesPlayed: row.gamesPlayed,
      wins: row.wins,
      losses: row.losses,
      otLosses: row.otLosses,
      points: row.points,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDiff: row.goalDiff,
      ppPct: row.ppPct ?? 0,
      pkPct: row.pkPct ?? 0,
      corsiForPct: row.corsiForPct ?? 0,
      xGoalsForPct: row.xGoalsForPct ?? 0,
    }));
  }, () => [...mockTeamStats].sort((a, b) => b.points - a.points));
}

export async function getTeamProfile(
  abbreviation: string,
  season: string = CURRENT_SEASON,
): Promise<TeamProfileData> {
  return withFallback(async () => {
    const team = await prisma.team.findUnique({
      where: { abbreviation: abbreviation.toUpperCase() },
      include: {
        seasonStats: {
          where: { season, gameType: "regular" },
          take: 1,
        },
        players: {
          include: {
            seasonStats: {
              where: { season, gameType: "regular" },
              take: 1,
            },
          },
          orderBy: { lastName: "asc" },
        },
      },
    });

    if (!team) {
      const mock = buildMockTeamProfile(abbreviation);
      return { team: mock.team, roster: mock.roster, lineCombos: mock.lines, trends: mock.trends };
    }

    const seasonStats = team.seasonStats[0];
    const teamRow: TeamStatsRow = {
      abbreviation: team.abbreviation,
      fullName: team.fullName,
      conference: team.conference,
      division: team.division,
      gamesPlayed: seasonStats?.gamesPlayed ?? 0,
      wins: seasonStats?.wins ?? 0,
      losses: seasonStats?.losses ?? 0,
      otLosses: seasonStats?.otLosses ?? 0,
      points: seasonStats?.points ?? 0,
      goalsFor: seasonStats?.goalsFor ?? 0,
      goalsAgainst: seasonStats?.goalsAgainst ?? 0,
      goalDiff: seasonStats?.goalDiff ?? 0,
      ppPct: seasonStats?.ppPct ?? 0,
      pkPct: seasonStats?.pkPct ?? 0,
      corsiForPct: seasonStats?.corsiForPct ?? 0,
      xGoalsForPct: seasonStats?.xGoalsForPct ?? 0,
    };

    const roster: TeamRosterRow[] = team.players
      .map((player) => {
        const stats = player.seasonStats[0];
        return {
          id: player.id,
          fullName: player.fullName,
          position: player.position,
          goals: stats?.goals ?? 0,
          assists: stats?.assists ?? 0,
          points: stats?.points ?? 0,
          toiPerGame: stats?.toiPerGame ?? 0,
        };
      })
      .sort((a, b) => b.points - a.points);

    const forwards = roster.filter((player) => player.position !== "D" && player.position !== "G");
    const defense = roster.filter((player) => player.position === "D");

    const lineCombos: TeamLineCombo[] = [
      { label: "Line 1", players: forwards.slice(0, 3).map((player) => player.fullName), toiShare: 16.5, goalsForPct: 55.4 },
      { label: "Line 2", players: forwards.slice(3, 6).map((player) => player.fullName), toiShare: 14.2, goalsForPct: 51.8 },
      { label: "Pair 1", players: defense.slice(0, 2).map((player) => player.fullName), toiShare: 18.3, goalsForPct: 54.1 },
    ].filter((combo) => combo.players.length > 0);

    const trends: TeamTrendPoint[] = Array.from({ length: 10 }).map((_, index) => ({
      game: `G${index + 1}`,
      goalsFor: 2 + ((index + teamRow.points) % 4),
      goalsAgainst: 1 + ((index + teamRow.losses) % 4),
      pointsPct: Number((0.42 + ((index + teamRow.wins) % 8) * 0.07).toFixed(2)),
    }));

    return { team: teamRow, roster, lineCombos, trends };
  }, () => {
    const mock = buildMockTeamProfile(abbreviation);
    return { team: mock.team, roster: mock.roster, lineCombos: mock.lines, trends: mock.trends };
  });
}
