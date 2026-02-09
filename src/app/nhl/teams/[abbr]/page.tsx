export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { TeamProfileClient } from "@/components/nhl/TeamProfileClient";
import { getTeamProfile } from "@/lib/nhl/queries";

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ abbr: string }>;
}) {
  const { abbr } = await params;
  if (!abbr) {
    notFound();
  }

  const data = await getTeamProfile(abbr.toUpperCase());

  return <TeamProfileClient data={data} />;
}
