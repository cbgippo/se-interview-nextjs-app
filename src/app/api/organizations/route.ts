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
import { NextRequest, NextResponse } from "next/server";

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export async function GET(request: NextRequest) {
  try {
    // Validate user authentication
    const { user } = await withAuth();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch organizations from WorkOS
    const organizationList = await workos.organizations.listOrganizations();
    
    return NextResponse.json({ organizations: organizationList.data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
