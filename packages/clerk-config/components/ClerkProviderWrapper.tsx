"use client";

import { ClerkProvider } from "@clerk/nextjs";

// clerk configuration
import { ClerkConfig } from "../lib/clerk";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={ClerkConfig.publishableKey}>
      {children}
    </ClerkProvider>
  );
}