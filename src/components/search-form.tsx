
"use client"

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { Loader2, Search } from "lucide-react"
import * as React from "react"

import { searchByVoterNumber, type SearchState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { CheckCircle } from "lucide-react"

const initialState: SearchState = {
  id: undefined,
  data: null,
  error: null,
  message: null,
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
  const formRef = React.useRef<HTMLFormElement>(null)
  const prevIdRef = React.useRef<number | undefined>();

  React.useEffect(() => {
    if (state.id && state.id !== prevIdRef.current) {
        if (state.data) {
            formRef.current?.reset();
        }
        prevIdRef.current = state.id;
    }
  }, [state]);

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardContent className="p-6">
             <form ref={formRef} action={formAction} className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="voterNumber" className="sr-only">رقم الناخب</Label>
                <Input
                    id="voterNumber"
                    name="voterNumber"
                    placeholder="ادخل رقم الناخب المكون من 8 أرقام"
                    required
                    type="text"
                    className="text-right text-base h-12"
                    pattern="\d{8}"
                    title="الرجاء إدخال 8 أرقام"
                    maxLength={8}
                />
                </div>
                <SubmitButton />
            </form>
        </CardContent>
      </Card>

      {state.id && state.error && (
         <Alert variant="destructive">
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
         </Alert>
      )}

      {state.data && (
        <Alert variant="default" className="border-green-600 text-green-800">
          <CheckCircle className="h-4 w-4 !text-green-600" />
          <AlertTitle className="font-bold">تم العثور على البيانات</AlertTitle>
          <AlertDescription>
            {state.message}
          </AlertDescription>
           <Card className="mt-4 border-green-200">
                <CardContent className="space-y-4 text-sm p-4 text-foreground">
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
                        <span className="font-medium text-muted-foreground">رقم الهاتف</span>
                        <span dir="ltr" className="font-mono">{state.data.phoneNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground">مركز الاقتراع</span>
                        <span className="text-left">{state.data.pollingCenter}</span>
                    </div>
                </CardContent>
            </Card>
        </Alert>
      )}
    </div>
  )
}
