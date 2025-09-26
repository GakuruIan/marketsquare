export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export interface AppConfig {
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

export const APP_CONFIGS: Record<UserRole, AppConfig> = {
  CUSTOMER: {
    name: "Storefront",
    role: "CUSTOMER",
    redirects: {
      afterSignIn: "/store",
      signUpUrl: "/register",
    },
    branding: {
      title: "Customer Sign In",
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
