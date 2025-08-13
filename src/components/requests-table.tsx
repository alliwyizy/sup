"use client";

import * as React from "react";
import { useFormStatus, useFormState } from "react-dom";
import { Loader2, Check, X, Trash2 } from "lucide-react";

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

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  action: (voterNumber: string) => Promise<RequestActionState>;
  voterNumber: string;
  icon: React.ReactNode;
}

function ActionButton({ action, voterNumber, icon, ...props }: ActionButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      formAction={async () => {
        await action(voterNumber);
      }}
      {...props}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    </Button>
  );
}

export function RequestsTable({ data }: { data: Supporter[] }) {
  const { toast } = useToast();

  const handleAction = async (
    action: (voterNumber: string) => Promise<RequestActionState>,
    voterNumber: string
  ) => {
    const result = await action(voterNumber);
    if (result.error) {
      toast({ variant: "destructive", title: "خطأ", description: result.error });
    }
    if (result.message) {
      toast({ title: "نجاح", description: result.message });
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>لا توجد طلبات معلقة حاليًا.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم الكامل</TableHead>
            <TableHead>رقم الناخب</TableHead>
            <TableHead>رقم الهاتف</TableHead>
            <TableHead>مركز الاقتراع</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((supporter) => (
            <TableRow key={supporter.voterNumber}>
              <TableCell>
                {supporter.name} {supporter.surname}
              </TableCell>
              <TableCell>{supporter.voterNumber}</TableCell>
              <TableCell>{supporter.phoneNumber}</TableCell>
              <TableCell>{supporter.pollingCenter}</TableCell>
              <TableCell className="text-center">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const actionType = formData.get("action") as string;
                    if (actionType === "approve") {
                      await handleAction(approveSupporter, supporter.voterNumber);
                    } else if (actionType === "reject") {
                      await handleAction(rejectSupporter, supporter.voterNumber);
                    }
                  }}
                  className="flex justify-center gap-2"
                >
                  <button type="submit" name="action" value="approve">
                     <TooltipProvider>
                       <Tooltip>
                         <TooltipTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                                <Check className="h-4 w-4" />
                            </Button>
                         </TooltipTrigger>
                         <TooltipContent>
                           <p>موافقة</p>
                         </TooltipContent>
                       </Tooltip>
                     </TooltipProvider>
                  </button>
                   <button type="submit" name="action" value="reject">
                     <TooltipProvider>
                       <Tooltip>
                         <TooltipTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                <X className="h-4 w-4" />
                            </Button>
                         </TooltipTrigger>
                         <TooltipContent>
                           <p>رفض</p>
                         </TooltipContent>
                       </Tooltip>
                     </TooltipProvider>
                  </button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// These imports are needed for the Tooltip components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
