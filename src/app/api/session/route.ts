import { authkit } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { session } = await authkit(request);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ sessionId: session.sessionId });
  } catch {
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
};
