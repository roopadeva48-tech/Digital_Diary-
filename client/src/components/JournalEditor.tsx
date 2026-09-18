import React, { useState, useRef, useEffect } from 'react';
import { 
  JournalCategory, 
  JournalPage, 
  CanvasElement, 
  PaperTheme 
} from '../types';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { SidebarToolbar } from './SidebarToolbar';
import { LeftSidebar, LeftSidebarTab } from './LeftSidebar';
import { EditJournalModal } from './EditJournalModal';
import { 
  ArrowLeft, 
  Plus, 
  Undo, 
  Redo, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Palette,
  Type,
  Highlighter,
  Sliders,
  Edit3
} from 'lucide-react';

interface JournalEditorProps {
  category: JournalCategory;
  onBackToDashboard: () => void;
  onUpdateCategory: (updated: JournalCategory) => void;
}

const MONTHS_LIST = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const JournalEditor: React.FC<JournalEditorProps> = ({
  category,
  onBackToDashboard,
  onUpdateCategory,
}) => {
  // Active page index
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const currentPage: JournalPage = category.pages[activePageIndex] || {
    id: 'page-new',
    title: 'New Page',
    month: 'JAN',
    day: 12,
    dayOfWeek: 'Tuesday',
    paperTheme: 'lined',
    isFavorite: false,
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Selected element ID on canvas
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Left Sidebar State (Theme, Text Type, Highlighter)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : false
  );
  const [leftSidebarTab, setLeftSidebarTab] = useState<LeftSidebarTab>('theme');

  // Right Sidebar State (Stickers, Image, Notes, Pinned, Emoji, Video)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  // Customize notes details and cover modal state
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState<boolean>(false);

  // Zoom scale state
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Mobile viewport tracking and fit mode
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [isFitMode, setIsFitMode] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute effective scale: on mobile fit mode, fit the 660px page into the viewport
  const isMobile = viewportWidth < 768;
  const availableCanvasWidth = Math.max(300, viewportWidth - (isMobile ? 20 : 64));
  const fitScale = Math.min(1, Math.max(0.42, availableCanvasWidth / 660));
  const effectiveScale = isMobile && isFitMode ? fitScale * zoomScale : zoomScale;

  // Canvas DOM and Scroll Container refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasScrollContainerRef = useRef<HTMLDivElement>(null);

  // Automatically reset scroll position to top whenever opening notes or switching pages
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (canvasScrollContainerRef.current) {
      canvasScrollContainerRef.current.scrollTop = 0;
      canvasScrollContainerRef.current.scrollLeft = 0;
    }
  }, [category.id, activePageIndex]);

  // Save feedback indicator
  const [, setIsSaved] = useState<boolean>(true);

  // History for Undo / Redo
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Update current page elements helper
  const updateCurrentPageElements = (newElements: CanvasElement[], recordHistory = true) => {
    if (recordHistory) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    const updatedPages = [...category.pages];
    updatedPages[activePageIndex] = {
      ...currentPage,
      elements: newElements,
      updatedAt: new Date().toISOString(),
    };

    onUpdateCategory({
      ...category,
      pages: updatedPages,
      updatedAt: new Date().toLocaleDateString(),
    });

    setIsSaved(true);
  };

  // Add an element to current canvas
  const handleAddElement = (newElem: Partial<CanvasElement>) => {
    const id = `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    // Default position centered in viewport or staggered below the compact header
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    const defaultX = canvasBounds ? Math.max(20, Math.min(260, canvasBounds.width / 2 - (newElem.width || 200) / 2)) : 100;
    const defaultY = Math.min(650, 70 + (currentPage.elements.length % 5) * 45);

    const fullElement: CanvasElement = {
      id,
      type: newElem.type || 'sticker',
      x: newElem.x ?? defaultX,
      y: newElem.y ?? defaultY,
      width: newElem.width || 200,
      height: newElem.height || 150,
      rotation: newElem.rotation ?? 0,
      zIndex: currentPage.elements.length + 10,
      isPinned: false,
      ...newElem,
    };

    const newElements = [...currentPage.elements, fullElement];
    updateCurrentPageElements(newElements);
    setSelectedElementId(id);
  };

  // Update single element by ID
  const handleUpdateElement = (elemId: string, updated: Partial<CanvasElement>) => {
    const newElements = currentPage.elements.map((el) =>
      el.id === elemId ? { ...el, ...updated } : el
    );
    updateCurrentPageElements(newElements);
  };

  // Delete element by ID
  const handleDeleteElement = (elemId: string) => {
    const newElements = currentPage.elements.filter((el) => el.id !== elemId);
    updateCurrentPageElements(newElements);
    if (selectedElementId === elemId) {
      setSelectedElementId(null);
    }
  };

  // Duplicate element
  const handleDuplicateElement = (elem: CanvasElement) => {
    const cloned: Partial<CanvasElement> = {
      ...elem,
      x: elem.x + 25,
      y: elem.y + 25,
      zIndex: currentPage.elements.length + 10,
    };
    handleAddElement(cloned);
  };

  // Layer ordering
  const handleBringForward = (elemId: string) => {
    const newElements = currentPage.elements.map((el) =>
      el.id === elemId ? { ...el, zIndex: el.zIndex + 2 } : el
    );
    updateCurrentPageElements(newElements);
  };

  const handleSendBackward = (elemId: string) => {
    const newElements = currentPage.elements.map((el) =>
      el.id === elemId ? { ...el, zIndex: Math.max(1, el.zIndex - 2) } : el
    );
    updateCurrentPageElements(newElements);
  };

  // Undo & Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      updateCurrentPageElements(history[prevIndex], false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      updateCurrentPageElements(history[nextIndex], false);
    }
  };

  // Add new page to collection - ATTACHED TO THE EXACT SAME DAY AND MONTH!
  const handleAddNewPage = () => {
    const newPage: JournalPage = {
      id: `page-${Date.now()}`,
      title: `Page ${category.pages.length + 1} (${currentPage.month} ${currentPage.day})`,
      month: currentPage.month, // attached to that same month!
      day: currentPage.day,     // attached to that same day!
      dayOfWeek: currentPage.dayOfWeek,
      paperTheme: currentPage.paperTheme,
      customBackgroundColor: currentPage.customBackgroundColor,
      customBackgroundOpacity: currentPage.customBackgroundOpacity,
      customBackgroundPattern: currentPage.customBackgroundPattern,
      isFavorite: false,
      elements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedPages = [...category.pages, newPage];
    onUpdateCategory({
      ...category,
      pages: updatedPages,
      updatedAt: new Date().toLocaleDateString(),
    });
    setActivePageIndex(updatedPages.length - 1);
    setSelectedElementId(null);
  };

  // Change paper theme
  const handleChangePaperTheme = (theme: PaperTheme) => {
    const updatedPages = [...category.pages];
    updatedPages[activePageIndex] = {
      ...currentPage,
      paperTheme: theme,
    };
    onUpdateCategory({ ...category, pages: updatedPages });
  };

  // Change custom background color
  const handleChangeCustomBackgroundColor = (color: string) => {
    const updatedPages = [...category.pages];
    updatedPages[activePageIndex] = {
      ...currentPage,
      customBackgroundColor: color,
    };
    onUpdateCategory({ ...category, pages: updatedPages });
  };

  // Change custom background opacity
  const handleChangeCustomBackgroundOpacity = (opacity: number) => {
    const updatedPages = [...category.pages];
    updatedPages[activePageIndex] = {
      ...currentPage,
      customBackgroundOpacity: opacity,
    };
    onUpdateCategory({ ...category, pages: updatedPages });
  };

  // Change custom background pattern
  const handleChangeCustomBackgroundPattern = (pattern: string) => {
    const updatedPages = [...category.pages];
    const newTheme: PaperTheme = 
      pattern === 'kraft' ? 'kraft' :
      pattern === 'grid' ? 'grid' :
      pattern === 'dots' ? 'dots' :
      pattern === 'lined' ? 'lined' :
      pattern === 'blush' ? 'blush' :
      pattern === 'dark' ? 'dark' : currentPage.paperTheme;

    updatedPages[activePageIndex] = {
      ...currentPage,
      paperTheme: newTheme,
      customBackgroundPattern: pattern,
    };
    onUpdateCategory({ ...category, pages: updatedPages });
  };

  // Toggle page favorite
  const handleTogglePageFavorite = () => {
    const updatedPages = [...category.pages];
    updatedPages[activePageIndex] = {
      ...currentPage,
      isFavorite: !currentPage.isFavorite,
    };
    onUpdateCategory({ ...category, pages: updatedPages });
  };

  // Date selection logic matching user request:
  // "if the user change the date or month then u give a new page with empty details.
  //  if the entered means then you show that details."
  const handleSelectMonth = (month: string) => {
    const targetMonth = month;
    const targetDay = currentPage.day;

    // Check if a page has already been entered for this month and day
    const existingIndex = category.pages.findIndex(
      (p) => p.month === targetMonth && p.day === targetDay
    );

    if (existingIndex !== -1) {
      // If entered already, switch to that page and show that page's details!
      setActivePageIndex(existingIndex);
      setSelectedElementId(null);
    } else if (currentPage.elements.length === 0 && !currentPage.isFavorite && !currentPage.customBackgroundColor) {
      // Current page is already an untouched empty page; update its date to this one
      const updatedPages = [...category.pages];
      updatedPages[activePageIndex] = {
        ...currentPage,
        month: targetMonth,
        day: targetDay,
        title: `${targetMonth} ${targetDay}`,
        updatedAt: new Date().toISOString(),
      };
      onUpdateCategory({ ...category, pages: updatedPages });
      setSelectedElementId(null);
    } else {
      // Give a brand new page with empty details
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const newPage: JournalPage = {
        id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: `${targetMonth} ${targetDay}`,
        month: targetMonth,
        day: targetDay,
        dayOfWeek: currentPage.dayOfWeek || dayNames[Math.floor(Math.random() * dayNames.length)],
        paperTheme: currentPage.paperTheme || 'lined',
        customBackgroundColor: '',
        customBackgroundOpacity: 1,
        customBackgroundPattern: 'solid',
        isFavorite: false,
        elements: [], // empty details
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedPages = [...category.pages, newPage];
      onUpdateCategory({
        ...category,
        pages: updatedPages,
        updatedAt: new Date().toLocaleDateString(),
      });
      setActivePageIndex(updatedPages.length - 1);
      setSelectedElementId(null);
    }
  };

  const handleSelectDay = (day: number) => {
    const targetMonth = currentPage.month;
    const targetDay = day;

    // Check if a page has already been entered for this month and day
    const existingIndex = category.pages.findIndex(
      (p) => p.month === targetMonth && p.day === targetDay
    );

    if (existingIndex !== -1) {
      // If entered already, switch to that page and show that page's details!
      setActivePageIndex(existingIndex);
      setSelectedElementId(null);
    } else if (currentPage.elements.length === 0 && !currentPage.isFavorite && !currentPage.customBackgroundColor) {
      // Current page is already an untouched empty page; update its date to this one
      const updatedPages = [...category.pages];
      updatedPages[activePageIndex] = {
        ...currentPage,
        month: targetMonth,
        day: targetDay,
        title: `${targetMonth} ${targetDay}`,
        updatedAt: new Date().toISOString(),
      };
      onUpdateCategory({ ...category, pages: updatedPages });
      setSelectedElementId(null);
    } else {
      // Give a brand new page with empty details
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const newPage: JournalPage = {
        id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: `${targetMonth} ${targetDay}`,
        month: targetMonth,
        day: targetDay,
        dayOfWeek: currentPage.dayOfWeek || dayNames[Math.floor(Math.random() * dayNames.length)],
        paperTheme: currentPage.paperTheme || 'lined',
        customBackgroundColor: '',
        customBackgroundOpacity: 1,
        customBackgroundPattern: 'solid',
        isFavorite: false,
        elements: [], // empty details
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedPages = [...category.pages, newPage];
      onUpdateCategory({
        ...category,
        pages: updatedPages,
        updatedAt: new Date().toLocaleDateString(),
      });
      setActivePageIndex(updatedPages.length - 1);
      setSelectedElementId(null);
    }
  };

  // Paper background class
  const getPaperClass = (theme: PaperTheme) => {
    switch (theme) {
      case 'kraft':
        return 'paper-kraft';
      case 'grid':
        return 'paper-grid';
      case 'dots':
        return 'paper-dots';
      case 'blush':
        return 'paper-blush';
      case 'dark':
        return 'paper-dark text-stone-200';
      default:
        return 'paper-lined';
    }
  };

  const selectedElement =
    currentPage.elements.find((el) => el.id === selectedElementId) || null;

  // Helper to open left sidebar to a specific tab
  const handleOpenLeftSidebarTab = (tab: LeftSidebarTab) => {
    setLeftSidebarTab(tab);
    setIsLeftSidebarOpen(true);
  };

  return (
    <div
      id="journal-editor-container"
      className="h-screen w-full bg-[#F5EFE6] flex flex-col select-none relative overflow-hidden fixed inset-0 z-40"
    >
      {/* Top Application Bar */}
      <header className="h-12 sm:h-13 bg-[#FBF7F0] border-b border-[#EEDBCA] px-3 sm:px-5 flex items-center justify-between shrink-0 z-30 shadow-2xs">
        {/* Left: Back, Title & Quick Design Triggers */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center justify-center w-9 h-9 text-[#5C3D2E] hover:text-[#3B291D] rounded-full bg-[#FAF5ED] hover:bg-[#EFE2D3] border border-[#E5D8C7] transition shrink-0 shadow-2xs"
            title="Back to Collections"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Collection Title & Emoji Badge (Clickable to customize notes & cover) */}
          <button
            type="button"
            onClick={() => setIsEditDetailsOpen(true)}
            className="flex items-center gap-2 min-w-0 bg-[#FAF5ED] hover:bg-[#F2E5D4] px-3 py-1.5 rounded-full border border-[#E5D8C7] hover:border-[#D8C7B5] transition cursor-pointer shadow-2xs group"
            title="Click to customize notes cover photo, heading name, color theme & emoji"
          >
            <span className="text-lg shrink-0 group-hover:scale-110 transition-transform">{category.coverEmoji}</span>
            <h2 className="font-serif-display font-bold text-xs sm:text-sm text-[#3E2B1F] group-hover:text-[#8C4E26] truncate max-w-[110px] sm:max-w-xs transition-colors">
              {category.title}
            </h2>
            <Edit3 className="w-3 h-3 text-[#A38A75] group-hover:text-[#8C4E26] shrink-0 opacity-70 group-hover:opacity-100 transition" />
          </button>

          <div className="h-5 w-[1px] bg-[#DBCBB9] hidden lg:block shrink-0" />

          {/* Left Sidebar Triggers: Theme, Text Type, Highlighter */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#EFE4D6] p-1 rounded-full border border-[#DDCFBF]">
            <button
              type="button"
              onClick={() => handleOpenLeftSidebarTab('theme')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                isLeftSidebarOpen && leftSidebarTab === 'theme'
                  ? 'bg-white text-[#8C4E26] shadow-xs font-bold'
                  : 'text-[#6D4F38] hover:text-[#3B291D] hover:bg-white/60'
              }`}
              title="Page Color Theme"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenLeftSidebarTab('type')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                isLeftSidebarOpen && leftSidebarTab === 'type'
                  ? 'bg-white text-[#8C4E26] shadow-xs font-bold'
                  : 'text-[#6D4F38] hover:text-[#3B291D] hover:bg-white/60'
              }`}
              title="Typeface & Typography"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text Type</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenLeftSidebarTab('highlighter')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                isLeftSidebarOpen && leftSidebarTab === 'highlighter'
                  ? 'bg-white text-[#8C4E26] shadow-xs font-bold'
                  : 'text-[#6D4F38] hover:text-[#3B291D] hover:bg-white/60'
              }`}
              title="Highlighter Tools"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Highlighter</span>
            </button>
          </div>
        </div>

        {/* Center: Page Carousel Switcher Pill */}
        <div className="flex items-center gap-2 bg-[#EFE4D6] px-3.5 sm:px-4 py-1.5 rounded-full border border-[#DDCFBF] shadow-2xs">
          <button
            type="button"
            disabled={activePageIndex === 0}
            onClick={() => {
              setActivePageIndex(activePageIndex - 1);
              setSelectedElementId(null);
            }}
            className="p-1 text-[#6B4E38] hover:text-[#3A281A] disabled:opacity-30 transition cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs sm:text-sm font-serif font-bold text-[#453022] px-1 whitespace-nowrap tracking-wide">
            {currentPage.month} {currentPage.day} ({activePageIndex + 1}/{category.pages.length})
          </span>
          <button
            type="button"
            disabled={activePageIndex === category.pages.length - 1}
            onClick={() => {
              setActivePageIndex(activePageIndex + 1);
              setSelectedElementId(null);
            }}
            className="p-1 text-[#6B4E38] hover:text-[#3A281A] disabled:opacity-30 transition cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions & Tools matching Image 5 */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Undo / Redo */}
          <div className="hidden md:flex items-center bg-[#EFE4D6] rounded-full border border-[#DDCFBF] p-0.5">
            <button
              type="button"
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              className="p-2 text-[#6B4E38] hover:text-[#3A281A] disabled:opacity-30 rounded-full transition"
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              className="p-2 text-[#6B4E38] hover:text-[#3A281A] disabled:opacity-30 rounded-full transition"
              title="Redo"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add page (attached to same day and month) */}
          <button
            type="button"
            onClick={handleAddNewPage}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-[#5C3D2E] bg-[#FAF5ED] hover:bg-[#EFE2D3] border border-[#E5D8C7] rounded-full shadow-2xs transition cursor-pointer"
            title={`Add new page on ${currentPage.month} ${currentPage.day}`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Left Sidebar Trigger (Style / ColorTheme) */}
          <button
            type="button"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E5D8C7] shadow-2xs transition cursor-pointer ${
              isLeftSidebarOpen
                ? 'bg-[#8C4E26] text-white'
                : 'bg-[#FAF5ED] hover:bg-[#EFE2D3] text-[#5C3D2E]'
            }`}
            title="Design & Style Tools"
          >
            <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right Sidebar Toggle Button (Media, Stickers & Notes) */}
          <button
            type="button"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E5D8C7] shadow-2xs transition cursor-pointer ${
              isRightSidebarOpen
                ? 'bg-[#8C4E26] text-white'
                : 'bg-[#FAF5ED] hover:bg-[#EFE2D3] text-[#5C3D2E]'
            }`}
            title="Open Stickers & Media Toolbar"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Area (Left Sidebar + Canvas + Right Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR: Text Type, Theme, Highlighter */}
        <LeftSidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
          activeTab={leftSidebarTab}
          onChangeTab={setLeftSidebarTab}
          currentPage={currentPage}
          onChangePaperTheme={handleChangePaperTheme}
          onChangeCustomBackgroundColor={handleChangeCustomBackgroundColor}
          onChangeCustomBackgroundOpacity={handleChangeCustomBackgroundOpacity}
          onChangeCustomBackgroundPattern={handleChangeCustomBackgroundPattern}
          selectedElement={selectedElement}
          onUpdateSelected={(updated) => {
            if (selectedElementId) {
              handleUpdateElement(selectedElementId, updated);
            }
          }}
          onAddElement={handleAddElement}
        />

        {/* Center Canvas Scrollable Container */}
        <div
          ref={canvasScrollContainerRef}
          className="flex-1 overflow-auto p-2 sm:p-5 pt-2 sm:pt-3 flex items-start justify-center pb-20 sm:pb-10"
          onClick={() => setSelectedElementId(null)}
        >
          {/* Responsive Fixed-Artboard Bounding Box */}
          <div
            style={{
              width: `${660 * effectiveScale}px`,
              minHeight: `${1020 * effectiveScale}px`,
              height: `${1020 * effectiveScale}px`,
            }}
            className="relative shrink-0 select-none shadow-xl rounded-2xl transition-all duration-150"
          >
            {/* Scrapbook Journal Page Canvas */}
            <div
              ref={canvasRef}
              id="scrapbook-page-canvas"
              style={{
                width: '660px',
                minHeight: '1020px',
                transform: `scale(${effectiveScale})`,
                transformOrigin: 'top left',
                backgroundColor: currentPage.customBackgroundColor || undefined,
              }}
              className={`rounded-2xl shadow-2xl shadow-[#583921]/15 border border-[#E5D7C6] px-6 sm:px-8 pt-3 pb-8 relative transition-colors duration-300 ${getPaperClass(
                currentPage.paperTheme
              )}`}
            >
              {/* Optional Custom Background Tint Layer */}
              {currentPage.customBackgroundColor && (
                <div
                  style={{
                    backgroundColor: currentPage.customBackgroundColor,
                    opacity: currentPage.customBackgroundOpacity ?? 1,
                  }}
                  className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-multiply"
                />
              )}

              {/* Top Spiral / Ring binder imitation */}
              <div className="absolute top-1.5 inset-x-12 flex justify-between pointer-events-none opacity-25 z-10">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-[#8A6D56] border border-black/20 shadow-inner"
                  />
                ))}
              </div>

              {/* COMPACT PAGE HEADER */}
              <div className="relative z-10 pt-1 pb-2 mb-3 border-b border-dashed border-[#DFD1BF]/80 select-none space-y-1.5">
                {/* Months Row */}
                <div className="flex items-center justify-between text-[11px] font-serif font-bold text-[#8C7058] tracking-wider px-2 py-0.5 bg-[#FAF3E8]/80 rounded-lg border border-[#E9DECF]">
                  {MONTHS_LIST.map((m) => {
                    const isCurrentMonth = currentPage.month === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMonth(m)}
                        className={`px-1 py-0.2 rounded transition cursor-pointer text-[10.5px] ${
                          isCurrentMonth
                            ? 'bg-[#8C4E26] text-white shadow-xs font-black'
                            : 'hover:text-[#3B291D] hover:bg-black/5'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>

                {/* Days Numbers Row (1 to 31) */}
                <div className="flex items-center justify-between text-[9px] font-mono text-[#A89078] px-0.5 py-0.5 overflow-x-auto no-scrollbar gap-0.5">
                  {[...Array(31)].map((_, idx) => {
                    const dayNum = idx + 1;
                    const isCurrentDay = currentPage.day === dayNum;
                    const hasDetails = category.pages.some(
                      (p) => p.month === currentPage.month && p.day === dayNum && p.elements.length > 0
                    );
                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => handleSelectDay(dayNum)}
                        className={`w-3.5 h-3.5 rounded-full flex flex-col items-center justify-center text-[8.5px] transition shrink-0 cursor-pointer relative ${
                          isCurrentDay
                            ? 'bg-[#B57C48] text-white font-bold ring-1 ring-[#8C4E26] shadow-xs'
                            : 'hover:text-[#3B291D] hover:bg-black/5'
                        }`}
                      >
                        <span>{dayNum}</span>
                        {hasDetails && !isCurrentDay && (
                          <span className="w-1 h-1 rounded-full bg-[#8C4E26] absolute -bottom-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Date & Title Bar */}
                <div className="flex items-center justify-between px-0.5 text-xs text-[#7A5A43]">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold tracking-wide text-[#4A3222] text-xs">
                      ✦ {currentPage.month} {currentPage.day} • {currentPage.dayOfWeek || 'Today'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentPage.title}
                      onChange={(e) => {
                        const updatedPages = [...category.pages];
                        updatedPages[activePageIndex] = {
                          ...currentPage,
                          title: e.target.value,
                        };
                        onUpdateCategory({ ...category, pages: updatedPages });
                      }}
                      placeholder="Page title or memory tag..."
                      className="bg-transparent border-b border-[#DFCDBB] text-xs font-handwriting text-[#5A3F2C] placeholder:text-[#B09A86] focus:outline-none focus:border-[#8C4E26] px-1 py-0.5 text-right max-w-[200px]"
                    />
                  </div>
                </div>
              </div>

              {/* Canvas Elements Area */}
              <div className="relative w-full h-[940px] z-10">
                {currentPage.elements.map((element) => (
                  <CanvasElementRenderer
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={() => {
                      setSelectedElementId(element.id);
                      // in mobile view user click the sticker then show the right side from the top of the page
                      if (isMobile && element.type === 'sticker') {
                        setIsRightSidebarOpen(true);
                      }
                    }}
                    onUpdate={(updated) => handleUpdateElement(element.id, updated)}
                    onDelete={() => handleDeleteElement(element.id)}
                    onDuplicate={() => handleDuplicateElement(element)}
                    onBringForward={() => handleBringForward(element.id)}
                    onSendBackward={() => handleSendBackward(element.id)}
                    canvasRef={canvasRef}
                  />
                ))}

                {currentPage.elements.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
                    <div className="text-4xl mb-2 opacity-60">✨</div>
                    <h3 className="font-serif-display text-lg font-bold text-[#6D4F38]">
                      Your Page is Blank
                    </h3>
                    <p className="text-xs text-[#9C826E] mt-1 max-w-xs font-editorial">
                      Use the left panel for Theme & Text Type, and the right panel for Stickers, Photos & Memo Notes.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom journal signature corner */}
              <div className="absolute bottom-3 right-5 text-xs font-handwriting text-[#B4957D] pointer-events-none z-10">
                ~ AuraPages • {currentPage.month} {currentPage.day} ~
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Stickers, Images, Notes, Pinned, Emoji, Video */}
        <SidebarToolbar
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          selectedElement={selectedElement}
          isPageFavorite={currentPage.isFavorite}
          onTogglePageFavorite={handleTogglePageFavorite}
          onAddElement={handleAddElement}
          onUpdateSelected={(updated) => {
            if (selectedElementId) {
              handleUpdateElement(selectedElementId, updated);
            }
          }}
        />

        {/* Mobile Floating Action & Navigation Bar */}
        <div className="sm:hidden fixed bottom-3 inset-x-3 z-30 flex items-center justify-between bg-[#2C1E14]/92 text-white backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-white/10">
          {/* Left tools trigger (Theme/Text/Highlighter) */}
          <button
            type="button"
            onClick={() => setIsLeftSidebarOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-xl transition"
          >
            <Sliders className="w-3 h-3 text-[#EED8C3]" />
            <span>Style</span>
          </button>

          {/* Page switch left */}
          <button
            type="button"
            disabled={activePageIndex === 0}
            onClick={() => {
              setActivePageIndex(activePageIndex - 1);
              setSelectedElementId(null);
            }}
            className="p-1 text-stone-300 hover:text-white disabled:opacity-30 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Info & View Mode Toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-serif font-semibold">
              {currentPage.month} {currentPage.day} ({activePageIndex + 1}/{category.pages.length})
            </span>
            <button
              type="button"
              onClick={() => {
                if (isFitMode) {
                  setIsFitMode(false);
                  setZoomScale(1);
                } else {
                  setIsFitMode(true);
                  setZoomScale(1);
                }
              }}
              className="text-[9px] font-mono bg-white/15 px-1.5 py-0.5 rounded-md hover:bg-white/25 transition text-[#F5DFCD]"
            >
              {isFitMode ? 'Fit' : '100%'}
            </button>
          </div>

          {/* Page switch right */}
          <button
            type="button"
            disabled={activePageIndex === category.pages.length - 1}
            onClick={() => {
              setActivePageIndex(activePageIndex + 1);
              setSelectedElementId(null);
            }}
            className="p-1 text-stone-300 hover:text-white disabled:opacity-30 rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Right tools trigger (Stickers & Media) */}
          <button
            type="button"
            onClick={() => setIsRightSidebarOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold bg-[#8C4E26] hover:bg-[#A35D31] text-white px-2.5 py-1.5 rounded-xl shadow-xs transition"
          >
            <Sparkles className="w-3 h-3" />
            <span>Stickers</span>
          </button>
        </div>
      </div>

      {/* Customize notes & cover photo modal */}
      <EditJournalModal
        isOpen={isEditDetailsOpen}
        onClose={() => setIsEditDetailsOpen(false)}
        category={category}
        onSave={(updated) => {
          onUpdateCategory({
            ...category,
            ...updated,
          });
        }}
      />
    </div>
  );
};
