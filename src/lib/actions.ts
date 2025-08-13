
"use server"

import { z } from "zod"
import { 
  findSupporterByVoterNumber, 
  addSupporter as addSupporterToDb, 
  addPendingSupporter,
  getPendingSupporters as getPendingSupportersFromDb,
  approveSupporter as approveSupporterInDb,
  rejectSupporter as rejectSupporterInDb,
  findInGeneralVoterDatabase,
  toggleReferrerStatus as toggleReferrerStatusInDb,
  updateSupporter as updateSupporterInDb,
  deleteSupporter as deleteSupporterInDb,
  type Supporter 
} from "@/lib/data"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// #region Schemas
const SupporterSchema = z.object({
    voterNumber: z.string().regex(/^\d{8}$/, { message: "رقم الناخب يجب أن يتكون من 8 أرقام." }),
    name: z.string().min(1, { message: "الاسم مطلوب." }),
    surname: z.string().min(1, { message: "اللقب مطلوب." }),
    age: z.coerce.number().min(18, { message: "يجب أن يكون العمر 18 عامًا على الأقل." }),
    gender: z.enum(["ذكر", "انثى"], { errorMap: () => ({ message: "الرجاء اختيار الجنس." }) }),
    phoneNumber: z.string().min(1, { message: "رقم الهاتف مطلوب." }),
    educationalAttainment: z.enum(["امي", "يقرأ ويكتب", "ابتدائية", "متوسطة", "اعدادية", "طالب جامعة", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراة"], { errorMap: () => ({ message: "الرجاء اختيار التحصيل الدراسي." }) }),
    registrationCenter: z.string().min(1, { message: "مركز التسجيل مطلوب." }),
    pollingCenter: z.string().min(1, { message: "مركز الاقتراع مطلوب." }),
    referrerId: z.string().optional(),
});

const VoterSchema = z.object({
  voterNumber: z.string().regex(/^\d{8}$/, { message: "رقم الناخب يجب أن يتكون من 8 أرقام." }),
})

const LoginSchema = z.object({
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح." }),
  password: z.string().min(1, { message: "الرجاء إدخال كلمة المرور." }),
})
// #endregion

// #region State Types
export type SearchState = {
  id?: number,
  data?: (Supporter & { referrerName?: string }) | null
  error?: string | null
  message?: string | null
}

export type AuthState = {
  error?: string | null;
  message?: string | null;
}

export type FormState = {
  error?: string | null;
  message?: string | null;
}

export type SupporterRequestState = {
  error?: string | null;
  message?: string | null;
}

export type VoterCheckState = {
  voterNumber?: string;
  prefilledData?: Partial<Supporter> | null;
  error?: string | null;
  message?: string | null;
  success?: boolean;
};

export type RequestActionState = {
  error?: string | null;
  message?: string | null;
}

export type ReferrerActionState = {
    error?: string | null;
    message?: string | null;
};
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
      data: null,
    }
  }
  
  try {
    const supporter = await findSupporterByVoterNumber(validatedFields.data.voterNumber)

    if (supporter) {
      return {
        id: submissionId,
        message: "تم العثور على البيانات بنجاح. شكراً لدعمكم!",
        data: supporter,
        error: null,
      }
    } else {
      return {
        id: submissionId,
        error: "تعذر وجود الاسم ضمن قاعدة بيانات مؤيدي الاستاذ عبدالرحمن اللويزي.",
        data: null,
      }
    }
  } catch (e) {
    return {
      id: submissionId,
      error: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة مرة أخرى.",
      data: null,
    }
  }
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0]
    }
  }

  const { email, password } = validatedFields.data;

  // This is a mock authentication.
  if (email === "admin@example.com" && password === "password") {
    // Redirect in server action
    redirect('/admin/stats');
  }

  return {
    error: "البريد الإلكتروني أو كلمة المرور غير صحيحة."
  }
}

export async function addSupporter(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SupporterSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return {
      error: firstError || "يرجى التحقق من الحقول."
    }
  }
  
  try {
    const existingSupporter = await findSupporterByVoterNumber(validatedFields.data.voterNumber, true);
    if(existingSupporter) {
      return {
        error: "هذا المؤيد موجود بالفعل في قاعدة البيانات."
      }
    }
    // Casting because the schema is validated. We handle the optional referrerId.
    const supporterData = {
        ...validatedFields.data,
        referrerId: validatedFields.data.referrerId === 'none' ? undefined : validatedFields.data.referrerId,
    } as Supporter

    await addSupporterToDb(supporterData);
    revalidatePath('/admin/add');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/stats');
    return {
      message: `تمت إضافة "${validatedFields.data.name} ${validatedFields.data.surname}" بنجاح.`
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
    const supporterData = {
        ...validatedFields.data,
        referrerId: validatedFields.data.referrerId === 'none' ? undefined : validatedFields.data.referrerId,
    }
    await updateSupporterInDb(supporterData as Supporter);
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/stats');
    return { message: `تم تحديث بيانات "${validatedFields.data.name} ${validatedFields.data.surname}" بنجاح.` };
  } catch (e: any) {
    return { error: e.message || "فشل تحديث بيانات المؤيد." };
  }
}

