

"use server"

import { z } from "zod"
import { 
  findSupporterByVoterNumber, 
  addSupporter as addSupporterToDb, 
  updateSupporter as updateSupporterInDb,
  deleteSupporter as deleteSupporterInDb,
  addJoinRequest,
  getJoinRequest,
  deleteJoinRequest,
  findJoinRequestByVoterNumber,
  addReferrer as addReferrerToDb,
  deleteReferrer as deleteReferrerInDb,
  findReferrerByName,
  findVoterInMainDb,
  type AuditStatus,
} from "@/lib/data"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation";

// #region Schemas
const SupporterSchema = z.object({
    voterNumber: z.string().regex(/^\d{8}$/, { message: "رقم الناخب يجب أن يتكون من 8 أرقام." }),
    fullName: z.string().trim().min(1, { message: "الاسم الكامل مطلوب." }).refine(name => name.split(' ').filter(Boolean).length >= 3, { message: "الاسم الكامل يجب أن يتكون من ثلاث كلمات على الأقل." }),
    surname: z.string().trim().min(1, { message: "اللقب مطلوب." }).refine(surname => surname.split(' ').filter(Boolean).length <= 2, { message: "اللقب يجب أن يتكون من كلمة أو كلمتين كحد أقصى." }),
    birthYear: z.coerce.number().min(1900, { message: "سنة الميلاد يجب أن تكون بعد 1900." }).max(new Date().getFullYear() - 18, { message: "يجب أن يكون عمر المؤيد 18 عامًا على الأقل." }),
    gender: z.enum(['ذكر', 'انثى'], { message: "الجنس مطلوب." }),
    phoneNumber: z.string().regex(/^\d{11}$/, { message: "رقم الهاتف يجب أن يتكون من 11 رقمًا." }),
    education: z.enum(['امي', 'يقرا ويكتب', 'ابتدائية', 'متوسطة', 'اعدادية', 'طالب جامعة', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراة'], { message: "التحصيل الدراسي مطلوب." }),
    registrationCenter: z.string().min(1, { message: "اسم مركز التسجيل مطلوب." }),
    pollingCenter: z.string().min(1, { message: "اسم مركز الاقتراع مطلوب." }),
    pollingCenterNumber: z.string().regex(/^\d{6}$/, { message: "رقم مركز الاقتراع يجب أن يتكون من 6 أرقام." }),
    referrerName: z.string().min(1, { message: "يجب اختيار مدخل البيانات." }),
    auditStatus: z.enum(['لم يتم التدقيق', 'تم التدقيق', 'مشكلة في التدقيق']),
});

const ReferrerSchema = z.object({
  name: z.string().trim().min(3, { message: "اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل." }),
});

const VoterSchema = z.object({
  voterNumber: z.string().regex(/^\d{8}$/, { message: "رقم الناخب يجب أن يتكون من 8 أرقام." }),
})

const LoginSchema = z.object({
  username: z.string().min(1, { message: "الرجاء إدخال اسم المستخدم أو البريد الإلكتروني." }),
  password: z.string().min(1, { message: "الرجاء إدخال كلمة المرور." }),
})
// #endregion

// #region State Types
export type SearchState = {
  id?: number,
  data?: {
    voterNumber: string,
    fullName: string,
    surname: string,
    age: number,
    phoneNumber: string,
    pollingCenter: string,
  } | null
  error?: string | null
  message?: string | null
}

export type AuthState = {
  error?: string | null;
  message?: string | null;
  role?: 'admin' | 'referrer' | null;
  userName?: string | null;
}

export type FormState = {
  error?: string | null;
  message?: string | null;
}
// #endregion


export async function searchByVoterNumber(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const validatedFields = VoterSchema.safeParse({
    voterNumber: formData.get("voterNumber"),
  })

  const submissionId = Date.now();

  if (!validatedFields.success) {
    return {
      id: submissionId,
      error: validatedFields.error.flatten().fieldErrors.voterNumber?.[0],
    }
  }
  
  try {
    const supporter = await findSupporterByVoterNumber(validatedFields.data.voterNumber)

    if (supporter) {
      return {
        id: submissionId,
        message: "شكراً لدعمكم! بياناتكم مسجلة لدينا في قاعدة بيانات مؤيدي الأستاذ عبدالرحمن اللويزي.",
        data: {
          voterNumber: supporter.voterNumber,
          fullName: supporter.fullName,
          surname: supporter.surname,
          age: supporter.age,
          phoneNumber: supporter.phoneNumber,
          pollingCenter: supporter.pollingCenter,
        },
      }
    } else {
      return {
        id: submissionId,
        error: "تعذر وجود الاسم ضمن قاعدة بيانات مؤيدي الأستاذ عبدالرحمن اللويزي.",
      }
    }
  } catch (e) {
    return {
      id: submissionId,
      error: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة مرة أخرى.",
    }
  }
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.username?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0]
    }
  }

  const { username, password } = validatedFields.data;

  // Case 1: Admin login (email)
  if ((username === "admin@example.com" || username.toLowerCase() === "admin") && password === "password") {
     return {
        message: "تم تسجيل الدخول بنجاح. جارٍ توجيهك...",
        role: 'admin',
        userName: 'Admin'
    }
  }

  // Case 2: Referrer login (username)
  const referrer = await findReferrerByName(username);
  if (referrer && referrer.password === password) {
    return {
        message: "تم تسجيل الدخول بنجاح. جارٍ توجيهك...",
        role: 'referrer',
        userName: referrer.name
    }
  }

  return {
    error: "اسم المستخدم أو كلمة المرور غير صحيحة."
  }
}

