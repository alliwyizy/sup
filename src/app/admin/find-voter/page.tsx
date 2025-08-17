
"use client";

import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Loader2, Search, ArrowRight, UserCog, Users, Mail, BarChart, LogOut, AlertCircle } from 'lucide-react';
import { findVoter } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import * as React from 'react';
import { getAllJoinRequests } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/theme-toggle';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="ml-2 h-5 w-5" /> بحث</>}
    </Button>
  );
}

export default function FindVoterPage() {
  const searchParams = useSearchParams();
  const referrerName = searchParams.get('ref');
  const error = searchParams.get('error');
  const isAdmin = !referrerName;
  const [requestCount, setRequestCount] = React.useState(0);

  React.useEffect(() => {
    async function fetchRequestCount() {
      if (isAdmin) {
        const requests = await getAllJoinRequests();
        setRequestCount(requests.length);
      }
    }
    fetchRequestCount();
  }, [isAdmin]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'exists':
        return 'هذا الناخب مسجل بالفعل كمؤيد في قاعدة البيانات.';
      case 'invalid':
        return 'رقم الناخب المدخل غير صالح. يجب أن يتكون من 8 أرقام.';
      default:
        return null;
    }
  };
  const errorMessage = getErrorMessage(error);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-xl font-semibold">لوحة التحكم</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={isAdmin ? "/admin/dashboard" : `/admin/dashboard?ref=${referrerName}`}>
              <Users className="ml-2 h-4 w-4" />
              قائمة المؤيدين
            </Link>
          </Button>
          {isAdmin && (
            <>
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
          <Button variant="secondary" asChild>
            <Link href="/">
              <LogOut className="ml-2 h-4 w-4" />
              العودة للرئيسية
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl tracking-tight">إضافة مؤيد جديد (خطوة 1 من 2)</CardTitle>
            <CardDescription className="pt-2">أدخل رقم الناخب للبحث في قاعدة البيانات العامة.</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <form action={findVoter} className="space-y-4">
              <input type="hidden" name="ref" value={referrerName ?? ''} />
              <input type="hidden" name="source" value="admin" />
              <div className="space-y-2">
                <Label htmlFor="voterNumber">رقم الناخب (8 أرقام)</Label>
                <Input id="voterNumber" name="voterNumber" required className="text-right" maxLength={8} pattern="\d{8}" title="الرجاء إدخال 8 أرقام" />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
