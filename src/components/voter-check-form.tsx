
"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Loader2, SearchCheck } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import type { Supporter } from "@/lib/data";

import { checkVoter, type VoterCheckState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert"

const initialState: VoterCheckState = {
  error: null,
  message: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <SearchCheck />
          تحقق
        </>
      )}
    </Button>
  );
}

interface VoterCheckFormProps {
  onSuccess: (data: { voterNumber: string; prefilledData: Partial<Supporter> | null }) => void;
  onVoterExists: (message: string) => void;
  initialError?: string | null;
}

export function VoterCheckForm({ onSuccess, onVoterExists, initialError }: VoterCheckFormProps) {
  const [state, formAction] = useActionState(checkVoter, { ...initialState, error: initialError });

  React.useEffect(() => {
    if (state.success && state.voterNumber) {
      onSuccess({ voterNumber: state.voterNumber, prefilledData: state.prefilledData || null });
    }
    if (!state.success && state.error && state.voterNumber) {
        onVoterExists(state.error);
    }
  }, [state, onSuccess, onVoterExists]);

  return (
    <form action={formAction}>
      <CardContent className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voterNumber">رقم الناخب (8 أرقام)</Label>
          <Input
            id="voterNumber"
            name="voterNumber"
            required
            className="text-right"
            maxLength={8}
            pattern="\\d{8}"
            title="الرجاء إدخال 8 أرقام"
          />
        </div>
         {state.error && (
            <Alert variant="destructive">
                <AlertDescription>
                    {state.error}
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-6">
        <SubmitButton />
         <Button variant="link" asChild>
          <Link href="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </CardFooter>
    </form>
  );
}
