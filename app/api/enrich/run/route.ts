import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { enrichFromGitHub } from "@/lib/enrichment/github";
import { enrichFromWebsites } from "@/lib/enrichment/website";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== config.adminToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await enrichFromGitHub();
  await enrichFromWebsites();
  return NextResponse.json({ ok: true });
}
