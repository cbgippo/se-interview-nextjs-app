"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { SignInButton } from "./components/sign-in-button";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useMe } from "@/app/hooks/use-me";

function TimeGreeting({ firstName }: { firstName?: string }) {
  const [timeGreeting, setTimeGreeting] = useState("Good day");

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      let greeting = "Good day";

      if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning";
      } else if (currentHour >= 12 && currentHour < 17) {
        greeting = "Good afternoon";
      } else if (currentHour >= 17 && currentHour < 22) {
        greeting = "Good evening";
      } else {
        greeting = "Good night";
      }

      setTimeGreeting(greeting);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Heading size="8">
      {timeGreeting}{firstName && `, ${firstName}!`}
    </Heading>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: me } = useMe(Boolean(user));

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div style={{ height: "100vh" }} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" align="center" gap="2">
      {user ? (
        <>
          <TimeGreeting firstName={(me?.firstName ?? user?.firstName) || undefined} />
          <Text size="4" color="gray" align="center" mt="2">
            Manage your organization&apos;s users, sessions, and security settings with WorkOS authentication
          </Text>
          <Flex align="center" gap="3" mt="4">
            <Button asChild size="3" variant="outline">
              <NextLink href="/user-management">User Management</NextLink>
            </Button>
            <Button asChild size="3" variant="outline">
              <NextLink href="/sessions">User Sessions</NextLink>
            </Button>
            <Button asChild size="3" variant="outline">
              <NextLink href="/security">User Security</NextLink>
            </Button>
            <Button asChild size="3" variant="outline">
              <NextLink href="/profile">User Profile</NextLink>
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <Heading size="8">AuthKit authentication example</Heading>
          <Text size="5" color="gray" mb="4">
            Sign in to view your account details
          </Text>
          <SignInButton large />
        </>
      )}
    </Flex>
  );
}
