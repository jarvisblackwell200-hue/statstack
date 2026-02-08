import { createColumnHelper } from "@tanstack/react-table";
import type { SkaterRow } from "../types";
import {
  formatPlusMinus,
  formatPct,
  formatTOIPerGame,
  formatNum,
} from "../utils/formatters";

const col = createColumnHelper<SkaterRow>();

export const skaterColumns = [
  // ── Bio ─────────────────────────────────────────────────
  col.accessor("fullName", {
    header: "Player",
    size: 180,
    minSize: 150,
    enableHiding: false,
    meta: { sticky: true, stickyLeft: 0 },
  }),
  col.accessor("teamAbbreviation", {
    header: "Team",
    size: 60,
    enableHiding: false,
    meta: { sticky: true, stickyLeft: 180 },
    filterFn: "equals",
  }),
  col.accessor("position", {
    header: "Pos",
    size: 50,
    filterFn: "equals",
  }),
  col.accessor("gamesPlayed", {
    header: "GP",
    size: 50,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Scoring ─────────────────────────────────────────────
  col.accessor("goals", {
    header: "G",
    size: 50,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("assists", {
    header: "A",
    size: 50,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("points", {
    header: "P",
    size: 50,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("plusMinus", {
    header: "+/-",
    size: 50,
    cell: (info) => formatPlusMinus(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("pim", {
    header: "PIM",
    size: 50,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("gameWinningGoals", {
    header: "GWG",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("overtimeGoals", {
    header: "OTG",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Power Play / Shorthanded ────────────────────────────
  col.accessor("ppGoals", {
    header: "PPG",
    size: 55,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("ppAssists", {
    header: "PPA",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("ppPoints", {
    header: "PPP",
    size: 55,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shGoals", {
    header: "SHG",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shAssists", {
    header: "SHA",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shPoints", {
    header: "SHP",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Shooting ────────────────────────────────────────────
  col.accessor("shots", {
    header: "S",
    size: 55,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shootingPct", {
    header: "S%",
    size: 55,
    cell: (info) => formatPct(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Ice Time ────────────────────────────────────────────
  col.accessor("toiPerGame", {
    header: "TOI/GP",
    size: 70,
    cell: (info) => formatTOIPerGame(info.getValue()),
    sortingFn: "basic",
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("evToi", {
    header: "EV TOI",
    size: 70,
    cell: (info) => formatTOIPerGame(info.getValue()),
    sortingFn: "basic",
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("ppToi", {
    header: "PP TOI",
    size: 70,
    cell: (info) => formatTOIPerGame(info.getValue()),
    sortingFn: "basic",
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shToi", {
    header: "SH TOI",
    size: 70,
    cell: (info) => formatTOIPerGame(info.getValue()),
    sortingFn: "basic",
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Physical ────────────────────────────────────────────
  col.accessor("hits", {
    header: "HIT",
    size: 55,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("blocks", {
    header: "BLK",
    size: 55,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("takeaways", {
    header: "TK",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("giveaways", {
    header: "GV",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Faceoffs ────────────────────────────────────────────
  col.accessor("faceoffPct", {
    header: "FO%",
    size: 55,
    cell: (info) => formatPct(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("faceoffsWon", {
    header: "FOW",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("faceoffsLost", {
    header: "FOL",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Advanced ────────────────────────────────────────────
  col.accessor("corsiForPct", {
    header: "CF%",
    size: 55,
    cell: (info) => formatPct(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("corsiRelPct", {
    header: "CF% Rel",
    size: 65,
    cell: (info) => formatNum(info.getValue(), 1),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("fenwickForPct", {
    header: "FF%",
    size: 55,
    cell: (info) => formatPct(info.getValue()),
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("xGoalsForPct", {
    header: "xGF%",
    size: 60,
    cell: (info) => formatPct(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("xGoalsDiff", {
    header: "xG+/-",
    size: 60,
    cell: (info) => formatNum(info.getValue(), 1),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("war", {
    header: "WAR",
    size: 55,
    cell: (info) => formatNum(info.getValue(), 1),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
];
