
"use client";

import * as React from "react";
import { getAllJoinRequests, type JoinRequest } from "@/lib/data";
import { RequestsTable } from "@/components/requests-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, LogOut, Mail, Users, BarChart } from "lucide-react";


export default function RequestsPage() {
  const [data, setData] = React.useState<JoinRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  const handleDataChange = React.useCallback(async () => {
    setLoading(true);
    const requests = await getAllJoinRequests();
    setData(requests);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);


  return (
     <div className="flex min-h-screen w-full flex-col bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
           <h1 className="text-xl font-semibold">لوحة التحكم</h1>
           <div className="flex-1" />
            <div className="flex items-center gap-2">
                 <Button variant="outline" asChild>
                    <Link href="/admin/dashboard">
                        <Users className="ml-2 h-4 w-4" />
                        قائمة المؤيدين
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/admin/stats">
                        <BarChart className="ml-2 h-4 w-4" />
                        الإحصائيات
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/admin/add">
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
                    <Mail />
                    <h2 className="text-2xl font-bold tracking-tight">طلبات الانضمام المعلقة</h2>
                </div>
                <p className="text-muted-foreground">مراجعة وقبول أو رفض طلبات الانضمام الجديدة.</p>
            </div>
            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <RequestsTable loading={loading} data={data} onDataChange={handleDataChange} />
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
