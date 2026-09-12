import { Response } from 'express';
import { AuthRequest, User } from '../types/index.js';
import { store } from '../models/store.js';
import { comparePassword, generateToken, hashPassword } from '../utils/auth.js';

export const authController = {
  async register(req: AuthRequest, res: Response): Promise<void> {
    const { name, email, password } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required.' });
      return;
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ message: 'A user with this email already exists.' });
      return;
    }

    const passwordHash = password ? await hashPassword(password) : undefined;
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    store.saveUser(newUser);

    const token = generateToken({ id: newUser.id, email: newUser.email, name: newUser.name });
    res.status(201).json({
      token,
      user: { name: newUser.name, email: newUser.email, avatar: newUser.avatar },
    });
  },

  async login(req: AuthRequest, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required.' });
      return;
    }

    let user = store.findUserByEmail(email);

    // Auto-create or login guest demo user if password not specified
    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        createdAt: new Date().toISOString(),
      };
      store.saveUser(user);
    } else if (password && user.passwordHash) {
      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        res.status(401).json({ message: 'Invalid credentials.' });
        return;
      }
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.name });
    res.status(200).json({
      token,
      user: { name: user.name, email: user.email, avatar: user.avatar },
    });
  },

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = store.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: { name: user.name, email: user.email, avatar: user.avatar },
    });
  },
};
