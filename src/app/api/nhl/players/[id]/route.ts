import { NextResponse } from "next/server";
import { getPlayerProfile } from "@/lib/nhl/queries";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid player id" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season") ?? undefined;
  const data = await getPlayerProfile(id, season);

  return NextResponse.json(data);
}
