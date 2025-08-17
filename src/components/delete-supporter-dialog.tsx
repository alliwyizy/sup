
"use client";

import { Loader2, Trash2 } from "lucide-react";
import * as React from "react";

import { deleteSupporter, type FormState } from "@/lib/actions";
import type { Supporter } from "@/lib/data";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

interface DeleteSupporterDialogProps {
  supporter: Supporter;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export function DeleteSupporterDialog({
  supporter,
  isOpen,
  onOpenChange,
  onSuccess,
}: DeleteSupporterDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsDeleting(true);
    const result = await deleteSupporter(supporter.voterNumber);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: result.error,
      });
    }
    if (result.message) {
      toast({
        title: "تم الحذف بنجاح",
        description: result.message,
      });
      onSuccess();
      onOpenChange(false);
    }
     setIsDeleting(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف بيانات المؤيد{" "}
            <span className="font-bold">
              {supporter.fullName} {supporter.surname}
            </span>{" "}
            بشكل دائم من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <form onSubmit={handleSubmit}>
            <Button type="submit" variant="destructive" disabled={isDeleting}>
              {isDeleting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Trash2 className="ml-2 h-5 w-5" />
                  حذف بالتأكيد
                </>
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
