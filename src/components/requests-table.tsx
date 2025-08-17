
"use client";

import * as React from "react";
import { useFormStatus, useFormState } from "react-dom";
import { Loader2, Check, X, UserCheck, UserX } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { approveSupporter, rejectSupporter, type RequestActionState } from "@/lib/actions";
import type { Supporter } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export function RequestsTable({ data }: { data: (Supporter & { referrerName?: string })[] }) {
  const { toast } = useToast();
  const [optimisticData, setOptimisticData] = React.useState(data);

  React.useEffect(() => {
    setOptimisticData(data);
  }, [data]);

  const handleAction = React.useCallback(
    async (
      action: (voterNumber: string) => Promise<RequestActionState>,
      voterNumber: string
    ) => {
      // Optimistic UI Update: remove the item from the list
      setOptimisticData(prevData => prevData.filter(item => item.voterNumber !== voterNumber));
      
      const result = await action(voterNumber);
      if (result.error) {
        toast({ variant: "destructive", title: "خطأ", description: result.error });
        // Revert optimistic update on error
        setOptimisticData(data);
      }
      if (result.message) {
        toast({ title: "نجاح", description: result.message });
        // No need to revert, state is now in sync with backend
      }
    },
    [toast, data]
  );
  
  const memoizedApprove = React.useCallback(
    (voterNumber: string) => handleAction(approveSupporter, voterNumber),
    [handleAction]
  );
  const memoizedReject = React.useCallback(
    (voterNumber: string) => handleAction(rejectSupporter, voterNumber),
    [handleAction]
  );


  if (optimisticData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>لا توجد طلبات معلقة حاليًا.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم الكامل</TableHead>
            <TableHead className="hidden sm:table-cell">رقم الناخب</TableHead>
            <TableHead className="hidden lg:table-cell">المعرّف</TableHead>
            <TableHead className="hidden md:table-cell">مركز التسجيل</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optimisticData.map((supporter) => (
             <TableRow key={supporter.voterNumber}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-bold">{supporter.name} {supporter.surname}</span>
                  <span className="text-sm text-muted-foreground sm:hidden">
                    {supporter.voterNumber}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{supporter.voterNumber}</TableCell>
              <TableCell className="hidden lg:table-cell">{supporter.referrerName || 'لا يوجد'}</TableCell>
              <TableCell className="hidden md:table-cell">{supporter.registrationCenter}</TableCell>
              <TableCell className="text-center">
                 <form className="flex justify-center gap-1 sm:gap-2">
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button
                           size="sm"
                           variant="ghost"
                           className="text-green-600 hover:bg-green-100 hover:text-green-700"
                           formAction={() => memoizedApprove(supporter.voterNumber)}
                         >
                           <UserCheck className="h-4 w-4" />
                         </Button>
                       </TooltipTrigger>
                       <TooltipContent>
                         <p>موافقة</p>
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button
                           size="sm"
                           variant="ghost"
                           className="text-red-600 hover:bg-red-100 hover:text-red-700"
                           formAction={() => memoizedReject(supporter.voterNumber)}
                         >
                           <UserX className="h-4 w-4" />
                         </Button>
                       </TooltipTrigger>
                       <TooltipContent>
                         <p>رفض</p>
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                 </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
