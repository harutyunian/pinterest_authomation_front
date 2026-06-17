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
  const setImageUploading = useCharacterReplacementStore(
    (s) => s.setImageUploading,
  );

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
      setImageUploading(true);
      setReferenceImageAssetId(null);

      const previousImage = referenceImage;
      if (previousImage?.previewUrl) {
        revokePreviewUrl(previousImage.previewUrl);
      }

      let newPreviewUrl: string | undefined;
      try {
        newPreviewUrl = createPreviewUrl(file);
        const asset: UploadedImageAsset = {
          file,
          previewUrl: newPreviewUrl,
          sizeBytes: file.size,
          mimeType: file.type || 'image/jpeg',
        };

        setReferenceImage(asset);

        const response = await uploadImage(file);
        setReferenceImageAssetId(response.assetId);
        return asset;
      } catch (error) {
        if (newPreviewUrl) {
          revokePreviewUrl(newPreviewUrl);
        }
        setReferenceImage(previousImage ?? null);
        setReferenceImageAssetId(null);
        setError(
          error instanceof Error ? error.message : 'Image upload failed.',
        );
        return null;
      } finally {
        setImageUploading(false);
      }
    },
    [
      referenceImage,
      setError,
      setImageUploading,
      setReferenceImage,
      setReferenceImageAssetId,
    ],
  );

  return {
    referenceImage,
    clearImage,
    uploadLocalImage,
  };
}
