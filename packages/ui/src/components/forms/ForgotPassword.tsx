"use client";
import React, { useEffect, useState } from "react";

// ui components
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

import { Spinner } from "../spinner";

// custom component
import Loader from "../Loader/Loader";

// clerk
import { useSignIn, useUser } from "@marketsquare/clerk-config";

// form utils
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import { RoleContext } from "./auth.types";
import { APP_CONFIGS } from "./auth.config";
import ForgotPasswordOTP from "./Verification/ForgotPasswordOTP";

interface ForgotFormProps {
  context: RoleContext;
  onSuccess?: (redirectUrl: string) => void;
  onSignInClick?: () => void;
}

//validation schema
const forgotSchema = z.object({
  email: z
    .string()
    .email("Invalid email, Please enter a valid Email")
    .max(50, "Email cannot exceed 50 characters.")
    .min(1, "Email is required."),
});

const ForgotPassword: React.FC<ForgotFormProps> = ({
  context,
  onSignInClick,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShopOtp] = useState(false);

  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();
  const appConfig = APP_CONFIGS[context];

  const isLoaded = isSignInLoaded && isUserLoaded;

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isSignedIn) {
      const targetUrl = appConfig.redirects.afterSignIn;
      onSuccess?.(targetUrl);
    }
  }, [isSignedIn, onSuccess, appConfig]);

  if (showOTP) {
    return <ForgotPasswordOTP context={context} onSuccess={onSuccess} />;
  }

  if (!isLoaded) {
    return <Loader />;
  }

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    const { email } = values;
    setIsLoading(true);

    toast.promise(
      (async () => {
        try {
          await signIn.create({
            strategy: "reset_password_email_code",
            identifier: email,
          });

          setShopOtp(true);
        } catch (error: any) {
          const code = error?.errors?.[0]?.code;

          const errorMessages: Record<string, string> = {
            too_many_requests:
              "Too many requests. Please wait a few minutes and try again.",
            form_identifier_invalid: "Please enter a valid email address.",
            not_allowed_access:
              "Password reset is not allowed for this account.",
            verification_expired:
              "This password reset code has expired. Please request a new one.",
          };

          const errorMessage =
            errorMessages[code] ||
            error?.errors?.[0]?.longMessage ||
            error?.message ||
            "Failed to send reset link";

          throw new Error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: "Submitting...",
        success: "Reset code sent successfully",
        error: (err: Error) => err.message,
        position: "top-center",
      }
    );
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Card className="w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter the email address associated with your account and we’ll send
            you a secure link to reset your password.
          </CardDescription>
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
                    <FieldDescription className="text-muted-foreground">
                      Enter email you used to register
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

          <div className="text-muted-foreground text-center text-sm mt-6">
            Remembered your password?{" "}
            <button
              onClick={onSignInClick}
              className="underline underline-offset-4 hover:text-primary"
            >
              Back to sign in
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
