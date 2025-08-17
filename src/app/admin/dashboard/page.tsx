
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusCircle, Search, Printer, FileDown, Trash2, Pencil } from "lucide-react";
import Link from "next/link";


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

  const filters = [
    { label: "نوع التصويت", options: ["الكل", "عام", "خاص"] },
    { label: "شعبي", options: ["الكل"] },
    { label: "المنطقة", options: ["الكل", "الحضر", "الريف"] },
    { label: "الوظيفة", options: ["الكل"] },
    { label: "المعرف", options: ["الكل", ...referrers.map(r => `${r.name} ${r.surname}`)] },
    { label: "التاريخ", options: ["الكل"] },
  ];

  return (
    <div className="w-full mx-auto grid gap-6">
        <Card className="w-full">
            <CardHeader>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Election Campaign Management System</p>
                    <CardTitle className="text-2xl font-bold tracking-tight">نظام ادارة الحملة الانتخابية المؤيدون</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Accordion type="single" collapsible className="w-full bg-primary/10 border border-primary/20 rounded-lg px-4">
                    <AccordionItem value="item-1" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline text-primary font-medium">تعليمات استخدام واجهة المؤيدين</AccordionTrigger>
                        <AccordionContent>
                            هنا تضاف التعليمات الخاصة باستخدام الواجهة وكيفية التعامل مع البيانات.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {filters.map((filter, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-muted-foreground pr-1">{filter.label}</span>
                             <Select dir="rtl" defaultValue="الكل">
                                <SelectTrigger className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {filter.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-4">
                   <div className="flex-grow flex items-center gap-2">
                     <div className="relative w-full max-w-sm">
                        <Input placeholder="بحث..." className="pr-10 bg-muted border-muted-foreground/30"/>
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                     </div>
                     <Button variant="secondary">
                        عدد المؤيدين: {loading ? '...' : allSupporters.length}
                     </Button>
                   </div>
                   <div className="flex items-center gap-2">
                        <Button variant="default" className="bg-green-600 hover:bg-green-700" asChild>
                           <Link href="/admin/add"><PlusCircle /> اضافة</Link>
                        </Button>
                         <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                           <FileDown /> ملخص مراكز الاقتراع
                        </Button>
                         <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                           <FileDown /> ملخص مراكز تسجيل
                        </Button>
                   </div>
                </div>

                <SupportersTable loading={loading} data={allSupporters} onDataChange={handleDataChange} />

            </CardContent>
        </Card>
    </div>
  );
}
