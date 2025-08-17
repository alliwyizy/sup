

import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn, UserPlus } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-muted/40">
      <div className="absolute left-4 top-4 flex gap-2 md:left-8 md:top-8">
        <Button asChild variant="outline">
          <Link href="/login">
            <LogIn className="ml-2 h-4 w-4"/>
            دخول المدير
          </Link>
        </Button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
         <div className="flex w-full flex-col justify-center space-y-8 text-center">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                قاعدة بيانات مؤيدي الأستاذ عبدالرحمن اللويزي
              </h1>
              <p className="text-lg text-muted-foreground pt-2">
                أدخل رقم الناخب الخاص بك أدناه للتحقق من تسجيلك في قاعدة بيانات المؤيدين.
              </p>
            </div>
            <SearchForm />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  أو
                </span>
              </div>
            </div>
             <Button asChild variant="secondary" size="lg">
                <Link href="/find-voter">
                    <UserPlus className="ml-2 h-4 w-4"/>
                    الانضمام كمؤيد جديد
                </Link>
            </Button>
        </div>
      </div>
    </main>
  )
}
