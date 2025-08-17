
"use client";

import * as React from "react";
import { getAllReferrers, type Referrer } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, LogOut, Mail, Users, BarChart, UserCog, Trash2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteReferrer } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function ReferrersPage() {
  const [data, setData] = React.useState<Referrer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleDataChange = React.useCallback(async () => {
    setLoading(true);
    const referrers = await getAllReferrers();
    setData(referrers);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteReferrer(id);
    if (result.error) {
        toast({ variant: "destructive", title: "خطأ", description: result.error });
    } else {
        toast({ title: "نجاح", description: result.message });
        handleDataChange();
    }
    setIsDeleting(null);
  };

  const tableHeaders = ["اسم المستخدم", "كلمة المرور (للتوضيح)", "إجراء"];

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
           <Button asChild>
                <Link href="/admin/referrers/add">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة مدخل بيانات
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
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                <UserCog />
                <h2 className="text-2xl font-bold tracking-tight">إدارة مدخلي البيانات</h2>
                </div>
                <p className="text-muted-foreground">
                عرض وحذف مدخلي البيانات المسجلين في النظام.
                </p>
            </div>
        </div>

        <Card>
          <CardContent className="p-0">
             <div className="w-full overflow-x-auto rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            {tableHeaders.map((header) => <TableHead key={header} className="text-center font-bold text-foreground whitespace-nowrap">{header}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             [...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    {tableHeaders.map((h, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                                </TableRow>
                            ))
                        ) : data.length > 0 ? (
                           data.map((referrer) => (
                            <TableRow key={referrer.id}>
                                <TableCell className="text-center font-medium">{referrer.name}</TableCell>
                                <TableCell className="text-center font-mono">{referrer.password}</TableCell>
                                <TableCell className="text-center">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-100" disabled={referrer.name.toLowerCase() === 'admin' || isDeleting === referrer.id}>
                                                {isDeleting === referrer.id ? <Loader2 className="animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                                <span className="sr-only">حذف</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader className="text-right">
                                            <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                هذا الإجراء سيقوم بحذف مدخل البيانات <span className="font-bold">{referrer.name}</span> بشكل نهائي.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(referrer.id)}>
                                                تأكيد الحذف
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                           ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={tableHeaders.length} className="h-24 text-center">
                                    لا يوجد مدخلو بيانات لعرضهم حاليًا.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
