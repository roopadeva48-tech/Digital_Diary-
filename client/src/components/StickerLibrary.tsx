import React, { useState } from 'react';
import { 
  MONTH_STICKERS, 
  WASHI_TAPES, 
  NOTE_TEMPLATES, 
  BOTANICAL_DECOR, 
  SAMPLE_SCRAPBOOK_PHOTOS,
  SCRAPBOOK_EMOJIS,
  MUSIC_PLAYER_PRESET 
} from '../data/stickers';
import { CanvasElement } from '../types';
import { Search, Sparkles, Image as ImageIcon, Heart, Music } from 'lucide-react';

interface StickerLibraryProps {
  onAddElement: (elem: Partial<CanvasElement>) => void;
  onClose?: () => void;
}

type TabType = 'all' | 'months' | 'notes' | 'tape' | 'botanical' | 'photos' | 'widgets';

export const StickerLibrary: React.FC<StickerLibraryProps> = ({ onAddElement, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');

  const handleAddMonth = (month: typeof MONTH_STICKERS[0]) => {
    onAddElement({
      type: 'sticker',
      stickerCategory: 'months',
      stickerData: {
        month: month.month,
        script: month.script,
        bg: month.bg,
        daySuffix: '1st'
      },
      width: 290,
      height: 85,
      rotation: 0
    });
  };

  const handleAddTape = (tape: typeof WASHI_TAPES[0]) => {
    onAddElement({
      type: 'sticker',
      stickerCategory: 'tape',
      stickerData: {
        text: tape.text || tape.name,
        pattern: tape.pattern,
        color: tape.color
      },
      width: 140,
      height: 42,
      rotation: -3
    });
  };

  const handleAddNote = (template: typeof NOTE_TEMPLATES[0]) => {
    onAddElement({
      type: 'note',
      title: template.title,
      content: template.body,
      style: template.style as any,
      width: template.defaultWidth,
      height: template.defaultHeight,
      noteItems: template.items ? JSON.parse(JSON.stringify(template.items)) : undefined,
      rotation: -1
    });
  };

  const handleAddBotanical = (botanical: typeof BOTANICAL_DECOR[0]) => {
    onAddElement({
      type: 'sticker',
      stickerCategory: 'botanical',
      stickerData: {
        type: botanical.type,
        color: botanical.color
      },
      width: botanical.width,
      height: botanical.height,
      rotation: 2
    });
  };

  const handleAddPhoto = (photo: typeof SAMPLE_SCRAPBOOK_PHOTOS[0]) => {
    onAddElement({
      type: 'image',
      src: photo.url,
      title: photo.caption,
      frameStyle: 'polaroid',
      width: 190,
      height: 230,
      rotation: -2
    });
  };

  const handleAddMusicWidget = () => {
    onAddElement({
      type: 'music',
      title: MUSIC_PLAYER_PRESET.title,
      artist: MUSIC_PLAYER_PRESET.artist,
      src: MUSIC_PLAYER_PRESET.albumArt,
      width: MUSIC_PLAYER_PRESET.width,
      height: MUSIC_PLAYER_PRESET.height,
      rotation: 0
    });
  };

  const handleAddEmoji = (emoji: string) => {
    onAddElement({
      type: 'sticker',
      stickerCategory: 'decor',
      content: emoji,
      width: 70,
      height: 70,
      rotation: 0
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFDF9] text-[#3E2B1F] select-none">
      {/* Header & Tabs */}
      <div className="p-3 border-b border-[#EEDBCA] space-y-2 shrink-0 bg-[#FAF4EB]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-serif-display font-bold text-[#453022]">
            <Sparkles className="w-4 h-4 text-[#C47D42]" />
            <span>Decorative Sticker Studio</span>
          </div>
          <span className="text-[10px] text-[#8C6D53] bg-[#EFE3D5] px-2 py-0.5 rounded-full">
            Tap to place on canvas
          </span>
        </div>

        {/* Scrollable Subtabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-medium no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Sets' },
              { id: 'months', label: 'Months' },
              { id: 'notes', label: 'Memo Frames' },
              { id: 'tape', label: 'Washi Tapes' },
              { id: 'botanical', label: 'Botanicals' },
              { id: 'photos', label: 'Polaroids' },
              { id: 'widgets', label: 'Widgets' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-[#8C4E26] text-white shadow-xs font-semibold'
                  : 'bg-[#F2E5D6] text-[#6E4F38] hover:bg-[#E9D9C7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stickers Grid Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {/* 1. MONTH STICKERS (Matching Image 2) */}
        {(activeTab === 'all' || activeTab === 'months') && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8A674D] mb-2 flex items-center gap-1">
              <span>Month Titles (Two-tone cursive)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {MONTH_STICKERS.map((month) => (
                <button
                  key={month.id}
                  type="button"
                  onClick={() => handleAddMonth(month)}
                  className="group relative p-2 rounded-xl border border-[#E9DFD3] hover:border-[#8C4E26] bg-[#FFFDF9] hover:shadow-md transition text-center flex items-center justify-center h-16 overflow-hidden cursor-pointer"
                >
                  <span
                    className="font-black text-xl tracking-wider uppercase opacity-75 group-hover:opacity-90"
                    style={{ color: month.bg }}
                  >
                    {month.month}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center font-handwriting text-2xl text-[#2B1B10] group-hover:scale-105 transition-transform">
                    {month.script}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. CUTE MEMO FRAMES & STICKY NOTES (Matching Image 3 & 4) */}
        {(activeTab === 'all' || activeTab === 'notes') && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8A674D] mb-2">
              Cute Memo Frames & Sticky Notes
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {NOTE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleAddNote(tpl)}
                  className="group p-2.5 rounded-xl border border-[#E9DFD3] hover:border-[#8C4E26] bg-[#FAF7F0] hover:shadow-md transition text-left flex flex-col justify-between h-24 relative overflow-hidden cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#4A3423] truncate group-hover:text-[#8C4E26]">
                    {tpl.name}
                  </span>
                  <div className="text-[10px] text-[#8C6D53] line-clamp-2 font-handwriting text-sm">
                    {tpl.title}: {tpl.body || 'Personal memo with checkboxes & decorations'}
                  </div>
                  <span className="self-end text-[10px] text-[#9E5728] font-bold group-hover:translate-x-0.5 transition-transform">
                    + Add to canvas
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. WASHI TAPE STRIPS (Matching Image 5) */}
        {(activeTab === 'all' || activeTab === 'tape') && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8A674D] mb-2">
              Decorative Washi Tape Strips
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {WASHI_TAPES.map((tape) => (
                <button
                  key={tape.id}
                  type="button"
                  onClick={() => handleAddTape(tape)}
                  style={{ backgroundColor: tape.color }}
                  className="h-10 px-3 rounded-xs border-y border-black/15 shadow-xs flex items-center justify-center font-handwriting text-sm font-bold text-[#3B281B] hover:scale-102 transition cursor-pointer"
                >
                  {tape.text || tape.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. BOTANICALS & DRIED FLOWERS (Matching Image 5) */}
        {(activeTab === 'all' || activeTab === 'botanical') && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8A674D] mb-2">
              Dried Botanicals & Foliage
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {BOTANICAL_DECOR.map((botanical) => (
                <button
                  key={botanical.id}
                  type="button"
                  onClick={() => handleAddBotanical(botanical)}
                  className="p-2 bg-[#FAF6EE] rounded-xl border border-[#E9DFD3] hover:border-[#8C4E26] hover:shadow-xs flex flex-col items-center justify-center gap-1 h-20 transition cursor-pointer"
                >
                  <span className="text-2xl">
                    {botanical.type === 'clover'
                      ? '🍀'
                      : botanical.type === 'flower-branch'
                      ? '🌿'
                      : botanical.type === 'rose'
                      ? '🥀'
                      : '🪴'}
                  </span>
                  <span className="text-[10px] text-[#6D4F38] font-medium truncate w-full text-center">
                    {botanical.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. AESTHETIC PHOTOS & POLAROIDS */}
        {(activeTab === 'all' || activeTab === 'photos') && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8A674D] mb-2">
              Aesthetic Polaroid Photos
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_SCRAPBOOK_PHOTOS.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => handleAddPhoto(photo)}
                  className="group relative rounded-lg overflow-hidden border border-[#EADBCC] shadow-xs hover:shadow-md transition aspect-4/3 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[11px] text-white font-handwriting truncate">
                      {photo.caption}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. RETRO WIDGETS (Matching Image 5) */}
        {(activeTab === 'all' || activeTab === 'widgets') && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8A674D] mb-2">
              Interactive Scrapbook Widgets
            </h4>
            <button
              type="button"
              onClick={handleAddMusicWidget}
              className="w-full p-3 rounded-xl border border-[#D5C2AF] bg-[#EAE2D7] hover:bg-[#E3D9CD] transition flex items-center justify-between text-left cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#8C4E26] text-white flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#3B291D]">Retro Music Player</div>
                  <div className="text-[11px] text-[#7A614D] font-handwriting">
                    "Versace on the floor - Bruno Mars"
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#8C4E26] bg-white/70 px-2 py-1 rounded-md">
                + Add
              </span>
            </button>
          </div>
        )}

        {/* 7. QUICK SCRAPBOOK EMOJIS */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8A674D] mb-2">
            Scrapbook Emojis & Accents
          </h4>
          <div className="grid grid-cols-6 gap-1.5 bg-[#FAF6EE] p-2 rounded-xl border border-[#E9DFD0]">
            {SCRAPBOOK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddEmoji(emoji)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-white hover:scale-115 transition cursor-pointer"
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
