/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import { diaryService } from './services/diaryService';
import { authService } from './services/authService';

const STORAGE_KEY_USER = 'aurapages_user_v1';

const getUserStorageKey = (user: UserProfile | null): string | null => {
  if (!user || !user.email) return null;
  return `aurapages_categories_${user.email.toLowerCase().trim()}`;
};

// Scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [pathname]);
  return null;
}

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
  onUpdateCategory,
  onLogout,
}: {
  user: UserProfile | null;
  categories: JournalCategory[];
  onAddCategory: (
    newCategory: Omit<JournalCategory, 'id' | 'createdAt' | 'updatedAt' | 'pages'>
  ) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleFavorite: (categoryId: string) => void;
  onUpdateCategory: (updated: JournalCategory) => void;
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
        onUpdateCategory={onUpdateCategory}
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
    authService.logout();
    setUser(null);
    setCategories([]);
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
    const id = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const category: JournalCategory = {
      ...newCategory,
      id,
      userId: user?.id,
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

    // Backend sync
    diaryService.createCategory(newCategory).catch(() => {});
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
    diaryService.deleteCategory(categoryId).catch(() => {});
  };

  const handleToggleFavorite = (categoryId: string) => {
    const target = categories.find((c) => c.id === categoryId);
    if (!target) return;
    const updated = { ...target, isFavorite: !target.isFavorite };
    setCategories(categories.map((c) => (c.id === categoryId ? updated : c)));
    diaryService.updateCategory(categoryId, { isFavorite: updated.isFavorite }).catch(() => {});
  };

  const handleUpdateCategory = (updated: JournalCategory) => {
    setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
    diaryService.updateCategory(updated.id, updated).catch(() => {});
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
              onUpdateCategory={handleUpdateCategory}
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
    const legacyMockIds = new Set(['cat-memories', 'cat-schooldays', 'cat-collegedays', 'cat-travel', 'cat-default-1']);
    try {
      if (user && user.email) {
        const userKey = getUserStorageKey(user);
        if (userKey) {
          const saved = localStorage.getItem(userKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              return parsed.filter((cat: JournalCategory) => !legacyMockIds.has(cat.id));
            }
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved categories:', e);
    }
    return [];
  });

  // When user changes, load user-specific categories & sync from backend
  useEffect(() => {
    if (!user || !user.email) {
      setCategories([]);
      return;
    }

    const legacyMockIds = new Set(['cat-memories', 'cat-schooldays', 'cat-collegedays', 'cat-travel', 'cat-default-1']);
    const userKey = getUserStorageKey(user);
    if (userKey) {
      try {
        const saved = localStorage.getItem(userKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCategories(parsed.filter((cat: JournalCategory) => !legacyMockIds.has(cat.id)));
          }
        } else {
          setCategories([]);
        }
      } catch (e) {
        console.error('Error reading user categories from storage:', e);
      }
    }

    // Also fetch user's categories from backend
    diaryService.getCategories()
      .then((serverCategories) => {
        if (Array.isArray(serverCategories)) {
          const cleanCats = serverCategories.filter((cat) => !legacyMockIds.has(cat.id));
          setCategories(cleanCats);
          if (userKey) {
            localStorage.setItem(userKey, JSON.stringify(cleanCats));
          }
        }
      })
      .catch(() => {
        // Fall back to local user storage
      });
  }, [user?.email]);

  // Save categories on change scoped to current user
  useEffect(() => {
    if (!user || !user.email) return;
    const userKey = getUserStorageKey(user);
    if (!userKey) return;
    try {
      localStorage.setItem(userKey, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving user categories:', e);
    }
  }, [categories, user]);

  return (
    <BrowserRouter>
      <ScrollToTop />
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
