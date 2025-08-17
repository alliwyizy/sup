
"use client";

import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Loader2, Search, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { findVoter } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="ml-2 h-5 w-5" /> بحث</>}
    </Button>
  );
}

export default function PublicFindVoterPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorMessage = (error: string | null) => {
        switch (error) {
        case 'exists':
            return 'أنت مسجل بالفعل كمؤيد لدينا. شكراً لدعمك!';
        case 'invalid':
            return 'رقم الناخب المدخل غير صالح. يجب أن يتكون من 8 أرقام.';
        default:
            return null;
        }
    };
    const errorMessage = getErrorMessage(error);


  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-muted/40">
      <Button asChild variant="ghost" className="absolute right-4 top-4 md:right-8 md:top-8">
        <Link href="/">
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة للرئيسية
        </Link>
      </Button>
      <div className="w-full max-w-lg py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <UserPlus className="size-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl tracking-tight">طلب الانضمام (خطوة 1 من 2)</CardTitle>
            <CardDescription className="pt-2">
              للبدء، يرجى إدخال رقم الناخب الخاص بك للبحث عن بياناتك في قاعدة البيانات العامة.
            </CardDescription>
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
              <input type="hidden" name="source" value="public" />
              <div className="space-y-2">
                <Label htmlFor="voterNumber">رقم الناخب (8 أرقام)</Label>
                <Input id="voterNumber" name="voterNumber" required className="text-right" maxLength={8} pattern="\d{8}" title="الرجاء إدخال 8 أرقام" />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
