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
  continuityMode?: boolean;
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

export interface SceneGenerationErrorBody {
  message: string;
  failedSceneIndex: number;
  sessionId: string;
  completedSceneIndices?: number[];
}

export interface SessionSceneStatus {
  index: number;
  status: 'ready' | 'missing';
}

export interface SessionStatusResult {
  sessionId: string;
  continuityMode?: boolean;
  scenes: SessionSceneStatus[];
  completedCount: number;
}

export interface RecoverPartialPayload {
  sessionId: string;
  continuityMode: boolean;
  failedSceneIndex?: number;
  totalScenes?: number;
}

export interface RecoverPartialResult {
  partialVideo?: CombinedVideoReady;
  completedSceneIndices: number[];
  failedSceneIndex?: number;
  message: string;
}

export interface PartialScenePreview {
  sceneIndex: number;
  previewUrl: string;
}

export type SceneBatchJobStatus =
  | 'queued'
  | 'generating'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'partial';

export interface StartSceneBatchPayload {
  keyId: string;
  model: string;
  scenes: string[];
  characters: VideoCharacter[];
  aspectRatio?: '16:9' | '9:16';
  durationSeconds?: 4 | 5 | 6 | 8;
  continuityMode: boolean;
}

export interface StartSceneBatchResponse {
  jobId: string;
  sessionId: string;
}

export interface SceneBatchStatusResponse {
  jobId: string;
  sessionId: string;
  status: SceneBatchJobStatus;
  progress: number;
  message?: string;
  continuityMode: boolean;
  totalScenes: number;
  currentSceneIndex?: number;
  completedSceneIndices: number[];
  failedSceneIndex?: number;
  storedVideoId?: string;
  resultVideoUrl?: string;
  error?: string;
}

export const SCENE_BATCH_POLL_INTERVAL_MS = 5000;
export const SCENE_BATCH_GENERATION_TIMEOUT_MS = 20 * 60 * 1000;
