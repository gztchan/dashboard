"use client";

import { Monitor, UserCircle2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    {
      title: "Browser",
      href: "/browsers",
      icon: Monitor,
    },
    {
      title: "Profiles",
      href: "/profiles",
      icon: UserCircle2,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <h1 className="text-base font-semibold tracking-tight">Providence</h1>
        <p className="text-xs text-muted-foreground">Distributed Browsers for cluster</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname.startsWith(item.href)}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
