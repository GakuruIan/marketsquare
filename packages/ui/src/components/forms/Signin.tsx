"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";

import { toast } from "sonner";
import { Spinner } from "../spinner";

// form types

import { RoleContext, UserRole } from "./auth.types";
import { APP_CONFIGS, ROLE_APP_REDIRECTS } from "./auth.config";

interface SignInFormProps {
  context: RoleContext;
  onSuccess?: (redirectUrl: string) => void;
  onForgotPassword?: () => void;
  onSignInClick?: () => void;
}

// form utils
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";

// custom components
import AccessMessage from "./AccessMessage";
import Loader from "../Loader/Loader";

//validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email, Please enter a valid Email")
    .max(50, "Email cannot exceed 50 characters.")
    .min(1, "Email is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password cannot exceed 50 characters.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &).",
    ),
});

// store
import { useUserStore } from "@marketsquare/store";

const Signin: React.FC<SignInFormProps> = ({
  context,
  onSuccess,
  onForgotPassword,
  onSignInClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUserStore((user) => user);

  const appConfig = APP_CONFIGS[context];

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      const role = context as UserRole | undefined;

      console.log(role);

      const redirectUrl = ROLE_APP_REDIRECTS[role];
      window.location.href = redirectUrl;
    }
  }, [user, appConfig]);

  // if (!isLoaded) {
  //   return <Loader />;
  // }

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    return toast.promise(
      (async () => {
        try {
          const result = await fetch(
            " http://localhost:3001/api/v1/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ identifier: email, password }),
            },
          );

          if (!result.ok) {
            const errorData = await result.json();
            throw new Error(
              errorData?.message || "Login failed. Please try again.",
            );
          }

          const user = (await result.json()).user;

          useUserStore.setState({ user });
        } catch (error: any) {
          let errorMessage = "Login failed";

          throw new Error(error.message || errorMessage);
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: "Signing in...",
        success: "Login successful!",
        error: (err: Error) => err.message,
        position: "top-center",
      },
    );
  };

  return (
    <Card className="w-full sm:max-w-xl">
      <CardHeader>
        <CardTitle>{appConfig?.branding?.title}</CardTitle>
        <CardDescription>{appConfig?.branding?.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    autoComplete="off"
                    type="password"
                  />
                  <FieldDescription
                    className="text-right cursor-pointer"
                    onClick={onForgotPassword}
                  >
                    Forgot password?
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Field orientation="vertical">
          <Button type="submit" form="form-rhf-demo" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-x-2">
                <p className="text-neutral-300 dark:text-neutral-600">
                  Submitting
                </p>
                <Spinner />
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </Field>

        {/* Social auth */}
        {(context === "BUSINESS" || context === "CUSTOMER") && (
          <div className="">
            <div className="after:border-border dark:after:border-neutral-400 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t my-4">
              <span className="dark:bg-background bg-white text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                type="button"
                className="w-full text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                Continue with Apple
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            {appConfig.redirects.signUpUrl && onSignInClick && (
              <div className="text-muted-foreground text-center text-sm text-balance mt-8">
                Don't have an account?{" "}
                <button
                  onClick={onSignInClick}
                  className="underline underline-offset-4 ml-2 hover:text-primary dark:hover:text-gray-300 bg-transparent border-none cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        )}

        {context === "BUSINESS" && (
          <AccessMessage message="Authorized access only. Accounts are created and managed by your vendor administrator." />
        )}

        {/* Admin-specific message */}
        {context === "ADMIN" && (
          <AccessMessage message="Administrative access only. Accounts are issued by the  a system administrator." />
        )}
      </CardFooter>
    </Card>
  );
};

export default Signin;
