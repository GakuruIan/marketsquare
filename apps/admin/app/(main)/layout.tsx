import React from "react";

import { SidebarProvider } from "@workspace/ui/components/sidebar";

import AppSidebar from "@/components/ui/AppSideBar";
import Topbar from "@/components/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex-1 space-y-4">
        <Topbar />
        <main className="px-4">{children}</main>
      </div>
    </SidebarProvider>
  );
}
