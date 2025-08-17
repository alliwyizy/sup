import { AddSupporterForm } from "@/components/add-supporter-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AddSupporterPage() {
  return (
    <div className="w-full max-w-2xl p-4 lg:p-8">
         <div className="mb-4">
            <Button variant="outline" asChild>
                <Link href="/admin/dashboard">
                    <ArrowRight className="ml-2 h-4 w-4" />
                    العودة إلى لوحة التحكم
                </Link>
            </Button>
         </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl tracking-tight">
            إضافة مؤيد جديد
          </CardTitle>
          <CardDescription className="pt-2">
            املأ النموذج أدناه لإضافة مؤيد جديد إلى قاعدة البيانات.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddSupporterForm />
        </CardContent>
      </Card>
    </div>
  );
}
