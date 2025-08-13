
import { getAllSupporters } from "@/lib/data";
import { ReferrersTable } from "@/components/referrers-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function ReferrersPage() {
  const supporters = await getAllSupporters();

  return (
    <div className="w-full max-w-4xl grid gap-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl tracking-tight">
            إدارة المعرّفين
          </CardTitle>
          <CardDescription className="pt-2">
            قم بترقية المؤيدين ليصبحوا معرّفين. يمكن للمعرّفين ربط المؤيدين الجدد بهم.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReferrersTable data={supporters} />
        </CardContent>
      </Card>
    </div>
  );
}
