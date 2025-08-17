

"use client";

import { AddSupporterForm } from "@/components/add-supporter-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, UserPlus, LogOut, Users, Mail, BarChart, UserCog } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AddSupporterPage() {
    const searchParams = useSearchParams();
    const referrerName = searchParams.get('ref');
    const isAdmin = !referrerName;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
           <h1 className="text-xl font-semibold">لوحة التحكم</h1>
           <div className="flex-1" />
            <div className="flex items-center gap-2">
                 <Button variant="outline" asChild>
                    <Link href={isAdmin ? "/admin/dashboard" : `/admin/dashboard?ref=${referrerName}`}>
                        <Users className="ml-2 h-4 w-4" />
                        قائمة المؤيدين
                    </Link>
                </Button>
                {isAdmin && (
                    <>
                        <Button variant="outline" asChild>
                            <Link href="/admin/requests">
                                <Mail className="ml-2 h-4 w-4" />
                                طلبات الانضمام
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/stats">
                                <BarChart className="ml-2 h-4 w-4" />
                                الإحصائيات
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/referrers">
                                <UserCog className="ml-2 h-4 w-4" />
                                إدارة مدخلي البيانات
                            </Link>
                        </Button>
                    </>
                )}
                 <Button variant="secondary" asChild>
                    <Link href="/">
                        <LogOut className="ml-2 h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                </Button>
            </div>
       </header>
       <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="w-full max-w-3xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl tracking-tight">
                        إضافة مؤيد جديد
                    </CardTitle>
                    <CardDescription className="pt-2">
                        املأ النموذج أدناه لإضافة مؤيد جديد إلى قاعدة البيانات.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <AddSupporterForm referrerName={referrerName} />
                </CardContent>
            </Card>
       </main>
    </div>
  );
}
