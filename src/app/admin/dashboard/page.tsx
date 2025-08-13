
"use client";

import * as React from "react";
import { getAllSupporters, getReferrers, type Supporter } from "@/lib/data";
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

export default function DashboardPage() {
  const [allSupporters, setAllSupporters] = React.useState<(Supporter & { referrerName?: string })[]>([]);
  const [referrers, setReferrers] = React.useState<Supporter[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [key, setKey] = React.useState(Date.now()); // Key to force re-render

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [supportersData, referrersData] = await Promise.all([
        getAllSupporters(),
        getReferrers(),
      ]);
      setAllSupporters(supportersData);
      setReferrers(referrersData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      // Optionally, set an error state and display a message
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, key]); // Re-fetch data when key changes

  const handleDataChange = () => {
    setKey(Date.now());
  };

  return (
    <div className="w-full max-w-6xl grid gap-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl tracking-tight">
            لوحة تحكم المؤيدين
          </CardTitle>
          <CardDescription className="pt-2">
            عرض وإدارة جميع المؤيدين والمعرّفين في النظام.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">جميع المؤيدين ({loading ? '...' : allSupporters.length})</TabsTrigger>
              <TabsTrigger value="referrers">المعرّفين فقط ({loading ? '...' : referrers.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <SupportersTable data={allSupporters} onDataChange={handleDataChange} />
              )}
            </TabsContent>
            <TabsContent value="referrers" className="mt-4">
              {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
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
  );
}
