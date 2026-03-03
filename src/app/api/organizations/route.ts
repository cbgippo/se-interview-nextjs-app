/**
 * Organizations API Endpoint
 * 
 * This API endpoint fetches all organizations available to the authenticated user.
 * It provides the organization data needed for the User Management widget to
 * allow organization switching and proper context.
 * 
 * Security:
 * - Requires valid WorkOS authentication session
 * - Only returns organizations the user has access to
 * - Uses server-side WorkOS client for security
 * 
 * Data Returned:
 * - Array of organization objects with id and name
 * - Filtered by user's access permissions
 */

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
    // Validate user authentication
    const { user } = await withAuth();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: user.id,
    });

    const organizationIds = Array.from(
      new Set(memberships.data.map((m: any) => m.organizationId ?? m.organization_id).filter(Boolean))
    ) as string[];

    const organizations = await Promise.all(
      organizationIds.map(async (id) => {
        const org = await workos.organizations.getOrganization(id);
        return { id: org.id, name: org.name };
      })
    );

    return NextResponse.json({ organizations });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
