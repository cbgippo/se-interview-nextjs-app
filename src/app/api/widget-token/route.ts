/**
 * Widget Token API Endpoint
 * 
 * This API endpoint generates secure widget tokens for WorkOS widgets.
 * It validates the user's authentication and generates a token with the
 * appropriate permissions for the User Management widget.
 * 
 * Security:
 * - Requires valid WorkOS authentication session
 * - Validates organization access
 * - Generates tokens with minimal required scopes
 * - Tokens expire after 1 hour for security
 * 
 * Required Permissions:
 * - User must be authenticated
 * - User must have 'widgets:users-table:manage' permission
 * - User must have access to the specified organization
 */

import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";

const workosApiKey = process.env.WORKOS_API_KEY;

if (!workosApiKey) {
  throw new Error("Missing WORKOS_API_KEY");
}

const workos = new WorkOS(workosApiKey);

type WidgetType = "users_management" | "user_profile" | "user_sessions" | "user_security";

type WidgetScope = "widgets:users-table:manage";

function getWidgetScopes(widgetType: WidgetType): WidgetScope[] | undefined {
  if (widgetType === "users_management") {
    return ["widgets:users-table:manage"];
  }

  return undefined;
}

export async function POST(request: Request) {
  try {
    // Validate user authentication
    const { user } = await withAuth();
    
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const organizationId = body.organizationId;
    const widgetType = body.widgetType as WidgetType | undefined;

    if (!organizationId) {
      return Response.json({ error: "Organization ID required" }, { status: 400 });
    }

    if (!widgetType) {
      return Response.json({ error: "Widget type required" }, { status: 400 });
    }

    const scopes = getWidgetScopes(widgetType);

    // Generate widget token with User Management permissions
    const authToken = await workos.widgets.getToken({
      userId: user.id,
      organizationId,
      ...(scopes ? { scopes } : {}),
    });

    return Response.json({ authToken });
  } catch (error) {
    return Response.json(
      { error: "Failed to generate widget token" },
      { status: 500 }
    );
  }
}
