import { createColumnHelper } from "@tanstack/react-table";
import type { GoalieRow } from "../types";
import { formatSavePct, formatGAA, formatPct, formatNum } from "../utils/formatters";

const col = createColumnHelper<GoalieRow>();

export const goalieColumns = [
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
  col.accessor("gamesPlayed", {
    header: "GP",
    size: 50,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("gamesStarted", {
    header: "GS",
    size: 50,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Record ──────────────────────────────────────────────
  col.accessor("wins", {
    header: "W",
    size: 50,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("losses", {
    header: "L",
    size: 50,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("otLosses", {
    header: "OTL",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Core ────────────────────────────────────────────────
  col.accessor("savePercentage", {
    header: "SV%",
    size: 65,
    cell: (info) => formatSavePct(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("goalsAgainstAvg", {
    header: "GAA",
    size: 60,
    cell: (info) => formatGAA(info.getValue()),
    meta: { numeric: true, colorScale: true, invertColor: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shutouts", {
    header: "SO",
    size: 50,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("saves", {
    header: "SV",
    size: 60,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shotsAgainst", {
    header: "SA",
    size: 60,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("goalsAgainst", {
    header: "GA",
    size: 55,
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Advanced ────────────────────────────────────────────
  col.accessor("qualityStarts", {
    header: "QS",
    size: 50,
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("qualityStartsPct", {
    header: "QS%",
    size: 55,
    cell: (info) => formatPct(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("goalsSavedAboveAverage", {
    header: "GSAA",
    size: 65,
    cell: (info) => formatNum(info.getValue(), 1),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("goalsPrevented", {
    header: "GSAx",
    size: 65,
    cell: (info) => formatNum(info.getValue(), 1),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),

  // ── Situational ─────────────────────────────────────────
  col.accessor("evSavePercentage", {
    header: "EV SV%",
    size: 70,
    cell: (info) => formatSavePct(info.getValue()),
    meta: { numeric: true, colorScale: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("ppSavePercentage", {
    header: "PP SV%",
    size: 70,
    cell: (info) => formatSavePct(info.getValue()),
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
  col.accessor("shSavePercentage", {
    header: "SH SV%",
    size: 70,
    cell: (info) => formatSavePct(info.getValue()),
    meta: { numeric: true },
    filterFn: "rangeFilter" as never,
  }),
];
