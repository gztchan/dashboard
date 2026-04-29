"use client";

import { DashboardHeader } from "./header";
import { DashboardSidebar } from "../sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto px-6 py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
