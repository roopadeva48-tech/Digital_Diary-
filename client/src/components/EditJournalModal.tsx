import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalCategory } from '../types';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  Check, 
  Palette, 
  Smile, 
  BookOpen,
  Link,
  Edit3
} from 'lucide-react';

interface EditJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: JournalCategory;
  onSave: (updated: Partial<JournalCategory>) => void;
}

const COLOR_PALETTES = [
  { name: 'Warm Tan', hex: '#E6D3BF' },
  { name: 'Sage Green', hex: '#D3E4CD' },
  { name: 'Soft Butter', hex: '#F5E8C7' },
  { name: 'Muted Periwinkle', hex: '#C9D6DF' },
  { name: 'Blush Pink', hex: '#FAD2E1' },
  { name: 'Mint Mist', hex: '#E2ECE9' },
  { name: 'Lavender Dream', hex: '#DFCCF1' },
  { name: 'Cozy Cream', hex: '#F0E5D8' },
  { name: 'Terracotta', hex: '#E2B198' },
  { name: 'Olive Leaf', hex: '#C5D8B8' },
  { name: 'Dusty Rose', hex: '#ECC4C4' },
  { name: 'Sky Breeze', hex: '#BCD4E6' },
];

const PRESET_EMOJIS = [
  '🌸', '🎀', '🎒', '🎓', '✈️', '☕', '📖', '💌', 
  '🕯️', '🧸', '🌿', '🎨', '🌻', '🌙', '✨', '🍓', 
  '📷', '🍰', '🍁', '💎', '🕊️', '🌅', '🌼', '🐾'
];

const PRESET_COVERS = [
  {
    name: 'Cozy Morning',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sakura & Spring',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vintage Books',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Golden Sunset',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Botanical Garden',
    url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Coffee & Journal',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
  },
];

