"use client";
import React from "react";

type UserRole = "customer" | "vendor";

// clerk
import { useSignUp } from "@marketsquare/clerk-config";

// zod
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// components
import Spinner from "../../loaders/Spinner";
import { Button } from "@workspace/ui/components/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time code must be 6 characters.",
  }),
});

interface VerificationFormProps {
  userRole: UserRole;
  onSuccess?: (redirectUrl: string) => void;
  onSignInClick?: () => void;
}

const Verification: React.FC<VerificationFormProps> = ({
  userRole,
  onSuccess,
  onSignInClick,
}) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showResendBtn, setShowResendBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setSendingCode] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleResendCode = () => {
    setSendingCode(true);
    return toast.promise(
      (async () => {
        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setSendingCode(false);
        setShowResendBtn(false);
      })(),
      {
        loading: "Resending code...",
        success: "Verification code successfully",
        error: "An error has occurred",
        position: "top-center",
      }
    );
  };

  const handleVerification = async (values: z.infer<typeof formSchema>) => {
    const { code } = values;
    setIsLoading(true);
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        if (userRole === "customer") {
          onSuccess?.("/storefront");
        } else if (userRole === "vendor") {
          onSuccess?.("/dashboard");
        }

        // toaster
        toast.success("Success", {
          description: "Your account has being verified ",
        });
      } else {
        toast("An error occurred", {
          description: JSON.stringify(signUpAttempt, null, 2),
        });
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error: unknown) {
      if (error?.errors[0]?.code === "verification_expired") {
        setShowResendBtn(true);
        return toast("Vefication code Expired", {
          description: error?.errors[0]?.longMessage,
        });
      }

      toast("An error occurred", {
        description: JSON.stringify(error?.errors[0]?.longMessage, null, 2),
      });
      console.error("Error:", JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col">
        {/* form header */}

        <div className="text-left mb-6">
          <h2 className="text-2xl font-medium tracking-normal">
            Verify Your Account
          </h2>
          <p className="text-muted-foreground mt-2">
            Enter the OTP sent to your email or phone
          </p>
        </div>

        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerification)} className="">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base  font-normal dark:text-white ">
                    Verification Code
                  </FormLabel>

                  <FormControl className="w-full ">
                    <div className="">
                      <InputOTP maxLength={6} {...field} className="">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!showResendBtn && (
              <>
                <FormDescription className="text-sm font-normal my-4  font-saira">
                  Please enter the code sent to the Email Address your provided
                </FormDescription>

                <Button
                  variant="default"
                  disabled={isLoading}
                  className="w-full font-semibold tracking-wide "
                >
                  {isLoading ? (
                    <div className="flex items-center gap-x-3">
                      <Spinner size="xs" variant="button" />
                      <p className=" ">Verifing...</p>
                    </div>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </>
            )}
          </form>
        </Form>
        {/*  */}
      </div>

      {showResendBtn && (
        <div className="mt-2">
          <p className="text-sm dark:text-gray-400 text-gray-500 mb-2">
            Get new Code
          </p>
          <Button variant={"outline"} onClick={handleResendCode}>
            Resend code
          </Button>
        </div>
      )}
    </div>
  );
};

export default Verification;
