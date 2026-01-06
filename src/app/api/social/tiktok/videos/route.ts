import { NextRequest, NextResponse } from "next/server";
import { getTikTokVideos } from "@/lib/tiktok";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // 1. Auth Check - Only Admins/Social Admins
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Get Access Token from Firestore
    const docRef = doc(db, "system_config", "tiktok_integration");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "TikTok not connected" }, { status: 404 });
    }

    const config = docSnap.data();
    const accessToken = config.accessToken;

    // 3. Fetch Videos
    // Handle cursor for pagination if needed
    const { searchParams } = new URL(req.url);
    const cursor = parseInt(searchParams.get('cursor') || '0');

    const data = await getTikTokVideos(accessToken, cursor);

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("Fetch TikTok Videos Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
