

"use client";

import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef, useState, useCallback } from "react"
import { Loader2, UserPlus, ArrowRight, UserCog, Users, Mail, BarChart, LogOut, AlertCircle } from "lucide-react"
import * as React from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";

import { addSupporter, type FormState } from "@/lib/actions"
import { type Referrer, getAllReferrers, getAllJoinRequests } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const initialState: FormState = {
  message: null,
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <UserPlus className="ml-2 h-5 w-5" />
          إضافة مؤيد
        </>
      )}
    </Button>
  )
}

const educationLevels = ['امي', 'يقرا ويكتب', 'ابتدائية', 'متوسطة', 'اعدادية', 'طالب جامعة', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراة'];


export default function AddSupporterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [state, formAction] = useActionState(addSupporter, initialState)
    const { toast } = useToast()
    const formRef = React.useRef<HTMLFormElement>(null)
    const [referrers, setReferrers] = useState<Referrer[]>([]);
    const [loadingReferrers, setLoadingReferrers] = useState(true);
    const [requestCount, setRequestCount] = useState(0);

    // Voter data from search params
    const voterNumber = searchParams.get('voterNumber');
    const fullName = searchParams.get('fullName');
    const surname = searchParams.get('surname');
    const birthYear = searchParams.get('birthYear');
    const gender = searchParams.get('gender');
    const notFound = searchParams.get('notFound');
    
    // Referrer info from potential login
    const referrerNameParam = searchParams.get('ref');
    const isAdmin = !referrerNameParam;

    const fetchAdminData = useCallback(async () => {
        if(isAdmin) {
            setLoadingReferrers(true);
            const [referrerData, requestsData] = await Promise.all([getAllReferrers(), getAllJoinRequests()]);
            setReferrers(referrerData);
            setRequestCount(requestsData.length);
            setLoadingReferrers(false);
        } else {
            setLoadingReferrers(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);
    
    // Redirect if voterNumber is not present
    useEffect(() => {
        if (!voterNumber) {
            router.replace('/admin/find-voter');
        }
    }, [voterNumber, router]);

    React.useEffect(() => {
        if (state?.error) {
        toast({
            variant: "destructive",
            title: "خطأ في الإضافة",
            description: state.error,
        });
        }
        if (state?.message) {
        toast({
            title: "تمت الإضافة بنجاح",
            description: state.message,
        });
        // Redirect to find voter page after successful submission
        router.push(isAdmin ? '/admin/find-voter' : `/admin/find-voter?ref=${referrerNameParam}`);
        }
    }, [state, toast, router, isAdmin, referrerNameParam]);
    
    // Render nothing or a loader while redirecting
    if (!voterNumber) {
        return <div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
           <h1 className="text-xl font-semibold">لوحة التحكم</h1>
           <div className="flex-1" />
            <div className="flex items-center gap-2">
                 <Button variant="outline" asChild>
                    <Link href={isAdmin ? "/admin/dashboard" : `/admin/dashboard?ref=${referrerNameParam}`}>
                        <Users className="ml-2 h-4 w-4" />
                        قائمة المؤيدين
                    </Link>
                </Button>
                {isAdmin && (
                    <>
                        <Button variant="outline" asChild className="relative">
                            <Link href="/admin/requests">
                                <Mail className="ml-2 h-4 w-4" />
                                طلبات الانضمام
                                {requestCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                                        {requestCount}
                                    </span>
                                )}
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/stats">
                                <BarChart className="ml-2 h-4 w-4" />
                                الإحصائيات
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/referrers">
                                <UserCog className="ml-2 h-4 w-4" />
                                إدارة مدخلي البيانات
                            </Link>
                        </Button>
                    </>
                )}
                 <Button variant="secondary" asChild>
                    <Link href="/">
                        <LogOut className="ml-2 h-4 w-4" />
                        العودة للرئيسية
                    </Link>
                </Button>
            </div>
       </header>
       <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="w-full max-w-3xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl tracking-tight">
                        إضافة مؤيد جديد
                    </CardTitle>
                    <CardDescription className="pt-2">
                        املأ النموذج أدناه لإضافة مؤيد جديد إلى قاعدة البيانات.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {notFound && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>ناخب غير موجود</AlertTitle>
                            <AlertDescription>
                                لم يتم العثور على بيانات لرقم الناخب المدخل. يرجى إكمال جميع الحقول يدويًا.
                            </AlertDescription>
                        </Alert>
                    )}
                    <form ref={formRef} action={formAction}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="voterNumber">رقم الناخب (8 أرقام)</Label>
                                <Input id="voterNumber" name="voterNumber" readOnly defaultValue={voterNumber} className="bg-muted text-right" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">رقم الهاتف (11 رقم)</Label>
                                <Input id="phoneNumber" name="phoneNumber" type="tel" required className="text-right" maxLength={11} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">الاسم الكامل (ثلاثي)</Label>
                                <Input id="fullName" name="fullName" required defaultValue={fullName ?? ''} readOnly={!!fullName} className={`text-right ${fullName ? 'bg-muted' : ''}`} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="surname">اللقب</Label>
                                <Input id="surname" name="surname" required defaultValue={surname ?? ''} className="text-right" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birthYear">سنة الميلاد</Label>
                                <Input id="birthYear" name="birthYear" type="number" required defaultValue={birthYear ?? ''} readOnly={!!birthYear} className={`text-right ${birthYear ? 'bg-muted' : ''}`} placeholder="مثال: 1990" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">الجنس</Label>
                                <Select name="gender" required defaultValue={gender ?? undefined}>
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="اختر الجنس" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ذكر">ذكر</SelectItem>
                                        <SelectItem value="انثى">انثى</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="education">التحصيل الدراسي</Label>
                                <Select name="education" required>
                                    <SelectTrigger id="education">
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
                                <Label htmlFor="referrerName">أضيف بواسطة (مدخل البيانات)</Label>
                                {loadingReferrers ? <Skeleton className="h-10 w-full" /> : 
                                    isAdmin ? (
                                        <Select name="referrerName" required>
                                            <SelectTrigger id="referrerName">
                                                <SelectValue placeholder="اختر اسم مدخل البيانات" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {referrers.map(r => (
                                                    <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input name="referrerName" value={referrerNameParam ?? ''} readOnly className="bg-muted" />
                                    )
                                }
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationCenter">اسم مركز التسجيل</Label>
                                <Input id="registrationCenter" name="registrationCenter" required className="text-right" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pollingCenter">اسم مركز الاقتراع</Label>
                                <Input id="pollingCenter" name="pollingCenter" required className="text-right" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="pollingCenterNumber">رقم مركز الاقتراع (6 أرقام)</Label>
                                <Input id="pollingCenterNumber" name="pollingCenterNumber" required className="text-right" maxLength={6} />
                            </div>
                        </div>
                         <CardFooter className="flex-col gap-4 pt-6 mt-4 p-0">
                            <SubmitButton />
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
       </main>
    </div>
  );
}
