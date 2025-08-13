
"use client";

import * as React from "react";
import { Check, Star, UserCheck, UserX } from "lucide-react";

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
import { toggleReferrerStatus, type ReferrerActionState } from "@/lib/actions";
import type { Supporter } from "@/lib/data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export function ReferrersTable({ data }: { data: Supporter[] }) {
  const { toast } = useToast();

  const handleAction = React.useCallback(
    async (voterNumber: string) => {
      const result = await toggleReferrerStatus(voterNumber);
      if (result.error) {
        toast({ variant: "destructive", title: "خطأ", description: result.error });
      }
      if (result.message) {
        toast({ title: "نجاح", description: result.message });
      }
    },
    [toast]
  );

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>لا يوجد مؤيدون لإدارتهم حاليًا. قم بإضافة مؤيدين أولاً.</p>
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
            <TableHead>الحالة</TableHead>
            <TableHead className="text-center">الإجراء</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((supporter) => (
            <TableRow key={supporter.voterNumber}>
              <TableCell className="font-medium">
                {supporter.name} {supporter.surname}
              </TableCell>
              <TableCell className="hidden sm:table-cell font-mono text-muted-foreground">
                {supporter.voterNumber}
              </TableCell>
              <TableCell>
                {supporter.isReferrer ? (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    <Star className="ml-1 h-3 w-3 text-amber-600" />
                    معرّف
                  </Badge>
                ) : (
                  <Badge variant="outline">مؤيد</Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                <form>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          formAction={() => handleAction(supporter.voterNumber)}
                        >
                          {supporter.isReferrer ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-primary" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{supporter.isReferrer ? 'إزالة كمعرّف' : 'ترقية إلى معرّف'}</p>
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
