import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { NextResponse } from "next/server";

const workosApiKey = process.env.WORKOS_API_KEY;

if (!workosApiKey) {
  throw new Error("Missing WORKOS_API_KEY");
}

const workos = new WorkOS(workosApiKey);

export async function GET() {
  try {
    const { user } = await withAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const freshUser = await workos.userManagement.getUser(user.id);
    return NextResponse.json({ firstName: freshUser.firstName ?? null });
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
