import { getInstagramLoginUrl } from "@/lib/instagram";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verify path
import { NextResponse } from "next/server";

export async function GET() {
  // Basic Auth Check
  // const session = await getServerSession(authOptions);
  // if (!session || !['admin', 'superadmin', 'social_admin'].includes(session.user.role)) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  // }

  // We redirect directly
  try {
    const url = getInstagramLoginUrl();
    return NextResponse.redirect(url);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
