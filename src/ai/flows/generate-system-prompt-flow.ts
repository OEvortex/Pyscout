
'use server';
/**
 * @fileOverview An AI agent to help generate system prompts.
 *
 * - generateSystemPrompt - A function that generates a system prompt based on a user's idea.
 * - GenerateSystemPromptInput - The input type for the generateSystemPrompt function.
 * - GenerateSystemPromptOutput - The return type for the generateSystemPrompt function.
 */

import {z} from 'zod';

const API_BASE_URL = 'https://ws.typegpt.net/v1';
const MODEL_FOR_SYSTEM_PROMPT_GENERATION = 'AI4Chat/default'; // Or another suitable high-quality model

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

const SYSTEM_MESSAGE_FOR_GENERATOR = `You are an expert at crafting effective system prompts for AI language models.
Your task is to generate a concise, clear, and effective system prompt based on a user's idea.
The generated system prompt should:
- Clearly define the assistant's persona, role, or expertise.
- Provide general instructions on tone and style, if applicable.
- Outline key tasks or areas of knowledge, if appropriate.
- Be encouraging and set a positive framing for the AI.
- Be suitable to be directly used as a system message for another LLM.
Do not add any conversational fluff, explanations, or markdown formatting like \`\`\` around the prompt. Just output the system prompt itself as plain text.`;

export async function generateSystemPrompt(input: GenerateSystemPromptInput): Promise<GenerateSystemPromptOutput> {
  // Validate input using Zod schema
  const validationResult = GenerateSystemPromptInputSchema.safeParse(input);
  if (!validationResult.success) {
    const  errors = validationResult.error.errors.map(e => e.message).join(', ');
    throw new Error(`Invalid input: ${errors}`);
  }

  const { idea } = validationResult.data;

  const messagesForApi = [
    { role: 'system', content: SYSTEM_MESSAGE_FOR_GENERATOR },
    { role: 'user', content: `User's idea for the AI assistant: "${idea}"` }
  ];

  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_FOR_SYSTEM_PROMPT_GENERATION,
        messages: messagesForApi,
        temperature: 0.7,
        max_tokens: 300, // System prompts can be longer
        stream: false, // One-shot generation
      }),
    });

    if (!response.ok) {
      let apiErrorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        const messageFromServer = errorData.error?.message ||
                                  errorData.detail ||
                                  errorData.error ||
                                  errorData.message;

        if (typeof messageFromServer === 'string') {
          apiErrorMessage = messageFromServer;
        } else if (messageFromServer && typeof messageFromServer === 'object') {
          apiErrorMessage = JSON.stringify(messageFromServer);
        } else if (typeof errorData === 'string') {
          apiErrorMessage = errorData;
        }
      } catch (e) {
        // Failed to parse error JSON, stick with status
      }
      throw new Error(apiErrorMessage);
    }

    const responseData = await response.json();
    const generatedContent = responseData.choices?.[0]?.message?.content;

    if (!generatedContent || typeof generatedContent !== 'string') {
      throw new Error('Failed to generate system prompt. The AI did not return valid content.');
    }

    // Ensure the output matches the schema
    const outputValidation = GenerateSystemPromptOutputSchema.safeParse({ systemPrompt: generatedContent.trim() });
    if (!outputValidation.success) {
        throw new Error('AI returned an invalid output format for the system prompt.');
    }

    return outputValidation.data;

  } catch (error) {
    console.error('Error in generateSystemPrompt:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during system prompt generation.';
    // Re-throw or handle as appropriate for the calling context
    // For instance, the settings page might catch this and show a toast
    throw new Error(errorMessage);
  }
}
