

"use client";

import * as React from "react";
import { getAllSupporters, type Supporter } from "@/lib/data";
import { SupportersTable } from "@/components/supporters-table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, LogOut, Mail, Users, BarChart, UserCog } from "lucide-react";
import { useSearchParams } from "next/navigation";


export default function DashboardPage() {
  const [data, setData] = React.useState<Supporter[]>([]);
  const [loading, setLoading] = React.useState(true);
  const searchParams = useSearchParams();
  const referrerName = searchParams.get('ref');
  const isAdmin = !referrerName;

  const handleDataChange = React.useCallback(async () => {
    setLoading(true);
    const supporters = await getAllSupporters();
    if (referrerName) {
        setData(supporters.filter(s => s.referrerName === referrerName));
    } else {
        setData(supporters);
    }
    setLoading(false);
  }, [referrerName]);

  React.useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
           <h1 className="text-xl font-semibold">لوحة التحكم</h1>
           <div className="flex-1" />
            <div className="flex items-center gap-2">
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
                <Button asChild>
                    <Link href={isAdmin ? "/admin/add" : `/admin/add?ref=${referrerName}`}>
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة مؤيد
                    </Link>
                </Button>
                 <Button variant="secondary" asChild>
                    <Link href="/">
                        <LogOut className="ml-2 h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                </Button>
            </div>
       </header>
       <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
         <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Users />
                <h2 className="text-2xl font-bold tracking-tight">
                    {isAdmin ? "قائمة المؤيدين" : `قائمة المؤيدين (مدخل البيانات: ${referrerName})`}
                </h2>
            </div>
            <p className="text-muted-foreground">
                {isAdmin ? "تصفح، ابحث، وصفِّ بيانات المؤيدين المسجلين في قاعدة البيانات." : "هذه هي قائمة المؤيدين الذين قمت بإضافتهم."}
            </p>
        </div>
        <Card className="shadow-sm">
            <CardContent className="p-6">
                 <SupportersTable loading={loading} data={data} onDataChange={handleDataChange} isAdmin={isAdmin} />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
