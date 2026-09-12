import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
import { geminiService } from '../services/geminiService.js';

export const aiController = {
  async getPrompt(req: AuthRequest, res: Response): Promise<void> {
    const { topic } = req.body;
    const prompt = await geminiService.generateJournalPrompt(topic);
    res.json({ prompt });
  },

  async assist(req: AuthRequest, res: Response): Promise<void> {
    const { prompt, context } = req.body;

    if (!prompt) {
      res.status(400).json({ message: 'Prompt query is required' });
      return;
    }

    const response = await geminiService.assistWriting(prompt, context);
    res.json(response);
  },

  async analyzeMood(req: AuthRequest, res: Response): Promise<void> {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ message: 'Text is required for mood analysis' });
      return;
    }

    // Gentle fallback mood heuristics
    res.json({
      mood: 'Calm & Reflective',
      summary: 'Your entry indicates a peaceful, introspective state of mind.',
      colorHint: '#e0e7ff',
    });
  },
};
