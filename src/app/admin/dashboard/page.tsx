
import { getAllSupporters, getReferrers } from "@/lib/data";
import { SupportersTable } from "@/components/supporters-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const allSupporters = await getAllSupporters();
  const referrers = await getReferrers();

  return (
    <div className="w-full max-w-6xl grid gap-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl tracking-tight">
            لوحة تحكم المؤيدين
          </CardTitle>
          <CardDescription className="pt-2">
            عرض وإدارة جميع المؤيدين والمعرّفين في النظام.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">جميع المؤيدين ({allSupporters.length})</TabsTrigger>
              <TabsTrigger value="referrers">المعرّفين فقط ({referrers.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
               <SupportersTable data={allSupporters} />
            </TabsContent>
            <TabsContent value="referrers" className="mt-4">
                <SupportersTable data={referrers} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
