"use client";
import React from "react";

import SignInForm from "@workspace/ui/components/forms/Signin";

// routing
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <SignInForm
        context="ADMIN"
        onForgotPassword={() => router.push("/forgot-password")}
        onSuccess={() => router.push("/dashboard")}
      />
    </div>
  );
};

export default Page;
