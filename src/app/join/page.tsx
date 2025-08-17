import { JoinForm } from "@/components/join-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

export default function JoinPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-muted/40">
         <Button asChild variant="ghost" className="absolute right-4 top-4 md:right-8 md:top-8">
          <Link href="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للرئيسية
          </Link>
        </Button>
      <div className="w-full max-w-2xl py-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                <UserPlus className="size-8 text-primary" />
            </div>
          <CardTitle className="font-headline text-2xl tracking-tight">
            طلب الانضمام كمؤيد
          </CardTitle>
          <CardDescription className="pt-2">
            املأ النموذج أدناه لإرسال طلبك. ستتم مراجعة طلبك من قبل المسؤول.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JoinForm />
        </CardContent>
      </Card>
      </div>
    </main>
  );
}
