import { useCallback } from 'react';
import { uploadImage } from '@/api/veoCharacterReplacement';
import { useCharacterReplacementStore } from '@/stores/characterReplacementStore';
import type { UploadedImageAsset } from '@/types/characterReplacement';
import {
  createPreviewUrl,
  revokePreviewUrl,
} from '@/utils/characterReplacement/formatters';
import { validateImageFile } from '@/utils/characterReplacement/validation';

export function useImageUpload() {
  const referenceImage = useCharacterReplacementStore((s) => s.referenceImage);
  const setReferenceImage = useCharacterReplacementStore(
    (s) => s.setReferenceImage,
  );
  const setReferenceImageAssetId = useCharacterReplacementStore(
    (s) => s.setReferenceImageAssetId,
  );
  const setError = useCharacterReplacementStore((s) => s.setError);
  const setStatus = useCharacterReplacementStore((s) => s.setStatus);

  const clearImage = useCallback(() => {
    revokePreviewUrl(referenceImage?.previewUrl);
    setReferenceImage(null);
    setReferenceImageAssetId(null);
  }, [referenceImage?.previewUrl, setReferenceImage, setReferenceImageAssetId]);

  const uploadLocalImage = useCallback(
    async (file: File): Promise<UploadedImageAsset | null> => {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError.message);
        return null;
      }

      setError(null);
      setStatus('uploading');

      try {
        const previewUrl = createPreviewUrl(file);
        const asset: UploadedImageAsset = {
          file,
          previewUrl,
          sizeBytes: file.size,
          mimeType: file.type || 'image/jpeg',
        };

        const response = await uploadImage(file);
        setReferenceImage(asset);
        setReferenceImageAssetId(response.assetId);
        setStatus('idle');
        return asset;
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Image upload failed.',
        );
        setStatus('idle');
        return null;
      }
    },
    [setError, setReferenceImage, setReferenceImageAssetId, setStatus],
  );

  return {
    referenceImage,
    clearImage,
    uploadLocalImage,
  };
}
