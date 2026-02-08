"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import { StatTableToolbar } from "./StatTableToolbar";
import { StatTableBody } from "./StatTableBody";
import { FilterSummary } from "./FilterSummary";
import { AdvancedFilterBuilder } from "./AdvancedFilterBuilder";
import { calculatePercentiles } from "./utils/percentiles";
import { type ColumnGroup, type ColumnPreset } from "./columns/column-groups";
import { useTableUrlState } from "./hooks/useTableUrlState";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface StatTableProps<T extends {}> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  columnGroups: ColumnGroup[];
  columnPresets: ColumnPreset[];
  positions?: string[];
  playerNameColumn?: string;
}

function rangeFilter<T>(row: Row<T>, columnId: string, filterValue: unknown) {
  if (filterValue == null) return true;
  const val = row.getValue(columnId) as number | null;
  if (val == null) return false;
  const conditions = filterValue as Array<{ operator: string; value: number }>;
  return conditions.every((cond) => {
    switch (cond.operator) {
      case "gt":
        return val > cond.value;
      case "gte":
        return val >= cond.value;
      case "lt":
        return val < cond.value;
      case "lte":
        return val <= cond.value;
      case "eq":
        return val === cond.value;
      default:
        return true;
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function StatTable<T extends {}>({
  data,
  columns,
  columnGroups,
  columnPresets,
  positions,
  playerNameColumn = "fullName",
}: StatTableProps<T>) {
  const {
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
  } = useTableUrlState(columnGroups);

  // Unique teams for filter dropdown
  const teams = useMemo(() => {
    const set = new Set<string>();
    for (const row of data) {
      const t = (row as Record<string, unknown>).teamAbbreviation;
      if (typeof t === "string" && t !== "—") set.add(t);
    }
    return Array.from(set).sort();
  }, [data]);

  // Derive columnFilters from URL state
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const cf: ColumnFiltersState = [];
    if (pos) cf.push({ id: "position", value: pos });
    if (team) cf.push({ id: "teamAbbreviation", value: team });

    // Group advanced filters by columnId
    const advancedByCol = new Map<string, Array<{ operator: string; value: number }>>();

    // Convert minGP into a rangeFilter condition on gamesPlayed
    if (minGP != null) {
      advancedByCol.set("gamesPlayed", [{ operator: "gte", value: minGP }]);
    }

    for (const f of filters) {
      const existing = advancedByCol.get(f.columnId);
      if (existing) {
        existing.push({ operator: f.operator, value: f.value });
      } else {
        advancedByCol.set(f.columnId, [{ operator: f.operator, value: f.value }]);
      }
    }
    for (const [colId, conditions] of advancedByCol) {
      cf.push({ id: colId, value: conditions });
    }

    return cf;
  }, [pos, team, minGP, filters]);

  // Identify columns with colorScale for percentile calculation
  const colorScaleColumns = useMemo(() => {
    return columns
      .filter(
        (c) =>
          (c as { meta?: { colorScale?: boolean } }).meta?.colorScale,
      )
      .map((c) => {
        if ("accessorKey" in c && typeof c.accessorKey === "string")
          return c.accessorKey;
        if (c.id) return c.id;
        return null;
      })
      .filter(Boolean) as string[];
  }, [columns]);

  // Build numeric columns list for advanced filter builder
  const numericColumns = useMemo(() => {
    return columns
      .filter((c) => (c as { meta?: { numeric?: boolean } }).meta?.numeric)
      .map((c) => {
        const id =
          "accessorKey" in c && typeof c.accessorKey === "string"
            ? c.accessorKey
            : c.id ?? "";
        const header =
          typeof c.header === "string" ? c.header : id;
        return { id, header };
      })
      .filter((c) => c.id);
  }, [columns]);

  // Build column header map for filter summary
  const columnHeaders = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of numericColumns) {
      map[c.id] = c.header;
    }
    return map;
  }, [numericColumns]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sort,
      columnFilters,
      columnVisibility: cols,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sort) : updater;
      setSort(next);
    },
    onColumnVisibilityChange: (updater) => {
      const next = typeof updater === "function" ? updater(cols) : updater;
      setCols(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiSort: true,
    isMultiSortEvent: (e: unknown) => (e as KeyboardEvent).shiftKey,
    filterFns: {
      rangeFilter: rangeFilter as never,
    },
    columnResizeMode: "onChange",
  });

  // Calculate percentiles on filtered rows
  const filteredRows = table.getFilteredRowModel().rows;
  const percentiles = useMemo(() => {
    const rowData = filteredRows.map((r) => r.original as Record<string, unknown>);
    return calculatePercentiles(rowData, colorScaleColumns);
  }, [filteredRows, colorScaleColumns]);

  // Map original indices to filtered row indices for percentiles
  const filteredPercentiles = useMemo(() => {
    const result = new Map<string, Map<number, number>>();
    for (const [col, pMap] of percentiles) {
      result.set(col, pMap);
    }
    return result;
  }, [percentiles]);

  const sortedRows = table.getRowModel().rows;

  // Remap percentiles to sorted row indices
  const sortedPercentiles = useMemo(() => {
    const result = new Map<string, Map<number, number>>();
    const filteredRowsArr = filteredRows;

    const filteredIdToFilteredIndex = new Map<string, number>();
    for (let i = 0; i < filteredRowsArr.length; i++) {
      filteredIdToFilteredIndex.set(filteredRowsArr[i].id, i);
    }

    for (const [col, pMap] of filteredPercentiles) {
      const newMap = new Map<number, number>();
      for (let sortedIdx = 0; sortedIdx < sortedRows.length; sortedIdx++) {
        const row = sortedRows[sortedIdx];
        const filteredIdx = filteredIdToFilteredIndex.get(row.id);
        if (filteredIdx != null) {
          const pct = pMap.get(filteredIdx);
          if (pct != null) {
            newMap.set(sortedIdx, pct);
          }
        }
      }
      result.set(col, newMap);
    }
    return result;
  }, [filteredPercentiles, filteredRows, sortedRows]);

  return (
    <div>
      <StatTableToolbar
        table={table}
        positions={positions}
        teams={teams}
        columnGroups={columnGroups}
        columnPresets={columnPresets}
        rowCount={sortedRows.length}
        activePosition={pos}
        activeTeam={team}
        activeMinGP={minGP}
        onPositionChange={(v) => setPos(v)}
        onTeamChange={(v) => setTeam(v)}
        onMinGPChange={(v) => setMinGP(v)}
        onColumnVisibilityChange={(v) => setCols(v)}
      />
      <FilterSummary
        pos={pos}
        team={team}
        minGP={minGP}
        filters={filters}
        onClearPos={() => setPos(null)}
        onClearTeam={() => setTeam(null)}
        onClearMinGP={() => setMinGP(null)}
        onRemoveFilter={(id) =>
          setFilters(filters.filter((f) => f.id !== id))
        }
        columnHeaders={columnHeaders}
      />
      <AdvancedFilterBuilder
        filters={filters}
        onChange={(next) => setFilters(next)}
        numericColumns={numericColumns}
      />
      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <StatTableBody
          table={table}
          rows={sortedRows}
          percentiles={sortedPercentiles}
          playerNameColumn={playerNameColumn}
        />
      </div>
    </div>
  );
}
