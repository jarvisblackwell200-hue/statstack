import type {
  StandingsTeam,
  ClubSkater,
  ClubGoalie,
  SkaterSummary,
  GoalieSummary,
  PlayerLandingResponse,
  LocalizedString,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ls(value: LocalizedString | string): string {
  if (typeof value === "string") return value;
  return value.default;
}

// ─── Team from Standings ─────────────────────────────────────────────────────

export function standingsTeamToPrisma(t: StandingsTeam) {
  return {
    nhlId: 0, // Standings don't include numeric team ID; must be resolved separately
    name: ls(t.teamCommonName),
    abbreviation: ls(t.teamAbbrev),
    fullName: `${ls(t.placeName)} ${ls(t.teamCommonName)}`,
    division: t.divisionName,
    conference: t.conferenceName,
    logoUrl: t.teamLogo,
  };
}

export function standingsTeamStatsToPrisma(t: StandingsTeam, season: string) {
  return {
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
  };
}

// ─── Player from Player Landing (profile) ────────────────────────────────────

export function playerLandingToPrisma(p: PlayerLandingResponse) {
  return {
    nhlId: p.playerId,
    firstName: ls(p.firstName),
    lastName: ls(p.lastName),
    fullName: `${ls(p.firstName)} ${ls(p.lastName)}`,
    position: p.position,
    shootsCatches: p.shootsCatches,
    height: p.heightInInches,
    weight: p.weightInPounds,
    birthDate: new Date(p.birthDate),
    birthCity: ls(p.birthCity),
    birthCountry: p.birthCountry,
    draftYear: p.draftDetails?.year ?? null,
    draftRound: p.draftDetails?.round ?? null,
    draftPick: p.draftDetails?.overallPick ?? null,
    headshotUrl: p.headshot,
    isActive: p.isActive,
  };
}

// ─── Skater Stats from Legacy Stats API ──────────────────────────────────────

export function skaterSummaryToPrisma(s: SkaterSummary) {
  return {
    nhlPlayerId: s.playerId,
    season: String(s.seasonId),
    gameType: "regular",
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
    evGoals: s.evGoals,
    evPoints: s.evPoints,
    pointsPerGame: s.pointsPerGame,
    // Metadata for player upsert
    playerFullName: s.skaterFullName,
    positionCode: s.positionCode,
    shootsCatches: s.shootsCatches,
    teamAbbrevs: s.teamAbbrevs,
  };
}

// ─── Goalie Stats from Legacy Stats API ──────────────────────────────────────

export function goalieSummaryToPrisma(g: GoalieSummary) {
  return {
    nhlPlayerId: g.playerId,
    season: String(g.seasonId),
    gameType: "regular",
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
    // Metadata for player upsert
    playerFullName: g.goalieFullName,
    shootsCatches: g.shootsCatches,
    teamAbbrevs: g.teamAbbrevs,
  };
}

// ─── Skater from Club Stats ──────────────────────────────────────────────────

export function clubSkaterToPrisma(s: ClubSkater, season: string) {
  return {
    nhlPlayerId: s.playerId,
    season,
    gameType: "regular",
    gamesPlayed: s.gamesPlayed,
    goals: s.goals,
    assists: s.assists,
    points: s.points,
    plusMinus: s.plusMinus,
    pim: s.penaltyMinutes,
    ppGoals: s.powerPlayGoals,
    shGoals: s.shorthandedGoals,
    gameWinningGoals: s.gameWinningGoals,
    overtimeGoals: s.overtimeGoals,
    shots: s.shots,
    shootingPct: s.shootingPctg,
    toiPerGame: s.avgTimeOnIcePerGame,
    faceoffPct: s.faceoffWinPctg,
    // Player metadata
    firstName: ls(s.firstName),
    lastName: ls(s.lastName),
    positionCode: s.positionCode,
    headshotUrl: s.headshot,
  };
}

// ─── Goalie from Club Stats ──────────────────────────────────────────────────

export function clubGoalieToPrisma(g: ClubGoalie, season: string) {
  return {
    nhlPlayerId: g.playerId,
    season,
    gameType: "regular",
    gamesPlayed: g.gamesPlayed,
    gamesStarted: g.gamesStarted,
    wins: g.wins,
    losses: g.losses,
    otLosses: g.overtimeLosses,
    savePercentage: g.savePercentage,
    goalsAgainstAvg: g.goalsAgainstAverage,
    shutouts: g.shutouts,
    saves: g.saves,
    shotsAgainst: g.shotsAgainst,
    goalsAgainst: g.goalsAgainst,
    toi: g.timeOnIce,
    // Player metadata
    firstName: ls(g.firstName),
    lastName: ls(g.lastName),
    headshotUrl: g.headshot,
  };
}
