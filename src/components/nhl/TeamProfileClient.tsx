"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TeamProfileData } from "@/lib/nhl/queries";

interface TeamProfileClientProps {
  data: TeamProfileData;
}

function toTimeLabel(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function TeamProfileClient({ data }: TeamProfileClientProps) {
  const { team, roster, lineCombos, trends } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="rounded-xl border border-border bg-bg-card p-6">
        <h1 className="text-3xl font-bold">{team.fullName}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {team.conference} Conference | {team.division} Division
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-6">
          <Tile label="Record" value={`${team.wins}-${team.losses}-${team.otLosses}`} />
          <Tile label="Points" value={team.points} />
          <Tile label="GF" value={team.goalsFor} />
          <Tile label="GA" value={team.goalsAgainst} />
          <Tile label="PP%" value={`${team.ppPct.toFixed(1)}%`} />
          <Tile label="PK%" value={`${team.pkPct.toFixed(1)}%`} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Line Combos</h2>
          <div className="space-y-3">
            {lineCombos.map((combo) => (
              <div key={combo.label} className="rounded-lg border border-border bg-bg-primary p-3">
                <p className="font-semibold">{combo.label}</p>
                <p className="mt-1 text-sm text-text-secondary">{combo.players.join(" | ")}</p>
                <p className="mt-2 text-xs text-text-secondary">
                  TOI Share: {combo.toiShare.toFixed(1)}% | GF%: {combo.goalsForPct.toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Recent Trends</h2>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <LineChart data={trends}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="game" stroke="var(--text-secondary)" />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="goalsFor" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line yAxisId="left" type="monotone" dataKey="goalsAgainst" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="pointsPct" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Roster</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Pos</th>
                <th className="px-3 py-2 text-right">G</th>
                <th className="px-3 py-2 text-right">A</th>
                <th className="px-3 py-2 text-right">P</th>
                <th className="px-3 py-2 text-right">TOI/GP</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((player) => (
                <tr key={player.id} className="border-b border-border/60 hover:bg-bg-hover">
                  <td className="px-3 py-2">{player.fullName}</td>
                  <td className="px-3 py-2">{player.position}</td>
                  <td className="px-3 py-2 text-right font-tabular">{player.goals}</td>
                  <td className="px-3 py-2 text-right font-tabular">{player.assists}</td>
                  <td className="px-3 py-2 text-right font-tabular font-semibold">{player.points}</td>
                  <td className="px-3 py-2 text-right font-tabular">{toTimeLabel(player.toiPerGame)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-bg-primary px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-lg font-semibold font-tabular">{value}</p>
    </div>
  );
}
