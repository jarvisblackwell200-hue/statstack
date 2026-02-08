// ─── Shared Types ────────────────────────────────────────────────────────────

export interface LocalizedString {
  default: string;
  fr?: string;
  cs?: string;
  de?: string;
  es?: string;
  fi?: string;
  sk?: string;
  sv?: string;
}

// ─── Standings ───────────────────────────────────────────────────────────────

export interface StandingsResponse {
  wildCardIndicator: boolean;
  standingsDateTimeUtc: string;
  standings: StandingsTeam[];
}

export interface StandingsTeam {
  conferenceAbbrev: string;
  conferenceName: string;
  conferenceSequence: number;
  divisionAbbrev: string;
  divisionName: string;
  divisionSequence: number;
  date: string;
  gameTypeId: number;
  gamesPlayed: number;
  goalDifferential: number;
  goalAgainst: number;
  goalFor: number;
  goalsForPctg: number;
  homeGamesPlayed: number;
  homeGoalsAgainst: number;
  homeGoalsFor: number;
  homeLosses: number;
  homeOtLosses: number;
  homeWins: number;
  homePoints: number;
  l10Losses: number;
  l10OtLosses: number;
  l10Points: number;
  l10Wins: number;
  leagueSequence: number;
  losses: number;
  otLosses: number;
  placeName: LocalizedString;
  pointPctg: number;
  points: number;
  regulationWins: number;
  regulationPlusOtWins: number;
  roadGamesPlayed: number;
  roadGoalsAgainst: number;
  roadGoalsFor: number;
  roadLosses: number;
  roadOtLosses: number;
  roadWins: number;
  roadPoints: number;
  seasonId: number;
  streakCode: string;
  streakCount: number;
  teamName: LocalizedString;
  teamCommonName: LocalizedString;
  teamAbbrev: LocalizedString;
  teamLogo: string;
  wildcardSequence: number;
  winPctg: number;
  wins: number;
  shootoutWins: number;
  shootoutLosses: number;
}

// ─── Leaders ─────────────────────────────────────────────────────────────────

export interface LeaderEntry {
  id: number;
  firstName: LocalizedString;
  lastName: LocalizedString;
  sweaterNumber: number;
  headshot: string;
  teamAbbrev: string;
  teamName: LocalizedString;
  teamLogo: string;
  position: string;
  value: number;
}

export interface SkaterLeadersResponse {
  goals: LeaderEntry[];
  assists: LeaderEntry[];
  points: LeaderEntry[];
  plusMinus: LeaderEntry[];
  goalsPp: LeaderEntry[];
  goalsSh: LeaderEntry[];
  toi: LeaderEntry[];
  penaltyMins: LeaderEntry[];
  faceoffLeaders: LeaderEntry[];
}

export interface GoalieLeadersResponse {
  wins: LeaderEntry[];
  shutouts: LeaderEntry[];
  savePctg: LeaderEntry[];
  goalsAgainstAverage: LeaderEntry[];
}

// ─── Scores ──────────────────────────────────────────────────────────────────

export interface ScoreResponse {
  prevDate: string;
  currentDate: string;
  nextDate: string;
  gameWeek: GameWeekDay[];
  games: ScoreGame[];
}

export interface GameWeekDay {
  date: string;
  dayAbbrev: string;
  numberOfGames: number;
}

export interface ScoreGame {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: LocalizedString;
  startTimeUTC: string;
  gameState: string; // "OFF" | "FUT" | "LIVE" | "CRIT" | "PRE"
  gameScheduleState: string;
  period: number;
  clock?: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  periodDescriptor?: {
    number: number;
    periodType: string; // "REG" | "OT" | "SO"
    maxRegulationPeriods: number;
  };
  gameOutcome?: {
    lastPeriodType: string;
  };
  awayTeam: ScoreTeam;
  homeTeam: ScoreTeam;
  goals?: ScoreGoal[];
  gameCenterLink: string;
}

export interface ScoreTeam {
  id: number;
  name: LocalizedString;
  abbrev: string;
  score: number;
  sog: number;
  logo: string;
}

