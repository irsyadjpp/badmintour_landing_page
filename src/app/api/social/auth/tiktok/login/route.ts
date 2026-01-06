import { getTikTokLoginUrl } from "@/lib/tiktok";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = getTikTokLoginUrl();
    return NextResponse.redirect(url);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
