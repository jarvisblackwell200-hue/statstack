"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PlayerProfileData } from "@/lib/nhl/queries";

interface PlayerProfileClientProps {
  player: PlayerProfileData;
}

function toTimeLabel(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function PlayerProfileClient({ player }: PlayerProfileClientProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="grid gap-6 rounded-xl border border-border bg-bg-card p-6 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center justify-center">
          <img
            src={player.headshotUrl ?? "https://assets.nhle.com/mugs/nhl/latest/168x168/skater.png"}
            alt={player.fullName}
            className="h-40 w-40 rounded-full border border-border bg-bg-primary object-cover"
          />
          <div className="mt-4 text-center text-sm text-text-secondary">
            {player.position} | {player.teamAbbreviation}
          </div>
          <Link
            href={`/nhl/compare?ids=${player.id}`}
            className="mt-4 w-full rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Compare Player
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{player.fullName}</h1>
          <p className="mt-1 text-sm text-text-secondary">{player.teamName}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Stat label="GP" value={player.seasonStats.gamesPlayed} />
            <Stat label="Goals" value={player.seasonStats.goals} />
            <Stat label="Assists" value={player.seasonStats.assists} />
            <Stat label="Points" value={player.seasonStats.points} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Stat label="Sh%" value={`${player.seasonStats.shootingPct.toFixed(1)}%`} />
            <Stat label="TOI/GP" value={toTimeLabel(Math.round(player.seasonStats.toiPerGame))} />
            <Stat label="xGF%" value={`${player.seasonStats.xGoalsForPct.toFixed(1)}%`} />
            <Stat label="WAR" value={player.seasonStats.war.toFixed(1)} />
          </div>
          <div className="mt-4 rounded-lg border border-border bg-bg-primary p-3 text-sm text-text-secondary">
            <p>
              Born: {player.birthDate ?? "N/A"} {player.birthCity ? `| ${player.birthCity}` : ""}
              {player.birthCountry ? `, ${player.birthCountry}` : ""}
            </p>
            <p className="mt-1">
              Shoots: {player.shootsCatches ?? "N/A"} | Height: {player.height ?? "N/A"} in | Weight: {player.weight ?? "N/A"} lbs
            </p>
            <p className="mt-1">
              Draft: {player.draftYear ?? "N/A"} {player.draftRound ? `(R${player.draftRound}, #${player.draftPick ?? "?"})` : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Goals & Points Trend</h2>
          <div className="h-[260px]">
            <ResponsiveContainer>
              <LineChart data={player.trends}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="season" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line type="monotone" dataKey="goals" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="points" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Shooting% & Ice Time Trend</h2>
          <div className="h-[260px]">
            <ResponsiveContainer>
              <LineChart data={player.trends}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="season" stroke="var(--text-secondary)" />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="shootingPct" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="toiPerGame" stroke="#c084fc" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Percentile Rankings</h2>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <BarChart data={player.percentileRankings} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} stroke="var(--text-secondary)" />
                <YAxis type="category" dataKey="label" stroke="var(--text-secondary)" width={90} />
                <Tooltip
                  formatter={(value: number | string | undefined) => `${Number(value ?? 0)}th pct`}
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {player.percentileRankings.map((entry) => (
                    <Cell key={entry.label} fill={entry.value >= 70 ? "#22c55e" : entry.value >= 40 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">Career Stats</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-secondary">
                  <th className="px-3 py-2">Season</th>
                  <th className="px-3 py-2">Team</th>
                  <th className="px-3 py-2 text-right">GP</th>
                  <th className="px-3 py-2 text-right">G</th>
                  <th className="px-3 py-2 text-right">A</th>
                  <th className="px-3 py-2 text-right">P</th>
                  <th className="px-3 py-2 text-right">Sh%</th>
                  <th className="px-3 py-2 text-right">TOI/GP</th>
                </tr>
              </thead>
              <tbody>
                {player.careerStats.map((season) => (
                  <tr key={season.season} className="border-b border-border/60 hover:bg-bg-hover">
                    <td className="px-3 py-2">{season.season.slice(0, 4)}-{season.season.slice(6, 8)}</td>
                    <td className="px-3 py-2">{season.teamAbbreviation}</td>
                    <td className="px-3 py-2 text-right font-tabular">{season.gamesPlayed}</td>
                    <td className="px-3 py-2 text-right font-tabular">{season.goals}</td>
                    <td className="px-3 py-2 text-right font-tabular">{season.assists}</td>
                    <td className="px-3 py-2 text-right font-tabular font-semibold">{season.points}</td>
                    <td className="px-3 py-2 text-right font-tabular">{season.shootingPct.toFixed(1)}%</td>
                    <td className="px-3 py-2 text-right font-tabular">{toTimeLabel(Math.round(season.toiPerGame))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Recent Game Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Opp</th>
                <th className="px-3 py-2">H/A</th>
                <th className="px-3 py-2 text-right">G</th>
                <th className="px-3 py-2 text-right">A</th>
                <th className="px-3 py-2 text-right">P</th>
                <th className="px-3 py-2 text-right">S</th>
                <th className="px-3 py-2 text-right">TOI</th>
              </tr>
            </thead>
            <tbody>
              {player.gameLog.map((game) => (
                <tr key={`${game.date}-${game.opponent}-${game.homeAway}`} className="border-b border-border/60 hover:bg-bg-hover">
                  <td className="px-3 py-2">{game.date}</td>
                  <td className="px-3 py-2">{game.opponent}</td>
                  <td className="px-3 py-2">{game.homeAway}</td>
                  <td className="px-3 py-2 text-right font-tabular">{game.goals}</td>
                  <td className="px-3 py-2 text-right font-tabular">{game.assists}</td>
                  <td className="px-3 py-2 text-right font-tabular font-semibold">{game.points}</td>
                  <td className="px-3 py-2 text-right font-tabular">{game.shots}</td>
                  <td className="px-3 py-2 text-right font-tabular">{toTimeLabel(game.toi)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-bg-primary px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-xl font-semibold font-tabular">{value}</p>
    </div>
  );
}
