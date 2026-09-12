import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  Highlighter, 
  X, 
  Plus, 
  Sparkles, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Check,
  Layers,
  BookOpen
} from 'lucide-react';
import { CanvasElement, FontStyle, JournalPage, PaperTheme } from '../types';
import { ColorThemePicker } from './ColorThemePicker';

export type LeftSidebarTab = 'theme' | 'type' | 'highlighter';

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: LeftSidebarTab;
  onChangeTab: (tab: LeftSidebarTab) => void;
  currentPage: JournalPage;
  onChangePaperTheme: (theme: PaperTheme) => void;
  onChangeCustomBackgroundColor: (color: string) => void;
  onChangeCustomBackgroundOpacity: (opacity: number) => void;
  onChangeCustomBackgroundPattern: (pattern: string) => void;
  selectedElement: CanvasElement | null;
  onUpdateSelected: (updated: Partial<CanvasElement>) => void;
  onAddElement: (elem: Partial<CanvasElement>) => void;
}

// Preset highlighter colors
const HIGHLIGHTER_PRESETS = [
  { name: 'Butter Yellow', color: '#FEF08A' },
  { name: 'Peach Glow', color: '#FED7AA' },
  { name: 'Mint Soft', color: '#BBF7D0' },
  { name: 'Sky Breeze', color: '#BAE6FD' },
  { name: 'Lavender Mist', color: '#DDD6FE' },
  { name: 'Blush Coral', color: '#FBCFE8' },
  { name: 'Golden Ochre', color: '#FDE68A' },
  { name: 'Vintage Sand', color: '#F5DFCE' },
];

