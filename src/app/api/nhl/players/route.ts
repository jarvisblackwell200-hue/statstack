import { NextResponse } from "next/server";
import { getSkaterRows } from "@/lib/nhl/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season") ?? undefined;
  const data = await getSkaterRows(season);
  return NextResponse.json(data);
}
