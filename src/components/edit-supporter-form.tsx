
"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import * as React from "react";

import { updateSupporter, type FormState } from "@/lib/actions";
import type { Supporter } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const initialState: FormState = {
  message: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Save className="ml-2 h-5 w-5" />
          حفظ التعديلات
        </>
      )}
    </Button>
  );
}

interface EditSupporterFormProps {
  supporter: Supporter;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

export function EditSupporterForm({
  supporter,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditSupporterFormProps) {
  const [state, formAction] = useActionState(updateSupporter, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "خطأ في التعديل",
        description: state.error,
      });
    }
    if (state?.message) {
      toast({
        title: "تم التعديل بنجاح",
        description: state.message,
      });
      onSuccess();
      onOpenChange(false);
    }
  }, [state, toast, onOpenChange, onSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="text-right">
          <DialogTitle>تعديل بيانات المؤيد</DialogTitle>
          <DialogDescription>
            قم بتحديث معلومات المؤيد أدناه. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="voterNumber-edit">رقم الناخب</Label>
              <Input
                id="voterNumber-edit"
                name="voterNumber"
                defaultValue={supporter.voterNumber}
                readOnly
                disabled
                className="text-right bg-muted"
              />
            </div>
             <div className="space-y-2">
                <Label htmlFor="name-edit">الاسم</Label>
                <Input id="name-edit" name="name" defaultValue={supporter.name} required className="text-right" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="surname-edit">اللقب</Label>
                <Input id="surname-edit" name="surname" defaultValue={supporter.surname} required className="text-right" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="age-edit">العمر</Label>
                <Input id="age-edit" name="age" type="number" defaultValue={supporter.age} required className="text-right" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phoneNumber-edit">رقم الهاتف</Label>
                <Input id="phoneNumber-edit" name="phoneNumber" type="tel" defaultValue={supporter.phoneNumber} required className="text-right" />
            </div>
             <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pollingCenter-edit">مركز الاقتراع</Label>
                <Input id="pollingCenter-edit" name="pollingCenter" defaultValue={supporter.pollingCenter} required className="text-right" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
