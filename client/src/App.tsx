/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { JournalCategory, UserProfile } from './types';
import { SplashScreen } from './components/SplashScreen';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { JournalEditor } from './components/JournalEditor';
import { NotFoundPage } from './components/NotFoundPage';
import { INITIAL_JOURNAL_CATEGORIES } from './data/defaultJournals';

const STORAGE_KEY_CATEGORIES = 'aurapages_categories_v1';
const STORAGE_KEY_USER = 'aurapages_user_v1';

// 1. Splash Page Screen
function SplashPageWrapper() {
  const navigate = useNavigate();

  const handleSplashComplete = () => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser && JSON.parse(savedUser)) {
        navigate('/dashboard', { replace: true });
        return;
      }
    } catch {
      // ignore
    }
    navigate('/auth', { replace: true });
  };

  return (
    <motion.div
      key="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full"
    >
      <SplashScreen onComplete={handleSplashComplete} />
    </motion.div>
  );
}

// 2. Auth Page Screen (Login / Sign Up)
function AuthPageWrapper({
  initialMode = 'login',
  onAuthSuccess,
}: {
  initialMode?: 'login' | 'signup';
  onAuthSuccess: (user: UserProfile) => void;
}) {
  const navigate = useNavigate();

  const handleSuccess = (user: UserProfile) => {
    onAuthSuccess(user);
    navigate('/dashboard');
  };

  return (
    <motion.div
      key={`auth-screen-${initialMode}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full"
    >
      <AuthForm initialMode={initialMode} onSuccess={handleSuccess} />
    </motion.div>
  );
}

// 3. Dashboard Page Screen
function DashboardPageWrapper({
  user,
  categories,
  onAddCategory,
  onDeleteCategory,
  onToggleFavorite,
  onLogout,
}: {
  user: UserProfile | null;
  categories: JournalCategory[];
  onAddCategory: (
    newCategory: Omit<JournalCategory, 'id' | 'createdAt' | 'updatedAt' | 'pages'>
  ) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleFavorite: (categoryId: string) => void;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
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
        onSelectCategory={(category) => navigate(`/journal/${category.id}`)}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
        onToggleFavorite={onToggleFavorite}
        onLogout={onLogout}
      />
    </motion.div>
  );
}

// 4. Journal Canvas / Editor Page Screen
function JournalEditorPageWrapper({
  categories,
  onUpdateCategory,
}: {
  categories: JournalCategory[];
  onUpdateCategory: (updated: JournalCategory) => void;
}) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const activeCategory =
    categories.find((c) => c.id === categoryId) || categories[0] || null;

  if (!activeCategory) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
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
        onBackToDashboard={() => navigate('/dashboard')}
        onUpdateCategory={onUpdateCategory}
      />
    </motion.div>
  );
}

function AppRoutes({
  user,
  setUser,
  categories,
  setCategories,
}: {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  categories: JournalCategory[];
  setCategories: React.Dispatch<React.SetStateAction<JournalCategory[]>>;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authenticatedUser));
    } catch (e) {
      console.error('Error persisting user:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error('Error removing user:', e);
    }
    navigate('/auth');
  };

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

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
  };

  const handleToggleFavorite = (categoryId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, isFavorite: !cat.isFavorite } : cat
      )
    );
  };

  const handleUpdateCategory = (updated: JournalCategory) => {
    setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Splash page */}
        <Route path="/" element={<SplashPageWrapper />} />
        <Route path="/splash" element={<SplashPageWrapper />} />

        {/* Authentication pages */}
        <Route
          path="/auth"
          element={
            <AuthPageWrapper
              initialMode="login"
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />
        <Route
          path="/login"
          element={
            <AuthPageWrapper
              initialMode="login"
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <AuthPageWrapper
              initialMode="signup"
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />
        <Route
          path="/register"
          element={
            <AuthPageWrapper
              initialMode="signup"
              onAuthSuccess={handleAuthSuccess}
            />
          }
        />

        {/* Dashboard Landing Page */}
        <Route
          path="/dashboard"
          element={
            <DashboardPageWrapper
              user={user}
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onToggleFavorite={handleToggleFavorite}
              onLogout={handleLogout}
            />
          }
        />

        {/* Journal Editor Page */}
        <Route
          path="/journal/:categoryId"
          element={
            <JournalEditorPageWrapper
              categories={categories}
              onUpdateCategory={handleUpdateCategory}
            />
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
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

  // Save categories on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }, [categories]);

  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#FAF6EE] text-[#3E2B1F] font-sans antialiased overflow-x-hidden">
        <AppRoutes
          user={user}
          setUser={setUser}
          categories={categories}
          setCategories={setCategories}
        />
      </div>
    </BrowserRouter>
  );
}
