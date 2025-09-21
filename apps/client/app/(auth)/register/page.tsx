"use client";
import React from "react";

// sign up form
import SignUpForm from "@workspace/ui/components/forms/SignUp";

// routing
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <SignUpForm
        userRole="customer"
        onSignInClick={() => {
          router.push("/login");
        }}
        onSuccess={() => {
          router.push("/storefront");
        }}
      />
    </div>
  );
};

export default page;
