export const dynamic = "force-dynamic";

import { getGoalieRows } from "@/lib/nhl/queries";
import { GoalieStatTable } from "@/components/stat-table/GoalieStatTable";

export default async function GoaliesPage() {
  const data = await getGoalieRows();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">NHL Goalie Stats</h1>
        <p className="text-sm text-text-secondary">
          2025-26 Regular Season
        </p>
      </div>
      <GoalieStatTable data={data} />
    </div>
  );
}
