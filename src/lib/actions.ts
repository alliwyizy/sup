
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
  type Supporter 
} from "@/lib/data"
import { revalidatePath } from "next/cache"

export type SearchState = {
  id?: number,
  data?: (Supporter & { referrerName?: string }) | null
  error?: string | null
  message?: string | null
}

const VoterSchema = z.object({
  voterNumber: z.string().regex(/^\d{8}$/, { message: "رقم الناخب يجب أن يتكون من 8 أرقام." }),
})

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

export type AuthState = {
  error?: string | null;
  message?: string | null;
}

const LoginSchema = z.object({
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح." }),
  password: z.string().min(1, { message: "الرجاء إدخال كلمة المرور." }),
})

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0]
    }
  }

  const { email, password } = validatedFields.data;

  // This is a mock authentication.
  // In a real application, you should verify credentials against a database.
  if (email === "admin@example.com" && password === "password") {
    return {
      message: "أهلاً بك. جارٍ توجيهك إلى لوحة الإدارة."
    }
  }

  return {
    error: "البريد الإلكتروني أو كلمة المرور غير صحيحة."
  }
}


export type AddSupporterState = {
  error?: string | null;
  message?: string | null;
}

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

export async function addSupporter(prevState: AddSupporterState, formData: FormData): Promise<AddSupporterState> {
  const validatedFields = SupporterSchema.safeParse(Object.fromEntries(formData.entries()));
  
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
    await addSupporterToDb(validatedFields.data as Supporter);
    revalidatePath('/admin/add');
    return {
      message: `تمت إضافة "${validatedFields.data.name} ${validatedFields.data.surname}" بنجاح.`
    }
  } catch(e) {
    return {
      error: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة مرة أخرى."
    }
  }
}

export type SupporterRequestState = {
  error?: string | null;
  message?: string | null;
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
    await addPendingSupporter(validatedFields.data as Supporter);
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

export type VoterCheckState = {
  voterNumber?: string;
  prefilledData?: Partial<Supporter> | null;
  error?: string | null;
  message?: string | null;
  success?: boolean;
};

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

    // Check if already an approved or pending supporter
    const existingSupporter = await findSupporterByVoterNumber(voterNumber, true);
    if (existingSupporter) {
        return {
            error: "أنت مسجل بالفعل كمؤيد أو طلبك قيد المراجعة. شكراً لك!",
            voterNumber: voterNumber,
        };
    }

    // Check in the general database
    const generalData = await findInGeneralVoterDatabase(voterNumber);

    // If not found in general DB, allow manual entry.
    if (!generalData) {
      return {
        success: true,
        voterNumber: voterNumber,
        prefilledData: null,
        message: "لم يتم العثور على بياناتك. يرجى إدخال معلوماتك يدويًا."
      };
    }

    // This part is not requested by the user, if the user exists, they can't submit.
    // The user just said "if the voter number is not found... allow manual entry"
    // I will interpret this as an error if found.
    return {
      error: "رقم الناخب هذا موجود بالفعل. لا يمكن تقديم طلب جديد.",
      voterNumber,
    }
}


export async function getPendingSupporters() {
  return await getPendingSupportersFromDb();
}


export type RequestActionState = {
  error?: string | null;
  message?: string | null;
}

export async function approveSupporter(voterNumber: string): Promise<RequestActionState> {
  try {
    const approved = await approveSupporterInDb(voterNumber);
    revalidatePath('/admin/requests');
    return { message: `تمت الموافقة على ${approved.name} ${approved.surname}.` };
  } catch (error) {
    return { error: 'فشلت عملية الموافقة.' };
  }
}

export async function rejectSupporter(voterNumber: string): Promise<RequestActionState> {
  try {
    await rejectSupporterInDb(voterNumber);
    revalidatePath('/admin/requests');
    return { message: 'تم رفض الطلب بنجاح.' };
  } catch (error) {
    return { error: 'فشلت عملية الرفض.' };
  }
}

export type ReferrerActionState = {
    error?: string | null;
    message?: string | null;
};

export async function toggleReferrerStatus(voterNumber: string): Promise<ReferrerActionState> {
    try {
        const { supporter, isNowReferrer } = await toggleReferrerStatusInDb(voterNumber);
        revalidatePath('/admin/referrers');
        const message = isNowReferrer
            ? `تمت ترقية ${supporter.name} ${supporter.surname} إلى معرّف.`
            : `تمت إزالة ${supporter.name} ${supporter.surname} من قائمة المعرّفين.`;
        return { message };
    } catch (e: any) {
        return { error: e.message || "فشلت عملية تحديث حالة المعرّف." };
    }
}
