import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { runIngestion } from "@/lib/ingestion/pipeline";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== config.adminToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await runIngestion();
  return NextResponse.json({ ok: true });
}
