import { useCallback, useRef } from 'react';
import {
  downloadResult,
  getGenerationStatus,
  startGeneration,
} from '@/api/veoCharacterReplacement';
import { useCharacterReplacementStore } from '@/stores/characterReplacementStore';
import type { GeneratedVideoItem } from '@/types/characterReplacement';
import {
  GENERATION_TIMEOUT_MS,
  POLL_INTERVAL_MS,
} from '@/types/characterReplacement';
import { revokePreviewUrl } from '@/utils/characterReplacement/formatters';

function mapApiStatusToStoreStatus(
  status: string,
): 'generating' | 'processing' | 'completed' | 'failed' {
  switch (status) {
    case 'processing':
      return 'processing';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'generating';
  }
}

export function useCharacterReplacementGeneration() {
  const pollTimeoutRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const prompt = useCharacterReplacementStore((s) => s.prompt);
  const keyId = useCharacterReplacementStore((s) => s.keyId);
  const model = useCharacterReplacementStore((s) => s.model);
  const settings = useCharacterReplacementStore((s) => s.settings);
  const sourceVideoAssetId = useCharacterReplacementStore(
    (s) => s.sourceVideoAssetId,
  );
  const referenceImageAssetId = useCharacterReplacementStore(
    (s) => s.referenceImageAssetId,
  );
  const status = useCharacterReplacementStore((s) => s.status);
  const progress = useCharacterReplacementStore((s) => s.progress);
  const progressMessage = useCharacterReplacementStore((s) => s.progressMessage);
  const estimatedSecondsRemaining = useCharacterReplacementStore(
    (s) => s.estimatedSecondsRemaining,
  );
  const error = useCharacterReplacementStore((s) => s.error);

  const setStatus = useCharacterReplacementStore((s) => s.setStatus);
  const setJobId = useCharacterReplacementStore((s) => s.setJobId);
  const setProgress = useCharacterReplacementStore((s) => s.setProgress);
  const setEstimatedSecondsRemaining = useCharacterReplacementStore(
    (s) => s.setEstimatedSecondsRemaining,
  );
  const setError = useCharacterReplacementStore((s) => s.setError);
  const addGalleryItem = useCharacterReplacementStore((s) => s.addGalleryItem);
  const resetGeneration = useCharacterReplacementStore((s) => s.resetGeneration);

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current != null) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current != null) {
      window.clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const handleCompletedJob = useCallback(
    async (jobId: string, resultMimeType?: string) => {
      const blob = await downloadResult(jobId);
      const previewUrl = URL.createObjectURL(blob);
      const item: GeneratedVideoItem = {
        id: crypto.randomUUID(),
        jobId,
        previewUrl,
        downloadUrl: previewUrl,
        mimeType: resultMimeType ?? blob.type ?? 'video/mp4',
        createdAt: new Date().toISOString(),
        prompt: prompt.trim(),
        resolution: settings.resolution,
      };
      addGalleryItem(item);
      setStatus('idle');
      setProgress(0, '');
      setEstimatedSecondsRemaining(null);
      setError(null);
    },
    [
      addGalleryItem,
      prompt,
      setError,
      setEstimatedSecondsRemaining,
      setProgress,
      setStatus,
      settings.resolution,
    ],
  );

  const pollJobStatus = useCallback(
    (jobId: string) => {
      clearPolling();
      startedAtRef.current = Date.now();

      pollTimeoutRef.current = window.setTimeout(() => {
        clearPolling();
        setStatus('failed');
        setError('Generation timed out. Please try again with a shorter clip.');
      }, GENERATION_TIMEOUT_MS);

      const poll = async () => {
        if (
          startedAtRef.current != null &&
          Date.now() - startedAtRef.current > GENERATION_TIMEOUT_MS
        ) {
          clearPolling();
          setStatus('failed');
          setError('Generation timed out. Please try again with a shorter clip.');
          return;
        }

        try {
          const response = await getGenerationStatus(jobId);
          const mappedStatus = mapApiStatusToStoreStatus(response.status);
          setStatus(mappedStatus);
          setProgress(
            response.progress,
            response.message ?? 'Generating video with Google Veo…',
          );
          setEstimatedSecondsRemaining(
            response.estimatedSecondsRemaining ?? null,
          );

          if (response.error) {
            clearPolling();
            setStatus('failed');
            setError(response.error);
            return;
          }

          if (mappedStatus === 'completed') {
            clearPolling();
            await handleCompletedJob(jobId, response.resultMimeType);
            return;
          }

          if (mappedStatus === 'failed') {
            clearPolling();
            setStatus('failed');
            setError(response.message ?? 'Video generation failed.');
          }
        } catch (pollError) {
          clearPolling();
          setStatus('failed');
          setError(
            pollError instanceof Error
              ? pollError.message
              : 'Failed to poll generation status.',
          );
        }
      };

      void poll();
      pollIntervalRef.current = window.setInterval(() => {
        void poll();
      }, POLL_INTERVAL_MS);
    },
    [
      clearPolling,
      handleCompletedJob,
      setError,
      setEstimatedSecondsRemaining,
      setProgress,
      setStatus,
    ],
  );

  const generate = useCallback(async () => {
    if (!keyId) {
      setError('Select a Gemini API key.');
      return;
    }
    if (!model) {
      setError('Select a Veo model.');
      return;
    }
    if (!sourceVideoAssetId || !referenceImageAssetId) {
      setError('Upload both a source video and a reference image.');
      return;
    }
    if (!prompt.trim()) {
      setError('Enter a prompt before generating.');
      return;
    }

    resetGeneration();
    setError(null);
    setStatus('generating');
    setProgress(5, 'Submitting generation request…');

    try {
      const response = await startGeneration({
        keyId,
        model,
        sourceVideoAssetId,
        referenceImageAssetId,
        prompt: prompt.trim(),
        settings,
      });

      setJobId(response.jobId);
      setEstimatedSecondsRemaining(response.estimatedSeconds ?? null);
      setProgress(10, 'Queued for processing…');
      pollJobStatus(response.jobId);
    } catch (generationError) {
      setStatus('failed');
      setError(
        generationError instanceof Error
          ? generationError.message
          : 'Failed to start generation.',
      );
    }
  }, [
    keyId,
    model,
    pollJobStatus,
    prompt,
    referenceImageAssetId,
    resetGeneration,
    setError,
    setEstimatedSecondsRemaining,
    setJobId,
    setProgress,
    setStatus,
    settings,
    sourceVideoAssetId,
  ]);

  const cancelPolling = useCallback(() => {
    clearPolling();
  }, [clearPolling]);

  const removeGalleryItem = useCallback(
    (id: string) => {
      const item = useCharacterReplacementStore
        .getState()
        .gallery.find((video) => video.id === id);
      revokePreviewUrl(item?.previewUrl);
      useCharacterReplacementStore.getState().removeGalleryItem(id);
    },
    [],
  );

  const isBusy =
    status === 'uploading' ||
    status === 'generating' ||
    status === 'processing';

  return {
    status,
    progress,
    progressMessage,
    estimatedSecondsRemaining,
    error,
    isBusy,
    generate,
    cancelPolling,
    removeGalleryItem,
  };
}
