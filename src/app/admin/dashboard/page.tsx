
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
    <div className="w-full space-y-8">
        <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">قائمة المؤيدين</CardTitle>
            <CardDescription>إدارة قائمة المؤيدين المسجلين في قاعدة البيانات.</CardDescription>
        </div>
        <Card className="shadow-sm">
            <CardContent className="p-0">
                 <SupportersTable loading={loading} data={data} onDataChange={handleDataChange} />
            </CardContent>
        </Card>
    </div>
  );
}
