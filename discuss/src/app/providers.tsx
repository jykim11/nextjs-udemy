"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component
 * @param {ProvidersProps} props - The props for the Providers component
 * @returns {React.ReactNode} The Providers component
 * @description This component is used to wrap the application in the NextUIProvider
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}
