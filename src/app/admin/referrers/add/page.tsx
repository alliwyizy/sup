
"use client";

import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef } from "react"
import { Loader2, UserPlus, ArrowRight, UserCog, Users, Mail, BarChart, LogOut } from "lucide-react"
import * as React from "react"
import Link from "next/link";

import { addReferrer, type FormState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


const initialState: FormState = {
  message: null,
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <UserPlus className="ml-2 h-5 w-5" />
          إضافة مدخل بيانات
        </>
      )}
    </Button>
  )
}

export default function AddReferrerPage() {
    const [state, formAction] = useActionState(addReferrer, initialState);
    const { toast } = useToast();
    const formRef = React.useRef<HTMLFormElement>(null);

    React.useEffect(() => {
        if (state?.error) {
        toast({
            variant: "destructive",
            title: "خطأ في الإضافة",
            description: state.error,
        });
        }
        if (state?.message) {
        toast({
            title: "تمت الإضافة بنجاح",
            description: state.message,
        });
        formRef.current?.reset();
        }
    }, [state, toast]);

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
                 <Button variant="outline" asChild>
                    <Link href="/admin/referrers">
                        <UserCog className="ml-2 h-4 w-4" />
                        إدارة مدخلي البيانات
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
       <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl tracking-tight">
                        إضافة مدخل بيانات جديد
                    </CardTitle>
                    <CardDescription className="pt-2">
                        املأ النموذج أدناه لإضافة مدخل بيانات جديد إلى النظام.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">اسم المستخدم</Label>
                            <Input id="name" name="name" required className="text-right" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input id="password" name="password" type="password" required className="text-right" />
                        </div>
                        <CardFooter className="p-0 pt-4">
                            <SubmitButton />
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
       </main>
    </div>
  );
}