export async function addSupporter(prevState: FormState, formData: FormData): Promise<FormState> {
  // We omit auditStatus because we want to set it programmatically
  const validatedFields = SupporterSchema.omit({ auditStatus: true }).safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return {
      error: firstError || "يرجى التحقق من الحقول."
    }
  }
  
  try {
    const existingSupporter = await findSupporterByVoterNumber(validatedFields.data.voterNumber);
    if(existingSupporter) {
      return {
        error: "هذا المؤيد موجود بالفعل في قاعدة البيانات."
      }
    }

    await addSupporterToDb(validatedFields.data);
    revalidatePath('/admin/dashboard');

    return {
      message: `تمت إضافة "${validatedFields.data.fullName} ${validatedFields.data.surname}" بنجاح.`
    }
  } catch(e) {
    return {
      error: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة مرة أخرى."
    }
  }
}

export async function updateSupporter(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SupporterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return { error: firstError || "يرجى التحقق من الحقول." };
  }

  try {
    await updateSupporterInDb(validatedFields.data);
    revalidatePath('/admin/dashboard');
    return { message: `تم تحديث بيانات "${validatedFields.data.fullName} ${validatedFields.data.surname}" بنجاح.` };
  } catch (e) {
    const error = e instanceof Error ? e.message : "فشل تحديث بيانات المؤيد.";
    return { error };
  }
}

export async function deleteSupporter(voterNumber: string): Promise<FormState> {
    try {
        await deleteSupporterInDb(voterNumber);
        revalidatePath('/admin/dashboard');
        return { message: "تم حذف المؤيد بنجاح." };
    } catch (e) {
        const error = e instanceof Error ? e.message : "فشلت عملية الحذف.";
        return { error };
    }
}


export async function submitJoinRequest(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SupporterSchema.omit({ referrerName: true, auditStatus: true }).safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return { error: firstError || "يرجى التحقق من الحقول." };
  }

  try {
    const existingSupporter = await findSupporterByVoterNumber(validatedFields.data.voterNumber);
    if (existingSupporter) {
      return { error: "أنت مسجل بالفعل كمؤيد في قاعدة البيانات." };
    }

    const existingRequest = await findJoinRequestByVoterNumber(validatedFields.data.voterNumber);
    if(existingRequest) {
      return { error: "لديك طلب انضمام معلق بالفعل. يرجى انتظار المراجعة." };
    }

    await addJoinRequest(validatedFields.data);
    return { message: "تم إرسال طلب الانضمام بنجاح. ستتم مراجعته من قبل المسؤول." };
  } catch (e) {
    const error = e instanceof Error ? e.message : "فشل إرسال طلب الانضمام.";
    return { error };
  }
}

