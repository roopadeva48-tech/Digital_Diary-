import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Pipette, 
  Plus, 
  X, 
  ChevronDown, 
  Square, 
  Grid, 
  Columns3, 
  Droplet, 
  Ban,
  Check,
  ArrowLeftRight,
  RotateCw,
  Minus,
  Maximize2
} from 'lucide-react';
import { 
  HSV, 
  hsvToHex, 
  hexToHsv, 
  hexToRgb, 
  rgbToHex, 
  hsvToRgb 
} from '../utils/color';

export interface ColorThemePickerProps {
  color: string;
  opacity?: number;
  onChangeColor: (hexOrGradient: string) => void;
  onChangeOpacity?: (opacity: number) => void;
  onChangePattern?: (pattern: string) => void;
  activePattern?: string;
  onClose?: () => void;
  onThisPageColors?: string[];
}

export type FillMode = 
  | 'solid' 
  | 'gradient' 
  | 'tile' 
  | 'tint' 
  | 'none';

export interface GradientStop {
  id: string;
  offset: number; // 0 to 100
  color: string;
  opacity: number; // 0 to 100
}

// Curated scrapbook color libraries
const COLOR_LIBRARIES = [
  {
    name: 'Vintage Scrapbook',
    colors: ['#3A2416', '#6B4226', '#B47846', '#D8B896', '#EFE4D2', '#FAF7F2'],
  },
  {
    name: 'Warm Earth & Terracotta',
    colors: ['#422116', '#8C4E26', '#C86D3B', '#E5A478', '#F5DFCE', '#FFF8F2'],
  },
  {
    name: 'Soft Pastels',
    colors: ['#FED7AA', '#FDE68A', '#BBF7D0', '#BAE6FD', '#DDD6FE', '#FBCFE8'],
  },
  {
    name: 'Botanical Herbarium',
    colors: ['#1C3323', '#2D5A3F', '#588157', '#A3B18A', '#DAD7CD', '#F4F7F4'],
  },
  {
    name: 'Midnight Noir',
    colors: ['#121110', '#24211E', '#3D3833', '#5E564F', '#8C827A', '#D9D3CC'],
  },
];

