import { notFound } from "next/navigation";
import { PlayerProfileClient } from "@/components/nhl/PlayerProfileClient";
import { getPlayerProfile } from "@/lib/nhl/queries";

export const dynamic = "force-dynamic";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = Number(id);
  if (!Number.isFinite(playerId)) {
    notFound();
  }

  const player = await getPlayerProfile(playerId);

  return <PlayerProfileClient player={player} />;
}
