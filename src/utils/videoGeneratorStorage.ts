import type {
  VideoCharacter,
  VideoGenerationMode,
} from '../types/videoGeneration';


const STORAGE_KEY = 'pinterest-video-generator-draft';

export interface VideoGeneratorDraft {
  mode: VideoGenerationMode;
  keyId: string;
  model: string;
  aspectRatio: '16:9' | '9:16';
  durationSeconds: 4 | 5 | 6 | 8;
  prompt: string;
  characters: VideoCharacter[];
  scenes: string[];
}

function restoreCharacterPreview(character: VideoCharacter): VideoCharacter {
  if (
    character.inputMode === 'image' &&
    character.imageBase64 &&
    character.imageMimeType &&
    !character.imagePreviewUrl
  ) {
    return {
      ...character,
      imagePreviewUrl: `data:${character.imageMimeType};base64,${character.imageBase64}`,
    };
  }
  return character;
}

const MAX_STORAGE_CHARS = 2_000_000;

export function clearOversizedVideoGeneratorDraft(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && raw.length > MAX_STORAGE_CHARS) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function loadVideoGeneratorDraft(): VideoGeneratorDraft | null {
  try {
    clearOversizedVideoGeneratorDraft();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<VideoGeneratorDraft>;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return {
      mode: parsed.mode === 'just-video' ? 'just-video' : 'scene',
      keyId: typeof parsed.keyId === 'string' ? parsed.keyId : '',
      model: typeof parsed.model === 'string' ? parsed.model : '',
      aspectRatio: parsed.aspectRatio === '9:16' ? '9:16' : '16:9',
      durationSeconds:
        parsed.durationSeconds === 4 ||
        parsed.durationSeconds === 5 ||
        parsed.durationSeconds === 6 ||
        parsed.durationSeconds === 8
          ? parsed.durationSeconds
          : 6,
      prompt: typeof parsed.prompt === 'string' ? parsed.prompt : '',
      characters: Array.isArray(parsed.characters)
        ? parsed.characters.map((c) =>
            restoreCharacterPreview(c as VideoCharacter),
          )
        : [],
      scenes: Array.isArray(parsed.scenes)
        ? parsed.scenes.filter((s): s is string => typeof s === 'string')
        : [],
    };
  } catch {
    return null;
  }
}

export function saveVideoGeneratorDraft(draft: VideoGeneratorDraft): void {
  try {
    const payload: VideoGeneratorDraft = {
      ...draft,
      characters: draft.characters.map(
        ({
          imagePreviewUrl: _preview,
          imageBase64: _image,
          ...character
        }) => character,
      ),
    };
    const serialized = JSON.stringify(payload);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore quota / serialization errors
  }
}
