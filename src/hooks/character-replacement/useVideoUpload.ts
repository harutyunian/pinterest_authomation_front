import { useCallback } from 'react';
import { uploadVideo } from '@/api/veoCharacterReplacement';
import { useCharacterReplacementStore } from '@/stores/characterReplacementStore';
import type { UploadedVideoAsset } from '@/types/characterReplacement';
import {
  createPreviewUrl,
  getVideoDuration,
  revokePreviewUrl,
} from '@/utils/characterReplacement/formatters';
import { validateVideoFile } from '@/utils/characterReplacement/validation';

export function useVideoUpload() {
  const sourceVideo = useCharacterReplacementStore((s) => s.sourceVideo);
  const setSourceVideo = useCharacterReplacementStore((s) => s.setSourceVideo);
  const setSourceVideoAssetId = useCharacterReplacementStore(
    (s) => s.setSourceVideoAssetId,
  );
  const setError = useCharacterReplacementStore((s) => s.setError);
  const setVideoUploading = useCharacterReplacementStore(
    (s) => s.setVideoUploading,
  );
  const setSettings = useCharacterReplacementStore((s) => s.setSettings);

  const clearVideo = useCallback(() => {
    revokePreviewUrl(sourceVideo?.previewUrl);
    setSourceVideo(null);
    setSourceVideoAssetId(null);
  }, [sourceVideo?.previewUrl, setSourceVideo, setSourceVideoAssetId]);

  const uploadLocalVideo = useCallback(
    async (file: File): Promise<UploadedVideoAsset | null> => {
      const validationError = validateVideoFile(file);
      if (validationError) {
        setError(validationError.message);
        return null;
      }

      setError(null);
      setVideoUploading(true);
      setSourceVideoAssetId(null);

      const previousVideo = sourceVideo;
      if (previousVideo?.previewUrl) {
        revokePreviewUrl(previousVideo.previewUrl);
      }

      let newPreviewUrl: string | undefined;
      try {
        const durationSeconds = await getVideoDuration(file);
        newPreviewUrl = createPreviewUrl(file);
        const asset: UploadedVideoAsset = {
          file,
          previewUrl: newPreviewUrl,
          durationSeconds,
          sizeBytes: file.size,
          mimeType: file.type || 'video/mp4',
        };

        setSourceVideo(asset);
        setSettings({
          outputDuration: Math.min(8, Math.max(4, Math.ceil(durationSeconds))) as
            | 4
            | 5
            | 6
            | 8,
        });

        const response = await uploadVideo(file);
        setSourceVideoAssetId(response.assetId);
        return asset;
      } catch (error) {
        if (newPreviewUrl) {
          revokePreviewUrl(newPreviewUrl);
        }
        setSourceVideo(previousVideo ?? null);
        setSourceVideoAssetId(null);
        setError(
          error instanceof Error ? error.message : 'Video upload failed.',
        );
        return null;
      } finally {
        setVideoUploading(false);
      }
    },
    [
      setError,
      setSettings,
      setSourceVideo,
      setSourceVideoAssetId,
      setVideoUploading,
      sourceVideo,
    ],
  );

  return {
    sourceVideo,
    clearVideo,
    uploadLocalVideo,
  };
}
