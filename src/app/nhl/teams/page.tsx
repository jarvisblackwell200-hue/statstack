export const dynamic = "force-dynamic";

import Link from "next/link";
import { getTeamStatsRows } from "@/lib/nhl/queries";

export default async function TeamsPage() {
  const teams = await getTeamStatsRows();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">NHL Teams</h1>
        <p className="mt-1 text-sm text-text-secondary">Team stats table with profile links.</p>
      </div>

      <div className="rounded-xl border border-border bg-bg-card p-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary">
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2">Conf</th>
                <th className="px-3 py-2">Div</th>
                <th className="px-3 py-2 text-right">GP</th>
                <th className="px-3 py-2 text-right">W-L-OT</th>
                <th className="px-3 py-2 text-right">PTS</th>
                <th className="px-3 py-2 text-right">GF</th>
                <th className="px-3 py-2 text-right">GA</th>
                <th className="px-3 py-2 text-right">GD</th>
                <th className="px-3 py-2 text-right">PP%</th>
                <th className="px-3 py-2 text-right">PK%</th>
                <th className="px-3 py-2 text-right">xGF%</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.abbreviation} className="border-b border-border/60 hover:bg-bg-hover">
                  <td className="px-3 py-2 font-medium">
                    <Link href={`/nhl/teams/${team.abbreviation.toLowerCase()}`} className="hover:text-accent">
                      {team.fullName}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{team.conference}</td>
                  <td className="px-3 py-2">{team.division}</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.gamesPlayed}</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.wins}-{team.losses}-{team.otLosses}</td>
                  <td className="px-3 py-2 text-right font-tabular font-semibold">{team.points}</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.goalsFor}</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.goalsAgainst}</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.goalDiff}</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.ppPct.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.pkPct.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-tabular">{team.xGoalsForPct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
