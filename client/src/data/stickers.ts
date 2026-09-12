export interface StickerItem {
  id: string;
  category: 'months' | 'notes' | 'tags' | 'botanical' | 'tape' | 'decor';
  name: string;
  previewType: 'svg' | 'html';
  renderSvg?: string;
  defaultWidth: number;
  defaultHeight: number;
  stickerData?: any;
}

export const MONTH_STICKERS = [
  { id: 'month-jan', name: 'January', month: 'JANUARY', script: 'January', bg: '#A7E8F0' },
  { id: 'month-feb', name: 'February', month: 'FEBRUARY', script: 'February', bg: '#FBC4D6' },
  { id: 'month-mar', name: 'March', month: 'MARCH', script: 'March', bg: '#BCE8CE' },
  { id: 'month-apr', name: 'April', month: 'APRIL', script: 'April', bg: '#FDD5B3' },
  { id: 'month-may', name: 'May', month: 'MAY', script: 'May', bg: '#E4C9FF' },
  { id: 'month-jun', name: 'June', month: 'JUNE', script: 'June', bg: '#BAE0FD' },
  { id: 'month-jul', name: 'July', month: 'JULY', script: 'July', bg: '#C0F3DF' },
  { id: 'month-aug', name: 'August', month: 'AUGUST', script: 'August', bg: '#FEC5CD' },
  { id: 'month-sep', name: 'September', month: 'SEPTEMBER', script: 'September', bg: '#C7E4FD' },
  { id: 'month-oct', name: 'October', month: 'OCTOBER', script: 'October', bg: '#FEE58A' },
  { id: 'month-nov', name: 'November', month: 'NOVEMBER', script: 'November', bg: '#FED2A4' },
  { id: 'month-dec', name: 'December', month: 'DECEMBER', script: 'December', bg: '#E0BDFC' },
];

export const WASHI_TAPES = [
  { id: 'tape-tuesday', name: 'Tuesday Tape', text: 'Tuesday', pattern: 'kraft', color: '#D5C4B1' },
  { id: 'tape-today', name: 'Today Tape', text: 'Today', pattern: 'stripes', color: '#FBC4D6' },
  { id: 'tape-grateful', name: 'Grateful Tape', text: 'Grateful', pattern: 'dots', color: '#BCE8CE' },
  { id: 'tape-memories', name: 'Memories Tape', text: 'Memories', pattern: 'check', color: '#E4C9FF' },
  { id: 'tape-stripes-pink', name: 'Pink Diagonal Tape', text: '', pattern: 'stripes', color: '#F472B6' },
  { id: 'tape-dots-mint', name: 'Mint Polka Dots', text: '', pattern: 'dots', color: '#6EE7B7' },
  { id: 'tape-kraft-plain', name: 'Kraft Brown Tape', text: '', pattern: 'kraft', color: '#D97706' },
  { id: 'tape-hearts-rose', name: 'Sweet Hearts Tape', text: '♥ ♥ ♥', pattern: 'hearts', color: '#FDA4AF' },
];

