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
import { LogIn, UserPlus } from "lucide-react"

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-2">
        <Button asChild>
            <Link href="/join">
            <UserPlus />
            انضم كمؤيد
            </Link>
        </Button>
        <Button variant="outline" asChild>
            <Link href="/admin/login">
            <LogIn />
            تسجيل دخول المسؤول
            </Link>
        </Button>
      </div>
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl tracking-tight">
              قاعدة بيانات مؤيدي الاستاذ عبدالرحمن اللويزي
            </CardTitle>
            <CardDescription className="pt-2">
              للتأكد من وجود بياناتك، أدخل رقم الناخب الخاص بك واضغط على بحث.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
