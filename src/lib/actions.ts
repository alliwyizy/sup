"use server"

import { z } from "zod"
import { findSupporterByVoterNumber, type Supporter } from "@/lib/data"

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