export const NOTE_TEMPLATES = [
  {
    id: 'note-bow-lined',
    category: 'notes' as const,
    name: 'Scalloped Bow Memo',
    defaultWidth: 260,
    defaultHeight: 280,
    style: 'lined-bow',
    title: 'Daily Memo',
    body: 'Add your cute thoughts or reminder here...',
    items: [
      { id: '1', text: 'Drink 2L water', done: true },
      { id: '2', text: 'Morning journaling', done: true },
      { id: '3', text: 'Read 10 pages', done: false }
    ]
  },
  {
    id: 'note-envelope-pink',
    category: 'tags' as const,
    name: 'Pink Envelope Letter',
    defaultWidth: 260,
    defaultHeight: 320,
    style: 'pink-envelope',
    title: 'A Little Note',
    body: 'A letter to my future self filled with hope and gratitude for small moments.',
  },
  {
    id: 'note-torn-todo',
    category: 'notes' as const,
    name: 'Torn Kraft To-Do List',
    defaultWidth: 280,
    defaultHeight: 240,
    style: 'kraft-tape',
    title: 'To-do-list',
    body: '',
    items: [
      { id: '1', text: 'Pick up bakery order', done: true },
      { id: '2', text: 'Call lovely restaurant', done: false },
      { id: '3', text: 'Update listings on shop', done: false }
    ]
  },
  {
    id: 'note-spiral-card',
    category: 'notes' as const,
    name: 'Spiral Notepad Page',
    defaultWidth: 250,
    defaultHeight: 260,
    style: 'spiral-notepad',
    title: 'Notes',
    body: 'Write something heartfelt or jot down quick ideas.',
  },
  {
    id: 'note-polaroid-frame',
    category: 'tags' as const,
    name: 'Scrapbook Polaroid Frame',
    defaultWidth: 240,
    defaultHeight: 300,
    style: 'polaroid-frame',
    title: 'Cherished Moment',
    body: 'Golden hour sunshine',
  },
  {
    id: 'note-hanging-board',
    category: 'tags' as const,
    name: 'Hanging Wood Plaque',
    defaultWidth: 270,
    defaultHeight: 200,
    style: 'hanging-board',
    title: 'My Sanctuary',
    body: 'Peace begins right here.',
  },
  {
    id: 'note-paperclip-memo',
    category: 'notes' as const,
    name: 'Paperclipped Memo',
    defaultWidth: 240,
    defaultHeight: 270,
    style: 'clip-memo',
    title: 'Important',
    body: 'Remember why you started this beautiful journey.',
  },
  {
    id: 'note-ribbon-banner',
    category: 'tags' as const,
    name: 'Ribbon Banner Tag',
    defaultWidth: 260,
    defaultHeight: 90,
    style: 'ribbon-banner',
    title: 'CHAPTER ONE',
    body: '',
  },
  {
    id: 'note-scroll-banner',
    category: 'tags' as const,
    name: 'Vintage Scroll',
    defaultWidth: 280,
    defaultHeight: 110,
    style: 'scroll-banner',
    title: 'A Beautiful Day',
    body: '',
  }
];

export const BOTANICAL_DECOR = [
  { id: 'botanical-branch', name: 'Floral Branch', type: 'flower-branch', color: '#4A3B32', width: 140, height: 210 },
  { id: 'botanical-clover', name: 'Dried Clover', type: 'clover', color: '#B58D52', width: 95, height: 95 },
  { id: 'botanical-rose', name: 'Pressed Rose', type: 'rose', color: '#9B5B5B', width: 110, height: 160 },
  { id: 'botanical-eucalyptus', name: 'Eucalyptus Stem', type: 'eucalyptus', color: '#5B7065', width: 120, height: 190 },
  { id: 'botanical-sunflower', name: 'Dried Bloom', type: 'sunflower', color: '#D97706', width: 100, height: 100 },
];

export const MUSIC_PLAYER_PRESET = {
  id: 'music-widget-player',
  name: 'Retro Music Player',
  title: 'Versace on the floor',
  artist: 'Bruno Mars',
  albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
  width: 320,
  height: 125,
};

export const SAMPLE_SCRAPBOOK_PHOTOS = [
  {
    id: 'photo-bed',
    title: 'Cozy Morning Bed',
    caption: 'simplicity is the ultimate sophistication',
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=500&auto=format&fit=crop&q=80',
    tags: ['lifestyle', 'cozy']
  },
  {
    id: 'photo-desk',
    title: 'Minimalist Workspace',
    caption: 'calm corner',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=80',
    tags: ['work', 'aesthetic']
  },
  {
    id: 'photo-coffee',
    title: 'Cafe Journaling',
    caption: 'warm cinnamon latte',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
    tags: ['coffee', 'journal']
  },
  {
    id: 'photo-flowers',
    title: 'Spring Blooms',
    caption: 'blooming quietly',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&auto=format&fit=crop&q=80',
    tags: ['nature', 'spring']
  },
  {
    id: 'photo-polaroid',
    title: 'Sunset Memories',
    caption: 'golden hour glow',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    tags: ['travel', 'sunset']
  }
];

export const SCRAPBOOK_EMOJIS = [
  '✨', '🌸', '🍂', '☕', '📖', '🎀', '💌', '🕯️', 
  '🎞️', '🪴', '🕊️', '🧸', '☁️', '🌙', '⭐', '🍓',
  '🎨', '📷', '🗝️', '📜', '🌷', '🌿', '🍯', '🤍'
];
