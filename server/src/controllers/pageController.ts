import { Response } from 'express';
import { AuthRequest, JournalPage } from '../types/index.js';
import { store } from '../models/store.js';

export const pageController = {
  async savePage(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const { categoryId } = req.params;
    const pageData: JournalPage = req.body;

    if (!pageData.id || !pageData.title) {
      res.status(400).json({ message: 'Page id and title are required.' });
      return;
    }

    const category = store.getCategoryById(categoryId);
    if (!category || category.userId !== userId) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    const saved = store.savePage(categoryId, {
      ...pageData,
      updatedAt: new Date().toISOString(),
    });

    if (!saved) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    res.json({ page: saved });
  },

  async deletePage(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const { categoryId, pageId } = req.params;
    const category = store.getCategoryById(categoryId);
    if (!category || category.userId !== userId) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    const success = store.deletePage(categoryId, pageId);
    if (!success) {
      res.status(404).json({ message: 'Category or page not found.' });
      return;
    }

    res.status(204).send();
  },
};
