"use client";
import React, { useState, useEffect } from "react";

// form utils
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

//toast
import { toast } from "sonner";

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

import { Input } from "@workspace/ui/components/input";

import { Button } from "@workspace/ui/components/button";
import Loader from "../loaders/Loader";

import Spinner from "../loaders/Spinner";

// clerk
import { useSignIn, useUser } from "@marketsquare/clerk-config";

type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN" | "EMPLOYEE";

interface SignInFormProps {
  userRole: UserRole;
  onSuccess?: (redirectUrl: string) => void;
  onForgotPassword?: () => void;
  onSignUpClick?: () => void;
}

interface AppConfig {
  name: string;
  role: UserRole;
  redirects: {
    afterSignIn: string;
    signUpUrl?: string;
  };
  branding: {
    title: string;
    subtitle?: string;
  };
}

const APP_CONFIGS: Record<UserRole, AppConfig> = {
  CUSTOMER: {
    name: "Storefront",
    role: "CUSTOMER",
    redirects: {
      afterSignIn: "/store",
      signUpUrl: "/register",
    },
    branding: {
      title: "Welcome to MarketSquare",
      subtitle: "Access our storefront",
    },
  },
  VENDOR: {
    name: "Vendor Dashboard",
    role: "VENDOR",
    redirects: {
      afterSignIn: "/vendor-dashboard",
      signUpUrl: "/vendor-register",
    },
    branding: {
      title: "Vendor Sign In",
      subtitle: "Manage your store",
    },
  },
  EMPLOYEE: {
    name: "Vendor Dashboard",
    role: "VENDOR",
    redirects: {
      afterSignIn: "/vendor-dashboard",
      signUpUrl: "/vendor-register",
    },
    branding: {
      title: "Vendor Sign In",
      subtitle: "Manage your store",
    },
  },
  ADMIN: {
    name: "Admin Panel",
    role: "ADMIN",
    redirects: {
      afterSignIn: "/admin",
    },
    branding: {
      title: "Admin Sign In",
      subtitle: "System Administration Access",
    },
  },
};

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
      "Password must contain at least one special character (@, $, !, %, *, ?, &)."
    ),
});

const SignInForm: React.FC<SignInFormProps> = ({
  userRole,
  onSuccess,
  onSignUpClick,
  onForgotPassword,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded: isSignLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();

  const isLoaded = isSignLoaded && isUserLoaded;
  const appConfig = APP_CONFIGS[userRole];

  useEffect(() => {
    if (isSignedIn && user) {
      const userRole = user.unsafeMetadata?.role as UserRole;

      console.log(userRole);

      if (userRole) {
        const targetConfig = APP_CONFIGS[userRole];
        onSuccess?.(targetConfig.redirects.afterSignIn);
      } else {
        onSuccess?.(appConfig.redirects.afterSignIn);
      }
    }
  }, [isSignedIn, user, appConfig, onSuccess]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!isLoaded) {
    return <Loader />;
  }

  if (isSignedIn) {
    return <Loader />;
  }

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const { email, password } = values;
    setIsLoading(true);
    return toast.promise(
      (async () => {
        try {
          const signInAttempt = await signIn.create({
            identifier: email,
            password,
          });

          if (signInAttempt.status === "complete") {
            await setActive({ session: signInAttempt.createdSessionId });

            const targetUrl = appConfig.redirects.afterSignIn;
            onSuccess?.(targetUrl);
          } else {
            throw new Error("Sign-in requires further verification.");
          }
        } catch (error: any) {
          let errorMessage = "Login failed";

          if (error?.errors?.[0]?.code === "form_identifier_not_found") {
            errorMessage = "Invalid credentials";
          } else if (error?.errors?.[0]?.code === "form_password_incorrect") {
            errorMessage = "Invalid credentials";
          } else if (error?.errors?.[0]?.code === "too_many_requests") {
            errorMessage = "Too many failed attempts. Please try again later.";
          } else {
            errorMessage =
              error?.errors?.[0]?.longMessage ||
              error.message ||
              "Login failed";
          }

          throw new Error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      })(),
      {
        loading: "Signing in...",
        success: "Login successful!",
        error: (err: Error) => err.message,
        position: "top-center",
      }
    );
  };

  return (
    <div className="w-full max-w-md px-2 md:px-0">
      {/* form header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium tracking-normal">
          {appConfig.branding.title}
        </h2>
        {appConfig.branding.subtitle && (
          <p className="text-muted-foreground mt-2">
            {appConfig.branding.subtitle}
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-3 mb-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="tracking-wide text-base font-normal">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center justify-between">
                    Enter the email you used to sign up.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3 mb-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="tracking-wide text-base font-normal">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-right dark:text-neutral-400 hover:underline bg-transparent border-none cursor-pointer"
            >
              Forgot your password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full text-sm font-semibold tracking-wider"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-x-3">
                <Spinner size="xs" variant="button" />
                <p className=" ">Signing in...</p>
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="after:border-border dark:after:border-neutral-400 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t my-4">
        <span className="dark:bg-neutral-900 text-muted-foreground relative z-10 px-2">
          Or
        </span>
      </div>

      {/* Social auth */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Button variant="outline" type="button" className="w-full text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
              fill="currentColor"
            />
          </svg>
          Continue with Apple
        </Button>
        <Button variant="outline" type="button" className="w-full text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Continue with Google
        </Button>
      </div>

      {/* <div className="text-muted-foreground *:[a]:hover:text-primary *:[a]:dark:hover:text-gray-300 text-center text-sm text-balance *:[a]:underline *:[a]:underline-offset-4 mt-8">
        Dont have an account{" "}
        <Link href="/register" className="underline underline-offset-4 ml-2">
          Sign up
        </Link>
      </div> */}

      {userRole !== "ADMIN" &&
        appConfig.redirects.signUpUrl &&
        onSignUpClick && (
          <div className="text-muted-foreground text-center text-sm text-balance mt-8">
            Don't have an account?{" "}
            <button
              onClick={onSignUpClick}
              className="underline underline-offset-4 ml-2 hover:text-primary dark:hover:text-gray-300 bg-transparent border-none cursor-pointer"
            >
              Sign up
            </button>
          </div>
        )}

      {/* Admin-specific message */}
      {userRole === "ADMIN" && (
        <div className="text-muted-foreground text-center text-sm text-balance mt-8">
          <p className="text-xs">
            Admin access only. Contact your system administrator if you need an
            account.
          </p>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
