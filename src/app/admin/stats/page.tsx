
"use client";

import * as React from "react";
import { Bar, BarChart as RechartsBarChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { getAllSupporters, type Supporter, getAllReferrers, type Referrer, getAllJoinRequests } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, LogOut, Mail, Users, BarChart as BarChartIcon, UserCog } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";


type DistributionChartData = { name: string; total: number };
type GenderDistribution = { name: string; value: number };


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default function StatsPage() {
  const [supporters, setSupporters] = React.useState<Supporter[]>([]);
  const [referrers, setReferrers] = React.useState<Referrer[]>([]);
  const [requestCount, setRequestCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const searchParams = useSearchParams();
  const referrerName = searchParams.get('ref');
  const isAdmin = !referrerName;

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [supportersData, referrersData, requestsData] = await Promise.all([
        getAllSupporters(),
        getAllReferrers(),
        getAllJoinRequests(),
      ]);
      setSupporters(supportersData);
      setReferrers(referrersData);
      setRequestCount(requestsData.length);
      setLoading(false);
    }
    fetchData();
  }, []);
  
  const stats = React.useMemo(() => {
    if (!supporters.length) {
      return {
        total: 0,
        male: 0,
        female: 0,
        avgAge: 0,
        educationDistribution: [],
        genderDistribution: [],
        referrerDistribution: [],
        topSurnames: [],
        topPollingCenters: [],
        topRegistrationCenters: [],
      };
    }
    
    const countAndSort = (field: keyof Supporter, limit: number): DistributionChartData[] => {
         const counts = supporters.reduce((acc, s) => {
            const key = s[field] as string;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(counts)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
    }

    const total = supporters.length;
    const male = supporters.filter((s) => s.gender === "ذكر").length;
    const female = total - male;
    const totalAge = supporters.reduce((acc, s) => acc + s.age, 0);
    const avgAge = total > 0 ? Math.round(totalAge / total) : 0;
    
    const educationDistribution = countAndSort('education', Infinity);
    const topSurnames = countAndSort('surname', 20);
    const topPollingCenters = countAndSort('pollingCenter', 10);
    const topRegistrationCenters = countAndSort('registrationCenter', 10);
    const referrerDistribution = countAndSort('referrerName', Infinity);


    const genderDistribution: GenderDistribution[] = [
      { name: "ذكور", value: male },
      { name: "إناث", value: female },
    ];
    

    return { total, male, female, avgAge, educationDistribution, genderDistribution, referrerDistribution, topSurnames, topPollingCenters, topRegistrationCenters };
  }, [supporters]);

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
          <Button variant="outline" asChild className="relative">
              <Link href="/admin/requests">
                  <Mail className="ml-2 h-4 w-4" />
                  طلبات الانضمام
                  {requestCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                          {requestCount}
                      </span>
                  )}
              </Link>
          </Button>
          <Button variant="outline" asChild>
                <Link href="/admin/referrers">
                    <UserCog className="ml-2 h-4 w-4" />
                    إدارة مدخلي البيانات
                </Link>
            </Button>
          <Button asChild>
            <Link href={isAdmin ? "/admin/find-voter" : `/admin/find-voter?ref=${referrerName}`}>
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
            <BarChartIcon />
            <h2 className="text-2xl font-bold tracking-tight">الإحصائيات</h2>
          </div>
          <p className="text-muted-foreground">
            نظرة عامة على بيانات المؤيدين المسجلين في قاعدة البيانات.
          </p>
        </div>
        
        {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المؤيدين</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">مؤيد مسجل</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">عدد الذكور</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M15 7a5 5 0 1 1-10 0"/><path d="M19 21v-4a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v4"/></svg>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.male}</div>
                <p className="text-xs text-muted-foreground">
                    {stats.total > 0 ? `${((stats.male / stats.total) * 100).toFixed(1)}%` : '0%'} من الإجمالي
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">عدد الإناث</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M12 21a5 5 0 0 0-10 0"/><path d="M19 21v-4a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v4"/><path d="M17 7a5 5 0 0 0-10 0"/></svg>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.female}</div>
                 <p className="text-xs text-muted-foreground">
                    {stats.total > 0 ? `${((stats.female / stats.total) * 100).toFixed(1)}%` : '0%'} من الإجمالي
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">متوسط العمر</CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.avgAge} سنة</div>
                <p className="text-xs text-muted-foreground">متوسط عمر المؤيدين</p>
                </CardContent>
            </Card>
            </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>توزيع المؤيدين حسب التحصيل الدراسي</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                 {loading ? <Skeleton className="h-[350px] w-full" /> : (
                    <ResponsiveContainer width="100%" height={350}>
                        <RechartsBarChart data={stats.educationDistribution}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          contentStyle={{ direction: 'rtl' }}
                          cursor={{ fill: 'hsl(var(--muted))' }}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="العدد" />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                 )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>النسبة حسب الجنس</CardTitle>
              <CardDescription>
                توزيع المؤيدين بين الذكور والإناث.
              </CardDescription>
            </CardHeader>
            <CardContent>
             {loading ? <Skeleton className="h-[350px] w-full" /> : (
                <ResponsiveContainer width="100%" height={350}>
                    <RechartsPieChart>
                    <Pie
                        data={stats.genderDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {stats.genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                     <Tooltip formatter={(value, name) => [value, name]} contentStyle={{ direction: 'rtl' }} />
                    <Legend />
                    </RechartsPieChart>
                </ResponsiveContainer>
             )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1">
             <Card>
                <CardHeader>
                <CardTitle>أعلى 20 لقب</CardTitle>
                <CardDescription>الألقاب الأكثر تكراراً بين المؤيدين.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    {loading ? <Skeleton className="h-[400px] w-full" /> : (
                        <ResponsiveContainer width="100%" height={400}>
                            <RechartsBarChart data={stats.topSurnames} layout="vertical">
                            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={80}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="العدد" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
             <Card>
                <CardHeader>
                <CardTitle>أعلى 10 مراكز تسجيل</CardTitle>
                <CardDescription>مراكز التسجيل التي ينتمي إليها أكبر عدد من المؤيدين.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                     {loading ? <Skeleton className="h-[350px] w-full" /> : (
                        <ResponsiveContainer width="100%" height={350}>
                            <RechartsBarChart data={stats.topRegistrationCenters}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={80}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="العدد" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                     )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle>أعلى 10 مراكز اقتراع</CardTitle>
                <CardDescription>مراكز الاقتراع التي ينتمي إليها أكبر عدد من المؤيدين.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                     {loading ? <Skeleton className="h-[350px] w-full" /> : (
                        <ResponsiveContainer width="100%" height={350}>
                            <RechartsBarChart data={stats.topPollingCenters}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={80}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="العدد" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                     )}
                </CardContent>
            </Card>
        </div>


        <Card>
            <CardHeader>
              <CardTitle>أداء مدخلي البيانات</CardTitle>
              <CardDescription>عدد المؤيدين الذين تمت إضافتهم بواسطة كل مدخل بيانات.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 {loading ? <Skeleton className="h-[350px] w-full" /> : (
                    <ResponsiveContainer width="100%" height={350}>
                        <RechartsBarChart data={stats.referrerDistribution} layout="vertical">
                        <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={80}
                        />
                        <Tooltip 
                          contentStyle={{ direction: 'rtl' }}
                          cursor={{ fill: 'hsl(var(--muted))' }}
                        />
                        <Legend />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="عدد المؤيدين" />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                 )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

    