// Font Families
const FONT_OPTIONS: { id: FontStyle; name: string; class: string; sample: string }[] = [
  { id: 'handwriting', name: 'Caveat Script', class: 'font-handwriting', sample: 'Dear Scrapbook journal...' },
  { id: 'kalam', name: 'Kalam Playful', class: 'font-kalam', sample: 'Happy sweet memories ✨' },
  { id: 'serif', name: 'Playfair Display', class: 'font-serif-display', sample: 'Chapter & Moments' },
  { id: 'typewriter', name: 'Courier Vintage', class: 'font-typewriter', sample: 'ARCHIVED / 1994 MEMO' },
  { id: 'editorial', name: 'Newsreader Book', class: 'font-editorial', sample: 'A delicate aesthetic reflection.' },
  { id: 'sans', name: 'Jakarta Sans', class: 'font-sans', sample: 'Modern minimal notes' },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  currentPage,
  onChangePaperTheme,
  onChangeCustomBackgroundColor,
  onChangeCustomBackgroundOpacity,
  onChangeCustomBackgroundPattern,
  selectedElement,
  onUpdateSelected,
  onAddElement,
}) => {
  // Feedback badge
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  const showFeedback = (text: string) => {
    setFeedbackText(text);
    setTimeout(() => setFeedbackText(null), 2000);
  };

  // Text Type State
  const [selectedFont, setSelectedFont] = useState<FontStyle>(
    selectedElement?.fontFamily || 'handwriting'
  );
  const [fontSize, setFontSize] = useState<number>(
    selectedElement?.fontSize || 22
  );
  const [textColor, setTextColor] = useState<string>(
    selectedElement?.color || '#3B291D'
  );
  const [newTextContent, setNewTextContent] = useState<string>('');

  // Highlighter State
  const [highlighterColor, setHighlighterColor] = useState<string>(
    selectedElement?.highlightColor || '#FEF08A'
  );
  const [highlighterOpacity, setHighlighterOpacity] = useState<number>(
    selectedElement?.highlightOpacity || 0.55
  );
  const [highlighterThickness, setHighlighterThickness] = useState<number>(24);

  // Sync with selectedElement when selection changes
  useEffect(() => {
    if (selectedElement) {
      if (selectedElement.fontFamily) setSelectedFont(selectedElement.fontFamily);
      if (selectedElement.fontSize) setFontSize(selectedElement.fontSize);
      if (selectedElement.color) setTextColor(selectedElement.color);
      if (selectedElement.highlightColor) setHighlighterColor(selectedElement.highlightColor);
      if (selectedElement.highlightOpacity) setHighlighterOpacity(selectedElement.highlightOpacity);
    }
  }, [selectedElement]);

  // Insert Text Box onto page
  const handleInsertText = (presetText?: string, presetFont?: FontStyle, presetSize?: number) => {
    const fontToUse = presetFont || selectedFont;
    const sizeToUse = presetSize || fontSize;
    const contentToUse = presetText || newTextContent.trim() || 'Write your memories here...';

    onAddElement({
      type: 'text',
      content: contentToUse,
      fontFamily: fontToUse,
      fontSize: sizeToUse,
      color: textColor,
      width: 280,
      height: 90,
      rotation: 0,
      highlightColor: highlighterColor,
      highlightOpacity: highlighterOpacity,
    });
    setNewTextContent('');
    showFeedback('Added text note to page ✨');
  };

  // Insert Highlighter Strip onto page
  const handleInsertHighlighterStrip = () => {
    onAddElement({
      type: 'highlight',
      width: 260,
      height: highlighterThickness,
      highlightColor: highlighterColor,
      highlightOpacity: highlighterOpacity,
      rotation: 0,
      color: highlighterColor,
    });
    showFeedback('Placed highlighter strip ✨');
  };

  // Collect colors currently present on the active page (Image 4)
  const getPageColors = (): string[] => {
    const colors = new Set<string>();
    if (currentPage.customBackgroundColor && currentPage.customBackgroundColor.startsWith('#')) {
      colors.add(currentPage.customBackgroundColor);
    }
    // Collect all element colors on this particular page
    currentPage.elements.forEach((el) => {
      if (el.color && el.color.startsWith('#')) colors.add(el.color);
      if (el.backgroundColor && el.backgroundColor.startsWith('#')) colors.add(el.backgroundColor);
      if (el.highlightColor && el.highlightColor.startsWith('#')) colors.add(el.highlightColor);
    });
    // Add default page colors matching Image 4
    const defaultPalette = ['#5C3D2E', '#FFFFFF', '#FFF9E2', '#681313', '#000000', '#ECEAE4'];
    defaultPalette.forEach((c) => colors.add(c));
    return Array.from(colors).slice(0, 8);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Left Sidebar Panel */}
      <aside
        id="left-sidebar-panel"
        className={`fixed inset-y-0 left-0 z-50 w-full sm:w-96 lg:w-84 bg-[#FFFDF9] border-r border-[#E9DFD0] shadow-2xl lg:shadow-none flex flex-col transition-all duration-300 ease-in-out lg:relative lg:inset-auto lg:h-full lg:shrink-0 ${
          isOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full lg:translate-x-0 lg:hidden pointer-events-none'
        }`}
      >
        {/* Header with Title & Tabs */}
        <div className="p-3 border-b border-[#EADBCC] bg-[#FAF5ED] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#8C4E26] text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs">
              ✦
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-sm text-[#3E2B1F]">
                Design & Style
              </h3>
              <p className="text-[10px] text-[#8C6D53] font-editorial">
                Text, themes & highlighter
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 text-[#8C6D53] hover:text-[#453022] hover:bg-[#EFE2D3] rounded-lg lg:hidden transition"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Main Tabs: Theme | Text Type | Highlighter */}
        <div className="grid grid-cols-3 p-1.5 bg-[#F5ECE1] border-b border-[#EADBCC] text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => onChangeTab('theme')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
              activeTab === 'theme'
                ? 'bg-white text-[#8C4E26] shadow-xs font-bold'
                : 'text-[#6D5340] hover:text-[#3B291D] hover:bg-white/50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('type')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
              activeTab === 'type'
                ? 'bg-white text-[#8C4E26] shadow-xs font-bold'
                : 'text-[#6D5340] hover:text-[#3B291D] hover:bg-white/50'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text Type</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('highlighter')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
              activeTab === 'highlighter'
                ? 'bg-white text-[#8C4E26] shadow-xs font-bold'
                : 'text-[#6D5340] hover:text-[#3B291D] hover:bg-white/50'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Highlighter</span>
          </button>
        </div>

        {/* Action feedback toast */}
        {feedbackText && (
          <div className="bg-[#4E3426] text-[#FFF9F2] text-xs font-medium px-3 py-1.5 flex items-center justify-between shrink-0">
            <span>{feedbackText}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#F6D0A0]" />
          </div>
        )}

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* TAB 1: THEME & COLOR THEME PICKER */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              {/* Paper Texture Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold text-[#453022]">
                    Paper Texture
                  </span>
                  <span className="text-[10px] text-[#8C6D53] font-mono capitalize">
                    {currentPage.paperTheme}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'lined', name: 'Lined', preview: 'bg-[#FAF7F2] border-red-300' },
                      { id: 'kraft', name: 'Kraft', preview: 'bg-[#EFE4D2] border-amber-400' },
                      { id: 'grid', name: 'Grid', preview: 'bg-[#F8F9FA] border-blue-300' },
                      { id: 'dots', name: 'Dots', preview: 'bg-[#FAF6F0] border-stone-300' },
                      { id: 'blush', name: 'Blush', preview: 'bg-[#FCF4F4] border-pink-300' },
                      { id: 'dark', name: 'Midnight', preview: 'bg-[#23201C] text-stone-300 border-stone-700' },
                    ] as const
                  ).map((theme) => {
                    const isSelected = currentPage.paperTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => {
                          onChangePaperTheme(theme.id);
                          showFeedback(`Changed theme to ${theme.name}`);
                        }}
                        className={`p-2 rounded-xl text-center border transition ${
                          theme.preview
                        } ${
                          isSelected
                            ? 'ring-2 ring-[#8C4E26] shadow-sm font-bold scale-102'
                            : 'opacity-80 hover:opacity-100 hover:border-[#8C4E26]'
                        }`}
                      >
                        <span className="text-xs font-serif block">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exact Colour Theme Picker from Reference Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold text-[#453022]">
                    Page Color & Tint
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeCustomBackgroundColor('');
                      onChangeCustomBackgroundOpacity(1);
                      showFeedback('Reset page color');
                    }}
                    className="text-[10px] text-[#8C6D53] hover:text-[#453022] underline"
                  >
                    Reset Color
                  </button>
                </div>

                <ColorThemePicker
                  color={currentPage.customBackgroundColor || '#FFF9E2'}
                  opacity={currentPage.customBackgroundOpacity ?? 1}
                  onChangeColor={(hex) => {
                    onChangeCustomBackgroundColor(hex);
                    // Also if an element is selected, update its color
                    if (selectedElement) {
                      if (selectedElement.type === 'text') {
                        onUpdateSelected({ color: hex });
                      } else if (selectedElement.type === 'highlight') {
                        onUpdateSelected({ highlightColor: hex, color: hex });
                      } else if (selectedElement.type === 'note') {
                        onUpdateSelected({ backgroundColor: hex });
                      }
                    }
                  }}
                  onChangeOpacity={(op) => {
                    onChangeCustomBackgroundOpacity(op);
                    if (selectedElement && selectedElement.type === 'highlight') {
                      onUpdateSelected({ highlightOpacity: op });
                    }
                  }}
                  onChangePattern={(pat) => {
                    onChangeCustomBackgroundPattern(pat);
                  }}
                  onThisPageColors={getPageColors()}
                />
              </div>
            </div>
          )}

          {/* TAB 2: TEXT TYPE & TYPOGRAPHY */}
          {activeTab === 'type' && (
            <div className="space-y-4">
              {/* Selected Element Notice */}
              {selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'note') ? (
                <div className="bg-[#FAF2E6] border border-[#E4D1BF] rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#8C4E26] font-semibold">
                    <Check className="w-4 h-4" />
                    <span>Editing Selected Text</span>
                  </div>
                  <span className="text-[10px] text-[#6F5543] font-mono">
                    {selectedElement.width}×{selectedElement.height}
                  </span>
                </div>
              ) : null}

              {/* Font Family Selection */}
              <div>
                <label className="text-xs font-serif font-bold text-[#453022] block mb-2">
                  Typeface / Font
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {FONT_OPTIONS.map((f) => {
                    const isSelected = selectedFont === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setSelectedFont(f.id);
                          if (selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'note')) {
                            onUpdateSelected({ fontFamily: f.id });
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FAF2E6] border-[#8C4E26] shadow-xs text-[#3E2B1F]'
                            : 'bg-[#FCFBF8] border-[#EADCCC] text-[#553E2C] hover:bg-[#F8EFE3]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-sans">{f.name}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-[#8C4E26] text-white px-1.5 py-0.2 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className={`text-base mt-0.5 truncate text-[#6F4E37] ${f.class}`}>
                            {f.sample}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Slider & Quick Pills */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-bold text-[#453022]">
                    Text Size
                  </span>
                  <span className="text-xs font-mono font-bold text-[#8C4E26] bg-[#FAF2E6] px-2 py-0.5 rounded-md">
                    {fontSize}px
                  </span>
                </div>

                <input
                  type="range"
                  min="12"
                  max="64"
                  value={fontSize}
                  onChange={(e) => {
                    const sz = parseInt(e.target.value, 10);
                    setFontSize(sz);
                    if (selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'note')) {
                      onUpdateSelected({ fontSize: sz });
                    }
                  }}
                  className="w-full accent-[#8C4E26] cursor-pointer"
                />

                <div className="flex items-center gap-1.5 mt-2">
                  {[14, 18, 24, 32, 42].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setFontSize(sz);
                        if (selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'note')) {
                          onUpdateSelected({ fontSize: sz });
                        }
                      }}
                      className={`flex-1 py-1 rounded-md text-xs font-mono transition border ${
                        fontSize === sz
                          ? 'bg-[#8C4E26] text-white border-[#8C4E26]'
                          : 'bg-[#FAF6EE] text-[#6F5543] border-[#E5D7C6] hover:bg-[#F2E8DA]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color Swatches */}
              <div>
                <span className="text-xs font-serif font-bold text-[#453022] block mb-1.5">
                  Ink Color
                </span>
                <div className="flex items-center gap-2">
                  {[
                    '#3B291D',
                    '#1C1917',
                    '#8C4E26',
                    '#B45309',
                    '#047857',
                    '#1D4ED8',
                    '#B91C1C',
                    '#6B21A8',
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setTextColor(c);
                        if (selectedElement && (selectedElement.type === 'text' || selectedElement.type === 'note')) {
                          onUpdateSelected({ color: c });
                        }
                      }}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-lg border border-black/20 shadow-xs hover:scale-110 transition ${
                        textColor === c ? 'ring-2 ring-[#8C4E26] ring-offset-1' : ''
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Text Composition & Add Button */}
              <div className="pt-2 border-t border-[#EADBCC]">
                <label className="text-xs font-serif font-bold text-[#453022] block mb-1.5">
                  Insert New Text Note
                </label>
                <textarea
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  placeholder="Type words, feelings, dates, or captions..."
                  rows={3}
                  className={`w-full p-2.5 rounded-xl bg-[#FAF6EE] border border-[#E5D7C6] text-xs text-[#3E2B1F] placeholder:text-[#A89078] outline-none focus:border-[#8C4E26] resize-none ${
                    FONT_OPTIONS.find((f) => f.id === selectedFont)?.class
                  }`}
                />

                <button
                  type="button"
                  onClick={() => handleInsertText()}
                  className="w-full mt-2 py-2 bg-[#8C4E26] hover:bg-[#723B1B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Text to Page</span>
                </button>
              </div>

              {/* Quick Style Presets */}
              <div className="pt-2 border-t border-[#EADBCC]">
                <span className="text-xs font-serif font-bold text-[#453022] block mb-2">
                  Quick Style Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInsertText('Chapter Notes', 'serif', 28)}
                    className="p-2 bg-[#FAF6EE] border border-[#E5D7C6] rounded-xl text-left hover:border-[#8C4E26] transition"
                  >
                    <span className="font-serif-display font-bold text-xs text-[#3E2B1F] block">
                      Heading Title
                    </span>
                    <span className="text-[10px] text-[#8C6D53]">Playfair 28px</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertText('A beautiful day to remember ✨', 'handwriting', 22)}
                    className="p-2 bg-[#FAF6EE] border border-[#E5D7C6] rounded-xl text-left hover:border-[#8C4E26] transition"
                  >
                    <span className="font-handwriting text-sm text-[#3E2B1F] block">
                      Diary Entry
                    </span>
                    <span className="text-[10px] text-[#8C6D53]">Caveat 22px</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertText('DATE: 12.09.26 // MEMORY ARCHIVE', 'typewriter', 16)}
                    className="p-2 bg-[#FAF6EE] border border-[#E5D7C6] rounded-xl text-left hover:border-[#8C4E26] transition"
                  >
                    <span className="font-typewriter text-xs text-[#3E2B1F] block">
                      Typewriter Memo
                    </span>
                    <span className="text-[10px] text-[#8C6D53]">Courier 16px</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInsertText('“To live is the rarest thing in the world.”', 'editorial', 20)}
                    className="p-2 bg-[#FAF6EE] border border-[#E5D7C6] rounded-xl text-left hover:border-[#8C4E26] transition"
                  >
                    <span className="font-editorial italic text-xs text-[#3E2B1F] block">
                      Literary Quote
                    </span>
                    <span className="text-[10px] text-[#8C6D53]">Newsreader 20px</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HIGHLIGHTER */}
          {activeTab === 'highlighter' && (
            <div className="space-y-4">
              {/* Selected Element Notice */}
              {selectedElement && selectedElement.type === 'highlight' ? (
                <div className="bg-[#FAF2E6] border border-[#E4D1BF] rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#8C4E26] font-semibold">
                    <Check className="w-4 h-4" />
                    <span>Editing Selected Highlighter</span>
                  </div>
                  <span className="text-[10px] text-[#6F5543] font-mono">
                    {Math.round((selectedElement.highlightOpacity || 0.5) * 100)}% opac
                  </span>
                </div>
              ) : null}

              {/* Color Presets */}
              <div>
                <label className="text-xs font-serif font-bold text-[#453022] block mb-2">
                  Highlighter Tint
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {HIGHLIGHTER_PRESETS.map((preset) => {
                    const isSelected = highlighterColor.toLowerCase() === preset.color.toLowerCase();
                    return (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => {
                          setHighlighterColor(preset.color);
                          if (selectedElement) {
                            onUpdateSelected({
                              highlightColor: preset.color,
                              color: preset.color,
                            });
                          }
                        }}
                        style={{ backgroundColor: preset.color }}
                        className={`h-11 rounded-xl border flex flex-col items-center justify-center p-1 transition shadow-xs hover:scale-105 ${
                          isSelected
                            ? 'ring-2 ring-[#8C4E26] ring-offset-2 scale-102 border-black/30'
                            : 'border-black/10'
                        }`}
                        title={preset.name}
                      >
                        <span className="text-[9px] font-bold text-black/70 truncate w-full text-center">
                          {preset.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Highlighter Palette via Reference Picker */}
              <div>
                <span className="text-xs font-serif font-bold text-[#453022] block mb-1.5">
                  Custom Highlighter Hue
                </span>
                <ColorThemePicker
                  color={highlighterColor}
                  opacity={highlighterOpacity}
                  onChangeColor={(hex) => {
                    setHighlighterColor(hex);
                    if (selectedElement) {
                      onUpdateSelected({ highlightColor: hex, color: hex });
                    }
                  }}
                  onChangeOpacity={(op) => {
                    setHighlighterOpacity(op);
                    if (selectedElement) {
                      onUpdateSelected({ highlightOpacity: op });
                    }
                  }}
                  onThisPageColors={getPageColors()}
                />
              </div>

              {/* Opacity Slider */}
              <div className="pt-2 border-t border-[#EADBCC]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-serif font-bold text-[#453022]">
                    Marker Transparency
                  </span>
                  <span className="text-xs font-mono font-bold text-[#8C4E26]">
                    {Math.round(highlighterOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={highlighterOpacity}
                  onChange={(e) => {
                    const op = parseFloat(e.target.value);
                    setHighlighterOpacity(op);
                    if (selectedElement) {
                      onUpdateSelected({ highlightOpacity: op });
                    }
                  }}
                  className="w-full accent-[#8C4E26] cursor-pointer"
                />
              </div>

              {/* Thickness / Stroke Style */}
              <div>
                <span className="text-xs font-serif font-bold text-[#453022] block mb-2">
                  Chisel Stroke Width
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Fine', h: 16 },
                    { label: 'Medium', h: 26 },
                    { label: 'Broad', h: 38 },
                  ].map((style) => (
                    <button
                      key={style.label}
                      type="button"
                      onClick={() => setHighlighterThickness(style.h)}
                      className={`p-2 rounded-xl text-center border transition ${
                        highlighterThickness === style.h
                          ? 'bg-[#FAF2E6] border-[#8C4E26] text-[#8C4E26] font-bold shadow-xs'
                          : 'bg-[#FAF6EE] border-[#E5D7C6] text-[#6F5543] hover:bg-[#F2E8DA]'
                      }`}
                    >
                      <span className="text-xs block">{style.label}</span>
                      <div
                        style={{
                          height: `${style.h / 3}px`,
                          backgroundColor: highlighterColor,
                          opacity: highlighterOpacity,
                        }}
                        className="w-full rounded-sm mt-1"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#EADBCC] space-y-2">
                <button
                  type="button"
                  onClick={handleInsertHighlighterStrip}
                  className="w-full py-2.5 bg-[#8C4E26] hover:bg-[#723B1B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Highlighter className="w-4 h-4" />
                  <span>Insert Highlighter Strip</span>
                </button>

                {selectedElement && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateSelected({
                        highlightColor: highlighterColor,
                        highlightOpacity: highlighterOpacity,
                      });
                      showFeedback('Applied highlight to selected element');
                    }}
                    className="w-full py-2 bg-[#FAF2E6] border border-[#E4D1BF] text-[#8C4E26] hover:bg-[#F3E5D4] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Highlight Selected Item</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
