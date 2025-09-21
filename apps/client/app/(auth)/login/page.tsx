"use client";
import React from "react";

// signin form
import SignInForm from "@workspace/ui/components/forms/SignIn";

// routing
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <SignInForm
        userRole="customer"
        onSignUpClick={() => {
          router.push("/register");
        }}
        onForgotPassword={() => {
          router.push("/forgot-password");
        }}
      />
    </div>
  );
};

export default page;