export const EditJournalModal: React.FC<EditJournalModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [title, setTitle] = useState(category.title);
  const [description, setDescription] = useState(category.description || '');
  const [coverColor, setCoverColor] = useState(category.coverColor || '#E6D3BF');
  const [coverEmoji, setCoverEmoji] = useState(category.coverEmoji || '🌸');
  const [coverImage, setCoverImage] = useState<string | undefined>(category.coverImage);
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'photo' | 'theme' | 'emoji'>('photo');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if category changes
  React.useEffect(() => {
    setTitle(category.title);
    setDescription(category.description || '');
    setCoverColor(category.coverColor || '#E6D3BF');
    setCoverEmoji(category.coverEmoji || '🌸');
    setCoverImage(category.coverImage);
  }, [category, isOpen]);

  // Handle local image upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size is too large. Please choose an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl) {
        setCoverImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      coverColor,
      coverEmoji,
      coverImage: coverImage || undefined,
      updatedAt: new Date().toLocaleDateString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-xl bg-[#FFFDF9] rounded-2xl shadow-2xl border border-[#E8DCCF] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#F0E5D8] flex items-center justify-between bg-[#FAF4EB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F0E3D3] flex items-center justify-center text-[#8C4E26] shadow-2xs">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif-display font-bold text-[#3E2B1F]">
                  Customize Notes & Cover
                </h3>
                <p className="text-[11px] text-[#8C6D53] font-editorial">
                  Update photo, notes name, color theme & emoji
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C6D53] hover:text-[#3E2B1F] hover:bg-[#EFE2D3] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 text-[#3E2B1F]">
            {/* Live Interactive Preview Card */}
            <div>
              <label className="text-xs font-semibold text-[#6E4F39] uppercase tracking-wider mb-1.5 block">
                Live Preview
              </label>
              <div className="w-full rounded-xl border border-[#E4D5C4] overflow-hidden shadow-sm bg-[#FAF5EC] flex flex-col sm:flex-row items-stretch">
                {/* Preview Banner */}
                <div
                  className="h-28 sm:h-auto sm:w-44 relative flex items-center justify-center overflow-hidden shrink-0"
                  style={{ backgroundColor: coverColor }}
                >
                  {coverImage ? (
                    <>
                      <img
                        src={coverImage}
                        alt="Cover Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />
                    </>
                  ) : null}

                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/40 flex items-center justify-center text-2xl shadow-sm">
                    {coverEmoji}
                  </div>
                </div>

                {/* Preview Info */}
                <div className="p-3.5 flex-1 flex flex-col justify-center">
                  <span className="text-[10px] text-[#A38A75] font-serif uppercase tracking-wider">
                    {category.pages.length} {category.pages.length === 1 ? 'Page' : 'Pages'}
                  </span>
                  <h4 className="text-base font-serif-display font-bold text-[#3E2B1F] line-clamp-1 mt-0.5">
                    {title || 'Untitled Notes'}
                  </h4>
                  <p className="text-xs text-[#7B6350] line-clamp-2 mt-1 font-editorial">
                    {description || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes Heading & Description */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#6E4F39] uppercase tracking-wider block mb-1">
                  Notes / Diary Heading Name *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Jammu Memories, Daily Musings, Travel Diary"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDCFBF] bg-white text-sm text-[#3E2B1F] focus:outline-hidden focus:ring-2 focus:ring-[#9E5728]/30 focus:border-[#9E5728] transition shadow-2xs font-serif-display font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#6E4F39] uppercase tracking-wider block mb-1">
                  Description / Subtitle
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Cherished moments, peaceful reflections & memories"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDCFBF] bg-white text-xs sm:text-sm text-[#3E2B1F] focus:outline-hidden focus:ring-2 focus:ring-[#9E5728]/30 focus:border-[#9E5728] transition shadow-2xs font-editorial"
                />
              </div>
            </div>

            {/* Customization Tabs */}
            <div className="pt-2 border-t border-[#EFE5D8]">
              <div className="flex bg-[#F0E6D8] p-1 rounded-xl mb-4 border border-[#DFCEBB]">
                <button
                  type="button"
                  onClick={() => setActiveTab('photo')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'photo'
                      ? 'bg-white text-[#8C4E26] shadow-xs'
                      : 'text-[#7B604A] hover:text-[#3E2B1F]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>1. Cover Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('theme')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'theme'
                      ? 'bg-white text-[#8C4E26] shadow-xs'
                      : 'text-[#7B604A] hover:text-[#3E2B1F]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>2. Color Theme</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('emoji')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'emoji'
                      ? 'bg-white text-[#8C4E26] shadow-xs'
                      : 'text-[#7B604A] hover:text-[#3E2B1F]'
                  }`}
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>3. Add Emoji</span>
                </button>
              </div>

              {/* TAB 1: Photo Upload */}
              {activeTab === 'photo' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl bg-[#9E5728] hover:bg-[#86461D] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Computer</span>
                    </button>

                    {coverImage && (
                      <button
                        type="button"
                        onClick={() => setCoverImage(undefined)}
                        className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#B91C1C] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>

                  {/* Or image URL */}
                  <div>
                    <label className="text-[11px] font-semibold text-[#8C6D53] uppercase tracking-wider block mb-1">
                      Or paste an Image URL:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A38A75]" />
                        <input
                          type="url"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          placeholder="https://example.com/my-photo.jpg"
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DDCFBF] bg-white text-xs text-[#3E2B1F] focus:outline-hidden focus:ring-1 focus:ring-[#9E5728]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (imageUrlInput.trim()) {
                            setCoverImage(imageUrlInput.trim());
                            setImageUrlInput('');
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#FAF4EB] hover:bg-[#EFE3D4] border border-[#DDCFBF] text-xs font-medium text-[#6D4F38]"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* Preset Aesthetic Covers */}
                  <div>
                    <label className="text-[11px] font-semibold text-[#8C6D53] uppercase tracking-wider block mb-2">
                      Or choose an aesthetic preset:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_COVERS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setCoverImage(preset.url)}
                          className={`relative h-16 rounded-lg overflow-hidden border transition group ${
                            coverImage === preset.url
                              ? 'ring-2 ring-[#9E5728] border-transparent scale-102 shadow-sm'
                              : 'border-[#E4D5C4] hover:border-[#9E5728]'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-0.5 px-1 truncate text-center">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Color Theme */}
              {activeTab === 'theme' && (
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-[#8C6D53] uppercase tracking-wider block">
                    Choose Background & Accent Color Theme:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {COLOR_PALETTES.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setCoverColor(color.hex)}
                        className={`p-2 rounded-xl border flex items-center gap-2.5 transition text-left cursor-pointer ${
                          coverColor.toLowerCase() === color.hex.toLowerCase()
                            ? 'bg-white border-[#9E5728] ring-2 ring-[#9E5728]/25 shadow-xs'
                            : 'bg-[#FAF5EC] border-[#E8DCCF] hover:bg-white'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-lg shadow-2xs shrink-0 border border-black/10 flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {coverColor.toLowerCase() === color.hex.toLowerCase() && (
                            <Check className="w-3.5 h-3.5 text-[#453022]" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-[#4A3423] truncate">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom color input */}
                  <div className="flex items-center gap-2 pt-2">
                    <label className="text-xs text-[#7B604A]">Custom Hex:</label>
                    <input
                      type="color"
                      value={coverColor}
                      onChange={(e) => setCoverColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-[#DDCFBF] p-0.5 bg-white"
                    />
                    <span className="text-xs font-mono text-[#7B604A] uppercase bg-white px-2 py-1 rounded-md border border-[#DDCFBF]">
                      {coverColor}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 3: Add Emoji */}
              {activeTab === 'emoji' && (
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-[#8C6D53] uppercase tracking-wider block">
                    Select an Emoji Icon:
                  </label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {PRESET_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCoverEmoji(emoji)}
                        className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition cursor-pointer ${
                          coverEmoji === emoji
                            ? 'bg-[#9E5728] text-white shadow-sm scale-110'
                            : 'bg-white border border-[#E4D5C4] hover:bg-[#F2E5D4]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Custom emoji write-in */}
                  <div className="pt-2 flex items-center gap-2">
                    <label className="text-xs text-[#7B604A]">Type any Emoji:</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={customEmojiInput}
                      onChange={(e) => {
                        setCustomEmojiInput(e.target.value);
                        if (e.target.value.trim()) {
                          setCoverEmoji(e.target.value.trim());
                        }
                      }}
                      placeholder="✨"
                      className="w-16 px-2.5 py-1 text-center rounded-lg border border-[#DDCFBF] bg-white text-base"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-5 py-3.5 border-t border-[#F0E5D8] bg-[#FAF4EB] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#7D5436] hover:bg-[#EFE2D3] transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#9E5728] hover:bg-[#86461D] text-white shadow-md shadow-[#9E5728]/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Update Notes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
