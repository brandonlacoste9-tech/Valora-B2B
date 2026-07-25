import { NextResponse } from "next/server";
import { runMatchmaking } from "@/lib/ai/matcher";

export const maxDuration = 60;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const procurementId = body.procurementId as string;

    if (!procurementId) {
      return NextResponse.json(
        { ok: false, error: "procurementId is required" },
        { status: 400 },
      );
    }

    const result = await runMatchmaking(procurementId);

    return NextResponse.json({
      ok: true,
      matchesCalculated: result.count,
    });
  } catch (e) {
    console.error("[api/match]", e);
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Matchmaking calculation failed",
      },
      { status: 500 },
    );
  }
}
