import { create } from 'zustand';
import type {
  AdvancedSettings,
  GeneratedVideoItem,
  GenerationStatus,
  UploadedImageAsset,
  UploadedVideoAsset,
} from '../types/characterReplacement';
import {
  DEFAULT_ADVANCED_SETTINGS,
  DEFAULT_PROMPT,
} from '../types/characterReplacement';

interface CharacterReplacementState {
  status: GenerationStatus;
  keyId: string;
  model: string;
  prompt: string;
  settings: AdvancedSettings;
  sourceVideo: UploadedVideoAsset | null;
  referenceImage: UploadedImageAsset | null;
  sourceVideoAssetId: string | null;
  referenceImageAssetId: string | null;
  jobId: string | null;
  progress: number;
  progressMessage: string;
  estimatedSecondsRemaining: number | null;
  error: string | null;
  gallery: GeneratedVideoItem[];
  setKeyId: (keyId: string) => void;
  setModel: (model: string) => void;
  setPrompt: (prompt: string) => void;
  setSettings: (settings: Partial<AdvancedSettings>) => void;
  setSourceVideo: (asset: UploadedVideoAsset | null) => void;
  setReferenceImage: (asset: UploadedImageAsset | null) => void;
  setSourceVideoAssetId: (assetId: string | null) => void;
  setReferenceImageAssetId: (assetId: string | null) => void;
  setStatus: (status: GenerationStatus) => void;
  setJobId: (jobId: string | null) => void;
  setProgress: (progress: number, message?: string) => void;
  setEstimatedSecondsRemaining: (seconds: number | null) => void;
  setError: (error: string | null) => void;
  addGalleryItem: (item: GeneratedVideoItem) => void;
  removeGalleryItem: (id: string) => void;
  resetGeneration: () => void;
  resetAll: () => void;
}

const initialGenerationState = {
  status: 'idle' as GenerationStatus,
  jobId: null,
  progress: 0,
  progressMessage: '',
  estimatedSecondsRemaining: null,
  error: null,
};

export const useCharacterReplacementStore = create<CharacterReplacementState>(
  (set) => ({
    ...initialGenerationState,
    keyId: '',
    model: '',
    prompt: DEFAULT_PROMPT,
    settings: { ...DEFAULT_ADVANCED_SETTINGS },
    sourceVideo: null,
    referenceImage: null,
    sourceVideoAssetId: null,
    referenceImageAssetId: null,
    gallery: [],

    setKeyId: (keyId) => set({ keyId }),
    setModel: (model) => set({ model }),
    setPrompt: (prompt) => set({ prompt }),
    setSettings: (partial) =>
      set((state) => ({ settings: { ...state.settings, ...partial } })),
    setSourceVideo: (asset) => set({ sourceVideo: asset }),
    setReferenceImage: (asset) => set({ referenceImage: asset }),
    setSourceVideoAssetId: (assetId) => set({ sourceVideoAssetId: assetId }),
    setReferenceImageAssetId: (assetId) =>
      set({ referenceImageAssetId: assetId }),
    setStatus: (status) => set({ status }),
    setJobId: (jobId) => set({ jobId }),
    setProgress: (progress, message) =>
      set((state) => ({
        progress,
        progressMessage: message ?? state.progressMessage,
      })),
    setEstimatedSecondsRemaining: (seconds) =>
      set({ estimatedSecondsRemaining: seconds }),
    setError: (error) => set({ error }),
    addGalleryItem: (item) =>
      set((state) => ({ gallery: [item, ...state.gallery] })),
    removeGalleryItem: (id) =>
      set((state) => ({
        gallery: state.gallery.filter((item) => item.id !== id),
      })),
    resetGeneration: () => set({ ...initialGenerationState }),
    resetAll: () =>
      set({
        ...initialGenerationState,
        keyId: '',
        model: '',
        prompt: DEFAULT_PROMPT,
        settings: { ...DEFAULT_ADVANCED_SETTINGS },
        sourceVideo: null,
        referenceImage: null,
        sourceVideoAssetId: null,
        referenceImageAssetId: null,
        gallery: [],
      }),
  }),
);
