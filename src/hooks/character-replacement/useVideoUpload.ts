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
  const setStatus = useCharacterReplacementStore((s) => s.setStatus);

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
      setStatus('uploading');

      try {
        const durationSeconds = await getVideoDuration(file);
        const previewUrl = createPreviewUrl(file);
        const asset: UploadedVideoAsset = {
          file,
          previewUrl,
          durationSeconds,
          sizeBytes: file.size,
          mimeType: file.type || 'video/mp4',
        };

        const response = await uploadVideo(file);
        setSourceVideo(asset);
        setSourceVideoAssetId(response.assetId);
        setStatus('idle');
        return asset;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Video upload failed.',
        );
        setStatus('idle');
        return null;
      }
    },
    [setError, setSourceVideo, setSourceVideoAssetId, setStatus],
  );

  return {
    sourceVideo,
    clearVideo,
    uploadLocalVideo,
  };
}
