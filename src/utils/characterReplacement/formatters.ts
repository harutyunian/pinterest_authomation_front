export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '—';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

export function formatEstimatedTime(seconds: number | null): string {
  if (seconds == null || seconds <= 0) {
    return 'Calculating…';
  }
  if (seconds < 60) {
    return `~${Math.ceil(seconds)}s remaining`;
  }
  const mins = Math.ceil(seconds / 60);
  return `~${mins} min remaining`;
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      video.load();
    };

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      cleanup();
      resolve(duration);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Could not read video metadata.'));
    };

    video.src = url;
  });
}

export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokePreviewUrl(url: string | null | undefined): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
