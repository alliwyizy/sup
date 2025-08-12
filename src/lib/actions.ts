"use server"

import { z } from "zod"
import { findSupporterByVoterNumber, addSupporter as addSupporterToDb, type Supporter } from "@/lib/data"
import { redirect } from "next/navigation"

export type SearchState = {
  id?: number,
  data?: Supporter | null
  error?: string | null
  message?: string | null
}

const VoterSchema = z.object({
  voterNumber: z.string().min(1, { message: "الرجاء إدخال رقم الناخب." }),
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
  name: z.string().min(1, { message: "الاسم مطلوب." }),
  surname: z.string().min(1, { message: "اللقب مطلوب." }),
  age: z.coerce.number().min(18, { message: "يجب أن يكون العمر 18 عامًا على الأقل." }),
  voterNumber: z.string().min(1, { message: "رقم الناخب مطلوب." }),
  phoneNumber: z.string().min(1, { message: "رقم الهاتف مطلوب." }),
  pollingCenter: z.string().min(1, { message: "مركز الاقتراع مطلوب." }),
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
    await addSupporterToDb(validatedFields.data);
    return {
      message: `تمت إضافة "${validatedFields.data.name} ${validatedFields.data.surname}" بنجاح.`
    }
  } catch(e) {
    return {
      error: "حدث خطأ غير متوقع في الخادم. يرجى المحاولة مرة أخرى."
    }
  }
}