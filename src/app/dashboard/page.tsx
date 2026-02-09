export const dynamic = "force-dynamic";

import Link from "next/link";
import { getScores, getSkaterLeaders } from "@/lib/nhl/client";
import { getSkaterRows } from "@/lib/nhl/queries";

interface ScoreCard {
  id: number;
  away: string;
  home: string;
  awayScore: number;
  homeScore: number;
  state: string;
}

export default async function DashboardPage() {
  const [scores, skaters, leaders] = await Promise.all([
    loadScores(),
    getSkaterRows(),
    loadLeaderSnapshot(),
  ]);

  const trending = [...skaters]
    .sort((a, b) => (b.points - b.gamesPlayed) - (a.points - a.gamesPlayed))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-text-secondary">Scores, leaders, and trending NHL skater stats.</p>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Scores Widget</h2>
            <Link href="/nhl" className="text-sm text-accent hover:text-accent-hover">NHL Hub</Link>
          </div>
          <div className="space-y-2">
            {scores.map((game) => (
              <div key={game.id} className="rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{game.away} @ {game.home}</span>
                  <span className="font-tabular">{game.awayScore}-{game.homeScore}</span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">{game.state}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <h2 className="mb-3 text-lg font-semibold">League Leaders Snapshot</h2>
          <div className="space-y-2 text-sm">
            <Snapshot label="Goals" value={`${leaders.goals.player} (${leaders.goals.value})`} />
            <Snapshot label="Assists" value={`${leaders.assists.player} (${leaders.assists.value})`} />
            <Snapshot label="Points" value={`${leaders.points.player} (${leaders.points.value})`} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Trending Stats (Pts - GP)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2 text-right">GP</th>
                <th className="px-3 py-2 text-right">P</th>
                <th className="px-3 py-2 text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {trending.map((player) => (
                <tr key={player.id} className="border-b border-border/60 hover:bg-bg-hover">
                  <td className="px-3 py-2 font-medium">{player.fullName}</td>
                  <td className="px-3 py-2">{player.teamAbbreviation}</td>
                  <td className="px-3 py-2 text-right font-tabular">{player.gamesPlayed}</td>
                  <td className="px-3 py-2 text-right font-tabular">{player.points}</td>
                  <td className="px-3 py-2 text-right font-tabular">{player.points - player.gamesPlayed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-primary px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

async function loadScores(): Promise<ScoreCard[]> {
  try {
    const response = await getScores();
    return response.games.slice(0, 6).map((game) => ({
      id: game.id,
      away: game.awayTeam.abbrev,
      home: game.homeTeam.abbrev,
      awayScore: game.awayTeam.score,
      homeScore: game.homeTeam.score,
      state: game.gameState,
    }));
  } catch {
    return [
      { id: 1, away: "EDM", home: "CGY", awayScore: 4, homeScore: 2, state: "FINAL" },
      { id: 2, away: "TOR", home: "MTL", awayScore: 3, homeScore: 3, state: "3RD 08:21" },
      { id: 3, away: "COL", home: "DAL", awayScore: 1, homeScore: 2, state: "2ND INT" },
      { id: 4, away: "NJD", home: "NYR", awayScore: 0, homeScore: 0, state: "PRE-GAME" },
    ];
  }
}

async function loadLeaderSnapshot() {
  try {
    const response = await getSkaterLeaders();
    return {
      goals: {
        player: `${response.goals[0]?.firstName.default ?? "N/A"} ${response.goals[0]?.lastName.default ?? ""}`.trim(),
        value: response.goals[0]?.value ?? 0,
      },
      assists: {
        player: `${response.assists[0]?.firstName.default ?? "N/A"} ${response.assists[0]?.lastName.default ?? ""}`.trim(),
        value: response.assists[0]?.value ?? 0,
      },
      points: {
        player: `${response.points[0]?.firstName.default ?? "N/A"} ${response.points[0]?.lastName.default ?? ""}`.trim(),
        value: response.points[0]?.value ?? 0,
      },
    };
  } catch {
    return {
      goals: { player: "A. Matthews", value: 56 },
      assists: { player: "C. McDavid", value: 86 },
      points: { player: "N. MacKinnon", value: 119 },
    };
  }
}
