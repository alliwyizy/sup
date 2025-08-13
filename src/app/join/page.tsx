import { JoinForm } from "@/components/join-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function JoinPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl tracking-tight">
              انضم كمؤيد
            </CardTitle>
            <CardDescription className="pt-2">
              املأ النموذج أدناه لإرسال طلبك. ستتم مراجعة طلبك من قبل المسؤول.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JoinForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
