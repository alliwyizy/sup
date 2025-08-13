
"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Loader2, Search } from "lucide-react"
import * as React from "react"

import { searchByVoterNumber, type SearchState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const initialState: SearchState = {
  message: null,
  error: null,
  data: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Search className="ml-2 h-5 w-5" />
          بحث
        </>
      )}
    </Button>
  )
}

export function SearchForm() {
  const [state, formAction] = useActionState(searchByVoterNumber, initialState)
  const { toast } = useToast()
  const formRef = React.useRef<HTMLFormElement>(null)
  const prevIdRef = React.useRef<number | undefined>();

  React.useEffect(() => {
    if (state.id && state.id !== prevIdRef.current) {
        if (state.error) {
            toast({
                variant: "destructive",
                title: "خطأ في البحث",
                description: state.error,
            })
        }
        // On successful search, clear the form.
        if (state.data) {
            formRef.current?.reset();
        }
        prevIdRef.current = state.id;
    }
  }, [state, toast]);

  return (
    <div className="w-full space-y-6">
      <form ref={formRef} action={formAction} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="voterNumber">رقم الناخب</Label>
          <Input
            id="voterNumber"
            name="voterNumber"
            placeholder="ادخل رقم الناخب هنا..."
            required
            type="text"
            className="text-right"
          />
        </div>
        <SubmitButton />
      </form>

      {state.data && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>بيانات المؤيد</span>
              {state.data.isReferrer && <Badge>معرّف</Badge>}
            </CardTitle>
            <CardDescription>
              {state.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">رقم الناخب</span>
              <span className="font-mono">{state.data.voterNumber}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">الاسم الكامل</span>
              <span>{state.data.name} {state.data.surname}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">العمر</span>
              <span>{state.data.age}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">الجنس</span>
              <span>{state.data.gender}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">رقم الهاتف</span>
              <span dir="ltr" className="font-mono">{state.data.phoneNumber}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">التحصيل الدراسي</span>
              <span>{state.data.educationalAttainment}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">المعرّف</span>
              <span>{state.data.referrerName || 'لا يوجد'}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">مركز التسجيل</span>
              <span className="text-left">{state.data.registrationCenter}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">مركز الاقتراع</span>
              <span className="text-left">{state.data.pollingCenter}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
