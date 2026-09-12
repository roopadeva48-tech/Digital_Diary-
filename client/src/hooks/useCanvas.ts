import { useState, useCallback } from 'react';
import { CanvasElement } from '../types';

export function useCanvas(initialElements: CanvasElement[] = []) {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addElement = useCallback((element: CanvasElement) => {
    setElements((prev) => [...prev, element]);
    setSelectedId(element.id);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const bringToFront = useCallback((id: string) => {
    setElements((prev) => {
      const maxZ = Math.max(...prev.map((el) => el.zIndex || 0), 0);
      return prev.map((el) => (el.id === id ? { ...el, zIndex: maxZ + 1 } : el));
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setElements((prev) => {
      const minZ = Math.min(...prev.map((el) => el.zIndex || 0), 0);
      return prev.map((el) => (el.id === id ? { ...el, zIndex: Math.max(0, minZ - 1) } : el));
    });
  }, []);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedId(null);
  }, []);

  return {
    elements,
    setElements,
    selectedId,
    setSelectedId,
    addElement,
    updateElement,
    removeElement,
    bringToFront,
    sendToBack,
    clearCanvas,
  };
}