export interface ScoreGoal {
  period: number;
  timeInPeriod: string;
  playerId: number;
  name: LocalizedString;
  firstName: LocalizedString;
  lastName: LocalizedString;
  teamAbbrev: string;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  strength: string; // "ev" | "pp" | "sh"
  assists: { playerId: number; name: LocalizedString; assistsToDate: number }[];
  mugshot: string;
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export interface ScheduleResponse {
  nextStartDate: string;
  previousStartDate: string;
  gameWeek: ScheduleWeekDay[];
  numberOfGames: number;
}

export interface ScheduleWeekDay {
  date: string;
  dayAbbrev: string;
  numberOfGames: number;
  games: ScheduleGame[];
}

export interface ScheduleGame {
  id: number;
  season: number;
  gameType: number;
  venue: LocalizedString;
  startTimeUTC: string;
  gameState: string;
  gameScheduleState: string;
  awayTeam: ScheduleTeam;
  homeTeam: ScheduleTeam;
  gameCenterLink: string;
}

export interface ScheduleTeam {
  id: number;
  commonName: LocalizedString;
  placeName: LocalizedString;
  abbrev: string;
  logo: string;
  darkLogo: string;
  score?: number;
}

// ─── Club Stats ──────────────────────────────────────────────────────────────

export interface ClubStatsResponse {
  season: string;
  gameType: number;
  skaters: ClubSkater[];
  goalies: ClubGoalie[];
}

export interface ClubSkater {
  playerId: number;
  headshot: string;
  firstName: LocalizedString;
  lastName: LocalizedString;
  positionCode: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  powerPlayGoals: number;
  shorthandedGoals: number;
  gameWinningGoals: number;
  overtimeGoals: number;
  shots: number;
  shootingPctg: number;
  avgTimeOnIcePerGame: number; // seconds
  avgShiftsPerGame: number;
  faceoffWinPctg: number;
}

export interface ClubGoalie {
  playerId: number;
  headshot: string;
  firstName: LocalizedString;
  lastName: LocalizedString;
  gamesPlayed: number;
  gamesStarted: number;
  wins: number;
  losses: number;
  overtimeLosses: number;
  goalsAgainstAverage: number;
  savePercentage: number;
  shotsAgainst: number;
  saves: number;
  goalsAgainst: number;
  shutouts: number;
  timeOnIce: number; // seconds
}

// ─── Legacy Stats API: Skater Summary ────────────────────────────────────────

export interface StatsApiResponse<T> {
  data: T[];
  total: number;
}

export interface SkaterSummary {
  playerId: number;
  skaterFullName: string;
  lastName: string;
  positionCode: string;
  shootsCatches: string;
  teamAbbrevs: string;
  seasonId: number;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  pointsPerGame: number;
  evGoals: number;
  evPoints: number;
  ppGoals: number;
  ppPoints: number;
  shGoals: number;
  shPoints: number;
  gameWinningGoals: number;
  otGoals: number;
  shots: number;
  shootingPct: number;
  timeOnIcePerGame: number; // seconds
  faceoffWinPct: number | null;
}

// ─── Legacy Stats API: Goalie Summary ────────────────────────────────────────

export interface GoalieSummary {
  playerId: number;
  goalieFullName: string;
  lastName: string;
  shootsCatches: string;
  teamAbbrevs: string;
  seasonId: number;
  gamesPlayed: number;
  gamesStarted: number;
  wins: number;
  losses: number;
  otLosses: number;
  goalsAgainstAverage: number;
  savePct: number;
  shotsAgainst: number;
  saves: number;
  goalsAgainst: number;
  shutouts: number;
  timeOnIce: number; // seconds
  penaltyMinutes: number;
}

// ─── Player Landing (Profile) ────────────────────────────────────────────────

export interface PlayerLandingResponse {
  playerId: number;
  isActive: boolean;
  currentTeamId: number;
  currentTeamAbbrev: string;
  fullTeamName: LocalizedString;
  teamCommonName: LocalizedString;
  firstName: LocalizedString;
  lastName: LocalizedString;
  teamLogo: string;
  sweaterNumber: number;
  position: string;
  headshot: string;
  heroImage: string;
  heightInInches: number;
  heightInCentimeters: number;
  weightInPounds: number;
  weightInKilograms: number;
  birthDate: string;
  birthCity: LocalizedString;
  birthStateProvince?: LocalizedString;
  birthCountry: string;
  shootsCatches: string;
  draftDetails?: {
    year: number;
    teamAbbrev: string;
    round: number;
    pickInRound: number;
    overallPick: number;
  };
  playerSlug: string;
  featuredStats?: {
    season: number;
    regularSeason: {
      subSeason: PlayerStatLine;
      career: PlayerStatLine;
    };
  };
  careerTotals: {
    regularSeason: PlayerStatLine & { avgToi: string; faceoffWinningPctg: number };
    playoffs: PlayerStatLine & { avgToi: string; faceoffWinningPctg: number };
  };
  last5Games: PlayerGameEntry[];
  seasonTotals: PlayerSeasonEntry[];
  awards: PlayerAward[];
}

export interface PlayerStatLine {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  powerPlayGoals: number;
  powerPlayPoints: number;
  shorthandedGoals: number;
  shorthandedPoints: number;
  gameWinningGoals: number;
  otGoals: number;
  shots: number;
  shootingPctg: number;
}

export interface PlayerGameEntry {
  gameDate: string;
  gameId: number;
  gameTypeId: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  shots: number;
  shifts: number;
  shorthandedGoals: number;
  powerPlayGoals: number;
  homeRoadFlag: string; // "H" | "R"
  opponentAbbrev: string;
  teamAbbrev: string;
  toi: string; // formatted "MM:SS"
}

export interface PlayerSeasonEntry {
  season: number;
  gameTypeId: number;
  leagueAbbrev: string;
  teamName: LocalizedString;
  teamCommonName?: LocalizedString;
  sequence: number;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  pim: number;
  plusMinus?: number;
  powerPlayGoals?: number;
  shorthandedGoals?: number;
  gameWinningGoals?: number;
  shots?: number;
  shootingPctg?: number;
  avgToi?: string;
  faceoffWinningPctg?: number;
}

export interface PlayerAward {
  trophy: LocalizedString;
  seasons: {
    seasonId: number;
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    plusMinus: number;
    hits: number;
    blockedShots: number;
    pim: number;
    gameTypeId: number;
  }[];
}