export const ColorThemePicker: React.FC<ColorThemePickerProps> = ({
  color = '#FFF9E2',
  opacity = 1,
  onChangeColor,
  onChangeOpacity,
  onChangePattern,
  activePattern = 'solid',
  onClose,
  onThisPageColors = ['#5C3D2E', '#FFFFFF', '#FFF9E2', '#681313', '#000000', '#ECEAE4'],
}) => {
  // Tabs: 'Custom' or 'Libraries'
  const [activeTab, setActiveTab] = useState<'custom' | 'libraries'>('custom');

  // Fill mode: 1st (solid), 2nd (gradient - Image 2), 3rd (tile - Image 3), 4th (tint), 5th (none)
  const [fillMode, setFillMode] = useState<FillMode>('solid');

  // HSV representation of the current color
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(color.startsWith('#') ? color : '#FFF9E2'));

  // Opacity percentage (0 - 100)
  const [alphaPercent, setAlphaPercent] = useState<number>(() =>
    Math.round(opacity * 100)
  );

  // Format mode: 'Hex' | 'RGB' | 'HSL'
  const [formatMode, setFormatMode] = useState<'Hex' | 'RGB' | 'HSL'>('Hex');
  const [formatDropdownOpen, setFormatDropdownOpen] = useState<boolean>(false);

  // Hex input string
  const [hexInput, setHexInput] = useState<string>(() =>
    color.startsWith('#') ? color.replace('#', '').toUpperCase() : 'FFF9E2'
  );

  // Palette source dropdown state (Image 4: "On this page")
  const [paletteSource, setPaletteSource] = useState<string>('On this page');
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState<boolean>(false);

  // Custom user swatches
  const [savedSwatches, setSavedSwatches] = useState<string[]>([
    '#5C3D2E',
    '#FFFFFF',
    '#FFF9E2',
    '#681313',
    '#000000',
    '#ECEAE4',
  ]);

  // Gradient Stops State (Image 2)
  const [gradientType, setGradientType] = useState<'Linear' | 'Radial'>('Linear');
  const [gradientTypeDropdownOpen, setGradientTypeDropdownOpen] = useState(false);
  const [gradientAngle, setGradientAngle] = useState<number>(180);
  const [activeStopId, setActiveStopId] = useState<string>('stop-1');
  const [stops, setStops] = useState<GradientStop[]>([
    { id: 'stop-1', offset: 0, color: '#FFF9E2', opacity: 100 },
    { id: 'stop-2', offset: 100, color: '#999588', opacity: 100 },
  ]);

  // Tile / Pattern State (Image 3)
  const [tileType, setTileType] = useState<'grid' | 'stagger'>('grid');
  const [tileScale, setTileScale] = useState<number>(100);
  const [spacingX, setSpacingX] = useState<number>(0);
  const [spacingY, setSpacingY] = useState<number>(0);
  const [alignmentIndex, setAlignmentIndex] = useState<number>(0); // 0 = top-left (active blue in Image 3)
  const [selectedSource, setSelectedSource] = useState<string>('Vintage Ledger Grid');
  const [sourceModalOpen, setSourceModalOpen] = useState<boolean>(false);

  // Sync state if external color changes
  useEffect(() => {
    if (color && color.startsWith('#')) {
      const newHsv = hexToHsv(color);
      setHsv(newHsv);
      setHexInput(color.replace('#', '').toUpperCase());
    }
  }, [color]);

  useEffect(() => {
    setAlphaPercent(Math.round(opacity * 100));
  }, [opacity]);

  // Current computed hex color from HSV
  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);

  // Apply gradient stops
  const applyGradient = (updatedStops: GradientStop[], angle = gradientAngle, type = gradientType) => {
    const sorted = [...updatedStops].sort((a, b) => a.offset - b.offset);
    const stopsCss = sorted
      .map((s) => `${s.color}${s.opacity < 100 ? Math.round((s.opacity / 100) * 255).toString(16).padStart(2, '0') : ''} ${s.offset}%`)
      .join(', ');
    
    const gradientString =
      type === 'Linear'
        ? `linear-gradient(${angle}deg, ${stopsCss})`
        : `radial-gradient(circle at center, ${stopsCss})`;

    onChangeColor(gradientString);
  };

  // Reverse gradient stops
  const handleReverseStops = () => {
    const reversed = stops.map((s) => ({
      ...s,
      offset: 100 - s.offset,
    }));
    setStops(reversed);
    applyGradient(reversed);
  };

  // Rotate gradient angle by 45 deg
  const handleRotateAngle = () => {
    const nextAngle = (gradientAngle + 45) % 360;
    setGradientAngle(nextAngle);
    applyGradient(stops, nextAngle);
  };

  // Add new stop
  const handleAddStop = () => {
    const newStop: GradientStop = {
      id: `stop-${Date.now()}`,
      offset: 50,
      color: currentHex,
      opacity: alphaPercent,
    };
    const updated = [...stops, newStop].sort((a, b) => a.offset - b.offset);
    setStops(updated);
    setActiveStopId(newStop.id);
    applyGradient(updated);
  };

  // Remove a stop
  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) return; // Keep at least 2 stops
    const updated = stops.filter((s) => s.id !== id);
    setStops(updated);
    if (activeStopId === id) {
      setActiveStopId(updated[0].id);
    }
    applyGradient(updated);
  };

  // 2D Gradient Box drag handlers
  const satValBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingSatVal = useRef(false);

  const updateSatValFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!satValBoxRef.current) return;
      const rect = satValBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const newS = Math.round((x / rect.width) * 100);
      const newV = Math.round((1 - y / rect.height) * 100);

      const nextHsv = { ...hsv, s: newS, v: newV };
      setHsv(nextHsv);
      const nextHex = hsvToHex(nextHsv.h, newS, newV);
      setHexInput(nextHex.replace('#', '').toUpperCase());

      if (fillMode === 'gradient') {
        const updated = stops.map((s) =>
          s.id === activeStopId ? { ...s, color: nextHex } : s
        );
        setStops(updated);
        applyGradient(updated);
      } else {
        onChangeColor(nextHex);
      }
    },
    [hsv, fillMode, activeStopId, stops, onChangeColor]
  );

  const handleSatValPointerDown = (e: React.PointerEvent) => {
    isDraggingSatVal.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSatValFromPointer(e.clientX, e.clientY);
  };

  const handleSatValPointerMove = (e: React.PointerEvent) => {
    if (isDraggingSatVal.current) {
      updateSatValFromPointer(e.clientX, e.clientY);
    }
  };

  const handleSatValPointerUp = (e: React.PointerEvent) => {
    isDraggingSatVal.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Hue Slider drag handlers
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingHue = useRef(false);

  const updateHueFromPointer = useCallback(
    (clientX: number) => {
      if (!hueSliderRef.current) return;
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const newH = Math.round((x / rect.width) * 360);

      const nextHsv = { ...hsv, h: newH };
      setHsv(nextHsv);
      const nextHex = hsvToHex(newH, nextHsv.s, nextHsv.v);
      setHexInput(nextHex.replace('#', '').toUpperCase());

      if (fillMode === 'gradient') {
        const updated = stops.map((s) =>
          s.id === activeStopId ? { ...s, color: nextHex } : s
        );
        setStops(updated);
        applyGradient(updated);
      } else {
        onChangeColor(nextHex);
      }
    },
    [hsv, fillMode, activeStopId, stops, onChangeColor]
  );

  const handleHuePointerDown = (e: React.PointerEvent) => {
    isDraggingHue.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateHueFromPointer(e.clientX);
  };

  const handleHuePointerMove = (e: React.PointerEvent) => {
    if (isDraggingHue.current) {
      updateHueFromPointer(e.clientX);
    }
  };

  const handleHuePointerUp = (e: React.PointerEvent) => {
    isDraggingHue.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Alpha / Opacity Slider drag handlers
  const alphaSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingAlpha = useRef(false);

  const updateAlphaFromPointer = useCallback(
    (clientX: number) => {
      if (!alphaSliderRef.current) return;
      const rect = alphaSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const newPercent = Math.round((x / rect.width) * 100);

      setAlphaPercent(newPercent);
      if (onChangeOpacity) {
        onChangeOpacity(newPercent / 100);
      }
      if (fillMode === 'gradient') {
        const updated = stops.map((s) =>
          s.id === activeStopId ? { ...s, opacity: newPercent } : s
        );
        setStops(updated);
        applyGradient(updated);
      }
    },
    [onChangeOpacity, fillMode, activeStopId, stops]
  );

  const handleAlphaPointerDown = (e: React.PointerEvent) => {
    isDraggingAlpha.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateAlphaFromPointer(e.clientX);
  };

  const handleAlphaPointerMove = (e: React.PointerEvent) => {
    if (isDraggingAlpha.current) {
      updateAlphaFromPointer(e.clientX);
    }
  };

  const handleAlphaPointerUp = (e: React.PointerEvent) => {
    isDraggingAlpha.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Eyedropper tool
  const handleEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const pickedHex = result.sRGBHex.toUpperCase();
          const nextHsv = hexToHsv(pickedHex);
          setHsv(nextHsv);
          setHexInput(pickedHex.replace('#', ''));
          onChangeColor(pickedHex);
        }
      } catch {
        // canceled
      }
    } else {
      const fallbackColor = '#8C4E26';
      setHsv(hexToHsv(fallbackColor));
      setHexInput('8C4E26');
      onChangeColor(fallbackColor);
    }
  };

  // Manual Hex Input change
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
    setHexInput(val.toUpperCase());
    if (val.length === 6 || val.length === 3) {
      const fullHex = `#${val}`;
      const nextHsv = hexToHsv(fullHex);
      setHsv(nextHsv);
      if (fillMode === 'gradient') {
        const updated = stops.map((s) =>
          s.id === activeStopId ? { ...s, color: fullHex } : s
        );
        setStops(updated);
        applyGradient(updated);
      } else {
        onChangeColor(fullHex);
      }
    }
  };

  // Manual Opacity Input change
  const handleOpacityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(val)) {
      const clamped = Math.max(0, Math.min(100, val));
      setAlphaPercent(clamped);
      if (onChangeOpacity) {
        onChangeOpacity(clamped / 100);
      }
    }
  };

  // Add current color to swatches
  const handleAddCurrentToSwatches = () => {
    if (!savedSwatches.includes(currentHex)) {
      setSavedSwatches([currentHex, ...savedSwatches]);
    }
  };

  // Select a preset swatch
  const handleSelectSwatch = (swatchHex: string) => {
    const nextHsv = hexToHsv(swatchHex);
    setHsv(nextHsv);
    setHexInput(swatchHex.replace('#', '').toUpperCase());
    if (fillMode === 'gradient') {
      const updated = stops.map((s) =>
        s.id === activeStopId ? { ...s, color: swatchHex } : s
      );
      setStops(updated);
      applyGradient(updated);
    } else {
      onChangeColor(swatchHex);
    }
  };

  // Active swatches list according to dropdown
  const getActiveSwatches = () => {
    if (paletteSource === 'On this page') {
      const merged = Array.from(new Set([...onThisPageColors, ...savedSwatches]));
      return merged.slice(0, 8);
    }
    const foundLib = COLOR_LIBRARIES.find((lib) => lib.name === paletteSource);
    return foundLib ? foundLib.colors : savedSwatches;
  };

  return (
    <div
      id="color-theme-picker-panel"
      className="w-full bg-[#FCFBF8] text-[#332216] select-none text-xs rounded-2xl flex flex-col p-3 border border-[#E9DFD0] shadow-xs"
    >
      {/* 1. TOP TAB BAR: Custom | Libraries | + | X */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EFE5D6]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-[#EFE7DC] text-[#301F13] shadow-2xs font-bold'
                : 'text-[#876F5E] hover:text-[#38261A]'
            }`}
          >
            Custom
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('libraries')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'libraries'
                ? 'bg-[#EFE7DC] text-[#301F13] shadow-2xs font-bold'
                : 'text-[#876F5E] hover:text-[#38261A]'
            }`}
          >
            Libraries
          </button>
        </div>

        <div className="flex items-center gap-1 text-[#6F5543]">
          <button
            type="button"
            onClick={handleAddCurrentToSwatches}
            className="p-1.5 hover:bg-[#EFE5D6] rounded-lg transition cursor-pointer"
            title="Save color to palette"
          >
            <Plus className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-[#EFE5D6] rounded-lg transition cursor-pointer"
              title="Close picker"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. MODE ICONS STRIP */}
      {/* User Instruction: Remove image, 6th icon (waves) and video icon. */}
      {/* 5 icons remain: 1: Solid (Image 1), 2: Grid/Gradient (Image 2), 3: Tile Layout (Image 3), 4: Tint, 5: Reset */}
      <div className="flex items-center justify-between py-2 border-b border-[#EFE5D6] text-[#785E4D]">
        {/* 1. Solid fill (Image 1) */}
        <button
          type="button"
          onClick={() => {
            setFillMode('solid');
            if (onChangePattern) onChangePattern('solid');
            onChangeColor(currentHex);
          }}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            fillMode === 'solid'
              ? 'bg-[#EFE5D6] text-[#8C4E26] shadow-2xs ring-1 ring-[#8C4E26]/20 font-bold'
              : 'hover:bg-[#F5ECE0]'
          }`}
          title="Solid Fill (Image 1)"
        >
          <Square className="w-4 h-4" />
        </button>

        {/* 2. Grid / Gradient Stops (Image 2) */}
        <button
          type="button"
          onClick={() => {
            setFillMode('gradient');
            applyGradient(stops);
          }}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            fillMode === 'gradient'
              ? 'bg-[#EFE5D6] text-[#8C4E26] shadow-2xs ring-1 ring-[#8C4E26]/20 font-bold'
              : 'hover:bg-[#F5ECE0]'
          }`}
          title="Gradient & Stops (Image 2)"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* 3. Tile / Pattern Layout (Image 3) */}
        <button
          type="button"
          onClick={() => {
            setFillMode('tile');
            if (onChangePattern) onChangePattern('grid');
          }}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            fillMode === 'tile'
              ? 'bg-[#EFE5D6] text-[#8C4E26] shadow-2xs ring-1 ring-[#8C4E26]/20 font-bold'
              : 'hover:bg-[#F5ECE0]'
          }`}
          title="Tile Pattern Layout (Image 3)"
        >
          <Columns3 className="w-4 h-4" />
        </button>

        {/* 4. Droplet / Tint */}
        <button
          type="button"
          onClick={() => {
            setFillMode('tint');
            if (onChangeOpacity) onChangeOpacity(0.35);
          }}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            fillMode === 'tint'
              ? 'bg-[#EFE5D6] text-[#8C4E26] shadow-2xs ring-1 ring-[#8C4E26]/20 font-bold'
              : 'hover:bg-[#F5ECE0]'
          }`}
          title="Soft Tint Mode"
        >
          <Droplet className="w-4 h-4" />
        </button>

        {/* 5. Ban / Clear */}
        <button
          type="button"
          onClick={() => {
            setFillMode('none');
            onChangeColor('');
            if (onChangeOpacity) onChangeOpacity(1);
            if (onChangePattern) onChangePattern('lined');
          }}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            fillMode === 'none'
              ? 'bg-[#EFE5D6] text-[#8C4E26] shadow-2xs ring-1 ring-[#8C4E26]/20 font-bold'
              : 'hover:bg-[#F5ECE0]'
          }`}
          title="Reset to Default"
        >
          <Ban className="w-4 h-4" />
        </button>
      </div>

      {activeTab === 'custom' ? (
        <>
          {/* ========================================================================= */}
          {/* VIEW 1: SOLID COLOR PICKER (IMAGE 1)                                     */}
          {/* ========================================================================= */}
          {fillMode === 'solid' && (
            <>
              {/* 2D SATURATION & VALUE CANVAS */}
              <div className="pt-2.5 pb-2">
                <div
                  ref={satValBoxRef}
                  onPointerDown={handleSatValPointerDown}
                  onPointerMove={handleSatValPointerMove}
                  onPointerUp={handleSatValPointerUp}
                  style={{
                    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                    touchAction: 'none',
                  }}
                  className="relative w-full h-44 rounded-xl overflow-hidden cursor-crosshair shadow-inner border border-black/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                  <div
                    style={{
                      left: `${hsv.s}%`,
                      top: `${100 - hsv.v}%`,
                      backgroundColor: currentHex,
                    }}
                    className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none ring-1 ring-black/20"
                  />
                </div>
              </div>

              {/* EYEDROPPER & SLIDERS ROW */}
              <div className="flex items-center gap-2.5 py-1.5">
                <button
                  type="button"
                  onClick={handleEyedropper}
                  className="p-1.5 text-[#543E2E] hover:text-[#8C4E26] hover:bg-[#EFE5D6] rounded-lg transition shrink-0 cursor-pointer"
                  title="Pick color with eyedropper"
                >
                  <Pipette className="w-4 h-4" />
                </button>

                <div className="flex-1 flex flex-col gap-2">
                  {/* Hue Rainbow Slider */}
                  <div
                    ref={hueSliderRef}
                    onPointerDown={handleHuePointerDown}
                    onPointerMove={handleHuePointerMove}
                    onPointerUp={handleHuePointerUp}
                    style={{
                      background:
                        'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                      touchAction: 'none',
                    }}
                    className="relative h-4 rounded-full cursor-pointer shadow-inner"
                  >
                    <div
                      style={{
                        left: `${(hsv.h / 360) * 100}%`,
                        backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                      }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full border-2 border-white shadow-md ring-1 ring-black/25 pointer-events-none"
                    />
                  </div>

                  {/* Alpha / Opacity Slider */}
                  <div
                    ref={alphaSliderRef}
                    onPointerDown={handleAlphaPointerDown}
                    onPointerMove={handleAlphaPointerMove}
                    onPointerUp={handleAlphaPointerUp}
                    style={{
                      backgroundImage:
                        'repeating-conic-gradient(#80808028 0% 25%, transparent 0% 50%) 50% / 8px 8px',
                      touchAction: 'none',
                    }}
                    className="relative h-4 rounded-full cursor-pointer shadow-inner overflow-visible"
                  >
                    <div
                      style={{
                        background: `linear-gradient(to right, transparent, ${currentHex})`,
                      }}
                      className="absolute inset-0 rounded-full pointer-events-none"
                    />
                    <div
                      style={{
                        left: `${alphaPercent}%`,
                        backgroundColor: currentHex,
                        opacity: alphaPercent / 100,
                      }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full border-2 border-white shadow-md ring-1 ring-black/25 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* INPUT ROW: Hex Dropdown | FFF9E2 | 100 % */}
              <div className="flex items-center gap-2 pt-2 pb-2.5">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFormatDropdownOpen(!formatDropdownOpen)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-[#FAF6EE] hover:bg-[#F2E8DA] rounded-lg border border-[#E5D7C6] transition cursor-pointer"
                  >
                    <span>{formatMode}</span>
                    <ChevronDown className="w-3 h-3 text-[#7B614E]" />
                  </button>

                  {formatDropdownOpen && (
                    <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-[#E5D7C6] shadow-lg rounded-lg py-1 w-20 text-xs">
                      {(['Hex', 'RGB', 'HSL'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            setFormatMode(mode);
                            setFormatDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1 hover:bg-[#FAF2E6] cursor-pointer ${
                            formatMode === mode ? 'font-bold text-[#8C4E26]' : ''
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex items-center bg-[#FAF6EE] border border-[#E5D7C6] rounded-lg px-2.5 py-1.5 focus-within:border-[#8C4E26] focus-within:ring-1 focus-within:ring-[#8C4E26]/20 transition">
                  <span className="text-stone-400 font-mono text-xs mr-1">#</span>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    maxLength={6}
                    className="w-full bg-transparent font-mono text-xs font-semibold text-[#301F13] uppercase tracking-wider outline-none"
                    placeholder="FFFFFF"
                  />
                </div>

                <div className="w-18 flex items-center bg-[#FAF6EE] border border-[#E5D7C6] rounded-lg px-2 py-1.5 focus-within:border-[#8C4E26] transition">
                  <input
                    type="text"
                    value={alphaPercent}
                    onChange={handleOpacityInputChange}
                    className="w-8 bg-transparent font-mono text-xs font-semibold text-[#301F13] text-right outline-none"
                  />
                  <span className="text-stone-500 font-mono text-xs ml-1">%</span>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: GRADIENT & STOPS (IMAGE 2)                                       */}
          {/* ========================================================================= */}
          {fillMode === 'gradient' && (
            <div className="py-2.5 space-y-3">
              {/* Linear / Radial Dropdown + Action Buttons (⇄ and ⤿) */}
              <div className="flex items-center justify-between">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setGradientTypeDropdownOpen(!gradientTypeDropdownOpen)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-[#FAF6EE] hover:bg-[#F2E8DA] rounded-xl border border-[#E5D7C6] transition cursor-pointer"
                  >
                    <span>{gradientType}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7B614E]" />
                  </button>

                  {gradientTypeDropdownOpen && (
                    <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-[#E5D7C6] shadow-lg rounded-xl py-1 w-24 text-xs">
                      {(['Linear', 'Radial'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setGradientType(t);
                            setGradientTypeDropdownOpen(false);
                            applyGradient(stops, gradientAngle, t);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-[#FAF2E6] cursor-pointer ${
                            gradientType === t ? 'font-bold text-[#8C4E26]' : ''
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[#543E2E]">
                  <button
                    type="button"
                    onClick={handleReverseStops}
                    className="p-1.5 hover:bg-[#EFE5D6] rounded-lg transition cursor-pointer"
                    title="Reverse Stops (⇄)"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRotateAngle}
                    className="p-1.5 hover:bg-[#EFE5D6] rounded-lg transition cursor-pointer"
                    title="Rotate Angle (⤿)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Gradient Preview Slider Bar with Stop Marker Pins (Image 2) */}
              <div className="pt-2 pb-1 relative">
                <div
                  style={{
                    background: `linear-gradient(to right, ${stops
                      .map((s) => `${s.color} ${s.offset}%`)
                      .join(', ')})`,
                  }}
                  className="w-full h-9 rounded-xl border border-black/10 shadow-inner relative"
                >
                  {/* Draggable Stop Marker Pins */}
                  {stops.map((stop) => {
                    const isActive = activeStopId === stop.id;
                    return (
                      <div
                        key={stop.id}
                        onClick={() => {
                          setActiveStopId(stop.id);
                          const h = hexToHsv(stop.color);
                          setHsv(h);
                          setHexInput(stop.color.replace('#', '').toUpperCase());
                          setAlphaPercent(stop.opacity);
                        }}
                        style={{
                          left: `${stop.offset}%`,
                        }}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-lg border-2 cursor-pointer shadow-md transition-transform ${
                          isActive
                            ? 'border-[#0088FF] ring-2 ring-[#0088FF]/40 scale-110 z-20'
                            : 'border-white hover:scale-105 z-10'
                        }`}
                      >
                        <div
                          style={{ backgroundColor: stop.color }}
                          className="w-full h-full rounded-md shadow-inner"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stops Section Header with '+' button */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-xs text-[#453022]">Stops</span>
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="p-1 hover:bg-[#EFE5D6] rounded-md transition text-[#6F5543] cursor-pointer"
                  title="Add Gradient Stop"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Stops List (Rows matching Image 2: offset %, color swatch, hex, opacity %, minus) */}
              <div className="space-y-1.5">
                {stops.map((stop) => {
                  const isActive = activeStopId === stop.id;
                  return (
                    <div
                      key={stop.id}
                      onClick={() => {
                        setActiveStopId(stop.id);
                        const h = hexToHsv(stop.color);
                        setHsv(h);
                        setHexInput(stop.color.replace('#', '').toUpperCase());
                        setAlphaPercent(stop.opacity);
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border transition cursor-pointer ${
                        isActive
                          ? 'bg-[#EBF5FF] border-[#BDE0FE]'
                          : 'bg-[#FAF6EE] border-[#EADBCC] hover:bg-[#F5ECE0]'
                      }`}
                    >
                      {/* Offset % Input */}
                      <div className="w-12 bg-white/80 rounded-md px-1.5 py-1 text-center font-mono text-[11px] font-semibold border border-black/5">
                        {stop.offset}%
                      </div>

                      {/* Color Swatch */}
                      <div
                        style={{ backgroundColor: stop.color }}
                        className="w-5 h-5 rounded-md border border-black/15 shadow-2xs shrink-0"
                      />

                      {/* Hex Value */}
                      <span className="font-mono text-xs font-semibold text-[#301F13] flex-1">
                        {stop.color.replace('#', '').toUpperCase()}
                      </span>

                      {/* Opacity % */}
                      <span className="font-mono text-xs text-[#553E2E]">
                        {stop.opacity} %
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        disabled={stops.length <= 2}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStop(stop.id);
                        }}
                        className="p-1 text-[#8C6D53] hover:text-[#B91C1C] disabled:opacity-25 rounded transition cursor-pointer"
                        title="Remove Stop"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: TILE / PATTERN LAYOUT (IMAGE 3)                                  */}
          {/* ========================================================================= */}
          {fillMode === 'tile' && (
            <div className="py-2.5 space-y-3">
              {/* Preview Box with Blue 'Select source...' button (Image 3) */}
              <div className="relative w-full h-36 rounded-xl bg-[#7D7D7D] flex items-center justify-center border border-black/10 overflow-hidden shadow-inner">
                {/* Simulated Tiled Texture Background */}
                <div
                  style={{
                    backgroundImage:
                      tileType === 'grid'
                        ? 'radial-gradient(#00000022 1px, transparent 0)'
                        : 'repeating-linear-gradient(45deg, #00000010, #00000010 10px, transparent 10px, transparent 20px)',
                    backgroundSize: `${tileScale * 0.2}px ${tileScale * 0.2}px`,
                  }}
                  className="absolute inset-0 pointer-events-none opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setSourceModalOpen(!sourceModalOpen)}
                  className="relative z-10 px-3.5 py-2 bg-[#0088FF] hover:bg-[#0070D2] text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer active:scale-98"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Select source...</span>
                </button>
              </div>

              {/* Source Selection Quick Dropdown */}
              {sourceModalOpen && (
                <div className="p-2.5 bg-[#FAF5ED] border border-[#DFCDBB] rounded-xl space-y-1.5 text-xs">
                  <span className="font-bold text-[11px] text-[#553E2E] block">
                    Available Scrapbook Sources:
                  </span>
                  {[
                    { name: 'Vintage Ledger Grid', pattern: 'grid' },
                    { name: 'Kraft Paper Texture', pattern: 'kraft' },
                    { name: 'Bullet Journal Dots', pattern: 'dots' },
                    { name: 'Diary Lined Paper', pattern: 'lined' },
                    { name: 'Blush Watercolor Tint', pattern: 'blush' },
                  ].map((src) => (
                    <button
                      key={src.name}
                      type="button"
                      onClick={() => {
                        setSelectedSource(src.name);
                        setSourceModalOpen(false);
                        if (onChangePattern) onChangePattern(src.pattern);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                        selectedSource === src.name
                          ? 'bg-[#8C4E26] text-white font-bold'
                          : 'hover:bg-[#EFE3D3] text-[#453022]'
                      }`}
                    >
                      <span>{src.name}</span>
                      {selectedSource === src.name && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Tile Type (Image 3: Two icon buttons) */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#553E2E] font-medium">Tile type</span>
                <div className="flex items-center bg-[#FAF6EE] p-0.5 rounded-xl border border-[#DFCDBB]">
                  <button
                    type="button"
                    onClick={() => {
                      setTileType('grid');
                      if (onChangePattern) onChangePattern('grid');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                      tileType === 'grid'
                        ? 'bg-white text-[#0088FF] shadow-xs font-bold'
                        : 'text-[#6F5543] hover:text-[#332216]'
                    }`}
                    title="Regular Grid Pattern"
                  >
                    :::
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTileType('stagger');
                      if (onChangePattern) onChangePattern('dots');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                      tileType === 'stagger'
                        ? 'bg-white text-[#0088FF] shadow-xs font-bold'
                        : 'text-[#6F5543] hover:text-[#332216]'
                    }`}
                    title="Staggered Dot Pattern"
                  >
                    ⁖⁖
                  </button>
                </div>
              </div>

              {/* Scale Control (Image 3: Scale 100%) */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#553E2E] font-medium">Scale</span>
                <div className="flex items-center gap-1.5 bg-[#FAF6EE] px-2.5 py-1 rounded-xl border border-[#DFCDBB]">
                  <button
                    type="button"
                    onClick={() => setTileScale((s) => Math.max(25, s - 25))}
                    className="text-xs text-[#6F5543] hover:text-[#332216] px-1 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs font-semibold text-[#301F13] w-12 text-center">
                    {tileScale}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setTileScale((s) => Math.min(300, s + 25))}
                    className="text-xs text-[#6F5543] hover:text-[#332216] px-1 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Spacing Controls (Image 3: Spacing X 0%, Y 0%) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#553E2E] font-medium">Spacing</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#8C6D53]">X</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={spacingX}
                      onChange={(e) => setSpacingX(parseInt(e.target.value, 10) || 0)}
                      className="w-16 bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#DFCDBB] text-xs font-mono text-right outline-none"
                    />
                    <span className="text-[11px] text-[#8C6D53]">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <span className="text-[11px] font-mono text-[#8C6D53]">Y</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={spacingY}
                    onChange={(e) => setSpacingY(parseInt(e.target.value, 10) || 0)}
                    className="w-16 bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#DFCDBB] text-xs font-mono text-right outline-none"
                  />
                  <span className="text-[11px] text-[#8C6D53]">%</span>
                </div>
              </div>

              {/* Alignment 3x3 Dot Matrix (Image 3: Top-left active blue square, others light dots) */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#553E2E] font-medium">Alignment</span>
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#FAF6EE] rounded-xl border border-[#DFCDBB]">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
                    const isSelected = alignmentIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAlignmentIndex(idx)}
                        className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#0088FF] shadow-xs'
                            : 'hover:bg-[#E5D7C6] text-stone-400'
                        }`}
                      >
                        {!isSelected && <span className="text-[9px] leading-none">·</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: TINT OR OTHER MODES                                               */}
          {/* ========================================================================= */}
          {fillMode === 'tint' && (
            <div className="py-3 text-center text-xs text-[#6F5543] space-y-2">
              <p>Soft tinted page overlay applied with 35% gentle vintage opacity.</p>
              <button
                type="button"
                onClick={() => setFillMode('solid')}
                className="px-3 py-1.5 bg-[#FAF6EE] border border-[#E5D7C6] rounded-xl text-[#8C4E26] font-semibold cursor-pointer hover:bg-[#F2E8DA]"
              >
                Customize Tint Color
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* IMAGE 4: "On this page ⌵" SWATCH CONTAINER                                */}
          {/* "in that you give me the what are color are available in that particular page." */}
          {/* ========================================================================= */}
          <div className="pt-2 border-t border-[#EFE5D6]">
            {/* Dropdown header */}
            <div className="relative mb-2">
              <button
                type="button"
                onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
                className="w-full flex items-center justify-between text-xs font-medium px-3 py-2 bg-[#FAF6EE] hover:bg-[#F2E8DA] rounded-xl border border-[#E5D7C6] transition text-[#543E2E] cursor-pointer"
              >
                <span>{paletteSource}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#7B614E]" />
              </button>

              {paletteDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-[#E5D7C6] shadow-xl rounded-xl py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setPaletteSource('On this page');
                      setPaletteDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#FAF2E6] flex items-center justify-between cursor-pointer"
                  >
                    <span>On this page</span>
                    {paletteSource === 'On this page' && (
                      <Check className="w-3.5 h-3.5 text-[#8C4E26]" />
                    )}
                  </button>
                  {COLOR_LIBRARIES.map((lib) => (
                    <button
                      key={lib.name}
                      type="button"
                      onClick={() => {
                        setPaletteSource(lib.name);
                        setPaletteDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#FAF2E6] flex items-center justify-between cursor-pointer"
                    >
                      <span>{lib.name}</span>
                      {paletteSource === lib.name && (
                        <Check className="w-3.5 h-3.5 text-[#8C4E26]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swatch chips row (Exact match to Image 4: Row of rounded squares) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {getActiveSwatches().map((swatch, idx) => {
                const isSelected = currentHex.toLowerCase() === swatch.toLowerCase();
                return (
                  <button
                    key={`${swatch}-${idx}`}
                    type="button"
                    onClick={() => handleSelectSwatch(swatch)}
                    style={{ backgroundColor: swatch }}
                    className={`w-7 h-7 rounded-lg shrink-0 border border-black/15 shadow-2xs transition transform hover:scale-110 active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#8C4E26] ring-offset-2 scale-105'
                        : ''
                    }`}
                    title={swatch}
                  />
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* LIBRARIES TAB */
        <div className="pt-2 flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
          {COLOR_LIBRARIES.map((lib) => (
            <div
              key={lib.name}
              className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#EAE0D2] flex flex-col gap-1.5"
            >
              <span className="text-xs font-serif font-bold text-[#453022]">
                {lib.name}
              </span>
              <div className="flex items-center gap-1.5">
                {lib.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectSwatch(c)}
                    style={{ backgroundColor: c }}
                    className="w-6 h-6 rounded-md border border-black/10 shadow-xs hover:scale-115 transition cursor-pointer"
                    title={`Apply ${c}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
