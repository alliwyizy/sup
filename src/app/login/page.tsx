import { LoginForm } from "@/components/login-form";
import Link from "next/link";


export default function LoginPage() {
  return (
    <main className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
         <Link
          href="/"
          className="absolute right-4 top-4 md:right-8 md:top-8"
        >
          العودة للرئيسية
        </Link>
         <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            قاعدة بيانات المؤيدين
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;نظام آمن وموثوق لإدارة بيانات المؤيدين بكفاءة عالية، مما يضمن سهولة الوصول والتنظيم.&rdquo;
              </p>
              <footer className="text-sm">فريق التطوير</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                تسجيل دخول المسؤول
              </h1>
              <p className="text-sm text-muted-foreground">
                أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة الإدارة
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
    </main>
  );
}
