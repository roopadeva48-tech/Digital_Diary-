import { Response } from 'express';
import { AuthRequest, JournalCategory } from '../types/index.js';
import { store } from '../models/store.js';

export const categoryController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }
    const categories = store.getCategories(userId);
    res.json({ categories });
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { id } = req.params;
    const category = store.getCategoryById(id);

    if (!category || category.userId !== userId) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    res.json({ category });
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const { title, description, coverColor, coverEmoji, coverImage, isFavorite } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const newCategory: JournalCategory = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      title,
      description: description || '',
      coverColor: coverColor || 'bg-amber-100',
      coverEmoji: coverEmoji || '📔',
      coverImage,
      isFavorite: Boolean(isFavorite),
      pages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.saveCategory(newCategory);
    res.status(201).json({ category: newCategory });
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { id } = req.params;
    const existing = store.getCategoryById(id);

    if (!existing || existing.userId !== userId) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    const updated: JournalCategory = {
      ...existing,
      ...req.body,
      id: existing.id,
      userId: existing.userId,
      updatedAt: new Date().toISOString(),
    };

    store.saveCategory(updated);
    res.json({ category: updated });
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { id } = req.params;
    const existing = store.getCategoryById(id);

    if (!existing || existing.userId !== userId) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    const deleted = store.deleteCategory(id);
    if (!deleted) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    res.status(204).send();
  },
};
