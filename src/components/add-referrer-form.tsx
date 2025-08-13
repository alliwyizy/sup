
"use client"

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { Loader2, UserPlus } from "lucide-react"
import * as React from "react"

import { addReferrer, type AddReferrerState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const initialState: AddReferrerState = {
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
          إضافة معرّف
        </>
      )}
    </Button>
  )
}

export function AddReferrerForm() {
  const [state, formAction] = useActionState(addReferrer, initialState)
  const { toast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: state.error,
      })
    }
    if (state?.message) {
      toast({
        title: "نجاح",
        description: state.message,
      });
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 max-w-sm mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">اسم المعرّف</Label>
        <Input id="name" name="name" required className="text-right" />
      </div>
      <SubmitButton />
    </form>
  )
}
