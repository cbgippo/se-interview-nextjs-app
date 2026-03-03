import NextLink from "next/link";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { SignInButton } from "./components/sign-in-button";

export default async function HomePage() {
  const { user } = await withAuth();

  // Get current hour for time-based greeting
  const currentHour = new Date().getHours();
  let timeGreeting = "Good day";

  if (currentHour >= 5 && currentHour < 12) {
    timeGreeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 22) {
    timeGreeting = "Good evening";
  } else {
    timeGreeting = "Good night";
  }

  return (
    <Flex direction="column" align="center" gap="2">
      {user ? (
        <>
          <Heading size="8">
            {timeGreeting}{user?.firstName && `, ${user?.firstName}!`}
          </Heading>
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
