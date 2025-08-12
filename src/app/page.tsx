import { SearchForm } from "@/components/search-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
              للتأكد من وجود بياناتك في قاعدة البيانات، يرجى إدخال رقم الناخب الخاص بك والضغط على زر البحث.
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
