export const dynamic = "force-dynamic";

import { getGoalieRows, getSkaterRows } from "@/lib/nhl/queries";

export default async function LeadersPage() {
  const [skaters, goalies] = await Promise.all([getSkaterRows(), getGoalieRows()]);

  const leaderboards = [
    {
      title: "Goals",
      rows: [...skaters].sort((a, b) => b.goals - a.goals).slice(0, 10).map((player) => ({
        name: player.fullName,
        team: player.teamAbbreviation,
        value: player.goals,
      })),
    },
    {
      title: "Assists",
      rows: [...skaters].sort((a, b) => b.assists - a.assists).slice(0, 10).map((player) => ({
        name: player.fullName,
        team: player.teamAbbreviation,
        value: player.assists,
      })),
    },
    {
      title: "Points",
      rows: [...skaters].sort((a, b) => b.points - a.points).slice(0, 10).map((player) => ({
        name: player.fullName,
        team: player.teamAbbreviation,
        value: player.points,
      })),
    },
    {
      title: "Shooting%",
      rows: [...skaters]
        .sort((a, b) => (b.shootingPct ?? 0) - (a.shootingPct ?? 0))
        .slice(0, 10)
        .map((player) => ({
          name: player.fullName,
          team: player.teamAbbreviation,
          value: `${(player.shootingPct ?? 0).toFixed(1)}%`,
        })),
    },
    {
      title: "Goalie Save%",
      rows: [...goalies]
        .sort((a, b) => (b.savePercentage ?? 0) - (a.savePercentage ?? 0))
        .slice(0, 10)
        .map((goalie) => ({
          name: goalie.fullName,
          team: goalie.teamAbbreviation,
          value: (goalie.savePercentage ?? 0).toFixed(3),
        })),
    },
    {
      title: "Goalie Wins",
      rows: [...goalies].sort((a, b) => b.wins - a.wins).slice(0, 10).map((goalie) => ({
        name: goalie.fullName,
        team: goalie.teamAbbreviation,
        value: goalie.wins,
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">NHL Leaders</h1>
      <p className="mt-1 text-sm text-text-secondary">Top 10 leaderboards by skater and goalie categories.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {leaderboards.map((board) => (
          <section key={board.title} className="rounded-xl border border-border bg-bg-card p-4">
            <h2 className="mb-3 text-lg font-semibold">{board.title}</h2>
            <ol className="space-y-2 text-sm">
              {board.rows.map((row, index) => (
                <li key={`${board.title}-${row.name}`} className="flex items-center justify-between rounded-lg border border-border bg-bg-primary px-3 py-2">
                  <span>
                    <span className="mr-2 text-text-secondary">#{index + 1}</span>
                    {row.name}
                    <span className="ml-2 text-text-secondary">{row.team}</span>
                  </span>
                  <span className="font-tabular font-semibold">{row.value}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
