import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 bg-muted/40">
       <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/">
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة للرئيسية
            </Link>
          </Button>
       </div>
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
           <CardHeader className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                <ShieldCheck className="size-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl tracking-tight">
              تسجيل دخول المدير
            </CardTitle>
            <CardDescription className="pt-2">
              الرجاء إدخال بيانات الاعتماد للوصول إلى لوحة التحكم.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
