import React from "react";

// shared components
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";
import { Input } from "@workspace/ui/components/input";

//ui components
import UserAvatar from "./ui/UserAvatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
//icons
import { Bell, Settings, Sun } from "lucide-react";

const Topbar = () => {
  return (
    <div className="md:p-2 w-full sticky top-0">
      <div className="flex items-center justify-between gap-x-2 px-2 md:px-2 py-2.5 w-full">
        <SidebarTrigger />

        {/* search form */}
        <form action="">
          <Input placeholder="Search" className="md:w-96" />
        </form>

        {/* icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="border border-gray-400 dark:border-neutral-400/20 p-2 rounded-md">
            <Bell size={18} />
          </button>

          <button className="border border-gray-400 dark:border-neutral-400/20 p-2 rounded-md">
            <Settings size={18} />
          </button>

          <button className="border border-gray-400 dark:border-neutral-400/20 p-2 rounded-md">
            <Sun size={18} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar url="https://github.com/shadcn.png" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mr-4 mt-1.5 w-44">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <Separator /> */}
    </div>
  );
};

export default Topbar;
