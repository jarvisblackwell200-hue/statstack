export const dynamic = "force-dynamic";

import { getSkaterRows } from "@/lib/nhl/queries";
import { SkaterStatTable } from "@/components/stat-table/SkaterStatTable";

export default async function PlayersPage() {
  const data = await getSkaterRows();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">NHL Skater Stats</h1>
        <p className="text-sm text-text-secondary">
          2025-26 Regular Season
        </p>
      </div>
      <SkaterStatTable data={data} />
    </div>
  );
}
