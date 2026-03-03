/**
 * User Sessions Page
 * 
 * This page implements the WorkOS User Sessions widget to allow users
 * to view and manage their active sessions across devices and browsers.
 * 
 * Features:
 * - View active sessions across all devices
 * - See session details (device, browser, location)
 * - Sign out of individual sessions
 * - Clean, responsive design
 * 
 * Authentication:
 * - Requires valid WorkOS authentication session
 * - Uses same token generation pattern as other widgets
 * - No special permissions required beyond basic authentication
 * 
 * Error Handling:
 * - Comprehensive error states and user feedback
 * - Retry functionality for failed operations
 * - Clear error messages for common issues
 */

"use client";

import { useState, useEffect } from "react";
import { UserSessions, WorkOsWidgets } from "@workos-inc/widgets";
import { Button, Flex, Heading, Text, Callout } from "@radix-ui/themes";

/**
 * Fetches a widget token from the server for WorkOS widgets
 * Uses the same endpoint as User Management since tokens are reusable
 * @param organizationId - The WorkOS organization ID
 * @returns Promise resolving to widget token string
 */
async function getWidgetToken(organizationId?: string) {
  const response = await fetch("/api/widget-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.details || errorData.error || `Failed to generate widget token (${response.status})`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.authToken;
}

/**
 * Fetches available organizations for the current user
 * @returns Promise resolving to array of organization objects
 */
async function getOrganizations() {
  const response = await fetch("/api/organizations");
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch organizations (${response.status})`);
  }

  const data = await response.json();
  return data.organizations;
}

export default function SessionsPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        
        // First, get organizations to provide proper context
        const orgs = await getOrganizations();
        setOrganizations(orgs);
        
        if (orgs.length > 0) {
          // Use the first organization for sessions context
          const organizationId = orgs[0].id;
          setSelectedOrganization(organizationId);
          
          const token = await getWidgetToken(organizationId);
          setAuthToken(token);
        } else {
          // Fallback: try without organization context
          const token = await getWidgetToken();
          setAuthToken(token);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sessions widget");
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  const handleOrganizationChange = async (orgId: string) => {
    try {
      setSelectedOrganization(orgId);
      setLoading(true);
      const token = await getWidgetToken(orgId);
      setAuthToken(token);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch organization");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !authToken) {
    return (
      <Flex direction="column" align="center" gap="4" p="6">
        <Heading size="6">Loading Sessions...</Heading>
      </Flex>
    );
  }

  if (error && !authToken) {
    return (
      <Flex direction="column" align="center" gap="4" p="6">
        <Heading size="6">Error</Heading>
        <Callout.Root color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" p="6" style={{ minHeight: "100vh" }}>
      <Flex direction="column" gap="4" mb="6">
        <Heading size="6">User Sessions</Heading>
        <Text color="gray">
          View and manage your active sessions across devices and browsers.
        </Text>
        
        {organizations.length > 1 && (
          <div style={{ 
            padding: "16px", 
            border: "1px solid var(--gray-a6)",
            borderRadius: "8px",
            backgroundColor: "var(--color-panel)"
          }}>
            <Flex align="center" gap="4">
              <Text weight="bold">Organization:</Text>
              <select 
                value={selectedOrganization} 
                onChange={(e) => handleOrganizationChange(e.target.value)}
                style={{
                  padding: "8px",
                  border: "1px solid var(--gray-a6)",
                  borderRadius: "4px",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text)"
                }}
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </Flex>
          </div>
        )}
      </Flex>
      
      {error && (
        <Callout.Root color="red" mb="4">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      
      {authToken && (
        <WorkOsWidgets>
          <div style={{ width: "100%", flex: 1, minHeight: 0 }}>
            <UserSessions 
              authToken={authToken} 
              currentSessionId={currentSessionId}
            />
          </div>
        </WorkOsWidgets>
      )}
    </Flex>
  );
}
