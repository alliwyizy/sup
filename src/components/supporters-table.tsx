
"use client";

import * as React from "react";
import { Check } from "lucide-react";

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

export function SupportersTable({ data }: { data: (Supporter & { referrerName?: string })[] }) {

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
        <p>لا يوجد بيانات لعرضها حاليًا.</p>
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
            <TableHead className="hidden md:table-cell">رقم الهاتف</TableHead>
            <TableHead className="hidden lg:table-cell">المعرّف</TableHead>
            <TableHead>معرّف؟</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((supporter) => (
            <TableRow key={supporter.voterNumber}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="font-bold">{supporter.name} {supporter.surname}</span>
                  <span className="text-sm text-muted-foreground sm:hidden font-mono">
                    {supporter.voterNumber}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell font-mono text-muted-foreground">
                {supporter.voterNumber}
              </TableCell>
              <TableCell className="hidden md:table-cell font-mono text-muted-foreground" dir="ltr">
                {supporter.phoneNumber}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {supporter.referrerName || 'لا يوجد'}
              </TableCell>
              <TableCell>
                {supporter.isReferrer && (
                  <Badge>
                    <Check className="ml-1 h-3 w-3" />
                    نعم
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
