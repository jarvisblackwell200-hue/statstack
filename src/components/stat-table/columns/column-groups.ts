export interface ColumnGroup {
  id: string;
  label: string;
  columns: string[];
  defaultVisible: boolean;
}

export interface ColumnPreset {
  id: string;
  label: string;
  groupIds: string[];
}

export const skaterColumnGroups: ColumnGroup[] = [
  {
    id: "bio",
    label: "Bio",
    columns: ["fullName", "teamAbbreviation", "position", "gamesPlayed"],
    defaultVisible: true,
  },
  {
    id: "scoring",
    label: "Scoring",
    columns: [
      "goals",
      "assists",
      "points",
      "plusMinus",
      "pim",
      "gameWinningGoals",
      "overtimeGoals",
    ],
    defaultVisible: true,
  },
  {
    id: "powerplay",
    label: "Power Play / SH",
    columns: ["ppGoals", "ppAssists", "ppPoints", "shGoals", "shAssists", "shPoints"],
    defaultVisible: false,
  },
  {
    id: "shooting",
    label: "Shooting",
    columns: ["shots", "shootingPct"],
    defaultVisible: true,
  },
  {
    id: "icetime",
    label: "Ice Time",
    columns: ["toiPerGame", "evToi", "ppToi", "shToi"],
    defaultVisible: false,
  },
  {
    id: "physical",
    label: "Physical",
    columns: ["hits", "blocks", "takeaways", "giveaways"],
    defaultVisible: false,
  },
  {
    id: "faceoffs",
    label: "Faceoffs",
    columns: ["faceoffPct", "faceoffsWon", "faceoffsLost"],
    defaultVisible: false,
  },
  {
    id: "advanced",
    label: "Advanced",
    columns: [
      "corsiForPct",
      "corsiRelPct",
      "fenwickForPct",
      "xGoalsForPct",
      "xGoalsDiff",
      "war",
    ],
    defaultVisible: false,
  },
];

export const skaterColumnPresets: ColumnPreset[] = [
  { id: "standard", label: "Standard", groupIds: ["bio", "scoring", "shooting"] },
  { id: "advanced", label: "Advanced", groupIds: ["bio", "advanced"] },
  { id: "physical", label: "Physical", groupIds: ["bio", "physical", "faceoffs"] },
  { id: "all", label: "All", groupIds: ["bio", "scoring", "powerplay", "shooting", "icetime", "physical", "faceoffs", "advanced"] },
];

export const goalieColumnGroups: ColumnGroup[] = [
  {
    id: "bio",
    label: "Bio",
    columns: ["fullName", "teamAbbreviation", "gamesPlayed", "gamesStarted"],
    defaultVisible: true,
  },
  {
    id: "record",
    label: "Record",
    columns: ["wins", "losses", "otLosses"],
    defaultVisible: true,
  },
  {
    id: "core",
    label: "Core",
    columns: [
      "savePercentage",
      "goalsAgainstAvg",
      "shutouts",
      "saves",
      "shotsAgainst",
      "goalsAgainst",
    ],
    defaultVisible: true,
  },
  {
    id: "advanced",
    label: "Advanced",
    columns: [
      "qualityStarts",
      "qualityStartsPct",
      "goalsSavedAboveAverage",
      "goalsPrevented",
    ],
    defaultVisible: false,
  },
  {
    id: "situational",
    label: "Situational",
    columns: ["evSavePercentage", "ppSavePercentage", "shSavePercentage"],
    defaultVisible: false,
  },
];

export const goalieColumnPresets: ColumnPreset[] = [
  { id: "standard", label: "Standard", groupIds: ["bio", "record", "core"] },
  { id: "advanced", label: "Advanced", groupIds: ["bio", "record", "advanced"] },
  { id: "all", label: "All", groupIds: ["bio", "record", "core", "advanced", "situational"] },
];
