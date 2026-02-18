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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";

import { Spinner } from "@workspace/ui/components/spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";

// custom component
import Loader from "@workspace/ui/components/Loader/Loader";

// toast
import { toast } from "sonner";

// form utils
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";

// clerk
import { useSignIn, useUser } from "@marketsquare/clerk-config";

// icons
import { ArrowLeft, ArrowRight } from "lucide-react";

// form types

import { RoleContext } from "../auth.types";
import { APP_CONFIGS } from "../auth.config";

//validation schema
const formSchema = z
  .object({
    code: z.string().min(6, {
      message: "Your one-time code must be 6 characters.",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(50, "Password cannot exceed 50 characters.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/\d/, "Password must contain at least one number.")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface FormProps {
  context: RoleContext;
  onSuccess?: (redirectUrl: string) => void;
  onSignInClick?: () => void;
}

const ForgotPasswordOTP: React.FC<FormProps> = ({
  context,
  onSuccess,
  onSignInClick,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn } = useUser();

  const isLoaded = isSignInLoaded && isUserLoaded;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      code: "",
    },
  });

  const appConfig = APP_CONFIGS[context];

  useEffect(() => {
    if (isSignedIn) {
      const targetUrl = appConfig.redirects.afterSignIn;
      onSuccess?.(targetUrl);
    }
  }, [isSignedIn, onSuccess, appConfig]);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger("code");
    if (!isValid) return;
    setStep(2);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      setStep(1);
    }
  };

  if (!isLoaded) {
    return <Loader />;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { code, password } = values;
    setIsLoading(true);

    try {
      toast.promise(
        (async () => {
          try {
            await signIn.attemptFirstFactor({
              strategy: "reset_password_email_code",
              code,
              password,
            });

            await setActive({ session: signIn.createdSessionId });
            const targetUrl = appConfig.redirects.afterSignIn;
            onSuccess?.(targetUrl);
          } catch (error: any) {
            const code = error?.errors?.[0]?.code;

            const errorMessages: Record<string, string> = {
              form_code_incorrect:
                "The code you entered is incorrect. Please try again.",
              form_password_pwned:
                "This password has been found in a data breach. Please choose a different password.",
              form_password_length_too_short:
                "Password is too short. Please use at least 8 characters.",
              form_password_not_strong_enough:
                "Password is not strong enough. Please use a stronger password.",
              verification_expired:
                "This reset code has expired. Please request a new one.",
              verification_failed:
                "Verification failed. Please check your code and try again.",
              too_many_requests:
                "Too many attempts. Please wait a few minutes and try again.",
            };

            const errorMessage =
              errorMessages[code] ||
              error?.errors?.[0]?.longMessage ||
              error?.message ||
              "Failed to reset password. Please try again.";

            throw new Error(errorMessage);
          }
        })(),
        {
          loading: "Resetting your password...",
          success: "Password reset successfully!",
          error: (err: Error) => err.message,
          position: "top-center",
        }
      );
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Card className="w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle>Password Reset?</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email along with your
            new password to complete the reset process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {step === 1 && (
                <Controller
                  name="code"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Verification Code
                      </FieldLabel>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="w-full">
                          <InputOTPSlot index={0} className="w-full h-12" />
                          <InputOTPSlot index={1} className="w-full h-12 " />
                          <InputOTPSlot index={2} className="w-full h-12" />
                          <InputOTPSlot index={3} className="w-full h-12" />
                          <InputOTPSlot index={4} className="w-full h-12" />
                          <InputOTPSlot index={5} className="w-full h-12" />
                        </InputOTPGroup>
                      </InputOTP>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}

              {step === 2 && (
                <>
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-password">
                          New Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-rhf-demo-title"
                          aria-invalid={fieldState.invalid}
                          placeholder="********"
                          autoComplete="off"
                          type="password"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-rhf-demo-title"
                          aria-invalid={fieldState.invalid}
                          placeholder="********"
                          autoComplete="off"
                          type="password"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </>
              )}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Field orientation="vertical">
            {step === 1 && (
              <Button
                type="button"
                className="flex items-center gap-x-3"
                onClick={handleNextStep}
              >
                Next
                <ArrowRight />
              </Button>
            )}
            {step === 2 && (
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  className="flex items-center gap-x-3"
                  onClick={handleBack}
                >
                  Back
                  <ArrowLeft />
                </Button>
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
              </div>
            )}
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

export default ForgotPasswordOTP;
