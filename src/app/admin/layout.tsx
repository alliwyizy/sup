
import * as React from "react"
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarTrigger, SidebarContent, SidebarFooter, SidebarInset } from "@/components/ui/sidebar"
import Link from "next/link";
import { LayoutDashboard, Users, UserPlus, LogOut, ShieldCheck, MailPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <SidebarProvider>
          <Sidebar side="right" collapsible="icon">
              <SidebarHeader>
                 <div className="flex items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <ShieldCheck className="size-5" />
                    </div>
                     <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        لوحة التحكم
                    </span>
                 </div>
              </SidebarHeader>
              <SidebarContent>
                 <SidebarMenu>
                     <SidebarMenuItem>
                         <SidebarMenuButton asChild>
                            <Link href="/admin/dashboard">
                                <LayoutDashboard />
                                <span className="group-data-[collapsible=icon]:hidden">
                                    قائمة المؤيدين
                                </span>
                            </Link>
                         </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                         <SidebarMenuButton asChild>
                            <Link href="/admin/requests">
                                <MailPlus />
                                <span className="group-data-[collapsible=icon]:hidden">
                                    طلبات الانضمام
                                </span>
                            </Link>
                         </SidebarMenuButton>
                     </SidebarMenuItem>
                     <SidebarMenuItem>
                         <SidebarMenuButton asChild>
                            <Link href="/admin/add">
                                <UserPlus />
                                <span className="group-data-[collapsible=icon]:hidden">
                                    إضافة مؤيد
                                </span>
                            </Link>
                         </SidebarMenuButton>
                     </SidebarMenuItem>
                 </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                  <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                          <AvatarImage src="https://placehold.co/100x100.png" alt="Admin" data-ai-hint="avatar" />
                          <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                            <span className="text-sm font-semibold text-sidebar-foreground">
                                المدير
                            </span>
                            <span className="text-xs text-muted-foreground">
                                admin@example.com
                            </span>
                      </div>
                  </div>
              </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <h1 className="text-lg font-semibold">قاعدة بيانات مؤيدي الأستاذ عبدالرحمن اللويزي</h1>
                </div>
                <Button variant="outline" asChild size="sm">
                    <Link href="/">
                        <LogOut className="ml-2" />
                        العودة للرئيسية
                    </Link>
                </Button>
            </header>
            <main className="flex-1 p-4 lg:p-6 bg-muted/40">
                {children}
            </main>
          </SidebarInset>
      </SidebarProvider>
  )
}
