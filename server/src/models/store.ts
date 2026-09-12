import { JournalCategory, JournalPage, User } from '../types/index.js';

// In-memory data store with default category examples
class DataStore {
  private users: Map<string, User> = new Map();
  private categories: Map<string, JournalCategory> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const defaultCat: JournalCategory = {
      id: 'cat-default-1',
      title: 'Daily Reflections',
      description: 'Thoughts, morning routines & daily moments',
      coverColor: 'bg-rose-100',
      coverEmoji: '✨',
      isFavorite: true,
      pages: [
        {
          id: 'page-default-1',
          title: 'A Fresh Morning',
          month: 'SEP',
          day: 12,
          dayOfWeek: 'Saturday',
          paperTheme: 'kraft',
          elements: [
            {
              id: 'el-1',
              type: 'text',
              x: 80,
              y: 100,
              width: 320,
              height: 120,
              rotation: 0,
              zIndex: 1,
              isPinned: false,
              content: 'Today is a wonderful day to organize my life and thoughts.',
              fontSize: 18,
              fontFamily: 'handwriting',
              color: '#3d342a',
            },
          ],
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.categories.set(defaultCat.id, defaultCat);
  }

  // Users
  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  saveUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  // Categories
  getCategories(userId?: string): JournalCategory[] {
    const all = Array.from(this.categories.values());
    if (!userId) return all;
    return all.filter((c) => !c.userId || c.userId === userId);
  }

  getCategoryById(id: string): JournalCategory | undefined {
    return this.categories.get(id);
  }

  saveCategory(category: JournalCategory): JournalCategory {
    this.categories.set(category.id, category);
    return category;
  }

  deleteCategory(id: string): boolean {
    return this.categories.delete(id);
  }

  // Pages
  savePage(categoryId: string, page: JournalPage): JournalPage | null {
    const cat = this.categories.get(categoryId);
    if (!cat) return null;

    const existingIdx = cat.pages.findIndex((p) => p.id === page.id);
    if (existingIdx >= 0) {
      cat.pages[existingIdx] = page;
    } else {
      cat.pages.push(page);
    }
    cat.updatedAt = new Date().toISOString();
    return page;
  }

  deletePage(categoryId: string, pageId: string): boolean {
    const cat = this.categories.get(categoryId);
    if (!cat) return false;

    const initialLen = cat.pages.length;
    cat.pages = cat.pages.filter((p) => p.id !== pageId);
    cat.updatedAt = new Date().toISOString();
    return cat.pages.length !== initialLen;
  }
}

export const store = new DataStore();