export async function approveJoinRequest(voterNumber: string): Promise<FormState> {
  try {
    const request = await getJoinRequest(voterNumber);
    if (!request) {
      return { error: "لم يتم العثور على طلب الانضمام." };
    }
    
    // Admin is the referrer for approved requests
    const supporterData = { ...request, referrerName: 'Admin' };
    await addSupporterToDb(supporterData);
    await deleteJoinRequest(voterNumber);

    revalidatePath('/admin/requests');
    revalidatePath('/admin/dashboard');
    
    return { message: "تمت الموافقة على الطلب وإضافة المؤيد بنجاح." };
  } catch (e) {
    const error = e instanceof Error ? e.message : "فشلت عملية الموافقة.";
    return { error };
  }
}


export async function denyJoinRequest(voterNumber: string): Promise<FormState> {
  try {
    await deleteJoinRequest(voterNumber);
    revalidatePath('/admin/requests');
    return { message: "تم رفض الطلب وحذفه بنجاح." };
  } catch (e) {
    const error = e instanceof Error ? e.message : "فشلت عملية الرفض.";
    return { error };
  }
}

// Referrer Actions
export async function addReferrer(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ReferrerSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return { error: firstError || "يرجى التحقق من الحقول." };
  }

  try {
    await addReferrerToDb(validatedFields.data);
    revalidatePath('/admin/referrers');
    return { message: `تمت إضافة مدخل البيانات "${validatedFields.data.name}" بنجاح.` };
  } catch (e) {
    const error = e instanceof Error ? e.message : "فشل إضافة مدخل البيانات.";
    return { error };
  }
}

export async function deleteReferrer(id: string): Promise<FormState> {
  try {
    await deleteReferrerInDb(id);
    revalidatePath('/admin/referrers');
    return { message: "تم حذف مدخل البيانات بنجاح." };
  } catch (e) {
    const error = e instanceof Error ? e.message : "فشلت عملية حذف مدخل البيانات.";
    return { error };
  }
}

// New action to find voter in the main DB
export async function findVoter(formData: FormData) {
  const validatedFields = VoterSchema.safeParse({
    voterNumber: formData.get("voterNumber"),
  });
  const referrerName = formData.get("ref") as string | null;
  const source = formData.get("source") as 'admin' | 'public';


  if (!validatedFields.success) {
    const redirectUrl = source === 'admin' ? '/admin/find-voter?error=invalid' : '/find-voter?error=invalid';
    const finalUrl = referrerName ? `${redirectUrl}&ref=${referrerName}` : redirectUrl;
    return redirect(finalUrl);
  }

  const { voterNumber } = validatedFields.data;

  // Check if supporter already exists
  const existingSupporter = await findSupporterByVoterNumber(voterNumber);
  if (existingSupporter) {
      const redirectUrl = source === 'admin' ? `/admin/find-voter?error=exists` : `/find-voter?error=exists`;
      const finalUrl = referrerName ? `${redirectUrl}&ref=${referrerName}` : redirectUrl;
      return redirect(finalUrl);
  }


  const voter = await findVoterInMainDb(voterNumber);

  const params = new URLSearchParams();
  params.set('voterNumber', voterNumber);
  
  if(referrerName) {
      params.set('ref', referrerName);
  }

  if (voter) {
    params.set('fullName', voter.fullName);
    params.set('surname', voter.surname);
    params.set('birthYear', voter.birthYear.toString());
    params.set('gender', voter.gender);
  } else {
    params.set('notFound', 'true');
  }

  if (source === 'admin') {
      redirect(`/admin/add?${params.toString()}`);
  } else {
      redirect(`/join?${params.toString()}`);
  }
}

    