export async function deleteSupporter(voterNumber: string): Promise<FormState> {
    try {
        await deleteSupporterInDb(voterNumber);
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/stats');
        return { message: "تم حذف المؤيد بنجاح." };
    } catch(e: any) {
        return { error: e.message || "فشلت عملية الحذف." };
    }
}


export async function submitSupporterRequest(prevState: SupporterRequestState, formData: FormData): Promise<SupporterRequestState> {
  const validatedFields = SupporterSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors)[0]?.[0];
    return {
      error: firstError || "يرجى التحقق من الحقول."
    }
  }
  
  try {
    const supporterData = {
        ...validatedFields.data,
        referrerId: validatedFields.data.referrerId === 'none' ? undefined : validatedFields.data.referrerId,
    } as Supporter
    await addPendingSupporter(supporterData);
    revalidatePath('/admin/requests');
    revalidatePath('/admin/stats');
    return {
      message: `شكراً لك، ${validatedFields.data.name}. لقد تم إرسال طلبك بنجاح للمراجعة.`
    }
  } catch(e: any) {
    if (e.message.includes("already exists")) {
       return {
        error: "أنت مسجل بالفعل كمؤيد أو طلبك قيد المراجعة. شكراً لك!"
      }
    }
    return {
      error: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة مرة أخرى."
    }
  }
}

export async function checkVoter(
  prevState: VoterCheckState,
  formData: FormData
): Promise<VoterCheckState> {
    const validatedFields = VoterSchema.safeParse({
        voterNumber: formData.get("voterNumber"),
    });

    if (!validatedFields.success) {
        return {
        error: validatedFields.error.flatten().fieldErrors.voterNumber?.[0],
        };
    }

    const { voterNumber } = validatedFields.data;

    const existingSupporter = await findSupporterByVoterNumber(voterNumber, true);
    if (existingSupporter) {
        return {
            error: "أنت مسجل بالفعل كمؤيد أو طلبك قيد المراجعة. شكراً لك!",
            voterNumber: voterNumber,
        };
    }

    const generalData = await findInGeneralVoterDatabase(voterNumber);

    return {
      success: true,
      voterNumber: voterNumber,
      prefilledData: generalData || null,
      message: generalData 
        ? "تم العثور على بياناتك. يرجى إكمال المعلومات المتبقية."
        : "لم يتم العثور على بياناتك. يرجى إدخال معلوماتك يدويًا."
    };
}


export async function getPendingSupporters() {
  return await getPendingSupportersFromDb();
}


export async function approveSupporter(voterNumber: string): Promise<RequestActionState> {
  try {
    const approved = await approveSupporterInDb(voterNumber);
    revalidatePath('/admin/requests');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/stats');
    return { message: `تمت الموافقة على ${approved.name} ${approved.surname}.` };
  } catch (error) {
    return { error: 'فشلت عملية الموافقة.' };
  }
}

export async function rejectSupporter(voterNumber: string): Promise<RequestActionState> {
  try {
    await rejectSupporterInDb(voterNumber);
    revalidatePath('/admin/requests');
    revalidatePath('/admin/stats');
    return { message: 'تم رفض الطلب بنجاح.' };
  } catch (error) {
    return { error: 'فشلت عملية الرفض.' };
  }
}

export async function toggleReferrerStatus(voterNumber: string): Promise<ReferrerActionState> {
    try {
        const { supporter, isNowReferrer } = await toggleReferrerStatusInDb(voterNumber);
        revalidatePath('/admin/referrers');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/stats');
        const message = isNowReferrer
            ? `تمت ترقية ${supporter.name} ${supporter.surname} إلى معرّف.`
            : `تمت إزالة ${supporter.name} ${supporter.surname} من قائمة المعرّفين.`;
        return { message };
    } catch (e: any) {
        return { error: e.message || "فشلت عملية تحديث حالة المعرّف." };
    }
}
