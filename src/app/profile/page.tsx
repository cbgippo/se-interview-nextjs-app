/**
 * User Profile Page
 * 
 * This page implements the WorkOS User Profile widget to allow users
 * to view and manage their personal profile information.
 * 
 * Features:
 * - View personal profile details
 * - Edit display name
 * - Manage profile information
 * - Clean, responsive design
 * 
 * Authentication:
 * - Requires valid WorkOS authentication session
 * - Uses same token generation as User Management
 * - No special permissions required beyond basic authentication
 * 
 * Error Handling:
 * - Comprehensive error states and user feedback
 * - Retry functionality for failed operations
 * - Clear error messages for common issues
 */

"use client";

import { useState, useEffect } from "react";
import React from "react";
import { UserProfile, WorkOsWidgets } from "@workos-inc/widgets";
import { Button, Flex, Heading, Text, Callout } from "@radix-ui/themes";

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
    body: JSON.stringify({ organizationId, widgetType: "user_profile" }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.details || errorData.error || `Failed to generate widget token (${response.status})`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.authToken;
}

export default function ProfilePage() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // First, get organizations to provide proper context
        const organizations = await getOrganizations();
        
        if (organizations.length === 0) {
          throw new Error("No organizations found for this user");
        }

        // Use the first organization for profile context
        const organizationId = organizations[0].id;
        const token = await getWidgetToken(organizationId);
        setAuthToken(token);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile widget");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading && !authToken) {
    return (
      <Flex direction="column" align="center" gap="4" p="6">
        <Heading size="6">Loading Profile...</Heading>
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
        <Heading size="6">User Profile</Heading>
        <Text color="gray">
          View and manage your personal profile information.
        </Text>
      </Flex>
      
      {error && (
        <Callout.Root color="red" mb="4">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      
      {authToken && (
        <WorkOsWidgets>
          <div style={{ width: "100%", flex: 1, minHeight: 0 }}>
            <UserProfile authToken={authToken} />
          </div>
        </WorkOsWidgets>
      )}
    </Flex>
  );
}
