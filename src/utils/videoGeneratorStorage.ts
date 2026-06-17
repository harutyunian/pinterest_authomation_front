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
  continuityMode?: boolean;
  activeSceneJobId?: string;
  activeSceneSessionId?: string;
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
      continuityMode: parsed.continuityMode === true,
      activeSceneJobId:
        typeof parsed.activeSceneJobId === 'string'
          ? parsed.activeSceneJobId
          : undefined,
      activeSceneSessionId:
        typeof parsed.activeSceneSessionId === 'string'
          ? parsed.activeSceneSessionId
          : undefined,
    };
  } catch {
    return null;
  }
}

export function saveVideoGeneratorDraft(draft: VideoGeneratorDraft): void {
  try {
    const existing = loadVideoGeneratorDraft();
    const payload: VideoGeneratorDraft = {
      ...draft,
      activeSceneJobId: draft.activeSceneJobId ?? existing?.activeSceneJobId,
      activeSceneSessionId:
        draft.activeSceneSessionId ?? existing?.activeSceneSessionId,
      characters: draft.characters.map(
        ({ imagePreviewUrl: _preview, ...character }) => character,
      ),
    };
    const serialized = JSON.stringify(payload);
    if (serialized.length > MAX_STORAGE_CHARS) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore quota / serialization errors
  }
}

export function persistActiveSceneJob(jobId: string, sessionId: string): void {
  const draft = loadVideoGeneratorDraft();
  if (!draft) {
    return;
  }
  saveVideoGeneratorDraft({
    ...draft,
    activeSceneJobId: jobId,
    activeSceneSessionId: sessionId,
  });
}

export function clearActiveSceneJob(): void {
  const draft = loadVideoGeneratorDraft();
  if (!draft?.activeSceneJobId) {
    return;
  }
  saveVideoGeneratorDraft({
    ...draft,
    activeSceneJobId: undefined,
    activeSceneSessionId: undefined,
  });
}

export function loadActiveSceneJob(): {
  jobId: string;
  sessionId: string;
} | null {
  const draft = loadVideoGeneratorDraft();
  if (draft?.activeSceneJobId && draft.activeSceneSessionId) {
    return {
      jobId: draft.activeSceneJobId,
      sessionId: draft.activeSceneSessionId,
    };
  }
  return null;
}
