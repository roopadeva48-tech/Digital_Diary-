import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { JournalCategory, JournalPage } from '../types';
import { INITIAL_JOURNAL_CATEGORIES } from '../data/defaultJournals';
import { diaryService } from '../services/diaryService';

const STORAGE_KEY_CATEGORIES = 'aurapages_categories_v1';

interface JournalContextType {
  categories: JournalCategory[];
  selectedCategory: JournalCategory | null;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  addCategory: (category: Omit<JournalCategory, 'id' | 'createdAt' | 'updatedAt' | 'pages'>) => Promise<JournalCategory>;
  updateCategory: (id: string, updates: Partial<JournalCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  savePage: (categoryId: string, page: JournalPage) => Promise<void>;
  deletePage: (categoryId: string, pageId: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<JournalCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading initial categories:', e);
    }
    return INITIAL_JOURNAL_CATEGORIES;
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to storage:', e);
    }
  }, [categories]);

  // Try fetching from backend if available
  const refreshCategories = useCallback(async () => {
    try {
      const backendCats = await diaryService.getCategories();
      if (backendCats && backendCats.length > 0) {
        setCategories(backendCats);
      }
    } catch {
      // Keep local categories if offline
    }
  }, []);

  const addCategory = async (newCategory: Omit<JournalCategory, 'id' | 'createdAt' | 'updatedAt' | 'pages'>) => {
    const id = `cat-${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const category: JournalCategory = {
      ...newCategory,
      id,
      createdAt: todayStr,
      updatedAt: todayStr,
      pages: [],
    };

    setCategories((prev) => [category, ...prev]);

    // Async backend sync
    diaryService.createCategory(newCategory).catch(() => {});
    return category;
  };

  const updateCategory = async (id: string, updates: Partial<JournalCategory>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : cat))
    );
    diaryService.updateCategory(id, updates).catch(() => {});
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
    diaryService.deleteCategory(id).catch(() => {});
  };

  const savePage = async (categoryId: string, page: JournalPage) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const pageIndex = cat.pages.findIndex((p) => p.id === page.id);
        let updatedPages: JournalPage[];
        if (pageIndex >= 0) {
          updatedPages = [...cat.pages];
          updatedPages[pageIndex] = page;
        } else {
          updatedPages = [page, ...cat.pages];
        }
        return {
          ...cat,
          pages: updatedPages,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
    diaryService.savePage(categoryId, page).catch(() => {});
  };

  const deletePage = async (categoryId: string, pageId: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          pages: cat.pages.filter((p) => p.id !== pageId),
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
    diaryService.deletePage(categoryId, pageId).catch(() => {});
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || null;

  return (
    <JournalContext.Provider
      value={{
        categories,
        selectedCategory,
        selectedCategoryId,
        setSelectedCategoryId,
        addCategory,
        updateCategory,
        deleteCategory,
        savePage,
        deletePage,
        refreshCategories,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = (): JournalContextType => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
