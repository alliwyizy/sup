

"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import * as React from "react";

import { updateSupporter, type FormState } from "@/lib/actions";
import type { Supporter, Referrer } from "@/lib/data";
import { getAllReferrers } from "@/lib/data";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";

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

const educationLevels = ['امي', 'يقرا ويكتب', 'ابتدائية', 'متوسطة', 'اعدادية', 'طالب جامعة', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراة'];

export function EditSupporterForm({
  supporter,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditSupporterFormProps) {
  const [state, formAction] = useActionState(updateSupporter, initialState);
  const { toast } = useToast();
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReferrers() {
        if (isOpen) {
            setLoading(true);
            const data = await getAllReferrers();
            setReferrers(data);
            setLoading(false);
        }
    }
    fetchReferrers();
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
            <div className="space-y-2">
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
                <Label htmlFor="phoneNumber-edit">رقم الهاتف</Label>
                <Input id="phoneNumber-edit" name="phoneNumber" type="tel" defaultValue={supporter.phoneNumber} required className="text-right" maxLength={11} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fullName-edit">الاسم الكامل</Label>
                <Input id="fullName-edit" name="fullName" defaultValue={supporter.fullName} required className="text-right" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="surname-edit">اللقب</Label>
                <Input id="surname-edit" name="surname" defaultValue={supporter.surname} required className="text-right" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="birthYear-edit">سنة الميلاد</Label>
                <Input id="birthYear-edit" name="birthYear" type="number" defaultValue={supporter.birthYear} required className="text-right" />
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
                <Label htmlFor="education-edit">التحصيل الدراسي</Label>
                <Select name="education" required defaultValue={supporter.education}>
                    <SelectTrigger id="education-edit">
                        <SelectValue placeholder="اختر التحصيل الدراسي" />
                    </SelectTrigger>
                    <SelectContent>
                        {educationLevels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="referrerName-edit">أضيف بواسطة (مدخل البيانات)</Label>
                {loading ? <Skeleton className="h-10 w-full" /> : (
                  <Select name="referrerName" required defaultValue={supporter.referrerName}>
                      <SelectTrigger id="referrerName-edit">
                          <SelectValue placeholder="اختر اسم مدخل البيانات" />
                      </SelectTrigger>
                      <SelectContent>
                          {referrers.map(r => (
                              <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                )}
            </div>
             <div className="space-y-2">
                <Label htmlFor="registrationCenter-edit">اسم مركز التسجيل</Label>
                <Input id="registrationCenter-edit" name="registrationCenter" defaultValue={supporter.registrationCenter} required className="text-right" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="pollingCenter-edit">اسم مركز الاقتراع</Label>
                <Input id="pollingCenter-edit" name="pollingCenter" defaultValue={supporter.pollingCenter} required className="text-right" />
            </div>
             <div className="space-y-2 md:col-span-2">
                <Label htmlFor="pollingCenterNumber-edit">رقم مركز الاقتراع</Label>
                <Input id="pollingCenterNumber-edit" name="pollingCenterNumber" defaultValue={supporter.pollingCenterNumber} required className="text-right" maxLength={6} />
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
