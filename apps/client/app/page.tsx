"use client";
import { Button } from "@workspace/ui/components/button";

import { useClerk } from "@marketsquare/clerk-config";

export default function Page() {
  const { signOut } = useClerk();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="lg" onClick={() => signOut({ redirectUrl: "/login" })}>
          Button
        </Button>
      </div>
    </div>
  );
}
