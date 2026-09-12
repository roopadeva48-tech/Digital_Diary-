import { Request } from 'express';

export type PaperTheme = 'lined' | 'kraft' | 'grid' | 'dots' | 'blush' | 'dark';
export type FontStyle = 'handwriting' | 'serif' | 'typewriter' | 'kalam' | 'sans' | 'editorial';
export type CanvasElementType = 'text' | 'sticker' | 'image' | 'video' | 'note' | 'music' | 'highlight';

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isPinned: boolean;
  content?: string;
  title?: string;
  artist?: string;
  src?: string;
  fontSize?: number;
  fontFamily?: FontStyle;
  color?: string;
  backgroundColor?: string;
  highlightColor?: string;
  highlightOpacity?: number;
  stickerCategory?: string;
  stickerData?: any;
  frameStyle?: 'polaroid' | 'tape' | 'torn' | 'simple';
  style?: string;
  noteItems?: { id: string; text: string; done: boolean }[];
  isPlaying?: boolean;
}

export interface JournalPage {
  id: string;
  title: string;
  month: string;
  day: number;
  dayOfWeek: string;
  paperTheme: PaperTheme;
  customBackgroundColor?: string;
  customBackgroundOpacity?: number;
  customBackgroundPattern?: string;
  elements: CanvasElement[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalCategory {
  id: string;
  userId?: string;
  title: string;
  description: string;
  coverColor: string;
  coverEmoji: string;
  coverImage?: string;
  isFavorite: boolean;
  pages: JournalPage[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}
