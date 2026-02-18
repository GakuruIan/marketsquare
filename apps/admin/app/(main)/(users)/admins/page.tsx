"use client";
import React, { useState } from "react";

// share data component

import { DataTable } from "@marketsquare/datatable";

import { columns } from "./columns";
import { Button } from "@workspace/ui/components/button";

// modal
import InviteUserModal from "@workspace/ui/components/modals/invite-user";

// usersData.ts

export const users = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "SUPERADMIN",
    status: "active",
    createdAt: "2026-01-01T08:00:00Z",
    avatar: { url: "https://github.com/shadcn.png" },
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "ADMIN",
    status: "active",
    createdAt: "2026-01-02T10:30:00Z",
    avatar: { url: "https://github.com/shadcn.png" },
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@example.com",
    role: "VENDOR",
    status: "inactive",
    createdAt: "2026-01-05T14:45:00Z",
    avatar: { url: "https://github.com/shadcn.png" },
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    role: "EMPLOYEE",
    status: "active",
    createdAt: "2026-01-07T09:20:00Z",
    avatar: { url: "https://github.com/shadcn.png" },
  },
  {
    id: "5",
    name: "Eve Wilson",
    email: "eve@example.com",
    role: "CUSTOMER",
    status: "active",
    createdAt: "2026-01-10T16:50:00Z",
    avatar: { url: "https://github.com/shadcn.png" },
  },
];

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseModal = () => setIsOpen(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <Button onClick={handleOpenModal}>Invite user</Button>
      </div>

      <InviteUserModal isOpen={isOpen} handleOnClose={handleCloseModal} />

      <DataTable
        columns={columns}
        data={users}
        emptyMessage="No results found"
      />
    </div>
  );
};

export default Page;
