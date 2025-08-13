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
import Image from "next/image"
import { LogIn, UserPlus } from "lucide-react"

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center lg:grid lg:grid-cols-2">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
         <div className="absolute inset-0 bg-zinc-900" />
         <Image 
            src="https://placehold.co/1200x800.png"
            alt="Iraqi election theme"
            fill
            className="object-cover"
            data-ai-hint="election campaign"
         />
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;مشاركتكم في الانتخابات هي صوتكم لمستقبل أفضل. معًا، نبني عراقًا أقوى وأكثر ازدهارًا.&rdquo;
              </p>
              <footer className="text-sm">الأستاذ عبدالرحمن اللويزي</footer>
            </blockquote>
          </div>
      </div>
      <div className="w-full max-w-md p-8 lg:p-8">
         <div className="flex w-full flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                بحث عن مؤيد
              </h1>
              <p className="text-sm text-muted-foreground">
                أدخل رقم الناخب الخاص بك أدناه للتحقق من تسجيلك.
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
             <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" asChild>
                    <Link href="/join">
                    <UserPlus />
                    انضم كمؤيد
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/login">
                    <LogIn />
                    تسجيل دخول المسؤول
                    </Link>
                </Button>
             </div>
        </div>
      </div>
    </main>
  )
}
