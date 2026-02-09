"use client";

import { useMemo, useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SkaterRow } from "@/components/stat-table/types";

interface CompareToolClientProps {
  players: SkaterRow[];
}

const MAX_COMPARE = 5;
const MIN_COMPARE = 2;

const METRICS: Array<{ key: keyof SkaterRow; label: string }> = [
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "points", label: "Points" },
  { key: "shootingPct", label: "Shooting%" },
  { key: "toiPerGame", label: "TOI/GP" },
  { key: "war", label: "WAR" },
];

const COLORS = ["#60a5fa", "#22c55e", "#f59e0b", "#f43f5e", "#a78bfa"];

function parseIds(ids: string): number[] {
  return ids
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value));
}

function uniqueIds(values: number[]): number[] {
  const result: number[] = [];
  for (const value of values) {
    if (!result.includes(value)) {
      result.push(value);
    }
  }
  return result;
}

function timeLabel(seconds: number | null): string {
  if (!seconds || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function CompareToolClient({ players }: CompareToolClientProps) {
  const [idsParam, setIdsParam] = useQueryState("ids", parseAsString.withDefault(""));
  const [query, setQuery] = useState("");

  const byId = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);

  const selectedIds = useMemo(() => uniqueIds(parseIds(idsParam)).slice(0, MAX_COMPARE), [idsParam]);

  const selectedPlayers = useMemo(
    () => selectedIds.map((id) => byId.get(id)).filter((row): row is SkaterRow => Boolean(row)),
    [selectedIds, byId],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return players
      .filter((player) => !selectedIds.includes(player.id))
      .filter((player) => player.fullName.toLowerCase().includes(q) || player.teamAbbreviation.toLowerCase().includes(q))
      .slice(0, 8);
  }, [players, query, selectedIds]);

  const canAdd = selectedIds.length < MAX_COMPARE;

  const radarData = useMemo(() => {
    if (selectedPlayers.length === 0) {
      return [];
    }

    const maxByMetric: Record<string, number> = {};
    for (const metric of METRICS) {
      maxByMetric[metric.key] = Math.max(
        1,
        ...selectedPlayers.map((player) => Number(player[metric.key] ?? 0)),
      );
    }

    return METRICS.map((metric) => {
      const row: Record<string, string | number> = { metric: metric.label };
      for (const player of selectedPlayers) {
        const value = Number(player[metric.key] ?? 0);
        row[player.fullName] = Math.round((value / maxByMetric[metric.key]) * 100);
      }
      return row;
    });
  }, [selectedPlayers]);

  function updateIds(nextIds: number[]) {
    void setIdsParam(nextIds.join(","));
  }

  function addPlayer(playerId: number) {
    if (!canAdd) return;
    updateIds(uniqueIds([...selectedIds, playerId]).slice(0, MAX_COMPARE));
    setQuery("");
  }

  function removePlayer(playerId: number) {
    updateIds(selectedIds.filter((id) => id !== playerId));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-xl border border-border bg-bg-card p-5">
        <h1 className="text-3xl font-bold">Compare Players</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Select {MIN_COMPARE} to {MAX_COMPARE} players. URL state is shareable via <span className="font-mono">?ids=...</span>.
        </p>

        <div className="mt-4 relative">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={canAdd ? "Search player or team abbreviation" : "Max 5 players selected"}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm outline-none focus:border-accent"
            disabled={!canAdd}
          />
          {suggestions.length > 0 && canAdd ? (
            <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-bg-card shadow-xl">
              {suggestions.map((player) => (
                <button
                  key={player.id}
                  onClick={() => addPlayer(player.id)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-bg-hover"
                >
                  <span>{player.fullName}</span>
                  <span className="text-text-secondary">{player.teamAbbreviation}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {selectedPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => removePlayer(player.id)}
              className="rounded-full border border-border bg-bg-primary px-3 py-1 text-sm hover:bg-bg-hover"
            >
              {player.fullName} <span className="text-text-secondary">({player.teamAbbreviation})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Radar Comparison (Normalized)</h2>
          {selectedPlayers.length >= MIN_COMPARE ? (
            <div className="h-[380px]">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" stroke="var(--text-secondary)" />
                  <PolarRadiusAxis angle={18} domain={[0, 100]} stroke="var(--text-secondary)" />
                  <Tooltip
                    formatter={(value: number | string | undefined) => `${Number(value ?? 0)}%`}
                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  />
                  {selectedPlayers.map((player, index) => (
                    <Radar
                      key={player.id}
                      name={player.fullName}
                      dataKey={player.fullName}
                      stroke={COLORS[index % COLORS.length]}
                      fill={COLORS[index % COLORS.length]}
                      fillOpacity={0.24}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-bg-primary p-6 text-center text-sm text-text-secondary">
              Select at least 2 players to render chart.
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Side-by-Side Table</h2>
          {selectedPlayers.length >= MIN_COMPARE ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-text-secondary">
                    <th className="px-3 py-2">Metric</th>
                    {selectedPlayers.map((player) => (
                      <th key={player.id} className="px-3 py-2 text-right">{player.lastName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <MetricRow label="Team" values={selectedPlayers.map((player) => player.teamAbbreviation)} />
                  <MetricRow label="Position" values={selectedPlayers.map((player) => player.position)} />
                  <MetricRow label="GP" values={selectedPlayers.map((player) => player.gamesPlayed)} />
                  <MetricRow label="Goals" values={selectedPlayers.map((player) => player.goals)} />
                  <MetricRow label="Assists" values={selectedPlayers.map((player) => player.assists)} />
                  <MetricRow label="Points" values={selectedPlayers.map((player) => player.points)} />
                  <MetricRow label="Shots" values={selectedPlayers.map((player) => player.shots)} />
                  <MetricRow label="Sh%" values={selectedPlayers.map((player) => `${(player.shootingPct ?? 0).toFixed(1)}%`)} />
                  <MetricRow label="TOI/GP" values={selectedPlayers.map((player) => timeLabel(player.toiPerGame))} />
                  <MetricRow label="xGF%" values={selectedPlayers.map((player) => `${(player.xGoalsForPct ?? 0).toFixed(1)}%`)} />
                  <MetricRow label="WAR" values={selectedPlayers.map((player) => (player.war ?? 0).toFixed(1))} />
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-bg-primary p-6 text-center text-sm text-text-secondary">
              Select at least 2 players to compare stats.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, values }: { label: string; values: Array<number | string> }) {
  return (
    <tr className="border-b border-border/60 hover:bg-bg-hover">
      <td className="px-3 py-2 font-medium">{label}</td>
      {values.map((value, index) => (
        <td key={`${label}-${index}`} className="px-3 py-2 text-right font-tabular">
          {value}
        </td>
      ))}
    </tr>
  );
}
