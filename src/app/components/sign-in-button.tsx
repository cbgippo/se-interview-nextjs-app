"use client";

/**
 * Example of a client component using the useAuth hook to get the current user session.
 */

import { Button, Flex } from "@radix-ui/themes";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { handleSignOutAction } from "../actions/signOut";
import { useEffect, useState } from "react";

export function SignInButton({ large }: { large?: boolean }) {
  const { user, loading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  // Prevent hydration mismatch by waiting for client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Don't render anything during hydration to prevent mismatch
  if (!isHydrated) {
    return <div style={{ height: large ? "48px" : "36px" }} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <Flex gap="3">
        <form action={handleSignOutAction}>
          <Button type="submit" size={large ? "3" : "2"}>
            Sign Out
          </Button>
        </form>
      </Flex>
    );
  }

  return (
    <Button asChild size={large ? "3" : "2"}>
      <a href="/login">Sign In {large && "with AuthKit"}</a>
    </Button>
  );
}
