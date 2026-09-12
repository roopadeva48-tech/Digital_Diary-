import React, { useState, useRef, useEffect } from 'react';
import { CanvasElement } from '../types';
import { 
  Pin, 
  Trash2, 
  RotateCw, 
  Move, 
  Check, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Copy,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface CanvasElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: Partial<CanvasElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const CanvasElementRenderer: React.FC<CanvasElementRendererProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  canvasRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicProgress, setMusicProgress] = useState(35);
  const [isEditingText, setIsEditingText] = useState(false);

  const startPosRef = useRef({ x: 0, y: 0 });
  const startDimRef = useRef({ width: 0, height: 0 });
  const startElemPosRef = useRef({ x: 0, y: 0 });
  const centerRef = useRef({ x: 0, y: 0 });

  // Music progress timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingMusic) {
      interval = setInterval(() => {
        setMusicProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingMusic]);

  // Drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    if (element.isPinned) return;
    // Don't drag if clicking buttons or input
    if ((e.target as HTMLElement).closest('button, input, textarea, .no-drag')) return;

    e.stopPropagation();
    onSelect();

    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startElemPosRef.current = { x: element.x, y: element.y };

    const getScale = () => {
      const rect = canvasRef.current?.getBoundingClientRect();
      return rect && rect.width > 0 ? rect.width / 660 : 1;
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const scale = getScale();
      const dx = (moveEvent.clientX - startPosRef.current.x) / scale;
      const dy = (moveEvent.clientY - startPosRef.current.y) / scale;
      onUpdate({
        x: Math.max(0, Math.min(660 - 40, startElemPosRef.current.x + dx)),
        y: Math.max(0, startElemPosRef.current.y + dy),
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Resize handling
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startDimRef.current = { width: element.width, height: element.height };

    const getScale = () => {
      const rect = canvasRef.current?.getBoundingClientRect();
      return rect && rect.width > 0 ? rect.width / 660 : 1;
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const scale = getScale();
      const dx = (moveEvent.clientX - startPosRef.current.x) / scale;
      const dy = (moveEvent.clientY - startPosRef.current.y) / scale;
      onUpdate({
        width: Math.max(60, startDimRef.current.width + dx),
        height: Math.max(30, startDimRef.current.height + dy),
      });
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Rotation handling
  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsRotating(true);

    const elem = e.currentTarget.parentElement;
    if (elem) {
      const rect = elem.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - centerRef.current.x;
      const dy = moveEvent.clientY - centerRef.current.y;
      const radians = Math.atan2(dy, dx);
      let degrees = Math.round((radians * 180) / Math.PI) + 90;
      onUpdate({ rotation: degrees });
    };

    const handlePointerUp = () => {
      setIsRotating(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const getFontClass = (font?: string) => {
    switch (font) {
      case 'handwriting':
        return 'font-handwriting';
      case 'serif':
        return 'font-serif-display';
      case 'typewriter':
        return 'font-typewriter';
      case 'kalam':
        return 'font-kalam';
      case 'editorial':
        return 'font-editorial';
      default:
        return 'font-sans';
    }
  };

  // Toggle todo items in note
  const handleToggleNoteItem = (itemId: string) => {
    if (!element.noteItems) return;
    const newItems = element.noteItems.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    onUpdate({ noteItems: newItems });
  };

  return (
    <div
      id={`canvas-elem-${element.id}`}
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        minHeight: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`group select-none transition-shadow ${
        isSelected
          ? 'ring-2 ring-[#C47D42] ring-offset-2 ring-offset-transparent shadow-lg'
          : 'hover:ring-1 hover:ring-[#C47D42]/40'
      } ${element.isPinned ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
    >
      {/* Pinned visual icon indicator */}
      {element.isPinned && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 text-[#B96F37] drop-shadow-sm pointer-events-none">
          <Pin className="w-5 h-5 fill-[#B96F37]" />
        </div>
      )}

      {/* Floating Action Controls Bar when selected */}
      {isSelected && (
        <div
          className={`absolute ${
            element.y < 55 ? 'top-full mt-2.5' : '-top-12'
          } left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-[#2C1E14] text-white px-2 py-1 sm:px-2.5 sm:py-1 rounded-full shadow-xl text-xs backdrop-blur-md no-drag whitespace-nowrap border border-white/10`}
        >
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 sm:p-1 hover:bg-white/20 active:bg-white/30 rounded-md transition touch-manipulation"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            type="button"
            onClick={onBringForward}
            className="p-1.5 sm:p-1 hover:bg-white/20 active:bg-white/30 rounded-md transition touch-manipulation"
            title="Bring Forward"
          >
            <ArrowUp className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            type="button"
            onClick={onSendBackward}
            className="p-1.5 sm:p-1 hover:bg-white/20 active:bg-white/30 rounded-md transition touch-manipulation"
            title="Send Backward"
          >
            <ArrowDown className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ isPinned: !element.isPinned })}
            className={`p-1.5 sm:p-1 hover:bg-white/20 active:bg-white/30 rounded-md transition touch-manipulation ${
              element.isPinned ? 'text-[#F3B37C]' : ''
            }`}
            title={element.isPinned ? 'Unpin' : 'Pin in place'}
          >
            <Pin className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${element.isPinned ? 'fill-current' : ''}`} />
          </button>
          <div className="w-[1px] h-3.5 bg-white/20 mx-0.5" />
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 sm:p-1 hover:bg-red-500 active:bg-red-600 rounded-md transition text-red-300 hover:text-white touch-manipulation"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      )}

      {/* Rotation Handle (top) - Larger touch area for mobile */}
      {isSelected && !element.isPinned && (
        <div
          onPointerDown={handleRotatePointerDown}
          style={{ touchAction: 'none' }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-[#8C4E26] shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-40 text-[#8C4E26] touch-none select-none"
          title="Drag to rotate"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Resize Handle (bottom-right) - Larger touch area for mobile */}
      {isSelected && !element.isPinned && (
        <div
          onPointerDown={handleResizePointerDown}
          style={{ touchAction: 'none' }}
          className="absolute -bottom-2.5 -right-2.5 w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-[#8C4E26] border-2 border-white shadow-md cursor-se-resize z-40 flex items-center justify-center touch-none select-none"
          title="Drag to resize"
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {/* ================= ELEMENT CONTENT BY TYPE ================= */}

      {/* 1. TEXT ELEMENT */}
      {element.type === 'text' && (
        <div
          className={`w-full h-full p-2 relative ${getFontClass(element.fontFamily)}`}
          style={{
            fontSize: `${element.fontSize || 20}px`,
            color: element.color || '#2D2319',
            backgroundColor: element.backgroundColor || 'transparent',
          }}
          onDoubleClick={() => setIsEditingText(true)}
        >
          {/* Highlighter background layer if present */}
          {element.highlightColor && (
            <div
              className="absolute inset-x-0 bottom-1 h-[45%] pointer-events-none -z-10 rounded-xs"
              style={{
                backgroundColor: element.highlightColor,
                opacity: element.highlightOpacity ?? 0.45,
              }}
            />
          )}

          {isEditingText ? (
            <textarea
              autoFocus
              value={element.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              onBlur={() => setIsEditingText(false)}
              className="w-full h-full bg-transparent border-none outline-none resize-none no-drag"
              style={{
                fontSize: `${element.fontSize || 20}px`,
                color: element.color || '#2D2319',
              }}
            />
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">
              {element.content || 'Double click to write your thoughts...'}
            </div>
          )}
        </div>
      )}

      {/* 2. STICKER ELEMENT */}
      {element.type === 'sticker' && (
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Month Stickers (Image 2 style: pastel block letters behind cursive script) */}
          {element.stickerCategory === 'months' && element.stickerData && (
            <div className="relative flex items-center justify-center p-2 select-none">
              {/* Pastel bold block capital background */}
              <span
                className="font-black text-4xl sm:text-5xl tracking-widest uppercase opacity-80"
                style={{
                  color: element.stickerData.bg || '#A7E8F0',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.06)',
                }}
              >
                {element.stickerData.month}
              </span>
              {/* Overlay cursive script */}
              <span
                className="absolute inset-0 flex items-center justify-center font-handwriting text-4xl sm:text-5xl text-[#241A14] -rotate-3"
                style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}
              >
                {element.stickerData.script}
                {element.stickerData.daySuffix ? ` ${element.stickerData.daySuffix}` : ''}
              </span>
            </div>
          )}

          {/* Washi Tape Stickers */}
          {element.stickerCategory === 'tape' && element.stickerData && (
            <div
              className="w-full h-full rounded-xs shadow-xs flex items-center justify-center px-4 py-1.5 border-t border-b border-black/10 relative overflow-hidden"
              style={{
                backgroundColor: element.stickerData.color || '#D8C7B5',
                backgroundImage:
                  element.stickerData.pattern === 'stripes'
                    ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)'
                    : element.stickerData.pattern === 'dots'
                    ? 'radial-gradient(rgba(255,255,255,0.5) 1.5px, transparent 1.5px)'
                    : 'none',
                backgroundSize: element.stickerData.pattern === 'dots' ? '12px 12px' : 'auto',
              }}
            >
              {/* Jagged / torn ends */}
              <div className="absolute left-0 inset-y-0 w-1.5 bg-black/5" />
              <div className="absolute right-0 inset-y-0 w-1.5 bg-black/5" />
              <span className="font-handwriting text-xl sm:text-2xl font-bold text-[#422C1D] tracking-wider drop-shadow-xs">
                {element.stickerData.text || ''}
              </span>
            </div>
          )}

          {/* Botanical / Nature Decor (Image 5 style) */}
          {element.stickerCategory === 'botanical' && element.stickerData && (
            <div className="w-full h-full flex items-center justify-center">
              {element.stickerData.type === 'flower-branch' && (
                <svg viewBox="0 0 100 160" className="w-full h-full overflow-visible">
                  <path
                    d="M 50 150 Q 45 100 60 70 Q 75 40 50 10"
                    fill="none"
                    stroke={element.stickerData.color || '#433428'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Leaves and delicate flower buds */}
                  <path d="M 47 115 C 30 110 25 95 38 92 C 45 100 47 110 47 115 Z" fill="none" stroke={element.stickerData.color || '#433428'} strokeWidth="1.8" />
                  <path d="M 54 90 C 70 85 75 70 62 67 C 55 75 54 85 54 90 Z" fill="none" stroke={element.stickerData.color || '#433428'} strokeWidth="1.8" />
                  <path d="M 62 60 C 80 50 85 35 70 30 C 62 42 62 55 62 60 Z" fill="none" stroke={element.stickerData.color || '#433428'} strokeWidth="1.8" />
                  <path d="M 48 35 C 30 30 25 15 40 12 C 48 20 48 30 48 35 Z" fill="none" stroke={element.stickerData.color || '#433428'} strokeWidth="1.8" />
                  {/* Small blooms */}
                  <circle cx="70" cy="30" r="6" fill="#FDFBF7" stroke={element.stickerData.color || '#433428'} strokeWidth="1.5" />
                  <circle cx="50" cy="10" r="7" fill="#FDFBF7" stroke={element.stickerData.color || '#433428'} strokeWidth="1.5" />
                  <circle cx="38" cy="92" r="5" fill="#FDFBF7" stroke={element.stickerData.color || '#433428'} strokeWidth="1.5" />
                </svg>
              )}

              {element.stickerData.type === 'clover' && (
                <div className="w-full h-full flex items-center justify-center drop-shadow-md">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Dried 4-leaf clover in golden amber tone */}
                    <path d="M 50 50 C 40 20 20 20 25 45 C 30 48 45 48 50 50 Z" fill="#C59E5C" opacity="0.9" />
                    <path d="M 50 50 C 75 20 95 20 85 45 C 80 48 65 48 50 50 Z" fill="#B88E4B" opacity="0.95" />
                    <path d="M 50 50 C 80 75 80 95 55 85 C 52 80 52 65 50 50 Z" fill="#AC813E" opacity="0.9" />
                    <path d="M 50 50 C 20 80 20 95 45 85 C 48 80 48 65 50 50 Z" fill="#BF9754" opacity="0.95" />
                    {/* Leaf veins */}
                    <path d="M 50 50 L 30 30" stroke="#7A5420" strokeWidth="1" />
                    <path d="M 50 50 L 75 30" stroke="#7A5420" strokeWidth="1" />
                    <path d="M 50 50 L 70 75" stroke="#7A5420" strokeWidth="1" />
                    <path d="M 50 50 L 30 75" stroke="#7A5420" strokeWidth="1" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Fallback general stickers */}
          {element.stickerCategory === 'decor' && (
            <div className="text-4xl select-none filter drop-shadow-sm">
              {element.content || '✨'}
            </div>
          )}
        </div>
      )}

      {/* 3. IMAGE / POLAROID ELEMENT */}
      {element.type === 'image' && (
        <div className="w-full h-full">
          {element.frameStyle === 'polaroid' ? (
            <div className="w-full h-full bg-white p-2.5 pb-7 rounded-xs shadow-md border border-[#EADBCC] flex flex-col relative group/img">
              {/* Tape on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#E8DACB]/80 -rotate-2 border-y border-[#D8C7B5]/60 shadow-xs z-10" />

              <div className="w-full flex-1 bg-stone-100 overflow-hidden rounded-xs relative">
                <img
                  src={element.src}
                  alt={element.title || 'Journal photo'}
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {element.title && (
                <p className="mt-2 text-center font-handwriting text-base text-[#4A382A] truncate">
                  {element.title}
                </p>
              )}
            </div>
          ) : (
            <div className="w-full h-full rounded-lg overflow-hidden shadow-sm border border-stone-200">
              <img
                src={element.src}
                alt="Journal photo"
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      )}

      {/* 4. NOTE / SCRAPBOOK MEMO ELEMENT (Matching Image 3, 4, 5) */}
      {element.type === 'note' && (
        <div className="w-full h-full">
          {/* Kraft To-Do List with Washi Tape (Matching Image 5) */}
          {element.style === 'kraft-tape' && (
            <div className="w-full h-full bg-[#CDBAA7] p-4 rounded-sm shadow-md border border-[#BBA490] relative torn-edge-bottom font-handwriting text-[#3D2C1F]">
              {/* Corner Washi tape 1 */}
              <div className="absolute -top-3 -left-3 w-16 h-5 bg-[#E8DACB]/85 -rotate-45 shadow-xs border-y border-[#D6C5B3]" />
              {/* Corner Washi tape 2 */}
              <div className="absolute -top-3 -right-3 w-16 h-5 bg-[#E8DACB]/85 rotate-45 shadow-xs border-y border-[#D6C5B3]" />

              {/* Header pill tag */}
              <div className="mx-auto w-fit px-3 py-0.5 bg-[#B8A089] text-[#2E1F14] rounded-md text-sm font-bold tracking-wide shadow-xs mb-3">
                {element.title || 'To-do-list'}
              </div>

              {/* Items with cute yellow dots */}
              <div className="space-y-2 text-lg">
                {element.noteItems?.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleNoteItem(item.id)}
                    className="flex items-center gap-2.5 cursor-pointer no-drag hover:opacity-85"
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition ${
                        item.done
                          ? 'bg-[#C28C4B] text-white'
                          : 'bg-[#DFC99F] border border-[#B39369]'
                      }`}
                    >
                      {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`transition ${
                        item.done ? 'line-through opacity-65 text-[#543E2E]' : 'text-[#2D1E13]'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pink Envelope with Pulled-out Letter (Matching Image 4) */}
          {element.style === 'pink-envelope' && (
            <div className="w-full h-full relative flex flex-col items-center">
              {/* Letter paper pulled out */}
              <div className="w-[88%] bg-[#FFFDF9] border border-[#E9DFD0] rounded-t-lg p-3 pb-8 shadow-sm text-xs font-handwriting text-[#4A3225]">
                <div className="font-bold text-sm mb-1 text-[#9E5728] border-b border-[#F0E6D8] pb-1">
                  {element.title || 'Secret Note'}
                </div>
                <p className="text-sm leading-relaxed">
                  {element.content || 'Cherishing every warm smile and quiet blessing today.'}
                </p>
              </div>

              {/* Envelope flap / front in sweet pastel pink */}
              <div className="w-full -mt-6 bg-[#FBC4D6] border-2 border-[#F49AB8] rounded-b-xl shadow-md p-3 relative flex items-center justify-center">
                {/* Envelope triangle flap pattern */}
                <div className="absolute -top-0 inset-x-0 h-8 bg-[#F8ABC3] [clip-path:polygon(0_0,50%_100%,100%_0)]" />
                <div className="relative z-10 w-6 h-6 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-xs">
                  💌
                </div>
              </div>
            </div>
          )}

          {/* Scalloped Bow Memo (Matching Image 3) */}
          {element.style === 'lined-bow' && (
            <div className="w-full h-full bg-[#FFFDF9] border-2 border-black/80 rounded-2xl p-4 shadow-sm relative font-sans flex flex-col justify-between">
              {/* Cute top bow */}
              <div className="absolute -top-3.5 left-6 bg-white px-1 text-xl">
                🎀
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#3E2B1F] border-b border-black/20 pb-1 mb-2">
                  {element.title || 'Daily Memo'}
                </h4>
                <div className="space-y-1.5 text-xs font-editorial">
                  {element.noteItems?.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleNoteItem(item.id)}
                      className="flex items-center gap-2 cursor-pointer no-drag"
                    >
                      <span className="text-sm">{item.done ? '♥' : '♡'}</span>
                      <span className={item.done ? 'line-through opacity-60' : ''}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right text-xs opacity-50">♡ ♡ ♡</div>
            </div>
          )}

          {/* Hanging Wood Plaque (Matching Image 4) */}
          {element.style === 'hanging-board' && (
            <div className="w-full h-full flex flex-col items-center">
              {/* Hanging string */}
              <svg viewBox="0 0 100 30" className="w-24 h-7 overflow-visible">
                <circle cx="50" cy="4" r="3" fill="#3D291C" />
                <line x1="50" y1="4" x2="10" y2="28" stroke="#5D4330" strokeWidth="1.5" />
                <line x1="50" y1="4" x2="90" y2="28" stroke="#5D4330" strokeWidth="1.5" />
              </svg>
              {/* Wooden Plaque */}
              <div className="w-full bg-[#E5D2B8] border-2 border-[#AA8662] rounded-md p-3 shadow-md text-center text-[#4A3320]">
                <h4 className="font-serif-display font-bold text-base tracking-wide uppercase">
                  {element.title || 'Sanctuary'}
                </h4>
                <p className="font-handwriting text-lg mt-0.5">{element.content || 'Peace begins right here'}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. RETRO MUSIC PLAYER WIDGET (Matching Image 5) */}
      {element.type === 'music' && (
        <div className="w-full bg-[#E8DFD3] border border-[#C5B5A2] rounded-2xl p-3 shadow-md flex items-center gap-3 select-none">
          {/* Album artwork */}
          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs border border-white/60 shrink-0 bg-stone-800 relative">
            <img
              src={
                element.src ||
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
              }
              alt="Album cover"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Song Info & Controls */}
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-wider text-[#8A715C] font-semibold block">
              currently listening
            </span>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-[10px] text-[#8A715C] uppercase">TITLE:</span>
              <span className="text-xs font-bold text-[#3B291D] truncate font-handwriting text-base">
                {element.title || 'Versace on the floor'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-[10px] text-[#8A715C] uppercase">ARTIST:</span>
              <span className="text-xs text-[#5C4533] truncate font-handwriting text-base">
                {element.artist || 'Bruno Mars'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-[#D2C3B2] rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-[#8C4E26] rounded-full transition-all duration-300"
                style={{ width: `${musicProgress}%` }}
              />
            </div>
          </div>

          {/* Play / Skip Buttons */}
          <div className="flex items-center gap-1.5 text-[#5C4330] shrink-0 no-drag">
            <button
              type="button"
              onClick={() => setMusicProgress((p) => Math.max(0, p - 10))}
              className="p-1 hover:bg-black/5 rounded-full transition"
            >
              <SkipBack className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="w-7 h-7 rounded-full bg-[#8C4E26] text-white flex items-center justify-center hover:bg-[#723B17] transition shadow-xs"
            >
              {isPlayingMusic ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMusicProgress((p) => Math.min(100, p + 10))}
              className="p-1 hover:bg-black/5 rounded-full transition"
            >
              <SkipForward className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* 6. SHORT VIDEO EMBED ELEMENT */}
      {element.type === 'video' && (
        <div className="w-full h-full bg-stone-900 rounded-xl overflow-hidden shadow-md border-4 border-[#FFFDF9] flex flex-col relative group/vid">
          <video
            src={
              element.src ||
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            }
            controls
            className="w-full h-full object-cover no-drag"
          />
          {element.title && (
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[11px] p-1 text-center font-handwriting">
              {element.title}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
