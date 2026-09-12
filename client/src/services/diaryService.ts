import { api } from './api';
import { JournalCategory, JournalPage } from '../types';

export const diaryService = {
  async getCategories(): Promise<JournalCategory[]> {
    const res = await api.get<{ categories: JournalCategory[] }>('/categories');
    return res.categories;
  },

  async createCategory(category: Omit<JournalCategory, 'id' | 'createdAt' | 'updatedAt' | 'pages'>): Promise<JournalCategory> {
    const res = await api.post<{ category: JournalCategory }>('/categories', category);
    return res.category;
  },

  async updateCategory(id: string, updates: Partial<JournalCategory>): Promise<JournalCategory> {
    const res = await api.put<{ category: JournalCategory }>(`/categories/${id}`, updates);
    return res.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  async savePage(categoryId: string, page: JournalPage): Promise<JournalPage> {
    const res = await api.post<{ page: JournalPage }>(`/categories/${categoryId}/pages`, page);
    return res.page;
  },

  async deletePage(categoryId: string, pageId: string): Promise<void> {
    await api.delete(`/categories/${categoryId}/pages/${pageId}`);
  },
};
