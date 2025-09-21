export type UserRole = "customer" | "vendor" | "admin";

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
  customer: {
    name: "Storefront",
    role: "customer",
    redirects: {
      afterSignIn: "/store",
      signUpUrl: "/register",
    },
    branding: {
      title: "Customer Sign In",
      subtitle: "Access our storefront",
    },
  },
  vendor: {
    name: "Vendor Dashboard",
    role: "vendor",
    redirects: {
      afterSignIn: "/vendor-dashboard",
      signUpUrl: "/vendor-register",
    },
    branding: {
      title: "Vendor Sign In",
      subtitle: "Manage your store",
    },
  },
  admin: {
    name: "Admin Panel",
    role: "admin",
    redirects: {
      afterSignIn: "/admin",
    },
    branding: {
      title: "Admin Sign In",
      subtitle: "System Administration Access",
    },
  },
};
