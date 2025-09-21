"use client";
import { useEffect, useState } from "react";

// types
import { UserRole } from "./types";

interface ForgotPasswordProps {
  userRole: UserRole;
}

// form utils
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

// clerk
import { useSignIn, useAuth } from "@marketsquare/clerk-config";

// components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Loader from "@workspace/ui/components/loaders/Loader";
import PasswordOTP from "@workspace/ui/components/forms/Verifications/ForgotPasswordOtp";
import Spinner from "@workspace/ui/components/loaders/Spinner";

// toaster
import { toast } from "sonner";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email, Please enter a valid Email")
    .max(50, "Email cannot exceed 50 characters.")
    .min(1, "Email is required."),
});

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ userRole }) => {
  const [showOTP, setShowOTP] = useState(false);

  const { isLoaded: isSigninLoaded, signIn } = useSignIn();

  const { isLoaded: isUserLoaded, isSignedIn } = useAuth();

  const isLoaded = isSigninLoaded && isUserLoaded;

  useEffect(() => {
    if (isSignedIn) {
      switch (userRole) {
        case "customer":
          break;

        default:
          break;
      }
    }
  }, [isSignedIn]);

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    const { email } = values;

    if (!isLoaded) return;

    await signIn
      .create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then(() => {
        toast.success("Password reset code sent to your email");
        setShowOTP(true);
      })
      .catch((error) => {
        if (error?.errors[0]?.code === "verification_expired") {
          return toast("Vefication code Expired", {
            description: error?.errors[0]?.longMessage,
          });
        }

        toast("An error occurred", {
          description: JSON.stringify(error?.errors[0]?.longMessage, null, 2),
        });

        console.error("Error:", JSON.stringify(error, null, 2));
      });
  };

  // form submitting status
  const isSubmitting = form.formState.isSubmitting;

  if (showOTP) {
    return <PasswordOTP userRole={userRole} />;
  }

  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-md px-2 md:px-0">
      <div className="">
        {/* form header */}
        <div className="mb-6">
          <h2 className="text-2xl font-medium tracking-normal">
            Reset Your Password
          </h2>

          <p className="text-muted-foreground mt-2">
            Provide your account email and we’ll help you regain access
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="tracking-wider text-sm">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            autoComplete="off"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          We&apos;ll send you a link to reset your password.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full text-sm font-semibold tracking-wider"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-x-3">
                      <Spinner size="xs" variant="button" />
                      <p className=" ">Sending link...</p>
                    </div>
                  ) : (
                    "Get reset code"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
