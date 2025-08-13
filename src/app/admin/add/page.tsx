import { AddSupporterForm } from "@/components/add-supporter-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AddSupporterPage() {
  return (
    <div className="w-full max-w-2xl">
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
