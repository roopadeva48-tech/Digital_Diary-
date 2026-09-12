import { api } from './api';

export interface AiPromptRequest {
  prompt: string;
  context?: string;
  type?: 'reflect' | 'continue' | 'rephrase' | 'mood_analysis' | 'sticker_suggestion';
}

export interface AiPromptResponse {
  result: string;
  suggestions?: string[];
}

export const aiService = {
  async generateJournalPrompt(topic?: string): Promise<string> {
    const res = await api.post<{ prompt: string }>('/ai/prompt', { topic });
    return res.prompt;
  },

  async assistWriting(data: AiPromptRequest): Promise<AiPromptResponse> {
    return api.post<AiPromptResponse>('/ai/assist', data);
  },

  async analyzeMood(entryText: string): Promise<{ mood: string; summary: string; colorHint: string }> {
    return api.post('/ai/mood', { text: entryText });
  },
};
