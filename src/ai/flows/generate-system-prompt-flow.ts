'use server';
/**
 * @fileOverview An AI agent to help generate system prompts.
 *
 * - generateSystemPrompt - A function that generates a system prompt based on a user's idea.
 * - GenerateSystemPromptInput - The input type for the generateSystemPrompt function.
 * - GenerateSystemPromptOutput - The return type for the generateSystemPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSystemPromptInputSchema = z.object({
  idea: z
    .string()
    .min(3, {message: 'Idea must be at least 3 characters long.'})
    .describe('A short description or idea for the AI assistant\'s persona or purpose.'),
});
export type GenerateSystemPromptInput = z.infer<typeof GenerateSystemPromptInputSchema>;

const GenerateSystemPromptOutputSchema = z.object({
  systemPrompt: z.string().describe('A well-crafted system prompt based on the user\'s idea.'),
});
export type GenerateSystemPromptOutput = z.infer<typeof GenerateSystemPromptOutputSchema>;

export async function generateSystemPrompt(input: GenerateSystemPromptInput): Promise<GenerateSystemPromptOutput> {
  return generateSystemPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSystemPromptPrompt',
  input: {schema: GenerateSystemPromptInputSchema},
  output: {schema: GenerateSystemPromptOutputSchema},
  prompt: `You are an expert at crafting effective system prompts for AI language models.
The user wants to create an AI assistant with the following characteristics or purpose:
"{{{idea}}}"

Based on this idea, generate a concise, clear, and effective system prompt that can be used to guide the AI assistant's behavior and responses. The system prompt should:
- Clearly define the assistant's persona, role, or expertise.
- Provide general instructions on tone and style, if applicable.
- Outline key tasks or areas of knowledge, if appropriate.
- Be encouraging and set a positive framing for the AI.
- The prompt should be suitable to be directly used as a system message for another LLM.

Generated System Prompt:
`,
});

const generateSystemPromptFlow = ai.defineFlow(
  {
    name: 'generateSystemPromptFlow',
    inputSchema: GenerateSystemPromptInputSchema,
    outputSchema: GenerateSystemPromptOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate system prompt. The AI did not return a valid output.');
    }
    return output;
  }
);
