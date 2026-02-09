import { mockSkaterRows } from "@/lib/nhl/mock-data";

export interface MockTeamStat {
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

export const mockTeamStats: MockTeamStat[] = [
  { abbreviation: "COL", fullName: "Colorado Avalanche", conference: "Western", division: "Central", gamesPlayed: 82, wins: 52, losses: 21, otLosses: 9, points: 113, goalsFor: 294, goalsAgainst: 228, goalDiff: 66, ppPct: 25.8, pkPct: 82.1, corsiForPct: 54.9, xGoalsForPct: 55.7 },
  { abbreviation: "EDM", fullName: "Edmonton Oilers", conference: "Western", division: "Pacific", gamesPlayed: 82, wins: 50, losses: 23, otLosses: 9, points: 109, goalsFor: 302, goalsAgainst: 239, goalDiff: 63, ppPct: 27.1, pkPct: 80.6, corsiForPct: 53.6, xGoalsForPct: 54.4 },
  { abbreviation: "TOR", fullName: "Toronto Maple Leafs", conference: "Eastern", division: "Atlantic", gamesPlayed: 82, wins: 48, losses: 24, otLosses: 10, points: 106, goalsFor: 286, goalsAgainst: 247, goalDiff: 39, ppPct: 24.2, pkPct: 79.8, corsiForPct: 51.7, xGoalsForPct: 52.3 },
  { abbreviation: "NYR", fullName: "New York Rangers", conference: "Eastern", division: "Metropolitan", gamesPlayed: 82, wins: 51, losses: 22, otLosses: 9, points: 111, goalsFor: 276, goalsAgainst: 225, goalDiff: 51, ppPct: 24.6, pkPct: 83.5, corsiForPct: 50.2, xGoalsForPct: 51 },
  { abbreviation: "VAN", fullName: "Vancouver Canucks", conference: "Western", division: "Pacific", gamesPlayed: 82, wins: 47, losses: 26, otLosses: 9, points: 103, goalsFor: 271, goalsAgainst: 238, goalDiff: 33, ppPct: 23.3, pkPct: 80.9, corsiForPct: 51.8, xGoalsForPct: 52.6 },
  { abbreviation: "OTT", fullName: "Ottawa Senators", conference: "Eastern", division: "Atlantic", gamesPlayed: 82, wins: 39, losses: 33, otLosses: 10, points: 88, goalsFor: 256, goalsAgainst: 262, goalDiff: -6, ppPct: 21.8, pkPct: 78.2, corsiForPct: 50.8, xGoalsForPct: 50.4 },
];

export function buildMockTeamProfile(abbr: string) {
  const team = mockTeamStats.find((row) => row.abbreviation === abbr.toUpperCase()) ?? mockTeamStats[0];

  const roster = mockSkaterRows
    .filter((player) => player.teamAbbreviation === team.abbreviation)
    .slice(0, 12)
    .map((player) => ({
      id: player.id,
      fullName: player.fullName,
      position: player.position,
      goals: player.goals,
      assists: player.assists,
      points: player.points,
      toiPerGame: player.toiPerGame ?? 0,
    }));

  while (roster.length < 12) {
    const n = roster.length + 1;
    roster.push({
      id: 5000 + n,
      fullName: `${team.abbreviation} Player ${n}`,
      position: n % 4 === 0 ? "D" : "C",
      goals: 6 + n,
      assists: 10 + n,
      points: 16 + n * 2,
      toiPerGame: 900 + n * 40,
    });
  }

  return {
    team,
    roster,
    lines: [
      { label: "Line 1", players: roster.slice(0, 3).map((player) => player.fullName), toiShare: 16.8, goalsForPct: 58.4 },
      { label: "Line 2", players: roster.slice(3, 6).map((player) => player.fullName), toiShare: 13.9, goalsForPct: 53.2 },
      { label: "Pair 1", players: roster.filter((player) => player.position === "D").slice(0, 2).map((player) => player.fullName), toiShare: 18.1, goalsForPct: 56.1 },
    ],
    trends: Array.from({ length: 10 }).map((_, index) => ({
      game: `G${index + 1}`,
      goalsFor: 2 + ((index + team.wins) % 4),
      goalsAgainst: 1 + ((index + team.losses) % 4),
      pointsPct: Number((0.46 + ((index + team.points) % 7) * 0.07).toFixed(2)),
    })),
  };
}
