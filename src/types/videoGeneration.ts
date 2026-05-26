export interface VideoModel {
  id: string;
  displayName: string;
}

export interface VideoModelsResponse {
  models: VideoModel[];
}

export type VideoCharacterInputMode = 'description' | 'image';

export interface VideoCharacter {
  name: string;
  inputMode: VideoCharacterInputMode;
  description?: string;
  imageBase64?: string;
  imageMimeType?: string;
  /** Client-only preview URL for uploaded photos */
  imagePreviewUrl?: string;
}

export interface GenerateVideoPayload {
  keyId: string;
  model: string;
  prompt: string;
  aspectRatio?: '16:9' | '9:16';
  durationSeconds?: 4 | 5 | 6 | 8;
  characters?: VideoCharacter[];
}

export interface GenerateScenePayload extends GenerateVideoPayload {
  sessionId: string;
  sceneIndex: number;
  characters: VideoCharacter[];
  prompt: string;
}

export interface GeneratedVideo {
  mimeType: string;
  videoBase64: string;
  model: string;
}

export interface GeneratedScene {
  sessionId: string;
  sceneIndex: number;
  model: string;
  filePath: string;
}

export interface CombineVideosPayload {
  sessionId: string;
  expectedSceneCount?: number;
}

export interface CombinedVideoReady {
  sessionId: string;
  storedVideoId: string;
  mimeType: string;
  model: string;
  sizeBytes: number;
}

export interface VideoPreviewResult {
  previewUrl: string;
  mimeType: string;
  model: string;
  downloadFilename: string;
}

export type VideoGenerationMode = 'scene' | 'just-video';

export type StoredVideoSourceType = 'single' | 'combined';

export interface StoredVideoItem {
  id: string;
  sourceType: StoredVideoSourceType;
  model: string;
  mimeType: string;
  sizeBytes: number;
  sceneCount: number | null;
  createdAt: string;
}
