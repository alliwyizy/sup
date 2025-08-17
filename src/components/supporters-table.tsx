
"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditSupporterForm } from "./edit-supporter-form";
import { DeleteSupporterDialog } from "./delete-supporter-dialog";
import { Skeleton } from "./ui/skeleton";

interface SupportersTableProps {
  data: Supporter[];
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
    "رقم الناخب", "الاسم الكامل", "اللقب", "العمر", "الجنس", "رقم الهاتف", 
    "التحصيل الدراسي", "مركز التسجيل", "مركز الاقتراع", "رقم المركز", "إجراءات"
  ];

  if (loading) {
     return (
        <div className="w-full overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    {tableHeaders.map((header) => <TableHead key={header} className="text-center">{header}</TableHead>)}
                </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(10)].map((_, i) => (
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
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground border-t">
        <p>لا يوجد بيانات لعرضها حاليًا. قم بإضافة مؤيد جديد للبدء.</p>
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
                <TableHead key={header} className="text-center font-bold text-foreground whitespace-nowrap">{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((supporter) => (
              <TableRow key={supporter.voterNumber}>
                <TableCell className="text-center">{supporter.voterNumber}</TableCell>
                <TableCell className="text-center font-medium">{supporter.fullName}</TableCell>
                <TableCell className="text-center">{supporter.surname}</TableCell>
                <TableCell className="text-center">{supporter.age}</TableCell>
                <TableCell className="text-center">{supporter.gender}</TableCell>
                <TableCell dir="ltr" className="text-center">{supporter.phoneNumber}</TableCell>
                <TableCell className="text-center">{supporter.education}</TableCell>
                <TableCell className="text-center">{supporter.registrationCenter}</TableCell>
                <TableCell className="text-center">{supporter.pollingCenter}</TableCell>
                <TableCell className="text-center">{supporter.pollingCenterNumber}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(supporter)}>
                        <Pencil className="ml-2 h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleDelete(supporter)}>
                         <Trash2 className="ml-2 h-4 w-4" />
                         حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
