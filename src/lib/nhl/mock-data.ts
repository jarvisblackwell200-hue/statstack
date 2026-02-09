import type { GoalieRow, SkaterRow } from "@/components/stat-table/types";

function skater(base: {
  id: number;
  nhlId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  teamAbbreviation: string;
  goals: number;
  assists: number;
  points: number;
  shots: number;
  shootingPct: number;
  toiPerGame: number;
  war: number;
}): SkaterRow {
  return {
    id: base.id,
    nhlId: base.nhlId,
    firstName: base.firstName,
    lastName: base.lastName,
    fullName: base.fullName,
    position: base.position,
    headshotUrl: null,
    teamAbbreviation: base.teamAbbreviation,
    teamLogoUrl: null,
    gamesPlayed: 82,
    goals: base.goals,
    assists: base.assists,
    points: base.points,
    plusMinus: 12,
    pim: 24,
    ppGoals: 10,
    ppAssists: 18,
    ppPoints: 28,
    shGoals: 1,
    shAssists: 1,
    shPoints: 2,
    gameWinningGoals: 8,
    overtimeGoals: 2,
    shots: base.shots,
    shootingPct: base.shootingPct,
    toi: base.toiPerGame * 82,
    toiPerGame: base.toiPerGame,
    evToi: Math.round(base.toiPerGame * 0.7) * 82,
    ppToi: Math.round(base.toiPerGame * 0.2) * 82,
    shToi: Math.round(base.toiPerGame * 0.1) * 82,
    hits: 60,
    blocks: 50,
    takeaways: 30,
    giveaways: 33,
    faceoffPct: 51,
    faceoffsWon: 700,
    faceoffsLost: 670,
    corsiForPct: 53,
    corsiRelPct: 1.2,
    fenwickForPct: 52,
    xGoalsForPct: 54,
    xGoalsDiff: 9,
    war: base.war,
  };
}

function goalie(base: {
  id: number;
  nhlId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  teamAbbreviation: string;
  wins: number;
  savePercentage: number;
  goalsAgainstAvg: number;
}): GoalieRow {
  return {
    id: base.id,
    nhlId: base.nhlId,
    firstName: base.firstName,
    lastName: base.lastName,
    fullName: base.fullName,
    headshotUrl: null,
    teamAbbreviation: base.teamAbbreviation,
    teamLogoUrl: null,
    gamesPlayed: 54,
    gamesStarted: 52,
    wins: base.wins,
    losses: 17,
    otLosses: 5,
    savePercentage: base.savePercentage,
    goalsAgainstAvg: base.goalsAgainstAvg,
    shutouts: 4,
    saves: 1420,
    shotsAgainst: 1550,
    goalsAgainst: 130,
    toi: 177000,
    qualityStarts: 33,
    qualityStartsPct: 0.63,
    goalsSavedAboveAverage: 9.5,
    goalsPrevented: 6.1,
    evSavePercentage: 0.919,
    ppSavePercentage: 0.878,
    shSavePercentage: 0.904,
  };
}

export const mockSkaterRows: SkaterRow[] = [
  skater({ id: 101, nhlId: 8478402, firstName: "Connor", lastName: "McDavid", fullName: "Connor McDavid", position: "C", teamAbbreviation: "EDM", goals: 43, assists: 86, points: 129, shots: 304, shootingPct: 14.1, toiPerGame: 1310, war: 4.9 }),
  skater({ id: 102, nhlId: 8478400, firstName: "Nathan", lastName: "MacKinnon", fullName: "Nathan MacKinnon", position: "C", teamAbbreviation: "COL", goals: 48, assists: 71, points: 119, shots: 396, shootingPct: 12.1, toiPerGame: 1360, war: 4.8 }),
  skater({ id: 103, nhlId: 8477956, firstName: "Auston", lastName: "Matthews", fullName: "Auston Matthews", position: "C", teamAbbreviation: "TOR", goals: 56, assists: 41, points: 97, shots: 356, shootingPct: 15.7, toiPerGame: 1272, war: 4.1 }),
  skater({ id: 104, nhlId: 8477492, firstName: "Nikita", lastName: "Kucherov", fullName: "Nikita Kucherov", position: "RW", teamAbbreviation: "TBL", goals: 39, assists: 82, points: 121, shots: 267, shootingPct: 14.6, toiPerGame: 1295, war: 4.5 }),
  skater({ id: 105, nhlId: 8480800, firstName: "Cale", lastName: "Makar", fullName: "Cale Makar", position: "D", teamAbbreviation: "COL", goals: 24, assists: 64, points: 88, shots: 248, shootingPct: 9.7, toiPerGame: 1530, war: 4.2 }),
  skater({ id: 106, nhlId: 8478403, firstName: "Leon", lastName: "Draisaitl", fullName: "Leon Draisaitl", position: "C", teamAbbreviation: "EDM", goals: 44, assists: 58, points: 102, shots: 244, shootingPct: 18, toiPerGame: 1290, war: 3.8 }),
  skater({ id: 107, nhlId: 8479323, firstName: "Quinn", lastName: "Hughes", fullName: "Quinn Hughes", position: "D", teamAbbreviation: "VAN", goals: 17, assists: 69, points: 86, shots: 211, shootingPct: 8.1, toiPerGame: 1510, war: 3.9 }),
  skater({ id: 108, nhlId: 8476468, firstName: "Artemi", lastName: "Panarin", fullName: "Artemi Panarin", position: "LW", teamAbbreviation: "NYR", goals: 41, assists: 63, points: 104, shots: 252, shootingPct: 16.3, toiPerGame: 1214, war: 3.4 }),
];

