import { RoleContext, UserRole } from "./auth.types";

export interface AppConfig {
  name: string;
  allowedRoles: UserRole[];
  redirects: {
    afterSignIn: string;
    signUpUrl?: string;
  };
  branding: {
    title: string;
    subtitle?: string;
  };
}

export const APP_CONFIGS: Record<RoleContext, AppConfig> = {
  CUSTOMER: {
    name: "Storefront",
    allowedRoles: ["CUSTOMER"],
    redirects: {
      afterSignIn: "/store",
      signUpUrl: "/register",
    },
    branding: {
      title: "Customer Sign In",
      subtitle: "Sign in to explore products, place orders, and manage your account.",
    },
  },

  BUSINESS: {
    name: "Business Dashboard",
    allowedRoles: ["VENDOR", "EMPLOYEE"],
    redirects: {
      afterSignIn: "/vendor-dashboard",
    },
    branding: {
      title: "Business Account Sign In",
      subtitle:
        "Sign in to manage business operations as a store owner or authorized team member.",
    },
  },

  ADMIN: {
    name: "Admin Panel",
    allowedRoles: ["ADMIN", "SUPERADMIN"],
    redirects: {
      afterSignIn: "/dashboard",
    },
    branding: {
      title: "Administration Sign In",
      subtitle:
        "Secure access for platform administrators and system managers.",
    },
  },
};


const isDev = true;

export const ROLE_APP_REDIRECTS: Record<UserRole, string> = {
  CUSTOMER: isDev
    ? "http://localhost:3000"
    : "https://app.yoursite.com",

  VENDOR: isDev
    ? "http://localhost:3001"
    : "https://business.yoursite.com",

  EMPLOYEE: isDev
    ? "http://localhost:3001"
    : "https://business.yoursite.com",

  ADMIN: isDev
    ? "http://localhost:3002"
    : "https://admin.yoursite.com",

  SUPERADMIN: isDev
    ? "http://localhost:3002"
    : "https://admin.yoursite.com",
};
