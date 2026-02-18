"use client";
import React, { useState } from "react";

// components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@workspace/ui/components/dialog";

import { Input } from "@workspace/ui/components/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@workspace/ui/components/select";

import { Button } from "@workspace/ui/components/button";

// form utils
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

// form resolver
const inviteSchema = z.object({
  email: z
    .string()
    .email("Invalid email, Please enter a valid Email")
    .max(50, "Email cannot exceed 50 characters.")
    .min(1, "Email is required."),

  role: z.enum(["admin", "vendor", "employee"]),
});

interface modalProps {
  isOpen: boolean;
  handleOnClose: () => void;
}

const InviteUserModal: React.FC<modalProps> = ({ isOpen, handleOnClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  const roles = [
    {
      id: 1,
      role: "Admin",
    },
    {
      id: 2,
      role: "Vendor",
    },
    {
      id: 3,
      role: "Employee",
    },
  ];

  const onSubmit = async (values: z.infer<typeof inviteSchema>) => {
    setIsLoading(true);
    return toast.promise(
      (async () => {
        try {
          const res = await fetch("http://localhost:3001/api/v1/invite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: "Sending invite...",
        success: "Invite sent successfully",
        error: (err: Error) => err.message,
        position: "top-center",
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnClose}>
      <DialogContent>
        <DialogHeader className="py-4">
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            Send them an invite and give them access to your workspace.
          </DialogDescription>
        </DialogHeader>

        <form>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="johndoe@gmail.com"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select channel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.role}>
                          {role.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="flex items-center justify-end gap-x-6 mt-4">
            <Button variant="destructive" onClick={handleOnClose} type="button">
              Cancel
            </Button>
            <Button>Send Invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
