
import * as React from "react"
import Link from "next/link"
import { FilePlus2, Hourglass, LogOut, Users, LayoutDashboard } from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
                 <SidebarTrigger className="md:hidden" />
                 <h2 className="text-lg font-semibold px-2 hidden md:block">لوحة الإدارة</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/dashboard">
                    <LayoutDashboard />
                    <span>لوحة التحكم</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/add">
                    <FilePlus2 />
                    <span>إضافة مؤيد</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/requests">
                    <Hourglass />
                    <span>الطلبات المعلقة</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/referrers">
                    <Users />
                    <span>إدارة المعرفين</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <LogOut />
                    <span>تسجيل الخروج</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <main className="flex flex-1 flex-col items-center p-4 lg:p-8">
                 <div className="absolute top-4 right-4 md:hidden">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
