import React, { useState, useRef } from 'react';
import { CanvasElement } from '../types';
import { StickerLibrary } from './StickerLibrary';
import { 
  Image as ImageIcon, 
  Pin, 
  Smile, 
  Video, 
  Upload, 
  Sparkles, 
  X, 
  Plus, 
  Star, 
  FileText
} from 'lucide-react';
import { SCRAPBOOK_EMOJIS } from '../data/stickers';

interface SidebarToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: CanvasElement | null;
  isPageFavorite: boolean;
  onTogglePageFavorite: () => void;
  onAddElement: (elem: Partial<CanvasElement>) => void;
  onUpdateSelected: (updated: Partial<CanvasElement>) => void;
}

export type ActiveToolTab = 
  | 'stickers'
  | 'image'
  | 'text'
  | 'pinned'
  | 'emoji'
  | 'video';

export const SidebarToolbar: React.FC<SidebarToolbarProps> = ({
  isOpen,
  onClose,
  selectedElement,
  isPageFavorite,
  onTogglePageFavorite,
  onAddElement,
  onUpdateSelected,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveToolTab>('stickers');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Wrap onAddElement with feedback notification
  const handleAddWithFeedback = (elem: Partial<CanvasElement>, label = 'Item') => {
    onAddElement(elem);
    setAddedNotice(`Added "${label}" to page ✨`);
    setTimeout(() => {
      setAddedNotice(null);
    }, 2000);
  };

  // Text inputs for quick note
  const [newTextContent, setNewTextContent] = useState('');

  // Video embed input
  const [videoUrl, setVideoUrl] = useState<string>('');

  // Image input
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageCaption, setImageCaption] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tools configuration array (Only creative embellishments, removed theme, type, highlighter, size)
  const toolList = [
    { id: 'stickers', name: 'Stickers', icon: Sparkles, badge: 'Sets' },
    { id: 'image', name: 'Image', icon: ImageIcon },
    { id: 'text', name: 'Notes', icon: FileText },
    { id: 'pinned', name: 'Pinned', icon: Pin },
    { id: 'emoji', name: 'Emoji', icon: Smile },
    { id: 'video', name: 'Video', icon: Video },
  ] as const;

  // Add custom text box
  const handleAddText = (presetContent?: string) => {
    handleAddWithFeedback({
      type: 'text',
      content: presetContent || (newTextContent.trim() || 'Write your memories here...'),
      fontFamily: 'handwriting',
      fontSize: 22,
      color: '#2D2319',
      width: 280,
      height: 100,
      rotation: 0,
      highlightColor: '#FEF08A',
      highlightOpacity: 0.55,
    }, 'Text Note');
    setNewTextContent('');
  };

  // Add image upload
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      if (loadEvt.target?.result) {
        handleAddWithFeedback({
          type: 'image',
          src: loadEvt.target.result as string,
          title: imageCaption.trim() || file.name.replace(/\.[^/.]+$/, ''),
          width: 220,
          height: 270,
          rotation: -1,
        }, 'Polaroid Photo');
        setImageCaption('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    handleAddWithFeedback({
      type: 'image',
      src: imageUrl.trim(),
      title: imageCaption.trim() || 'Memories',
      width: 220,
      height: 270,
      rotation: -1,
    }, 'Polaroid Photo');
    setImageUrl('');
    setImageCaption('');
  };

  // Add video clip
  const handleAddVideo = () => {
    const defaultSample = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    handleAddWithFeedback({
      type: 'video',
      src: videoUrl.trim() || defaultSample,
      title: 'Cherished Moment Video',
      width: 280,
      height: 200,
      rotation: 0,
    }, 'Video Clip');
    setVideoUrl('');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Right Sidebar Container (In mobile view, shows from the top of the page) */}
      <aside
        id="sidebar-toolbar"
        className={`fixed top-0 left-0 right-0 sm:left-auto sm:right-0 z-50 w-full sm:w-96 lg:w-88 max-h-[85vh] sm:max-h-full h-auto sm:h-full bg-[#FFFDF9] border-b-2 sm:border-b-0 sm:border-l border-[#EEDBCA] shadow-2xl lg:shadow-none rounded-b-3xl sm:rounded-none flex flex-col transition-all duration-300 ease-in-out lg:relative lg:inset-auto lg:h-full lg:shrink-0 ${
          isOpen
            ? 'translate-y-0 opacity-100 sm:translate-x-0'
            : '-translate-y-full opacity-0 sm:translate-y-0 sm:translate-x-full lg:translate-x-0 lg:opacity-100 lg:hidden pointer-events-none'
        }`}
      >
        {/* Mobile Pull Bar Indicator */}
        <div className="sm:hidden pt-2 pb-0.5 flex justify-center bg-[#FAF5ED] rounded-t-none">
          <div className="w-12 h-1.5 rounded-full bg-[#D8C7B7]" />
        </div>

        {/* Top Header */}
        <div className="px-4 py-3.5 border-b border-[#EEDBCA] bg-[#FAF5ED] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#EED8C3] text-[#7C4825]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-serif-display font-bold text-[#453022]">
                Media & Stickers
              </h3>
              <p className="text-[10px] text-[#8C6D53]">Stickers, photos & elements</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 text-[#8C6D53] hover:text-[#453022] hover:bg-[#EFE2D3] rounded-lg lg:hidden transition"
            >
              <span>View Canvas</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Added Notification Toast */}
        {addedNotice && (
          <div className="bg-[#5C3D2E] text-[#FFF7ED] text-xs font-medium px-4 py-2 flex items-center justify-between animate-fadeIn shrink-0">
            <span>{addedNotice}</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Placed</span>
          </div>
        )}

        {/* Scrollable Tool Categories Bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#EADBCC] bg-[#FAF6EE] overflow-x-auto no-scrollbar shrink-0">
          {toolList.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#8C4E26] text-white shadow-xs font-semibold'
                    : 'bg-[#F3E7D8] text-[#6E4F38] hover:bg-[#EBDBC9]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tool Content Body */}
        <div className="flex-1 overflow-y-auto bg-[#FFFDF9] relative">
          {/* 1. STICKERS LIBRARY (Comprehensive sticker catalog from uploaded images) */}
          {activeTab === 'stickers' && (
            <StickerLibrary
              onAddElement={(elem) =>
                handleAddWithFeedback(
                  elem,
                  elem.type === 'note'
                    ? 'Memo Frame'
                    : elem.type === 'image'
                    ? 'Polaroid'
                    : elem.type === 'music'
                    ? 'Music Player'
                    : 'Sticker'
                )
              }
            />
          )}

          {/* 2. IMAGE UPLOAD & GALLERY */}
          {activeTab === 'image' && (
            <div className="p-4 space-y-4 text-xs text-[#4A3423]">
              <div>
                <h4 className="font-bold text-sm text-[#453022]">Polaroid & Photo Frames</h4>
              </div>

              {/* Upload file */}
              <div className="space-y-2">
                <label className="font-semibold text-[11px] text-[#614732] block">
                  Photo Caption
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Kyoto Sunset, 1998"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#DFCDBB] text-xs text-[#3E2B1F] placeholder:text-[#A88E78] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/30"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-[#DFCDBB] hover:border-[#8C4E26] rounded-xl flex flex-col items-center justify-center gap-1 text-[#8C6D53] hover:text-[#8C4E26] bg-[#FAF6EE] hover:bg-[#F3E7D8] transition cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold text-xs">Upload Photo from Device</span>
                  <span className="text-[10px] text-[#A88E78]">JPG, PNG, WebP supported</span>
                </button>
              </div>

              {/* Or paste URL */}
              <div className="space-y-2 pt-3 border-t border-[#F0E6DA]">
                <label className="font-semibold text-[11px] text-[#614732] block">
                  Or Paste Photo Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#DFCDBB] text-xs text-[#3E2B1F] placeholder:text-[#A88E78] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-[#8C4E26] text-white rounded-xl font-semibold hover:bg-[#723B17] transition cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sample Polaroid presets */}
              <div className="space-y-2 pt-2 border-t border-[#F0E6DA]">
                <span className="font-semibold text-[11px] text-[#614732] block">
                  Aesthetic Sample Photos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
                      title: 'Forest Pine Sunlight',
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
                      title: 'Yosemite Mountain Stream',
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80',
                      title: 'Morning Cherry Blossoms',
                    },
                    {
                      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
                      title: 'Turquoise Summer Coast',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() =>
                        handleAddWithFeedback({
                          type: 'image',
                          src: preset.url,
                          title: preset.title,
                          width: 220,
                          height: 270,
                          rotation: -2,
                        }, 'Polaroid Photo')
                      }
                      className="group relative rounded-xl overflow-hidden border border-[#E9DFD0] hover:border-[#8C4E26] p-1 bg-white shadow-2xs transition hover:scale-102 cursor-pointer"
                    >
                      <div className="w-full h-24 overflow-hidden rounded-lg bg-stone-100">
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition duration-300"
                        />
                      </div>
                      <div className="p-1 text-center font-handwriting text-xs text-[#4A3423] truncate">
                        {preset.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. TEXT & QUICK NOTES */}
          {activeTab === 'text' && (
            <div className="p-4 space-y-4 text-xs text-[#4A3423]">
              <div>
                <h4 className="font-bold text-sm text-[#453022]">Quick Note Elements</h4>
              </div>

              {/* Quick Note Presets */}
              <div className="space-y-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[#8C6D53]">
                  Note Styles
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddText('A quiet, beautiful moment to cherish forever...')}
                    className="p-3 bg-[#FAF6EE] border border-[#E9DFD0] hover:border-[#8C4E26] rounded-xl text-left transition hover:shadow-xs"
                  >
                    <div className="font-handwriting text-base text-[#3E291B]">Cursive Memo</div>
                    <div className="text-[10px] text-[#8C6D53] font-editorial">Handwritten Note</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddText('grateful for warm coffee, soft rain & cozy books ♡')}
                    className="p-3 bg-[#FAF6EE] border border-[#E9DFD0] hover:border-[#8C4E26] rounded-xl text-left transition hover:shadow-xs"
                  >
                    <div className="font-kalam text-sm text-[#3E291B]">Gratitude Note</div>
                    <div className="text-[10px] text-[#8C6D53]">Journal Reflection</div>
                  </button>
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-2 pt-2 border-t border-[#F0E6DA]">
                <label className="font-semibold text-[11px] text-[#614732] block">
                  Write Custom Note
                </label>
                <textarea
                  rows={3}
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  placeholder="Type anything to place onto the lined page..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#DFCDBB] text-sm text-[#3E2B1F] placeholder:text-[#A88E78] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/30 font-handwriting text-lg resize-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddText()}
                  className="w-full py-2 bg-[#8C4E26] text-white rounded-xl font-semibold text-xs hover:bg-[#723B17] transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Note Box</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. PINNED & FAVORITES */}
          {activeTab === 'pinned' && (
            <div className="p-4 space-y-4 text-xs text-[#4A3423]">
              <div>
                <h4 className="font-bold text-sm text-[#453022] mb-1">Pinning & Favorites</h4>
                <p className="text-[11px] text-[#876E59] font-editorial">
                  Pin your favorite elements in place or mark this entire scrapbook spread as a favorite.
                </p>
              </div>

              {/* Pin Page */}
              <button
                type="button"
                onClick={onTogglePageFavorite}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${
                  isPageFavorite
                    ? 'border-[#C47D42] bg-[#FFF8EE]'
                    : 'border-[#E9DFD0] bg-[#FAF7F1]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star
                    className={`w-4 h-4 ${
                      isPageFavorite ? 'text-[#C47D42] fill-[#C47D42]' : 'text-[#8C6D53]'
                    }`}
                  />
                  <span className="font-semibold text-xs">
                    {isPageFavorite ? 'Page Marked as Favorite' : 'Mark Page as Favorite'}
                  </span>
                </div>
                <span className="text-[11px] text-[#8C6D53]">
                  {isPageFavorite ? 'Starred' : 'Unstarred'}
                </span>
              </button>

              {/* Pin Selected Element */}
              {selectedElement ? (
                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#EADBCC] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-[#4A3423]">Selected Item:</span>
                    <span className="capitalize font-mono text-[11px] text-[#8C4E26]">
                      {selectedElement.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSelected({ isPinned: !selectedElement.isPinned })}
                    className="w-full py-2 bg-[#8C4E26] text-white rounded-xl font-semibold text-xs hover:bg-[#723B17] transition flex items-center justify-center gap-1.5"
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>{selectedElement.isPinned ? 'Unpin Element' : 'Pin Element in Place'}</span>
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-[#A0856E] italic text-center">
                  Select any sticker, photo, or note on the canvas to pin it securely so it won't move accidentally.
                </p>
              )}
            </div>
          )}

          {/* 5. EMOJI SELECTOR */}
          {activeTab === 'emoji' && (
            <div className="p-4 space-y-4 text-xs text-[#4A3423]">
              <div>
                <h4 className="font-bold text-sm text-[#453022] mb-1">Scrapbook Emojis</h4>
                <p className="text-[11px] text-[#876E59] font-editorial">
                  Click any aesthetic scrapbook emoji to stamp it onto the page.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-[#FAF6EE] p-3 rounded-2xl border border-[#E9DFD0]">
                {SCRAPBOOK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      handleAddWithFeedback(
                        {
                          type: 'sticker',
                          stickerCategory: 'decor',
                          content: emoji,
                          width: 75,
                          height: 75,
                          rotation: 0,
                        },
                        `Emoji ${emoji}`
                      );
                    }}
                    className="h-12 rounded-xl flex items-center justify-center text-2xl hover:bg-white hover:scale-115 transition shadow-xs cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. SHORT VIDEO EMBED */}
          {activeTab === 'video' && (
            <div className="p-4 space-y-4 text-xs text-[#4A3423]">
              <div>
                <h4 className="font-bold text-sm text-[#453022] mb-1">Video Memory Clip</h4>
                <p className="text-[11px] text-[#876E59] font-editorial">
                  Embed or upload a short looping memory clip in a vintage player frame.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-[11px] text-[#614732] block">
                  Video URL (MP4 / WebM)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://.../my-clip.mp4 (leave empty for sample)"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#DFCDBB] text-xs text-[#3E2B1F] placeholder:text-[#A88E78] focus:outline-none focus:ring-2 focus:ring-[#C47D42]/30"
                />
                <button
                  type="button"
                  onClick={handleAddVideo}
                  className="w-full py-2 bg-[#8C4E26] text-white rounded-xl font-semibold text-xs hover:bg-[#723B17] transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Video Clip</span>
                </button>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E9DFD0]">
                <span className="text-[10px] text-[#8C6D53]">
                  Tip: Video clips are styled like vintage memory screens with embedded playback controls.
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
