import { JournalCategory, JournalPage, User } from '../types/index.js';

// In-memory data store with default category examples
class DataStore {
  private users: Map<string, User> = new Map();
  private categories: Map<string, JournalCategory> = new Map();

  constructor() {}

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
