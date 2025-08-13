
"use client";

import * as React from "react";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Supporter } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditSupporterForm } from "./edit-supporter-form";
import { DeleteSupporterDialog } from "./delete-supporter-dialog";

interface SupportersTableProps {
  data: (Supporter & { referrerName?: string })[];
  onDataChange: () => void;
}

export function SupportersTable({ data, onDataChange }: SupportersTableProps) {
  const [filter, setFilter] = React.useState("");
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


  const filteredData = data.filter(
    (supporter) =>
      supporter.name.toLowerCase().includes(filter.toLowerCase()) ||
      supporter.surname.toLowerCase().includes(filter.toLowerCase()) ||
      supporter.voterNumber.includes(filter)
  );

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>لا يوجد بيانات لعرضها حاليًا.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="ابحث بالاسم أو رقم الناخب..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم الكامل</TableHead>
              <TableHead className="hidden sm:table-cell">رقم الناخب</TableHead>
              <TableHead className="hidden md:table-cell">رقم الهاتف</TableHead>
              <TableHead className="hidden lg:table-cell">المعرّف</TableHead>
              <TableHead>معرّف؟</TableHead>
              <TableHead>
                <span className="sr-only">الإجراءات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((supporter) => (
              <TableRow key={supporter.voterNumber}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {supporter.name} {supporter.surname}
                    </span>
                    <span className="text-sm text-muted-foreground sm:hidden font-mono">
                      {supporter.voterNumber}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-muted-foreground">
                  {supporter.voterNumber}
                </TableCell>
                <TableCell
                  className="hidden md:table-cell font-mono text-muted-foreground"
                  dir="ltr"
                >
                  {supporter.phoneNumber}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {supporter.referrerName || "لا يوجد"}
                </TableCell>
                <TableCell>
                  {supporter.isReferrer && (
                    <Badge>
                      <Check className="ml-1 h-3 w-3" />
                      نعم
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem onClick={() => handleEdit(supporter)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>تعديل</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(supporter)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>حذف</span>
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
