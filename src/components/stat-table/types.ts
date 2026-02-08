export interface AdvancedFilter {
  id: string;
  columnId: string;
  operator: "gt" | "gte" | "lt" | "lte" | "eq";
  value: number;
}

export interface SkaterRow {
  id: number;
  nhlId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  headshotUrl: string | null;
  teamAbbreviation: string;
  teamLogoUrl: string | null;

  // Standard
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;

  // Power Play / Shorthanded
  ppGoals: number;
  ppAssists: number;
  ppPoints: number;
  shGoals: number;
  shAssists: number;
  shPoints: number;

  // Scoring Extras
  gameWinningGoals: number;
  overtimeGoals: number;

  // Shooting
  shots: number;
  shootingPct: number | null;

  // Ice Time (seconds)
  toi: number;
  toiPerGame: number | null;
  evToi: number;
  ppToi: number;
  shToi: number;

  // Physical
  hits: number;
  blocks: number;
  takeaways: number;
  giveaways: number;

  // Faceoffs
  faceoffPct: number | null;
  faceoffsWon: number;
  faceoffsLost: number;

  // Advanced
  corsiForPct: number | null;
  corsiRelPct: number | null;
  fenwickForPct: number | null;
  xGoalsForPct: number | null;
  xGoalsDiff: number | null;
  war: number | null;
}

export interface GoalieRow {
  id: number;
  nhlId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  headshotUrl: string | null;
  teamAbbreviation: string;
  teamLogoUrl: string | null;

  // Record
  gamesPlayed: number;
  gamesStarted: number;
  wins: number;
  losses: number;
  otLosses: number;

  // Core
  savePercentage: number | null;
  goalsAgainstAvg: number | null;
  shutouts: number;
  saves: number;
  shotsAgainst: number;
  goalsAgainst: number;
  toi: number;

  // Advanced
  qualityStarts: number | null;
  qualityStartsPct: number | null;
  goalsSavedAboveAverage: number | null;
  goalsPrevented: number | null;

  // Situational
  evSavePercentage: number | null;
  ppSavePercentage: number | null;
  shSavePercentage: number | null;
}
