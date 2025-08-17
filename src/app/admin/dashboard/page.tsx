
"use client";

import * as React from "react";
import { getAllSupporters, type Supporter } from "@/lib/data";
import { SupportersTable } from "@/components/supporters-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";


export default function DashboardPage() {
  const [data, setData] = React.useState<Supporter[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Function to refresh data
  const handleDataChange = React.useCallback(async () => {
    setLoading(true);
    const supporters = await getAllSupporters();
    setData(supporters);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);


  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8">
        <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">قائمة المؤيدين</CardTitle>
                <CardDescription>إدارة قائمة المؤيدين في قاعدة البيانات.</CardDescription>
            </div>
            <div className="flex gap-2">
                 <Button asChild>
                    <Link href="/admin/add">
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إضافة مؤيد
                    </Link>
                </Button>
                 <Button variant="outline" asChild>
                    <Link href="/">
                        <LogOut className="ml-2 h-4 w-4" />
                        تسجيل الخروج
                    </Link>
                </Button>
            </div>
        </div>
        <Card>
            <CardContent className="p-0">
                 <SupportersTable loading={loading} data={data} onDataChange={handleDataChange} />
            </CardContent>
        </Card>
    </div>
  );
}

