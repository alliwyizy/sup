
import { getReferrers } from "@/lib/data";
import { AddReferrerForm } from "@/components/add-referrer-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ReferrersPage() {
  const referrers = await getReferrers();

  return (
    <div className="w-full max-w-4xl grid gap-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl tracking-tight">
            إضافة معرّف جديد
          </CardTitle>
          <CardDescription className="pt-2">
            أدخل اسم المعرّف الجديد لإضافته إلى النظام.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddReferrerForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المعرّفين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المعرف (ID)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrers.length > 0 ? referrers.map((referrer) => (
                  <TableRow key={referrer.id}>
                    <TableCell className="font-medium">{referrer.name}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{referrer.id}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      لا يوجد معرفين حاليًا.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
