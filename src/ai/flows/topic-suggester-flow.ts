'use server';
/**
 * @fileOverview A simple flow to generate a paragraph about a topic.
 *
 * - suggestTopic - A function that handles the topic suggestion process.
 * - SuggestTopicInput - The input type for the suggestTopic function.
 * - SuggestTopicOutput - The return type for the suggestTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTopicInputSchema = z.object({
  topic: z.string().describe('The topic to generate a paragraph about.'),
});
export type SuggestTopicInput = z.infer<typeof SuggestTopicInputSchema>;

const SuggestTopicOutputSchema = z.object({
  suggestion: z.string().describe('The generated paragraph about the topic.'),
});
export type SuggestTopicOutput = z.infer<typeof SuggestTopicOutputSchema>;

export async function suggestTopic(input: SuggestTopicInput): Promise<SuggestTopicOutput> {
  return suggestTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTopicPrompt',
  input: {schema: SuggestTopicInputSchema},
  output: {schema: SuggestTopicOutputSchema},
  prompt: `You are a helpful assistant. Write a short, engaging paragraph about the following topic: {{{topic}}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const suggestTopicFlow = ai.defineFlow(
  {
    name: 'suggestTopicFlow',
    inputSchema: SuggestTopicInputSchema,
    outputSchema: SuggestTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
