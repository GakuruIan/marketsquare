"use client";
import React from "react";

// forgot password
import ForgotPassword from "@workspace/ui/components/forms/ForgotPassword";

// routing
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <ForgotPassword userRole="customer" />
    </div>
  );
};

export default page;
