"use client";

import { type Table, type VisibilityState } from "@tanstack/react-table";
import { type ColumnGroup, type ColumnPreset } from "./columns/column-groups";
import { useState } from "react";

interface StatTableToolbarProps<T> {
  table: Table<T>;
  positions?: string[];
  teams: string[];
  columnGroups: ColumnGroup[];
  columnPresets: ColumnPreset[];
  rowCount: number;
  activePosition: string | null;
  activeTeam: string | null;
  activeMinGP: number | null;
  onPositionChange: (value: string | null) => void;
  onTeamChange: (value: string | null) => void;
  onMinGPChange: (value: number | null) => void;
  onColumnVisibilityChange: (value: VisibilityState) => void;
}

export function StatTableToolbar<T>({
  table,
  positions,
  teams,
  columnGroups,
  columnPresets,
  rowCount,
  activePosition,
  activeTeam,
  activeMinGP,
  onPositionChange,
  onTeamChange,
  onMinGPChange,
  onColumnVisibilityChange,
}: StatTableToolbarProps<T>) {
  const [showColumns, setShowColumns] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showSaveView, setShowSaveView] = useState(false);
  const [copied, setCopied] = useState(false);

  function applyPreset(preset: ColumnPreset) {
    const vis: VisibilityState = {};
    // Start by hiding all columns from all groups
    for (const group of columnGroups) {
      for (const colId of group.columns) {
        vis[colId] = false;
      }
    }
    // Then show columns from the selected preset's groups
    const activeGroupIds = new Set(preset.groupIds);
    for (const group of columnGroups) {
      if (activeGroupIds.has(group.id)) {
        for (const colId of group.columns) {
          vis[colId] = true;
        }
      }
    }
    onColumnVisibilityChange(vis);
    setShowPresets(false);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="mb-3 flex flex-wrap items-center gap-3">
      {/* Position Filter */}
      {positions && (
        <select
          className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary"
          value={activePosition ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onPositionChange(val || null);
          }}
        >
          <option value="">All Positions</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      )}

      {/* Team Filter */}
      <select
        className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary"
        value={activeTeam ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          onTeamChange(val || null);
        }}
      >
        <option value="">All Teams</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>

      {/* Min GP Filter */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-text-secondary">Min GP</label>
        <input
          type="number"
          className="w-16 rounded-md border border-border bg-bg-card px-2 py-1.5 text-sm text-text-primary"
          placeholder="0"
          min={0}
          value={activeMinGP ?? ""}
          onChange={(e) => {
            const val = e.target.value ? Number(e.target.value) : null;
            onMinGPChange(val);
          }}
        />
      </div>

      {/* Column Visibility Toggle */}
      <div className="relative">
        <button
          className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary hover:bg-bg-hover"
          onClick={() => setShowColumns(!showColumns)}
        >
          Columns
        </button>
        {showColumns && (
          <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-md border border-border bg-bg-card p-2 shadow-lg">
            {columnGroups.map((group) => {
              const groupCols = group.columns
                .map((colId) => table.getColumn(colId))
                .filter(Boolean);
              const allVisible = groupCols.every(
                (c) => c!.getIsVisible(),
              );

              return (
                <label
                  key={group.id}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-bg-hover"
                >
                  <input
                    type="checkbox"
                    checked={allVisible}
                    onChange={() => {
                      groupCols.forEach((c) =>
                        c!.toggleVisibility(!allVisible),
                      );
                    }}
                    className="accent-accent"
                  />
                  {group.label}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Presets Dropdown */}
      <div className="relative">
        <button
          className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary hover:bg-bg-hover"
          onClick={() => setShowPresets(!showPresets)}
        >
          Presets
        </button>
        {showPresets && (
          <div className="absolute top-full left-0 z-50 mt-1 w-40 rounded-md border border-border bg-bg-card p-1 shadow-lg">
            {columnPresets.map((preset) => (
              <button
                key={preset.id}
                className="block w-full rounded px-3 py-1.5 text-left text-sm text-text-primary hover:bg-bg-hover"
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Share Button */}
      <button
        className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary hover:bg-bg-hover"
        onClick={handleShare}
      >
        {copied ? "Copied!" : "Share"}
      </button>

      {/* Save View Placeholder */}
      <div className="relative">
        <button
          className="rounded-md border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary hover:bg-bg-hover"
          onClick={() => setShowSaveView(!showSaveView)}
        >
          Save View
        </button>
        {showSaveView && (
          <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-md border border-border bg-bg-card p-3 shadow-lg">
            <p className="text-xs text-text-secondary">
              Sign in to save views
            </p>
          </div>
        )}
      </div>

      {/* Row count */}
      <span className="ml-auto text-xs text-text-secondary">
        {rowCount} player{rowCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
