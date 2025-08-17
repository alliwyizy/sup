

"use client"

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { Loader2, LogIn } from "lucide-react"
import * as React from "react"
import { useRouter } from "next/navigation"

import { login, type AuthState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"


const initialState: AuthState = {
  message: null,
  error: null,
  role: null,
  userName: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <LogIn className="ml-2 h-5 w-5" />
          تسجيل الدخول
        </>
      )}
    </Button>
  )
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(login, initialState)
  const { toast } = useToast()

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: state.error,
      })
    }
    if (state?.message) {
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: state.message,
      });

      if(state.role === 'admin') {
         router.push('/admin/dashboard');
      } else if (state.role === 'referrer') {
         router.push(`/admin/dashboard?ref=${state.userName}`);
      }
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">اسم المستخدم أو البريد الإلكتروني</Label>
          <Input
            id="username"
            name="username"
            placeholder="admin / admin@example.com"
            required
            className="text-right"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            className="text-right"
          />
        </div>
        <SubmitButton />
    </form>
  )
}
