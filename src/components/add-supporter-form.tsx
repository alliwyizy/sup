
"use client"

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { Loader2, UserPlus } from "lucide-react"
import * as React from "react"

import { addSupporter, type FormState } from "@/lib/actions"
import { getReferrers, type Supporter } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
          إضافة مؤيد
        </>
      )}
    </Button>
  )
}

export function AddSupporterForm() {
  const [state, formAction] = useActionState(addSupporter, initialState)
  const [referrers, setReferrers] = React.useState<Supporter[]>([]);
  const { toast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    async function fetchReferrers() {
      const data = await getReferrers();
      setReferrers(data);
    }
    fetchReferrers();
  }, []);

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "خطأ في الإضافة",
        description: state.error,
      })
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
    <form ref={formRef} action={formAction}>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="voterNumber">رقم الناخب (8 أرقام)</Label>
          <Input id="voterNumber" name="voterNumber" required className="text-right" maxLength={8} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" name="name" required className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">اللقب</Label>
          <Input id="surname" name="surname" required className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">العمر</Label>
          <Input id="age" name="age" type="number" required className="text-right" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="gender">الجنس</Label>
            <Select name="gender" required defaultValue="ذكر">
                <SelectTrigger id="gender">
                <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="ذكر">ذكر</SelectItem>
                <SelectItem value="انثى">انثى</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">رقم الهاتف</Label>
          <Input id="phoneNumber" name="phoneNumber" type="tel" required className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="educationalAttainment">التحصيل الدراسي</Label>
          <Select name="educationalAttainment" required>
            <SelectTrigger id="educationalAttainment">
              <SelectValue placeholder="اختر التحصيل الدراسي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="امي">امي</SelectItem>
              <SelectItem value="يقرأ ويكتب">يقرأ ويكتب</SelectItem>
              <SelectItem value="ابتدائية">ابتدائية</SelectItem>
              <SelectItem value="متوسطة">متوسطة</SelectItem>
              <SelectItem value="اعدادية">اعدادية</SelectItem>
              <SelectItem value="طالب جامعة">طالب جامعة</SelectItem>
              <SelectItem value="دبلوم">دبلوم</SelectItem>
              <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
              <SelectItem value="ماجستير">ماجستير</SelectItem>
              <SelectItem value="دكتوراة">دكتوراة</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
            <Label htmlFor="referrerId">المعرّف</Label>
            <Select name="referrerId">
                <SelectTrigger id="referrerId">
                <SelectValue placeholder="اختر المعرّف (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="none">لا يوجد</SelectItem>
                {referrers.map((referrer) => (
                    <SelectItem key={referrer.voterNumber} value={referrer.voterNumber}>{referrer.name} {referrer.surname}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="registrationCenter">مركز التسجيل</Label>
          <Input id="registrationCenter" name="registrationCenter" required className="text-right" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pollingCenter">مركز الاقتراع</Label>
          <Input id="pollingCenter" name="pollingCenter" required className="text-right" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-6">
        <SubmitButton />
      </CardFooter>
    </form>
  )
}
