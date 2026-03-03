"use client";

import NextLink from "next/link";
import { Button, Flex } from "@radix-ui/themes";

export function Navigation() {
  return (
    <Flex gap="4">
      <Button asChild variant="soft">
        <NextLink href="/">Home</NextLink>
      </Button>

      <Button asChild variant="soft">
        <NextLink href="/account">Account</NextLink>
      </Button>
    </Flex>
  );
}
