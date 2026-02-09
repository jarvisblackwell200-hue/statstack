export const dynamic = "force-dynamic";

import { CompareToolClient } from "@/components/nhl/CompareToolClient";
import { getSkaterRows } from "@/lib/nhl/queries";

export default async function ComparePage() {
  const players = await getSkaterRows();

  return <CompareToolClient players={players} />;
}
