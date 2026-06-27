// src/app/api/settings/google-analytics/route.ts
// Saves GA/GTM IDs to a local JSON file so layout.tsx can read them server-side.

import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const SETTINGS_DIR  = join(process.cwd(), "data");
const SETTINGS_FILE = join(SETTINGS_DIR, "analytics-settings.json");

function readSettings(): Record<string, string> {
  try {
    return JSON.parse(readFileSync(SETTINGS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeSettings(data: Record<string, string>) {
  mkdirSync(SETTINGS_DIR, { recursive: true });
  writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

// GET — layout.tsx calls this to load IDs
export async function GET() {
  return NextResponse.json(readSettings());
}

// POST — admin widget calls this to save IDs
export async function POST(req: NextRequest) {
  const body = await req.json();
  const current = readSettings();

  const updated = {
    ...current,
    ...(body.measurementId !== undefined && { gaId:  body.measurementId }),
    ...(body.gtmId         !== undefined && { gtmId: body.gtmId }),
  };

  writeSettings(updated);
  return NextResponse.json({ ok: true });
}