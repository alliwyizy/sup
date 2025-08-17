
"use server"

import { z } from "zod"
import { 
  findSupporterByVoterNumber, 
  addSupporter as addSupporterToDb, 
  updateSupporter as updateSupporterInDb,
  deleteSupporter as deleteSupporterInDb,
  type Supporter 
} from "@/lib/data"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || validatedFields.error.flatten().fieldErrors.password?.[0]
    }
  }

  const { email, password } = validatedFields.data;

  // This is a mock authentication.
  if (email === "admin@example.com" && password === "password") {
    return {
        message: "تم تسجيل الدخول بنجاح. جارٍ توجيهك..."
    }
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
  } catch (e: any) {
    return { error: e.message || "فشل تحديث بيانات المؤيد." };
  }
}

export async function deleteSupporter(voterNumber: string): Promise<FormState> {
    try {
        await deleteSupporterInDb(voterNumber);
        revalidatePath('/admin/dashboard');
        return { message: "تم حذف المؤيد بنجاح." };
    } catch(e: any) {
        return { error: e.message || "فشلت عملية الحذف." };
    }
}
