
'use server';
/**
 * @fileOverview An AI flow for analyzing supporter data.
 *
 * - analyzeSupportersData - A function that handles the analysis of supporter data.
 * - SupportersAnalysisInput - The input type for the analyzeSupportersData function.
 */

import { ai } from '@/ai/genkit';
import type { Supporter } from '@/lib/data';
import { z } from 'genkit';

// We define a simpler schema for the AI, as it doesn't need all the component-specific types.
const SupporterSchemaForAI = z.object({
    voterNumber: z.string(),
    fullName: z.string(),
    surname: z.string(),
    birthYear: z.number(),
    age: z.number(),
    gender: z.enum(['ذكر', 'انثى']),
    phoneNumber: z.string(),
    education: z.string(),
    registrationCenter: z.string(),
    pollingCenter: z.string(),
    pollingCenterNumber: z.string(),
    referrerName: z.string(),
});


const SupportersAnalysisInputSchema = z.object({
  question: z.string().describe('The user\'s question about the supporters data.'),
  supporters: z.array(SupporterSchemaForAI).describe('A JSON array of supporter data.'),
});
export type SupportersAnalysisInput = z.infer<typeof SupportersAnalysisInputSchema>;


export async function analyzeSupportersData(input: SupportersAnalysisInput): Promise<string> {
  const analysis = await analyzeSupportersFlow(input);
  return analysis;
}

const prompt = ai.definePrompt({
  name: 'analyzeSupportersPrompt',
  input: { schema: SupportersAnalysisInputSchema },
  // We remove the output schema here to handle potential nulls in the flow.
  prompt: `أنت مساعد تحليلي وخبير في تحليل البيانات. مهمتك هي الإجابة على سؤال المستخدم بناءً على بيانات المؤيدين المقدمة لك بصيغة JSON.

  سؤال المستخدم: {{{question}}}

  بيانات المؤيدين:
  {{{json supporters}}}

  الرجاء تقديم إجابة واضحة وموجزة ومباشرة باللغة العربية. قم بتحليلك بناءً على البيانات المقدمة فقط.
  لا تقم باختلاق أي معلومات غير موجودة في البيانات.
  `,
});

const analyzeSupportersFlow = ai.defineFlow(
  {
    name: 'analyzeSupportersFlow',
    inputSchema: SupportersAnalysisInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    // Ensure we always return a string, even if the model returns null.
    return output ?? "لم أتمكن من تحليل البيانات أو العثور على إجابة.";
  }
);
