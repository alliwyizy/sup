import { getPendingSupporters } from "@/lib/actions";
import { RequestsTable } from "@/components/requests-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function RequestsPage() {
  const pendingSupporters = await getPendingSupporters();

  return (
    <div className="w-full max-w-6xl">
        <Card>
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl tracking-tight">
                مراجعة الطلبات المعلقة
            </CardTitle>
            <CardDescription className="pt-2">
                قم بمراجعة طلبات الانضمام الجديدة والموافقة عليها أو رفضها.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <RequestsTable data={pendingSupporters} />
        </CardContent>
        </Card>
    </div>
  );
}
