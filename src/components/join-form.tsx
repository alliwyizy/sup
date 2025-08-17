
"use client"

import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef } from "react"
import { Loader2, Send } from "lucide-react"
import * as React from "react"

import { submitJoinRequest, type FormState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"


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

export function JoinForm() {
  const [state, formAction] = useActionState(submitJoinRequest, initialState)
  const formRef = React.useRef<HTMLFormElement>(null)


  React.useEffect(() => {
    if (state?.error) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (state?.message) {
      formRef.current?.reset();
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
       {state?.message && (
          <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
            <AlertTitle>تم الإرسال بنجاح!</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state?.error && (
            <Alert variant="destructive">
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 p-0">
        <div className="space-y-2">
          <Label htmlFor="voterNumber">رقم الناخب (8 أرقام)</Label>
          <Input id="voterNumber" name="voterNumber" required className="text-right" maxLength={8} />
        </div>
         <div className="space-y-2">
          <Label htmlFor="phoneNumber">رقم الهاتف (11 رقم)</Label>
          <Input id="phoneNumber" name="phoneNumber" type="tel" required className="text-right" maxLength={11} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">الاسم الكامل (ثلاثي)</Label>
          <Input id="fullName" name="fullName" required className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">اللقب</Label>
          <Input id="surname" name="surname" required className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthYear">سنة الميلاد</Label>
          <Input id="birthYear" name="birthYear" type="number" required className="text-right" placeholder="مثال: 1990" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="gender">الجنس</Label>
            <Select name="gender" required>
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
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-6 p-0">
        <SubmitButton />
      </CardFooter>
    </form>
  )
}
