
import * as React from "react"
import Link from "next/link"
import { FilePlus2, Hourglass, LogOut, Users, BarChartHorizontal, List, ShieldCheck } from "lucide-react"

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
        <Sidebar variant="inset" side="right" collapsible="icon">
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
                <SidebarMenuButton asChild tooltip="الإحصائيات">
                  <Link href="/admin/stats">
                    <BarChartHorizontal />
                    <span className="md:group-data-[state=expanded]:inline-block hidden">الإحصائيات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="الطلبات المعلقة">
                  <Link href="/admin/requests">
                    <Hourglass />
                    <span className="md:group-data-[state=expanded]:inline-block hidden">الطلبات المعلقة</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="إدارة المعرفين">
                  <Link href="/admin/referrers">
                    <Users />
                    <span className="md:group-data-[state=expanded]:inline-block hidden">إدارة المعرفين</span>
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
        <SidebarInset>
            <main className="flex flex-1 flex-col p-4 lg:p-8">
                 <div className="absolute top-4 right-4 md:hidden">
                    <SidebarTrigger />
                </div>
                <div className="flex-1 w-full max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
