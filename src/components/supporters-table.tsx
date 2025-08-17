
"use client";

import * as React from "react";
import { Pencil, Trash2, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Supporter } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { EditSupporterForm } from "./edit-supporter-form";
import { DeleteSupporterDialog } from "./delete-supporter-dialog";
import { Skeleton } from "./ui/skeleton";

interface SupportersTableProps {
  data: (Supporter & { referrerName?: string })[];
  onDataChange: () => void;
  loading: boolean;
}

export function SupportersTable({ data, onDataChange, loading }: SupportersTableProps) {
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedSupporter, setSelectedSupporter] = React.useState<Supporter | null>(null);

  const handleEdit = (supporter: Supporter) => {
    setSelectedSupporter(supporter);
    setEditDialogOpen(true);
  };
  
  const handleDelete = (supporter: Supporter) => {
    setSelectedSupporter(supporter);
    setDeleteDialogOpen(true);
  };

  const tableHeaders = [
    "المحافظة", "المعرف", "الاسم", "اللقب", "العمر", "الجنس", 
    "التحصيل الدراسي", "رقم الهاتف", "مركز الاقتراع", "رقم بطاقة الناخب",
    "نوع التصويت", "المدخل", "الإجراءات"
  ];

  if (loading) {
     return (
        <div className="w-full overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    {tableHeaders.map((header) => <TableHead key={header}>{header}</TableHead>)}
                </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            {tableHeaders.map((h, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
     )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground border rounded-lg">
        <p>لا يوجد بيانات لعرضها حاليًا.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {tableHeaders.map((header) => (
                <TableHead key={header} className="font-bold text-foreground whitespace-nowrap">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((supporter) => (
              <TableRow key={supporter.voterNumber}>
                <TableCell>نينوى</TableCell>
                <TableCell>{supporter.referrerName || "غير محدد"}</TableCell>
                <TableCell>{supporter.name}</TableCell>
                <TableCell>{supporter.surname}</TableCell>
                <TableCell>{supporter.age}</TableCell>
                <TableCell>{supporter.gender}</TableCell>
                <TableCell>{supporter.educationalAttainment}</TableCell>
                <TableCell dir="ltr">{supporter.phoneNumber}</TableCell>
                <TableCell>{supporter.pollingCenter}</TableCell>
                <TableCell>{supporter.voterNumber}</TableCell>
                <TableCell>عام</TableCell>
                <TableCell>المدخل</TableCell>
                <TableCell className="flex items-center gap-1">
                   <Button variant="outline" size="sm" className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => handleEdit(supporter)}>
                     <Pencil className="h-4 w-4" />
                   </Button>
                   <Button variant="outline" size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(supporter)}>
                     <Trash2 className="h-4 w-4" />
                   </Button>
                   <Button variant="outline" size="sm" className="bg-gray-500 hover:bg-gray-600 text-white">
                     <Printer className="h-4 w-4" />
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       {selectedSupporter && (
         <>
            <EditSupporterForm
                supporter={selectedSupporter}
                isOpen={isEditDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={onDataChange}
            />
            <DeleteSupporterDialog
                supporter={selectedSupporter}
                isOpen={isDeleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onSuccess={onDataChange}
            />
         </>
      )}
    </>
  );
}
