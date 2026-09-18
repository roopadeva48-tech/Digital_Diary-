import React, { useState } from 'react';
import { motion } from 'motion/react';
import { JournalCategory } from '../types';
import { BookOpen, Star, MoreVertical, Calendar, Sparkles, Trash2, Edit3 } from 'lucide-react';

interface JournalCardProps {
  category: JournalCategory;
  index: number;
  onSelect: (category: JournalCategory) => void;
  onToggleFavorite: (categoryId: string, e: React.MouseEvent) => void;
  onDelete: (categoryId: string, e: React.MouseEvent) => void;
  onEdit?: (category: JournalCategory, e: React.MouseEvent) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({
  category,
  index,
  onSelect,
  onToggleFavorite,
  onDelete,
  onEdit,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      id={`journal-card-${category.id}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(category)}
      className="group relative cursor-pointer select-none rounded-2xl bg-[#FFFDF9] border border-[#E8DCCF] shadow-sm hover:shadow-xl hover:shadow-[#7D4C27]/12 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Decorative Washi Tape on top edge */}
      <div className="absolute -top-3 left-8 w-20 h-6 bg-[#E8D4BE]/90 -rotate-3 z-20 shadow-xs border-y border-[#D6BC9F]/50 pointer-events-none" />

      {/* Card Cover Header / Image banner */}
      <div
        className="h-36 sm:h-40 w-full relative overflow-hidden flex items-center justify-center p-4"
        style={{ backgroundColor: category.coverColor || '#EBD8C3' }}
      >
        {category.coverImage && !imageError ? (
          <>
            <img
              src={category.coverImage}
              alt={category.title}
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </>
        ) : (
          <div className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
            {category.coverEmoji}
          </div>
        )}

        {/* Action Buttons Container */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {/* Edit Details Button */}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => onEdit(category, e)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/25 text-white hover:bg-[#8C4E26] hover:text-white backdrop-blur-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-xs"
              title="Edit photo, heading name, color theme & emoji"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Category Button */}
          <button
            type="button"
            onClick={(e) => onDelete(category.id, e)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/25 text-white hover:bg-red-500 hover:text-white backdrop-blur-md transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-xs"
            title="Delete collection"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Favorite Pin Button */}
          <button
            type="button"
            onClick={(e) => onToggleFavorite(category.id, e)}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              category.isFavorite
                ? 'bg-[#FFECC8] text-[#C47D42] shadow-sm'
                : 'bg-black/25 text-white/80 hover:bg-black/40 hover:text-white'
            }`}
            title={category.isFavorite ? 'Remove from favorites' : 'Pin to favorites'}
          >
            <Star className={`w-4 h-4 ${category.isFavorite ? 'fill-[#C47D42]' : ''}`} />
          </button>
        </div>

        {/* Category Cover Emoji Pill if cover image is present */}
        {category.coverImage && !imageError && (
          <div className="absolute bottom-3 left-3 z-10 w-9 h-9 rounded-xl bg-[#FFFDF9]/90 backdrop-blur-sm border border-[#E6D6C4] flex items-center justify-center text-lg shadow-sm">
            {category.coverEmoji}
          </div>
        )}

        {/* Page Count Badge */}
        <div className="absolute bottom-3 right-3 z-10 text-[11px] font-medium bg-[#2A1E16]/75 text-[#FAF6F0] px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-[#E8C59A]" />
          <span>{category.pages.length} {category.pages.length === 1 ? 'page' : 'pages'}</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#FFFDF9]">
        <div>
          <h3 className="text-lg font-serif-display font-bold text-[#3B291D] group-hover:text-[#995526] transition-colors line-clamp-1">
            {category.title}
          </h3>
          <p className="text-xs text-[#7B6350] mt-1.5 line-clamp-2 leading-relaxed font-editorial">
            {category.description || 'A cozy corner for your scrapbook entries and daily memories.'}
          </p>
        </div>

        {/* Footer info: Last edited & Action prompt */}
        <div className="mt-4 pt-3 border-t border-[#F2E8DC] flex items-center justify-between text-[11px] text-[#A38A75]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Updated {category.updatedAt}</span>
          </span>
          <span className="font-semibold text-[#8C4E26] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <span>Open</span>
            <span>&rarr;</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
