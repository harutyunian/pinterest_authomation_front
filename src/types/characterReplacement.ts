export type GenerationStatus =
  | 'idle'
  | 'uploading'
  | 'generating'
  | 'processing'
  | 'completed'
  | 'failed';

export type OutputResolution = '720p' | '1080p' | '4K';

export type OutputDuration = 4 | 5 | 6 | 8 | 10 | 15;

export interface UploadedVideoAsset {
  file: File;
  previewUrl: string;
  durationSeconds: number;
  sizeBytes: number;
  mimeType: string;
}

export interface UploadedImageAsset {
  file: File;
  previewUrl: string;
  sizeBytes: number;
  mimeType: string;
}

export interface AdvancedSettings {
  motionFidelity: number;
  characterConsistency: number;
  backgroundPreservation: boolean;
  facePreservation: boolean;
  cameraPreservation: boolean;
  outputDuration: OutputDuration;
  resolution: OutputResolution;
}

export interface UploadVideoResponse {
  assetId: string;
  mimeType: string;
  sizeBytes: number;
  durationSeconds?: number;
}

export interface UploadImageResponse {
  assetId: string;
  mimeType: string;
  sizeBytes: number;
}

export interface StartGenerationPayload {
  keyId: string;
  model: string;
  sourceVideoAssetId: string;
  referenceImageAssetId: string;
  prompt: string;
  settings: AdvancedSettings;
}

export interface StartGenerationResponse {
  jobId: string;
  estimatedSeconds?: number;
}

export interface GenerationStatusResponse {
  jobId: string;
  status: Exclude<GenerationStatus, 'idle' | 'uploading'>;
  progress: number;
  message?: string;
  estimatedSecondsRemaining?: number;
  resultVideoUrl?: string;
  resultMimeType?: string;
  error?: string;
}

export interface GeneratedVideoItem {
  id: string;
  jobId: string;
  previewUrl: string;
  downloadUrl: string;
  mimeType: string;
  createdAt: string;
  prompt: string;
  resolution: OutputResolution;
}

export interface CharacterReplacementError {
  code:
    | 'INVALID_FILE_TYPE'
    | 'FILE_TOO_LARGE'
    | 'UPLOAD_FAILED'
    | 'API_FAILED'
    | 'GENERATION_TIMEOUT'
    | 'UNKNOWN';
  message: string;
}

export const DEFAULT_PROMPT = `Replace the person in the source video with the character from the reference image.
Preserve the original choreography, timing, body movement, camera motion, pacing, framing, scene composition and background.
Keep motion consistency as close as possible to the source video.
Photorealistic output.
High quality details.
Natural lighting.
No artifacts.
No extra characters.
Maintain exact dance performance.`;

export const DEFAULT_ADVANCED_SETTINGS: AdvancedSettings = {
  motionFidelity: 85,
  characterConsistency: 90,
  backgroundPreservation: true,
  facePreservation: true,
  cameraPreservation: true,
  outputDuration: 8,
  resolution: '1080p',
};

export const VIDEO_ACCEPT = {
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/webm': ['.webm'],
} as const;

export const IMAGE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
} as const;

export const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const POLL_INTERVAL_MS = 5000;
export const GENERATION_TIMEOUT_MS = 20 * 60 * 1000;
