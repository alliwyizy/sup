import { SearchForm } from "@/components/search-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
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
          <CardFooter className="flex-col gap-4 pt-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  أو
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/login">
                <LogIn />
                تسجيل دخول المسؤول
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
