export async function normalizeVideoBlob(blob: Blob): Promise<Blob> {
  if (blob.size === 0) {
    throw new Error('Video file is empty.');
  }

  const type = blob.type.toLowerCase();
  if (type.includes('json')) {
    const text = await blob.text();
    try {
      const parsed = JSON.parse(text) as { message?: string | string[] };
      const message = parsed.message;
      if (typeof message === 'string') {
        throw new Error(message);
      }
      if (Array.isArray(message)) {
        throw new Error(message.join(', '));
      }
    } catch (error) {
      if (error instanceof Error && error.message !== 'Unexpected token') {
        throw error;
      }
    }
    throw new Error(text || 'Could not load video.');
  }

  if (!type || type === 'application/octet-stream') {
    return new Blob([blob], { type: 'video/mp4' });
  }

  return blob;
}
