
import { SearchForm } from "@/components/search-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-muted">
      <Button asChild variant="outline" className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/login">
            <LogIn className="ml-2 h-4 w-4"/>
            دخول المدير
          </Link>
      </Button>

      <div className="w-full max-w-md">
         <div className="flex w-full flex-col justify-center space-y-6 text-center">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                قاعدة بيانات مؤيدي الأستاذ عبدالرحمن اللويزي
              </h1>
              <p className="text-lg text-muted-foreground pt-2">
                أدخل رقم الناخب الخاص بك أدناه للتحقق من تسجيلك.
              </p>
            </div>
            <SearchForm />
        </div>
      </div>
    </main>
  )
}