export const mockGoalieRows: GoalieRow[] = [
  goalie({ id: 201, nhlId: 8478409, firstName: "Connor", lastName: "Hellebuyck", fullName: "Connor Hellebuyck", teamAbbreviation: "WPG", wins: 39, savePercentage: 0.924, goalsAgainstAvg: 2.15 }),
  goalie({ id: 202, nhlId: 8479310, firstName: "Igor", lastName: "Shesterkin", fullName: "Igor Shesterkin", teamAbbreviation: "NYR", wins: 36, savePercentage: 0.921, goalsAgainstAvg: 2.28 }),
  goalie({ id: 203, nhlId: 8479338, firstName: "Jake", lastName: "Oettinger", fullName: "Jake Oettinger", teamAbbreviation: "DAL", wins: 35, savePercentage: 0.916, goalsAgainstAvg: 2.37 }),
  goalie({ id: 204, nhlId: 8475883, firstName: "Andrei", lastName: "Vasilevskiy", fullName: "Andrei Vasilevskiy", teamAbbreviation: "TBL", wins: 33, savePercentage: 0.918, goalsAgainstAvg: 2.41 }),
];

export function buildMockCareer(player: SkaterRow) {
  return [
    { season: "20212022", teamAbbreviation: player.teamAbbreviation, gamesPlayed: 76, goals: Math.round(player.goals * 0.68), assists: Math.round(player.assists * 0.68), points: Math.round(player.points * 0.68), shots: Math.round(player.shots * 0.78), shootingPct: Number(((player.shootingPct ?? 11) - 0.8).toFixed(1)), toiPerGame: Math.round((player.toiPerGame ?? 1100) - 70) },
    { season: "20222023", teamAbbreviation: player.teamAbbreviation, gamesPlayed: 79, goals: Math.round(player.goals * 0.78), assists: Math.round(player.assists * 0.78), points: Math.round(player.points * 0.78), shots: Math.round(player.shots * 0.9), shootingPct: Number(((player.shootingPct ?? 11) - 0.3).toFixed(1)), toiPerGame: Math.round((player.toiPerGame ?? 1100) - 32) },
    { season: "20232024", teamAbbreviation: player.teamAbbreviation, gamesPlayed: 81, goals: Math.round(player.goals * 0.91), assists: Math.round(player.assists * 0.91), points: Math.round(player.points * 0.91), shots: Math.round(player.shots * 0.95), shootingPct: Number(((player.shootingPct ?? 11) - 0.1).toFixed(1)), toiPerGame: Math.round((player.toiPerGame ?? 1100) - 12) },
    { season: "20242025", teamAbbreviation: player.teamAbbreviation, gamesPlayed: 82, goals: Math.round(player.goals * 0.96), assists: Math.round(player.assists * 0.96), points: Math.round(player.points * 0.96), shots: Math.round(player.shots * 0.99), shootingPct: Number(((player.shootingPct ?? 11) + 0.2).toFixed(1)), toiPerGame: Math.round((player.toiPerGame ?? 1100) - 4) },
    { season: "20252026", teamAbbreviation: player.teamAbbreviation, gamesPlayed: player.gamesPlayed, goals: player.goals, assists: player.assists, points: player.points, shots: player.shots, shootingPct: player.shootingPct ?? 0, toiPerGame: player.toiPerGame ?? 0 },
  ];
}

export function buildMockGameLog(player: SkaterRow) {
  return Array.from({ length: 12 }).map((_, index) => {
    const goals = (index + player.id) % 4 === 0 ? 2 : (index + player.id) % 3 === 0 ? 1 : 0;
    const assists = (index + player.id + 1) % 3;
    return {
      date: `2026-01-${String(index + 7).padStart(2, "0")}`,
      opponent: ["BOS", "MTL", "DET", "DAL", "NSH", "SEA"][index % 6],
      homeAway: index % 2 === 0 ? "H" as const : "A" as const,
      goals,
      assists,
      points: goals + assists,
      shots: 2 + ((index + player.id) % 5),
      toi: 960 + ((index + player.id) % 8) * 42,
    };
  });
}
