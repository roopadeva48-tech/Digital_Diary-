/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppScreen, JournalCategory, UserProfile } from './types';
import { SplashScreen } from './components/SplashScreen';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { JournalEditor } from './components/JournalEditor';
import { INITIAL_JOURNAL_CATEGORIES } from './data/defaultJournals';

const STORAGE_KEY_CATEGORIES = 'aurapages_categories_v1';
const STORAGE_KEY_USER = 'aurapages_user_v1';

export default function App() {
  // Step 1: Logo Page initially
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [categories, setCategories] = useState<JournalCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved categories:', e);
    }
    return INITIAL_JOURNAL_CATEGORIES;
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Save categories on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }, [categories]);

  // Step 2: When Logo/Splash completes -> ALWAYS move to Authentication Page
  const handleSplashComplete = () => {
    setCurrentScreen('auth');
  };

  // Step 3: When Login / Sign Up is complete -> move to Landing Page (Dashboard)
  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authenticatedUser));
    } catch (e) {
      console.error('Error persisting user:', e);
    }
    setCurrentScreen('dashboard');
  };

  // Handle logout -> return to Authentication Page
  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error('Error removing user:', e);
    }
    setCurrentScreen('auth');
  };

  // Select category to edit
  const handleSelectCategory = (category: JournalCategory) => {
    setSelectedCategoryId(category.id);
    setCurrentScreen('editor');
  };

  // Add new category
  const handleAddCategory = (
    newCategory: Omit<JournalCategory, 'id' | 'createdAt' | 'updatedAt' | 'pages'>
  ) => {
    const id = `cat-${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const category: JournalCategory = {
      ...newCategory,
      id,
      createdAt: todayStr,
      updatedAt: todayStr,
      pages: [
        {
          id: `page-${Date.now()}`,
          title: `${newCategory.title} - Day 1`,
          month: 'JAN',
          day: 12,
          dayOfWeek: 'Tuesday',
          paperTheme: 'lined',
          isFavorite: false,
          elements: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    setCategories([category, ...categories]);
  };

  // Delete category
  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setCurrentScreen('dashboard');
    }
  };

  // Toggle favorite on category
  const handleToggleFavorite = (categoryId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, isFavorite: !cat.isFavorite } : cat
      )
    );
  };

  // Update category (pages, title, elements)
  const handleUpdateCategory = (updated: JournalCategory) => {
    setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
  };

  const activeCategory =
    categories.find((c) => c.id === selectedCategoryId) || categories[0] || null;

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-[#3E2B1F] font-sans antialiased overflow-x-hidden">
      <AnimatePresence mode="wait">
        {/* 1. Logo Page (Splash Screen) initially */}
        {currentScreen === 'splash' && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}

        {/* 2. Authentication Page (Login & Sign Up with Demos) */}
        {currentScreen === 'auth' && (
          <motion.div
            key="auth-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <AuthForm initialMode="login" onSuccess={handleAuthSuccess} />
          </motion.div>
        )}

        {/* 3. Landing Page (Dashboard) */}
        {currentScreen === 'dashboard' && user && (
          <motion.div
            key="dashboard-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full"
          >
            <Dashboard
              user={user}
              categories={categories}
              onSelectCategory={handleSelectCategory}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onToggleFavorite={handleToggleFavorite}
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {/* 4. Journal Canvas / Editor */}
        {currentScreen === 'editor' && activeCategory && (
          <motion.div
            key={`editor-${activeCategory.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full"
          >
            <JournalEditor
              category={activeCategory}
              onBackToDashboard={() => setCurrentScreen('dashboard')}
              onUpdateCategory={handleUpdateCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
