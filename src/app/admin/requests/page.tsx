
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
    <div className="w-full space-y-8">
        <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">طلبات الانضمام المعلقة</CardTitle>
            <CardDescription>مراجعة وقبول أو رفض طلبات الانضمام الجديدة.</CardDescription>
        </div>
        <Card className="shadow-sm">
            <CardContent className="p-0">
                 <RequestsTable loading={loading} data={data} onDataChange={handleDataChange} />
            </CardContent>
        </Card>
    </div>
  );
}
