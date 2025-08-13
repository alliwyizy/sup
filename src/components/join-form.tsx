"use client"

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { Loader2, Send } from "lucide-react"
import * as React from "react"
import Link from "next/link"

import { submitSupporterRequest, type SupporterRequestState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const initialState: SupporterRequestState = {
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

export function JoinForm() {
  const [state, formAction] = useActionState(submitSupporterRequest, initialState)
  const { toast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "خطأ في الإرسال",
        description: state.error,
      })
    }
    if (state?.message) {
      toast({
        title: "تم إرسال الطلب بنجاح",
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
          <Label htmlFor="phoneNumber">رقم الهاتف</Label>
          <Input id="phoneNumber" name="phoneNumber" type="tel" required className="text-right" />
        </div>
         <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pollingCenter">مركز الاقتراع</Label>
          <Input id="pollingCenter" name="pollingCenter" required className="text-right" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-6">
        <SubmitButton />
         <Button variant="link" asChild>
          <Link href="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </CardFooter>
    </form>
  )
}
