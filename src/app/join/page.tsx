
"use client";

import { useState } from "react";
import { JoinForm } from "@/components/join-form";
import { VoterCheckForm } from "@/components/voter-check-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Supporter } from "@/lib/data";

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [voterNumber, setVoterNumber] = useState<string>("");
  const [prefilledData, setPrefilledData] = useState<Partial<Supporter> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVoterCheckSuccess = (data: { voterNumber: string, prefilledData: Partial<Supporter> | null }) => {
    setVoterNumber(data.voterNumber);
    setPrefilledData(data.prefilledData);
    setStep(2);
    setError(null);
  }

  const handleVoterExists = (message: string) => {
    setError(message);
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl tracking-tight">
              {step === 1 ? "التحقق من رقم الناخب" : "انضم كمؤيد"}
            </CardTitle>
            <CardDescription className="pt-2">
              {step === 1 
                ? "أدخل رقم الناخب الخاص بك للبدء. إذا لم تكن مسجلاً، سيُطلب منك إدخال معلوماتك."
                : "املأ النموذج أدناه لإرسال طلبك. ستتم مراجعة طلبك من قبل المسؤول."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <VoterCheckForm 
                onSuccess={handleVoterCheckSuccess} 
                onVoterExists={handleVoterExists}
                initialError={error}
              />
            )}
            {step === 2 && <JoinForm voterNumber={voterNumber} />}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
