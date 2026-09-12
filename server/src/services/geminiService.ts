import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';

let aiClient: GoogleGenAI | null = null;

if (config.geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with provided key:', err);
  }
}

export const geminiService = {
  async generateJournalPrompt(topic?: string): Promise<string> {
    if (!aiClient) {
      return topic
        ? `Reflect on: What gave you energy or inspired you regarding "${topic}" recently?`
        : 'Reflect on: What is one small moment from today that you want to remember five years from now?';
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a single thoughtful, creative, and gentle journaling prompt for a personal digital diary${
          topic ? ` on the topic of "${topic}"` : ''
        }. Return ONLY the prompt text, no quotes.`,
      });

      return response.text?.trim() || 'Write about a thought that has been lingering in your mind today.';
    } catch (error) {
      console.error('Gemini API Prompt Error:', error);
      return 'What made you smile or pause for thought today?';
    }
  },

  async assistWriting(prompt: string, context?: string): Promise<{ result: string }> {
    if (!aiClient) {
      return {
        result: `Here is a creative continuation for your diary:\n\n"${prompt}" reminds us to embrace the journey, take deep breaths, and cherish the unfolding moment.`,
      };
    }

    try {
      const promptText = `You are an empathetic, poetic, and supportive creative writing assistant for a personal digital diary.
User request: ${prompt}
${context ? `Current diary entry context: ${context}` : ''}
Provide thoughtful, inspiring text to add to their diary page.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
      });

      return { result: response.text?.trim() || '' };
    } catch (error) {
      console.error('Gemini AI Assistance Error:', error);
      return { result: 'Unable to contact AI assistant at the moment. Keep journaling your true thoughts!' };
    }
  },
};
