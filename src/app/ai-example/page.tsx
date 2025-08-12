"use client"

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { suggestTopic, type SuggestTopicOutput } from "@/ai/flows/topic-suggester-flow";

type AiState = {
    data?: SuggestTopicOutput | null
    error?: string | null
    message?: string | null
};

const initialState: AiState = {
    data: null,
    error: null,
    message: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <>
                    <Sparkles className="ml-2 h-5 w-5" />
                    انشاء
                </>
            )}
        </Button>
    )
}

async function suggestTopicAction(prevState: AiState, formData: FormData): Promise<AiState> {
    const topic = formData.get("topic") as string;
    if (!topic) {
        return { error: "الرجاء إدخال موضوع." }
    }
    try {
        const result = await suggestTopic({ topic });
        return { data: result };
    } catch (e) {
        return { error: "حدث خطأ أثناء إنشاء الاقتراح." }
    }
}

export default function AiExamplePage() {
    const [state, formAction] = useActionState(suggestTopicAction, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <main className="flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl tracking-tight">
                            مثال على استخدام Genkit
                        </CardTitle>
                        <CardDescription className="pt-2">
                            أدخل موضوعًا أدناه، وسيقوم الذكاء الاصطناعي بإنشاء فقرة عنه.
                        </CardDescription>
                    </CardHeader>
                    <form ref={formRef} action={formAction}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">الموضوع</Label>
                                <Input
                                    id="topic"
                                    name="topic"
                                    placeholder="مثال: تاريخ بغداد"
                                    required
                                    className="text-right"
                                />
                            </div>
                            {state.data?.suggestion && (
                                <div className="space-y-2">
                                    <Label>النتيجة</Label>
                                    <Textarea readOnly value={state.data.suggestion} rows={6} className="bg-muted" />
                                </div>
                            )}
                             {state.error && (
                                <p className="text-sm text-destructive">{state.error}</p>
                             )}
                        </CardContent>
                        <CardFooter>
                            <SubmitButton />
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </main>
    )
}
