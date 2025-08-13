
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
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <LogIn />
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
  const formRef = React.useRef<HTMLFormElement>(null)

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
      router.push('/admin/stats');
    }
  }, [state, toast, router]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            name="email"
            placeholder="admin@example.com"
            required
            type="email"
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
            defaultValue="password"
          />
        </div>
        <SubmitButton />
    </form>
  )
}
