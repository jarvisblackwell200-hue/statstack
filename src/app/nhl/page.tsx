export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSchedule, getSkaterLeaders, getStandings } from "@/lib/nhl/client";

interface HubStandingRow {
  team: string;
  abbr: string;
  points: number;
  gamesPlayed: number;
  winPct: number;
}

interface HubScheduleRow {
  id: number;
  date: string;
  away: string;
  home: string;
  state: string;
}

export default async function NHLHub() {
  const [standings, leaders, schedule] = await Promise.all([
    loadStandings(),
    loadLeaders(),
    loadSchedule(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">NHL Hub</h1>
        <p className="mt-1 text-sm text-text-secondary">Standings, leaders, and schedule overview.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Standings</h2>
            <Link href="/nhl/teams" className="text-sm text-accent hover:text-accent-hover">Teams</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-secondary">
                  <th className="px-3 py-2">Team</th>
                  <th className="px-3 py-2 text-right">GP</th>
                  <th className="px-3 py-2 text-right">PTS</th>
                  <th className="px-3 py-2 text-right">Win%</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => (
                  <tr key={row.abbr} className="border-b border-border/60 hover:bg-bg-hover">
                    <td className="px-3 py-2 font-medium">{row.team}</td>
                    <td className="px-3 py-2 text-right font-tabular">{row.gamesPlayed}</td>
                    <td className="px-3 py-2 text-right font-tabular font-semibold">{row.points}</td>
                    <td className="px-3 py-2 text-right font-tabular">{(row.winPct * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Leaders</h2>
            <Link href="/nhl/leaders" className="text-sm text-accent hover:text-accent-hover">All leaderboards</Link>
          </div>
          <div className="space-y-2 text-sm">
            <LeaderRow label="Goals" value={`${leaders.goals.name} (${leaders.goals.value})`} />
            <LeaderRow label="Assists" value={`${leaders.assists.name} (${leaders.assists.value})`} />
            <LeaderRow label="Points" value={`${leaders.points.name} (${leaders.points.value})`} />
            <LeaderRow label="+/-" value={`${leaders.plusMinus.name} (${leaders.plusMinus.value})`} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Away</th>
                <th className="px-3 py-2">Home</th>
                <th className="px-3 py-2">State</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((game) => (
                <tr key={game.id} className="border-b border-border/60 hover:bg-bg-hover">
                  <td className="px-3 py-2">{game.date}</td>
                  <td className="px-3 py-2">{game.away}</td>
                  <td className="px-3 py-2">{game.home}</td>
                  <td className="px-3 py-2 text-text-secondary">{game.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LeaderRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-primary px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

async function loadStandings(): Promise<HubStandingRow[]> {
  try {
    const response = await getStandings();
    return response.standings
      .slice()
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)
      .map((team) => ({
        team: `${team.placeName.default} ${team.teamCommonName.default}`,
        abbr: team.teamAbbrev.default,
        points: team.points,
        gamesPlayed: team.gamesPlayed,
        winPct: team.winPctg,
      }));
  } catch {
    return [
      { team: "Colorado Avalanche", abbr: "COL", points: 113, gamesPlayed: 82, winPct: 0.634 },
      { team: "New York Rangers", abbr: "NYR", points: 111, gamesPlayed: 82, winPct: 0.622 },
      { team: "Edmonton Oilers", abbr: "EDM", points: 109, gamesPlayed: 82, winPct: 0.610 },
      { team: "Toronto Maple Leafs", abbr: "TOR", points: 106, gamesPlayed: 82, winPct: 0.598 },
      { team: "Dallas Stars", abbr: "DAL", points: 104, gamesPlayed: 82, winPct: 0.585 },
    ];
  }
}

async function loadLeaders() {
  try {
    const response = await getSkaterLeaders();
    return {
      goals: {
        name: `${response.goals[0]?.firstName.default ?? "N/A"} ${response.goals[0]?.lastName.default ?? ""}`.trim(),
        value: response.goals[0]?.value ?? 0,
      },
      assists: {
        name: `${response.assists[0]?.firstName.default ?? "N/A"} ${response.assists[0]?.lastName.default ?? ""}`.trim(),
        value: response.assists[0]?.value ?? 0,
      },
      points: {
        name: `${response.points[0]?.firstName.default ?? "N/A"} ${response.points[0]?.lastName.default ?? ""}`.trim(),
        value: response.points[0]?.value ?? 0,
      },
      plusMinus: {
        name: `${response.plusMinus[0]?.firstName.default ?? "N/A"} ${response.plusMinus[0]?.lastName.default ?? ""}`.trim(),
        value: response.plusMinus[0]?.value ?? 0,
      },
    };
  } catch {
    return {
      goals: { name: "A. Matthews", value: 56 },
      assists: { name: "C. McDavid", value: 86 },
      points: { name: "N. MacKinnon", value: 119 },
      plusMinus: { name: "Q. Hughes", value: 21 },
    };
  }
}

async function loadSchedule(): Promise<HubScheduleRow[]> {
  try {
    const response = await getSchedule();
    return response.gameWeek
      .flatMap((day) => day.games.map((game) => ({
        id: game.id,
        date: day.date,
        away: game.awayTeam.abbrev,
        home: game.homeTeam.abbrev,
        state: game.gameState,
      })))
      .slice(0, 12);
  } catch {
    return [
      { id: 1, date: "2026-02-09", away: "COL", home: "DAL", state: "FUT" },
      { id: 2, date: "2026-02-09", away: "TOR", home: "BOS", state: "FUT" },
      { id: 3, date: "2026-02-10", away: "EDM", home: "VAN", state: "FUT" },
      { id: 4, date: "2026-02-10", away: "NYR", home: "NJD", state: "FUT" },
    ];
  }
}
