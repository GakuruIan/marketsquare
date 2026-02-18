"use client";

import { ColumnDef } from "@tanstack/react-table";

// icons
import { MoreHorizontal, Copy, Eye, Trash, Edit } from "lucide-react";

// components
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

import { Button } from "@workspace/ui/components/button";

//TODO:find fix for this
// import { toast } from "@workspace/ui/components/sonner";

import Image from "next/image";

export type UserRole =
  | "CUSTOMER"
  | "VENDOR"
  | "ADMIN"
  | "SUPERADMIN"
  | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  createdAt: string; // ISO date
  avatar: { url: string };
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // {
  //   accessorFn: (row) => row.avatar.url,
  //   id: "thumbnail",
  //   header: "Image",
  //   cell: ({ getValue, row }) => {
  //     const url = getValue() as string;
  //     return (
  //       <div className="relative size-16 rounded-md overflow-hidden">
  //         <Image
  //           src={url}
  //           alt={`Car ${row.original.avatar.url}`}
  //           fill
  //           className="object-cover"
  //         />
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "Status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Create At",
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.id);
              }}
            >
              <Copy /> Copy car ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Edit /> Edit car
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Eye /> View car details
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Trash /> Delete car
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
