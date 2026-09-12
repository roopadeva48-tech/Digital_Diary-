import { JournalCategory } from '../types';

export const INITIAL_JOURNAL_CATEGORIES: JournalCategory[] = [
  {
    id: 'cat-memories',
    title: 'Memories',
    description: 'Cherished moments, cozy mornings, and little daily joys.',
    coverColor: '#E6D3BF',
    coverEmoji: '🌸',
    coverImage: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=500&auto=format&fit=crop&q=80',
    isFavorite: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-12',
    pages: [
      {
        id: 'page-jan-12',
        title: 'A Beautiful January Day',
        month: 'JAN',
        day: 12,
        dayOfWeek: 'Tuesday',
        paperTheme: 'lined',
        isFavorite: true,
        createdAt: '2026-01-12T09:00:00Z',
        updatedAt: '2026-01-12T14:30:00Z',
        elements: [
          // Month sticker
          {
            id: 'el-month-title',
            type: 'sticker',
            stickerCategory: 'months',
            stickerData: {
              month: 'JANUARY',
              script: 'January',
              bg: '#E4C3AD',
              daySuffix: '12th'
            },
            x: 180,
            y: 40,
            width: 320,
            height: 90,
            rotation: 0,
            zIndex: 10,
            isPinned: false
          },
          // Washi tape "Tuesday"
          {
            id: 'el-tape-tues',
            type: 'sticker',
            stickerCategory: 'tape',
            stickerData: {
              text: 'Tuesday',
              pattern: 'kraft',
              color: '#D8C7B5'
            },
            x: 20,
            y: 50,
            width: 130,
            height: 42,
            rotation: -12,
            zIndex: 12,
            isPinned: false
          },
          // Dried Clover
          {
            id: 'el-clover',
            type: 'sticker',
            stickerCategory: 'botanical',
            stickerData: {
              type: 'clover',
              color: '#B88E52'
            },
            x: 480,
            y: 45,
            width: 85,
            height: 85,
            rotation: 15,
            zIndex: 14,
            isPinned: false
          },
          // Bed photo polaroid
          {
            id: 'el-photo-bed',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=600&auto=format&fit=crop&q=80',
            frameStyle: 'polaroid',
            title: 'Cozy Morning',
            x: 15,
            y: 135,
            width: 175,
            height: 205,
            rotation: -2,
            zIndex: 5,
            isPinned: false
          },
          // Desk photo
          {
            id: 'el-photo-desk',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80',
            frameStyle: 'polaroid',
            title: 'Workspace',
            x: 130,
            y: 275,
            width: 165,
            height: 185,
            rotation: 1,
            zIndex: 6,
            isPinned: false
          },
          // Hand-lettered journal text right column
          {
            id: 'el-text-main',
            type: 'text',
            content: 'I am so filled with love and adoration for the things I’ve achieved this year. Not only have I been working full time, but I’ve been building my creative dreams and cherishing quiet moments with those I love.',
            fontFamily: 'handwriting',
            fontSize: 22,
            color: '#2D2319',
            x: 320,
            y: 170,
            width: 280,
            height: 180,
            rotation: 0,
            zIndex: 4,
            isPinned: false
          },
          // Hand-drawn botanical branch
          {
            id: 'el-botanical-branch',
            type: 'sticker',
            stickerCategory: 'botanical',
            stickerData: {
              type: 'flower-branch',
              color: '#433428'
            },
            x: 460,
            y: 330,
            width: 120,
            height: 180,
            rotation: 5,
            zIndex: 7,
            isPinned: false
          },
          // Music Player Widget
          {
            id: 'el-music-player',
            type: 'music',
            title: 'Versace on the floor',
            artist: 'Bruno Mars',
            src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
            x: 310,
            y: 490,
            width: 270,
            height: 110,
            rotation: -1,
            zIndex: 11,
            isPinned: false
          },
          // Left column handwritten paragraph
          {
            id: 'el-text-birthday',
            type: 'text',
            content: 'Today is a really special day for our family! I’m so excited to see what this year will bring. We’ve grown through so much, and this celebration felt truly magical.',
            fontFamily: 'handwriting',
            fontSize: 21,
            color: '#2D2319',
            x: 15,
            y: 490,
            width: 275,
            height: 130,
            rotation: 0,
            zIndex: 4,
            isPinned: false
          },
          // Torn Kraft paper To-do-list
          {
            id: 'el-todo-note',
            type: 'note',
            title: 'To-do-list',
            style: 'kraft-tape',
            x: 25,
            y: 630,
            width: 270,
            height: 200,
            rotation: -2,
            zIndex: 9,
            isPinned: false,
            noteItems: [
              { id: '1', text: 'Pick up bakery cake', done: true },
              { id: '2', text: 'Call cozy restaurant', done: true },
              { id: '3', text: 'Update scrapbook stickers', done: false }
            ]
          },
          // Bottom right journal reflection
          {
            id: 'el-text-reflection',
            type: 'text',
            content: 'Having a creative space brings me so much peace. When I write my thoughts here, my heart swells with gratitude. A warm hug to whoever reads this page!',
            fontFamily: 'handwriting',
            fontSize: 22,
            color: '#2D2319',
            x: 340,
            y: 630,
            width: 250,
            height: 180,
            rotation: 0,
            zIndex: 4,
            isPinned: false
          }
        ]
      },
      {
        id: 'page-feb-04',
        title: 'Spring Flowers & Tea',
        month: 'FEB',
        day: 14,
        dayOfWeek: 'Saturday',
        paperTheme: 'blush',
        isFavorite: false,
        createdAt: '2026-02-14T10:00:00Z',
        updatedAt: '2026-02-14T15:10:00Z',
        elements: [
          {
            id: 'el-month-feb',
            type: 'sticker',
            stickerCategory: 'months',
            stickerData: {
              month: 'FEBRUARY',
              script: 'February',
              bg: '#FBC4D6',
              daySuffix: '14th'
            },
            x: 160,
            y: 40,
            width: 320,
            height: 90,
            rotation: 0,
            zIndex: 10,
            isPinned: false
          },
          {
            id: 'el-note-envelope',
            type: 'note',
            title: 'Valentine Note',
            style: 'pink-envelope',
            x: 60,
            y: 180,
            width: 260,
            height: 290,
            rotation: -3,
            zIndex: 8,
            isPinned: false,
            content: 'A sweet letter about love, compassion, and warm hugs.'
          },
          {
            id: 'el-photo-coffee',
            type: 'image',
            src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
            frameStyle: 'polaroid',
            title: 'Morning Latte',
            x: 350,
            y: 160,
            width: 200,
            height: 240,
            rotation: 3,
            zIndex: 7,
            isPinned: false
          }
        ]
      }
    ]
  },
  {
    id: 'cat-schooldays',
    title: 'School Days',
    description: 'Blackboard memories, recess giggles, and best friends forever.',
    coverColor: '#D3E4CD',
    coverEmoji: '🎒',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=80',
    isFavorite: false,
    createdAt: '2026-01-05',
    updatedAt: '2026-01-20',
    pages: [
      {
        id: 'page-school-1',
        title: 'First Day of High School',
        month: 'SEP',
        day: 8,
        dayOfWeek: 'Monday',
        paperTheme: 'grid',
        isFavorite: true,
        createdAt: '2026-09-08T08:00:00Z',
        updatedAt: '2026-09-08T18:00:00Z',
        elements: [
          {
            id: 'el-school-title',
            type: 'text',
            content: 'First Day In The Hallways!',
            fontFamily: 'serif',
            fontSize: 32,
            color: '#273C2C',
            x: 80,
            y: 60,
            width: 440,
            height: 60,
            rotation: -1,
            zIndex: 5,
            isPinned: true
          },
          {
            id: 'el-tape-school',
            type: 'sticker',
            stickerCategory: 'tape',
            stickerData: {
              text: 'School Day 01',
              pattern: 'stripes',
              color: '#A7F3D0'
            },
            x: 380,
            y: 35,
            width: 150,
            height: 40,
            rotation: 5,
            zIndex: 8,
            isPinned: false
          }
        ]
      }
    ]
  },
  {
    id: 'cat-collegedays',
    title: 'College Days',
    description: 'Late night study groups, dorm life, and coffee-fueled cramming.',
    coverColor: '#C9D6DF',
    coverEmoji: '🎓',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
    isFavorite: true,
    createdAt: '2026-01-08',
    updatedAt: '2026-01-25',
    pages: [
      {
        id: 'page-college-1',
        title: 'Library All-Nighter',
        month: 'NOV',
        day: 20,
        dayOfWeek: 'Friday',
        paperTheme: 'kraft',
        isFavorite: false,
        createdAt: '2026-11-20T21:00:00Z',
        updatedAt: '2026-11-21T02:00:00Z',
        elements: [
          {
            id: 'el-college-banner',
            type: 'text',
            content: 'Architecture Studio Review',
            fontFamily: 'typewriter',
            fontSize: 28,
            color: '#4B3621',
            x: 80,
            y: 70,
            width: 420,
            height: 50,
            rotation: 0,
            zIndex: 5,
            isPinned: false
          }
        ]
      }
    ]
  },
  {
    id: 'cat-travel',
    title: 'Travel Wanderlust',
    description: 'Train tickets, passport stamps, postcard sunsets, and road trips.',
    coverColor: '#F5E8C7',
    coverEmoji: '✈️',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    isFavorite: false,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-18',
    pages: [
      {
        id: 'page-travel-1',
        title: 'Kyoto In Autumn',
        month: 'OCT',
        day: 24,
        dayOfWeek: 'Sunday',
        paperTheme: 'dots',
        isFavorite: true,
        createdAt: '2026-10-24T12:00:00Z',
        updatedAt: '2026-10-24T19:00:00Z',
        elements: []
      }
    ]
  }
];
