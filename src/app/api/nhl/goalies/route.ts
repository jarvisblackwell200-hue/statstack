import { NextResponse } from "next/server";
import { getGoalieRows } from "@/lib/nhl/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season") ?? undefined;
  const data = await getGoalieRows(season);
  return NextResponse.json(data);
}
