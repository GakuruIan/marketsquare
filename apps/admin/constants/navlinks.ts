import {
  House,
  ChartArea,
  Users,
  Store,
  ShieldCheck,
  Tags,
  Flag,
  MessageSquareText,
  ScrollText,
  Activity,
  Settings,
  BellRing,
  Inbox,
  MessageCircle,
  FolderKanban,
  CreditCard,
  Truck,
} from "lucide-react";

export const AdminLinks = [
  {
    label: "Main Menu",
    links: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: House,
      },
      {
        title: "Platform Analytics",
        url: "/analytics",
        icon: ChartArea,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: BellRing,
      },
    ],
  },

  {
    label: "User & Vendor Management",
    links: [
      {
        title: "Admins",
        url: "/admins",
        icon: Users,
      },
      {
        title: "Vendors",
        url: "/vendors",
        icon: Store,
      },
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
      },
      {
        title: "Roles & Permissions",
        url: "/roles",
        icon: ShieldCheck,
      },
    ],
  },

  {
    label: "Marketplace Management",
    links: [
      {
        title: "Products",
        url: "/products",
        icon: FolderKanban,
      },
      {
        title: "Categories & Tags",
        url: "/categories",
        icon: Tags,
      },
      {
        title: "Orders",
        url: "/orders",
        icon: Inbox,
      },
      {
        title: "Payments",
        url: "/payments",
        icon: CreditCard,
      },
      {
        title: "Shipping & Delivery",
        url: "/shipping",
        icon: Truck,
      },
    ],
  },

  {
    label: "Content & Moderation",
    links: [
      {
        title: "Reviews & Feedback",
        url: "/reviews",
        icon: MessageSquareText,
      },
      {
        title: "Reports & Flags",
        url: "/reports",
        icon: Flag,
      },
      {
        title: "Disputes",
        url: "/disputes",
        icon: MessageCircle,
      },
    ],
  },

  {
    label: "System",
    links: [
      {
        title: "Audit Logs",
        url: "/audit-logs",
        icon: ScrollText,
      },
      {
        title: "System Status",
        url: "/system-status",
        icon: Activity,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];
