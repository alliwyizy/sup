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

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4 bg-muted">
       <Button asChild variant="ghost" className="absolute right-4 top-4 md:right-8 md:top-8">
          <Link href="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للرئيسية
          </Link>
        </Button>
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl tracking-tight">
              تسجيل دخول المدير
            </CardTitle>
            <CardDescription className="pt-2">
              الرجاء إدخال بيانات الاعتماد الخاصة بك للوصول إلى لوحة الإدارة.
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
