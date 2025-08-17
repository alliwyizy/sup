
import * as React from "react"
import Link from "next/link"
import { FilePlus2, List, LogOut, ShieldCheck } from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar side="right" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2">
                 <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <ShieldCheck className="h-5 w-5" />
                 </div>
                 <h2 className="text-lg font-semibold px-2 hidden md:group-data-[state=expanded]:block">لوحة الإدارة</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="قائمة المؤيدين">
                  <Link href="/admin/dashboard">
                    <List />
                    <span className="md:group-data-[state=expanded]:inline-block hidden">قائمة المؤيدين</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="إضافة مؤيد">
                  <Link href="/admin/add">
                    <FilePlus2 />
                    <span className="md:group-data-[state=expanded]:inline-block hidden">إضافة مؤيد</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="تسجيل الخروج">
                  <Link href="/">
                    <LogOut />
                    <span className="md:group-data-[state=expanded]:inline-block hidden">تسجيل الخروج</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-4 lg:p-8">
            <div className="flex-1 w-full max-w-6xl mx-auto">
                {children}
            </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
