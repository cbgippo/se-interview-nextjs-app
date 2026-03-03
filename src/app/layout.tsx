import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Theme, Container, Card, Flex, Button, Box } from "@radix-ui/themes";
import { Footer } from "./components/footer";
import { SignInButton } from "./components/sign-in-button";
import { Navigation } from "./components/navigation";
import { Providers } from "./providers";
import {
  AuthKitProvider,
  Impersonation,
} from "@workos-inc/authkit-nextjs/components";

export const metadata: Metadata = {
  title: "Clare's AuthKit Authenticated App",
  description: "Clare's example Next.js application demonstrating how to use AuthKit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ padding: 0, margin: 0 }}>
        <Theme
          accentColor="iris"
          panelBackground="solid"
          style={{ backgroundColor: "var(--gray-1)" }}
        >
          <AuthKitProvider>
            <Providers>
              <Impersonation />
              <Container style={{ backgroundColor: "var(--gray-1)" }}>
                <Flex direction="column" gap="5" p="5" height="100vh">
                  <Box asChild flexGrow="1">
                    <Card size="4">
                      <Flex direction="column" height="100%">
                        <Flex asChild justify="between">
                          <header>
                            <Navigation />
                            <SignInButton />
                          </header>
                        </Flex>

                        <Flex flexGrow="1" align="center" justify="center">
                          <main>{children}</main>
                        </Flex>
                      </Flex>
                    </Card>
                  </Box>
                  <Footer />
                </Flex>
              </Container>
            </Providers>
          </AuthKitProvider>
        </Theme>
      </body>
    </html>
  );
}
