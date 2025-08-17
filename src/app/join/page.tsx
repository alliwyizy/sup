
"use client";

import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef, useState, useCallback } from "react"
import { Loader2, ArrowRight, UserPlus, AlertCircle, Send } from "lucide-react"
import * as React from "react"
import Link from "next/link";

import { submitJoinRequest, type FormState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
          <Send className="ml-2 h-5 w-5" />
          إرسال الطلب
        </>
      )}
    </Button>
  )
}

const educationLevels = ['امي', 'يقرا ويكتب', 'ابتدائية', 'متوسطة', 'اعدادية', 'طالب جامعة', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراة'];


export default function JoinPage() {
    const searchParams = useSearchParams();
    const [state, formAction] = useActionState(submitJoinRequest, initialState)
    const formRef = React.useRef<HTMLFormElement>(null)

    // Voter data from search params
    const voterNumber = searchParams.get('voterNumber');
    const fullName = searchParams.get('fullName');
    const surname = searchParams.get('surname');
    const birthYear = searchParams.get('birthYear');
    const gender = searchParams.get('gender');
    const notFound = searchParams.get('notFound');
    
    React.useEffect(() => {
        if (state?.error) {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        if (state?.message) {
        formRef.current?.reset();
        formRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [state]);
    
    // Render nothing or a loader while redirecting
    if (!voterNumber) {
        return (
             <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-muted/40">
                <p>يجب البحث عن الناخب أولاً.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link href="/find-voter">العودة لصفحة البحث</Link>
                </Button>
            </main>
        );
    }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-muted/40">
         <Button asChild variant="ghost" className="absolute right-4 top-4 md:right-8 md:top-8">
          <Link href="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للرئيسية
          </Link>
        </Button>
      <div className="w-full max-w-2xl py-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                <UserPlus className="size-8 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl tracking-tight">
            طلب الانضمام كمؤيد
          </CardTitle>
          <CardDescription className="pt-2">
            املأ النموذج أدناه لإرسال طلبك. ستتم مراجعة طلبك من قبل المسؤول.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {notFound && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>ناخب غير موجود</AlertTitle>
                    <AlertDescription>
                        لم يتم العثور على بيانات لرقم الناخب المدخل. يرجى إكمال جميع الحقول يدويًا.
                    </AlertDescription>
                </Alert>
            )}
             {state?.message && (
                <Alert variant="default" className="border-green-500 bg-green-50 text-green-800 mb-4">
                    <AlertTitle>تم الإرسال بنجاح!</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            {state?.error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
            {!state.message && (
                 <form ref={formRef} action={formAction} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-0">
                        <div className="space-y-2">
                            <Label htmlFor="voterNumber">رقم الناخب (8 أرقام)</Label>
                            <Input id="voterNumber" name="voterNumber" readOnly defaultValue={voterNumber} className="bg-muted text-right" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">رقم الهاتف (11 رقم)</Label>
                            <Input id="phoneNumber" name="phoneNumber" type="tel" required className="text-right" maxLength={11} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">الاسم الكامل (ثلاثي)</Label>
                            <Input id="fullName" name="fullName" required defaultValue={fullName ?? ''} readOnly={!!fullName} className={`text-right ${fullName ? 'bg-muted' : ''}`} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="surname">اللقب</Label>
                            <Input id="surname" name="surname" required defaultValue={surname ?? ''} className="text-right" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthYear">سنة الميلاد</Label>
                            <Input id="birthYear" name="birthYear" type="number" required defaultValue={birthYear ?? ''} readOnly={!!birthYear} className={`text-right ${birthYear ? 'bg-muted' : ''}`} placeholder="مثال: 1990" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">الجنس</Label>
                             <Select name="gender" required defaultValue={gender ?? undefined}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="اختر الجنس" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ذكر">ذكر</SelectItem>
                                    <SelectItem value="انثى">انثى</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="education">التحصيل الدراسي</Label>
                            <Select name="education" required>
                                <SelectTrigger id="education">
                                    <SelectValue placeholder="اختر التحصيل الدراسي" />
                                </SelectTrigger>
                                <SelectContent>
                                    {educationLevels.map(level => (
                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registrationCenter">اسم مركز التسجيل</Label>
                            <Input id="registrationCenter" name="registrationCenter" required className="text-right" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pollingCenter">اسم مركز الاقتراع</Label>
                            <Input id="pollingCenter" name="pollingCenter" required className="text-right" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="pollingCenterNumber">رقم مركز الاقتراع (6 أرقام)</Label>
                            <Input id="pollingCenterNumber" name="pollingCenterNumber" required className="text-right" maxLength={6} />
                        </div>
                    </div>
                    <CardFooter className="flex-col gap-4 pt-6 p-0">
                        <SubmitButton />
                    </CardFooter>
                </form>
            )}
        </CardContent>
      </Card>
      </div>
    </main>
  );
}
