
"use client";

import * as React from "react";
import { Check, Loader2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JoinRequest } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import { approveJoinRequest, denyJoinRequest } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RequestsTableProps {
  data: JoinRequest[];
  onDataChange: () => void;
  loading: boolean;
}

export function RequestsTable({ data, onDataChange, loading }: RequestsTableProps) {
  const { toast } = useToast();
  const [localData, setLocalData] = React.useState(data);
  const [isProcessing, setIsProcessing] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleApprove = async (voterNumber: string) => {
    setIsProcessing(voterNumber);
    const result = await approveJoinRequest(voterNumber);
    if (result.error) {
      toast({ variant: "destructive", title: "خطأ", description: result.error });
    } else {
      toast({ title: "نجاح", description: result.message });
      setLocalData(prev => prev.filter(r => r.voterNumber !== voterNumber));
      // Optionally call onDataChange if counts in parent need update
      onDataChange();
    }
    setIsProcessing(null);
  };
  
  const handleDeny = async (voterNumber: string) => {
    setIsProcessing(voterNumber);
    const result = await denyJoinRequest(voterNumber);
     if (result.error) {
      toast({ variant: "destructive", title: "خطأ", description: result.error });
    } else {
      toast({ title: "نجاح", description: result.message });
      setLocalData(prev => prev.filter(r => r.voterNumber !== voterNumber));
      onDataChange();
    }
    setIsProcessing(null);
  };


  const tableHeaders = [
    "رقم الناخب", "الاسم الكامل", "اللقب", "سنة الميلاد", "الجنس", "رقم الهاتف", 
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

  if (localData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-muted-foreground border-t">
        <p>لا توجد طلبات انضمام معلقة حاليًا.</p>
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
            {localData.map((request) => (
              <TableRow key={request.voterNumber}>
                <TableCell className="text-center">{request.voterNumber}</TableCell>
                <TableCell className="text-center font-medium">{request.fullName}</TableCell>
                <TableCell className="text-center">{request.surname}</TableCell>
                <TableCell className="text-center">{request.birthYear}</TableCell>
                <TableCell className="text-center">{request.gender}</TableCell>
                <TableCell dir="ltr" className="text-center">{request.phoneNumber}</TableCell>
                <TableCell className="text-center">{request.education}</TableCell>
                <TableCell className="text-center">{request.registrationCenter}</TableCell>
                <TableCell className="text-center">{request.pollingCenter}</TableCell>
                <TableCell className="text-center">{request.pollingCenterNumber}</TableCell>
                <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-100"
                            onClick={() => handleApprove(request.voterNumber)}
                            disabled={isProcessing === request.voterNumber}
                        >
                            {isProcessing === request.voterNumber ? <Loader2 className="animate-spin" /> :  <Check className="h-5 w-5" />}
                            <span className="sr-only">موافقة</span>
                        </Button>

                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                    disabled={isProcessing === request.voterNumber}
                                >
                                    {isProcessing === request.voterNumber ? null : <X className="h-5 w-5" />}
                                    <span className="sr-only">رفض</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader className="text-right">
                                <AlertDialogTitle>هل أنت متأكد من رفض الطلب؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                    هذا الإجراء سيقوم بحذف طلب الانضمام بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeny(request.voterNumber)}>
                                    تأكيد الرفض
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
