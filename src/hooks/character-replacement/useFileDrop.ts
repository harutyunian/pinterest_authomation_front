import { useCallback, useState } from 'react';
import type { DragEvent } from 'react';

interface UseFileDropOptions {
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}

export function useFileDrop({ disabled = false, onFiles }: UseFileDropOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    },
    [disabled],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        onFiles(files);
      }
    },
    [disabled, onFiles],
  );

  return {
    isDragging,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}
