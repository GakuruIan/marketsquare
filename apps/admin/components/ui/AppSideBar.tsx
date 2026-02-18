// icons
import { GalleryVerticalEnd } from "lucide-react";

// components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@workspace/ui/components/sidebar";

// routing
import Link from "next/link";

// links
import { AdminLinks } from "@/constants/navlinks";
import { Separator } from "@workspace/ui/components/separator";

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props} variant="floating">
      <SidebarHeader className="py-4 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <GalleryVerticalEnd className="size-6 text-gray-600 dark:text-neutral-300" />
              <p className="text-sm font-poppins">Marketquare</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
      </SidebarHeader>

      <SidebarContent className="no-scrollbar">
        {AdminLinks.map((menuitems) => (
          <SidebarGroup key={menuitems.label}>
            <SidebarGroupLabel className="font-poppins-semibold text-sm  tracking-tight">
              {menuitems.label}
            </SidebarGroupLabel>
            <Separator />
            <SidebarGroupContent>
              <SidebarMenu>
                {menuitems.links.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link href={item.url} className="flex items-center">
                        <item.icon
                          size={17}
                          className="text-gray-600 dark:text-neutral-300 "
                        />
                        <p className="text-gray-700 tracking-wide text-sm font-poppins-light  ml-2 dark:text-neutral-300">
                          {item.title}
                        </p>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="py-4"></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
