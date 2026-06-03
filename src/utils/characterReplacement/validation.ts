import type { CharacterReplacementError } from '../../types/characterReplacement';
import {
  IMAGE_ACCEPT,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  VIDEO_ACCEPT,
} from '../../types/characterReplacement';

function isAcceptedType(
  file: File,
  acceptMap: Record<string, readonly string[]>,
): boolean {
  if (file.type && file.type in acceptMap) {
    return true;
  }

  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  return Object.values(acceptMap).some((extensions) =>
    extensions.includes(extension),
  );
}

export function validateVideoFile(file: File): CharacterReplacementError | null {
  if (!isAcceptedType(file, VIDEO_ACCEPT)) {
    return {
      code: 'INVALID_FILE_TYPE',
      message: 'Invalid video type. Upload MP4, MOV, or WEBM.',
    };
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `Video is too large. Maximum size is ${Math.round(MAX_VIDEO_SIZE_BYTES / (1024 * 1024))} MB.`,
    };
  }
  return null;
}

export function validateImageFile(file: File): CharacterReplacementError | null {
  if (!isAcceptedType(file, IMAGE_ACCEPT)) {
    return {
      code: 'INVALID_FILE_TYPE',
      message: 'Invalid image type. Upload JPG, PNG, or WEBP.',
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `Image is too large. Maximum size is ${Math.round(MAX_IMAGE_SIZE_BYTES / (1024 * 1024))} MB.`,
    };
  }
  return null;
}

export function getAcceptedExtensions(
  acceptMap: Record<string, readonly string[]>,
): string {
  const extensions = new Set<string>();
  for (const values of Object.values(acceptMap)) {
    for (const ext of values) {
      extensions.add(ext.replace('.', '').toUpperCase());
    }
  }
  return Array.from(extensions).join(', ');
}
