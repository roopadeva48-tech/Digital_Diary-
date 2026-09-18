import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalCategory, UserProfile } from '../types';
import { JournalCard } from './JournalCard';
import { EditJournalModal } from './EditJournalModal';
import { Logo } from './Logo';
import { 
  Plus, 
  Search, 
  Star, 
  BookOpen, 
  LogOut, 
  Sparkles, 
  Filter, 
  Layers, 
  Heart,
  X,
  Smile,
  Upload
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  categories: JournalCategory[];
  onSelectCategory: (category: JournalCategory) => void;
  onAddCategory: (category: Omit<JournalCategory, 'id' | 'createdAt' | 'updatedAt' | 'pages'>) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleFavorite: (categoryId: string) => void;
  onUpdateCategory?: (updated: JournalCategory) => void;
  onLogout: () => void;
}

const COLOR_OPTIONS = [
  '#E6D3BF', // Warm tan
  '#D3E4CD', // Sage green
  '#F5E8C7', // Soft butter
  '#C9D6DF', // Muted periwinkle
  '#FAD2E1', // Blush pink
  '#E2ECE9', // Mint mist
  '#DFCCF1', // Lavender
  '#F0E5D8', // Cream
];

const EMOJI_OPTIONS = ['🌸', '🎒', '🎓', '✈️', '☕', '📖', '🎀', '💌', '🕯️', '🧸', '🌿', '🎨'];

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  categories,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  onToggleFavorite,
  onUpdateCategory,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<JournalCategory | null>(null);

  // New Category form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0]);
  const [newEmoji, setNewEmoji] = useState(EMOJI_OPTIONS[0]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterMode === 'all' || (filterMode === 'favorites' && cat.isFavorite);
    return matchesSearch && matchesFilter;
  });

  const totalPagesCount = categories.reduce((sum, cat) => sum + cat.pages.length, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddCategory({
      title: newTitle.trim(),
      description: newDescription.trim(),
      coverColor: newColor,
      coverEmoji: newEmoji,
      coverImage: newImageUrl.trim() || undefined,
      isFavorite: false,
    });

    // Reset & close
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setIsCreateModalOpen(false);
  };

  return (
    <motion.div
      id="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#FAF6EE] flex flex-col text-[#3D2E21]"
    >
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-30 h-14 sm:h-16 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#E8DEC8] px-4 sm:px-8 py-2 sm:py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Logo size="xs" showSlogan={false} className="shrink-0" />
          <div className="hidden sm:flex flex-col justify-center">
            <h1 className="text-base sm:text-lg font-serif-display font-bold text-[#453022] leading-tight tracking-tight">
              AuraPages
            </h1>
            <p className="text-[11px] sm:text-xs text-[#8C6D53] tracking-wider font-editorial mt-1 leading-tight">
              Personal Digital Scrapbook
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F3E8DA] px-2.5 py-1 rounded-full border border-[#DFCEBA]">
            <span className="text-xs">{user.avatar || '🌸'}</span>
            <span className="text-xs font-semibold text-[#543825] max-w-[120px] truncate">
              {user.name}
            </span>
          </div>

          <button
            id="btn-logout"
            type="button"
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-[#8C6D53] hover:text-[#453022] hover:bg-[#EFE2D3] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Welcome & Stats Hero Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FFFDF9] border border-[#E9DFD0] rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          {/* Decorative washi strip */}
          <div className="absolute top-0 right-10 w-24 h-3 bg-[#EAD1B9]/70 rounded-b-sm" />

          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#99633B]">
              <Sparkles className="w-3 h-3 text-[#C47D42]" />
              <span>Sanctuary Collection</span>
            </div>
            <h2 className="mt-0.5 text-xl sm:text-2xl font-serif-display font-bold text-[#3B291D]">
              Welcome back, {user.name}
            </h2>
            <p className="text-xs text-[#7F644E] mt-0.5 font-editorial">
              Capture your cherished memories, school nostalgias, and creative spreads.
            </p>
          </div>

          {/* Quick Metrics & New Journal Button */}
          <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2.5">
            <div className="flex items-center justify-center gap-3 bg-[#FAF5EC] px-3.5 py-1.5 rounded-xl border border-[#E8DAC9] text-xs text-[#6B503B]">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#B96F37]" />
                <span>
                  <b>{categories.length}</b> Collections
                </span>
              </div>
              <div className="h-3 w-[1px] bg-[#DBCBB9]" />
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#B96F37]" />
                <span>
                  <b>{totalPagesCount}</b> Pages
                </span>
              </div>
            </div>

            <button
              id="btn-create-category"
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-1.5 bg-[#9E5728] hover:bg-[#85451C] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-sm transition hover:shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Collection</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#A88C76] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-journals"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections by title or description..."
              className="w-full pl-11 pr-14 py-2.5 sm:py-3 bg-[#FFFDF9] border border-[#E5DACD] rounded-xl text-sm sm:text-base text-[#3E2B1F] placeholder:text-[#AFA090] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/30 shadow-xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#A88C76] hover:text-[#543825] bg-[#F2E8DB] px-2 py-1 rounded-md transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#F2E8DB] p-1.5 rounded-xl border border-[#E2D4C3] self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                filterMode === 'all'
                  ? 'bg-white text-[#4A3423] shadow-xs font-semibold'
                  : 'text-[#856B55] hover:text-[#4A3423]'
              }`}
            >
              All Journals ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('favorites')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                filterMode === 'favorites'
                  ? 'bg-white text-[#4A3423] shadow-xs font-semibold'
                  : 'text-[#856B55] hover:text-[#4A3423]'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-[#C47D42] fill-[#C47D42]" />
              <span>Favorites ({categories.filter((c) => c.isFavorite).length})</span>
            </button>
          </div>
        </div>

        {/* Categories Grid (Mobile-first responsive layout) */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredCategories.map((category, index) => (
              <JournalCard
                key={category.id}
                category={category}
                index={index}
                onSelect={onSelectCategory}
                onEdit={(cat, e) => {
                  e.stopPropagation();
                  setEditingCategory(cat);
                }}
                onToggleFavorite={(id, e) => {
                  e.stopPropagation();
                  onToggleFavorite(id);
                }}
                onDelete={(id, e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete "${category.title}"?`)) {
                    onDeleteCategory(id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFDF9] rounded-2xl border border-dashed border-[#DFCDBB] p-8">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-base font-serif-display font-semibold text-[#4F3928]">
              No collections found
            </h3>
            <p className="text-xs text-[#876E5B] mt-1 font-editorial">
              {searchQuery
                ? `No journal matched "${searchQuery}". Try a different keyword.`
                : 'Start your digital scrapbooking journey by adding your first collection!'}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 bg-[#9E5728] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#85451C] transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Journal</span>
            </button>
          </div>
        )}
      </main>

      {/* Modal: Create New Journal Collection */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-[#FFFDF9] rounded-2xl border border-[#E9DFD0] shadow-2xl p-5 sm:p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Top Washi strip */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#E8D4BE]/90 -rotate-1 rounded-sm shadow-xs border-y border-[#D6BC9F]/50 pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8]">
                <h3 className="text-lg font-serif-display font-bold text-[#453022]">
                  New Journal Collection
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-[#A08873] hover:text-[#453022] hover:bg-[#F3E8DB] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#5B422F]">
                    Collection Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Kyoto Trip, Creative Musings, Book Log"
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] rounded-xl border border-[#DDCFBE] text-sm text-[#3E2B1F] placeholder:text-[#B7A18F] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/40"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#5B422F]">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="A brief memo about what you record here..."
                    className="w-full px-3.5 py-2 bg-[#FAF6F0] rounded-xl border border-[#DDCFBE] text-xs sm:text-sm text-[#3E2B1F] placeholder:text-[#B7A18F] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/40 resize-none font-editorial"
                  />
                </div>

                {/* Cover Emoji */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5B422F]">
                    Cover Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                          newEmoji === emoji
                            ? 'bg-[#EBD6C1] ring-2 ring-[#9E5728] scale-105'
                            : 'bg-[#FAF6F0] hover:bg-[#F2E5D5]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cover Color */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5B422F]">
                    Cover Color Theme
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border border-black/10 transition transform ${
                          newColor === color
                            ? 'ring-2 ring-offset-2 ring-[#9E5728] scale-110'
                            : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Optional Cover Image URL */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#5B422F]">
                    Optional Cover Image (URL)
                  </label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-[#FAF6F0] rounded-xl border border-[#DDCFBE] text-xs text-[#3E2B1F] placeholder:text-[#B7A18F] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/40"
                  />
                </div>

                {/* Actions */}
                <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#F0E6D8]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#7A604B] hover:bg-[#F2E5D5] rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#9E5728] hover:bg-[#85451C] rounded-xl shadow-xs transition"
                  >
                    Create Journal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditJournalModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
          onSave={(updated) => {
            if (onUpdateCategory) {
              onUpdateCategory({
                ...editingCategory,
                ...updated,
              });
            }
          }}
        />
      )}
    </motion.div>
  );
};
