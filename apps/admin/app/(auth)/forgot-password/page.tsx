"use client";
import React from "react";

// custom forgot
import ForgotPassword from "@workspace/ui/components/forms/ForgotPassword";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <ForgotPassword
      context="ADMIN"
      onSignInClick={() => router.replace("/login")}
      onSuccess={() => router.replace("/dashboard")}
    />
  );
};

export default Page;
