"use client";

import { useQueryState, parseAsJson, parseAsString, parseAsInteger } from "nuqs";
import type { SortingState, VisibilityState } from "@tanstack/react-table";
import type { AdvancedFilter } from "../types";
import type { ColumnGroup } from "../columns/column-groups";

function buildDefaultVisibility(columnGroups: ColumnGroup[]): VisibilityState {
  const vis: VisibilityState = {};
  for (const group of columnGroups) {
    if (!group.defaultVisible) {
      for (const colId of group.columns) {
        vis[colId] = false;
      }
    }
  }
  return vis;
}

export function useTableUrlState(columnGroups: ColumnGroup[]) {
  const defaultVisibility = buildDefaultVisibility(columnGroups);

  const [sort, setSort] = useQueryState(
    "sort",
    parseAsJson<SortingState>((v) => {
      if (!Array.isArray(v)) return [];
      return v.filter(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Record<string, unknown>).id === "string" &&
          typeof (item as Record<string, unknown>).desc === "boolean",
      ) as SortingState;
    }).withDefault([]),
  );

  const [pos, setPos] = useQueryState("pos", parseAsString);
  const [team, setTeam] = useQueryState("team", parseAsString);
  const [minGP, setMinGP] = useQueryState("minGP", parseAsInteger);

  const [cols, setCols] = useQueryState(
    "cols",
    parseAsJson<VisibilityState>((v) => {
      if (typeof v !== "object" || v === null || Array.isArray(v)) return defaultVisibility;
      return v as VisibilityState;
    }).withDefault(defaultVisibility),
  );

  const [filters, setFilters] = useQueryState(
    "filters",
    parseAsJson<AdvancedFilter[]>((v) => {
      if (!Array.isArray(v)) return [];
      return v.filter(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as Record<string, unknown>).id === "string" &&
          typeof (item as Record<string, unknown>).columnId === "string" &&
          ["gt", "gte", "lt", "lte", "eq"].includes(
            (item as Record<string, unknown>).operator as string,
          ) &&
          typeof (item as Record<string, unknown>).value === "number",
      ) as AdvancedFilter[];
    }).withDefault([]),
  );

  return {
    sort,
    setSort,
    pos,
    setPos,
    team,
    setTeam,
    minGP,
    setMinGP,
    cols,
    setCols,
    filters,
    setFilters,
  };
}
