
"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import * as React from "react";

import { updateSupporter, type FormState } from "@/lib/actions";
import { getReferrers, type Supporter } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
          حفظ التغييرات
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
  const [referrers, setReferrers] = React.useState<Supporter[]>([]);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    async function fetchReferrers() {
      const data = await getReferrers();
      setReferrers(data);
    }
    if (isOpen) {
      fetchReferrers();
    }
  }, [isOpen]);

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

  // Reset form state when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
        // Reset the state to initial when the dialog is closed
        initialState.error = null;
        initialState.message = null;
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المؤيد</DialogTitle>
          <DialogDescription>
            قم بتحديث معلومات المؤيد أدناه. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="voterNumber-edit">رقم الناخب</Label>
              <Input
                id="voterNumber-edit"
                name="voterNumber"
                defaultValue={supporter.voterNumber}
                readOnly
                disabled
                className="text-right"
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
                <Label htmlFor="gender-edit">الجنس</Label>
                <Select name="gender" required defaultValue={supporter.gender}>
                    <SelectTrigger id="gender-edit">
                    <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="ذكر">ذكر</SelectItem>
                    <SelectItem value="انثى">انثى</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phoneNumber-edit">رقم الهاتف</Label>
                <Input id="phoneNumber-edit" name="phoneNumber" type="tel" defaultValue={supporter.phoneNumber} required className="text-right" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="educationalAttainment-edit">التحصيل الدراسي</Label>
                <Select name="educationalAttainment" required defaultValue={supporter.educationalAttainment}>
                    <SelectTrigger id="educationalAttainment-edit">
                    <SelectValue placeholder="اختر التحصيل الدراسي" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="امي">امي</SelectItem>
                        <SelectItem value="يقرأ ويكتب">يقرأ ويكتب</SelectItem>
                        <SelectItem value="ابتدائية">ابتدائية</SelectItem>
                        <SelectItem value="متوسطة">متوسطة</SelectItem>
                        <SelectItem value="اعدادية">اعدادية</SelectItem>
                        <SelectItem value="طالب جامعة">طالب جامعة</SelectItem>
                        <SelectItem value="دبلوم">دبلوم</SelectItem>
                        <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                        <SelectItem value="ماجستير">ماجستير</SelectItem>
                        <SelectItem value="دكتوراة">دكتوراة</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label htmlFor="referrerId-edit">المعرّف</Label>
                <Select name="referrerId" defaultValue={supporter.referrerId || "none"}>
                    <SelectTrigger id="referrerId-edit">
                    <SelectValue placeholder="اختر المعرّف (اختياري)" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="none">لا يوجد</SelectItem>
                    {referrers.map((referrer) => (
                        <SelectItem key={referrer.voterNumber} value={referrer.voterNumber}>
                        {referrer.name} {referrer.surname}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2 md:col-span-2">
                <Label htmlFor="registrationCenter-edit">مركز التسجيل</Label>
                <Input id="registrationCenter-edit" name="registrationCenter" defaultValue={supporter.registrationCenter} required className="text-right" />
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
