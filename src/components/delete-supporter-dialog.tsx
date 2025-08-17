
"use client";

import { Loader2, Trash2 } from "lucide-react";
import * as React from "react";
import { useFormStatus } from "react-dom";

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

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Trash2 className="ml-2 h-5 w-5" />
          حذف بالتأكيد
        </>
      )}
    </Button>
  );
}

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
  const [formState, setFormState] = React.useState<FormState>({});

  const handleSubmit = async () => {
    const result = await deleteSupporter(supporter.voterNumber);
    setFormState(result);
  };

  React.useEffect(() => {
    if (formState.error) {
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: formState.error,
      });
    }
    if (formState.message) {
      toast({
        title: "تم الحذف بنجاح",
        description: formState.message,
      });
      onSuccess();
      onOpenChange(false);
    }
  }, [formState, toast, onOpenChange, onSuccess]);


  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف بيانات المؤيد{" "}
            <span className="font-bold">
              {supporter.name} {supporter.surname}
            </span>{" "}
            بشكل دائم من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
           <form action={handleSubmit}>
            <DeleteButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
