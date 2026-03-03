/**
 * User Management Page
 * 
 * This page implements the WorkOS User Management Widget to allow organization admins
 * to manage users, roles, and permissions within their organization.
 * 
 * Features:
 * - Invite new users to the organization
 * - Remove existing users
 * - Change user roles and permissions
 * - Multi-organization support with switching
 * - Full container responsive design
 * 
 * Authentication:
 * - Requires valid WorkOS authentication session
 * - User must have 'widgets:users-table:manage' permission
 * - Widget tokens are generated server-side for security
 * 
 * Error Handling:
 * - Comprehensive error states and user feedback
 * - Retry functionality for failed operations
 * - Clear error messages for common issues
 */

"use client";

import React, { useState, useEffect } from "react";
import { UsersManagement, WorkOsWidgets } from "@workos-inc/widgets";
import { Button, Flex, Heading, Text, Callout, Select, Card } from "@radix-ui/themes";
class WidgetErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }


  render() {
    if (this.state.hasError) {
      return (
        <Callout.Root color="red" mb="4">
          <Callout.Text>
            Widget encountered an error. Please refresh the page.
          </Callout.Text>
          <Button size="1" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Callout.Root>
      );
    }

    return this.props.children;
  }
}

/**
 * Fetches a widget token from the server for the specified organization
 * @param organizationId - The WorkOS organization ID
 * @returns Promise resolving to the widget token string
 */
async function getWidgetToken(organizationId: string) {
  const response = await fetch("/api/widget-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ organizationId, widgetType: "users_management" }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate widget token (${response.status})`);
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

export default function UserManagementPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const orgs = await getOrganizations();
        setOrganizations(orgs);
        
        if (orgs.length > 0) {
          const orgId = orgs[0].id;
          setSelectedOrganization(orgId);
          
          const token = await getWidgetToken(orgId);
          setAuthToken(token);
        } else {
          setError("No organizations found for this user");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load widget");
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
        <Heading size="6">Loading User Management...</Heading>
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
        <Heading size="6">User Management</Heading>
        <Text color="gray">
          Manage users, roles, and permissions for your organization.
        </Text>
        
        {organizations.length > 1 && (
          <Card size="2">
            <Flex align="center" gap="4">
              <Text weight="bold">Organization:</Text>
              <Select.Root 
                value={selectedOrganization} 
                onValueChange={handleOrganizationChange}
              >
                <Select.Trigger />
                <Select.Content>
                  {organizations.map((org) => (
                    <Select.Item key={org.id} value={org.id}>
                      {org.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Flex>
          </Card>
        )}
      </Flex>
      
      {error && (
        <Callout.Root color="red" mb="4">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      
      {authToken && (
        <WorkOsWidgets>
          <WidgetErrorBoundary>
            <UsersManagement authToken={authToken as string} />
          </WidgetErrorBoundary>
        </WorkOsWidgets>
      )}
    </Flex>
  );
}
