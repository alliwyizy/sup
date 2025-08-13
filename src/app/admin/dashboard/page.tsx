
"use client";

import * as React from "react";
import { getAllSupporters, getReferrers, getPendingSupporters, type Supporter } from "@/lib/data";
import { SupportersTable } from "@/components/supporters-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, Hourglass } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";


export default function DashboardPage() {
  const [allSupporters, setAllSupporters] = React.useState<(Supporter & { referrerName?: string })[]>([]);
  const [referrers, setReferrers] = React.useState<Supporter[]>([]);
  const [pendingCount, setPendingCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [key, setKey] = React.useState(Date.now()); // Key to force re-render

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [supportersData, referrersData, pendingData] = await Promise.all([
        getAllSupporters(),
        getReferrers(),
        getPendingSupporters(),
      ]);
      setAllSupporters(supportersData);
      setReferrers(referrersData);
      setPendingCount(pendingData.length);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, key]);

  const handleDataChange = () => {
    setKey(Date.now());
  };

  const stats = [
    { title: "إجمالي المؤيدين", value: allSupporters.length, icon: Users },
    { title: "إجمالي المعرفين", value: referrers.length, icon: UserPlus },
    { title: "الطلبات المعلقة", value: pendingCount, icon: Hourglass },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto grid gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stat.value}</div>}
                </CardContent>
            </Card>
            ))}
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
         <Card className="lg:col-span-3">
           <CardHeader>
             <CardTitle>المؤيدون لكل معرّف</CardTitle>
             <CardDescription>
                رسم بياني يوضح عدد المؤيدين الذين جلبهم كل معرّف.
             </CardDescription>
           </CardHeader>
           <CardContent className="pl-2">
             {loading ? <Skeleton className="h-[300px] w-full" /> : <DashboardCharts data={allSupporters} />}
           </CardContent>
         </Card>
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>قائمة المؤيدين</CardTitle>
                <CardDescription>
                    عرض وإدارة جميع المؤيدين والمعرّفين في النظام.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">الكل ({loading ? '...' : allSupporters.length})</TabsTrigger>
                    <TabsTrigger value="referrers">المعرّفين ({loading ? '...' : referrers.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                    {loading ? (
                        <div className="space-y-2 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <SupportersTable data={allSupporters} onDataChange={handleDataChange} />
                    )}
                    </TabsContent>
                    <TabsContent value="referrers" className="mt-4">
                    {loading ? (
                        <div className="space-y-2 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <SupportersTable data={referrers} onDataChange={handleDataChange} />
                    )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
