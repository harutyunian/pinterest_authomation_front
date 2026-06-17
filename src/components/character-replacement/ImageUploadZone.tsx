import ImageIcon from '@mui/icons-material/Image';
import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { FileDropZone, PreviewShell } from './FileDropZone';
import { useImageUpload } from '../../hooks/character-replacement/useImageUpload';
import { useCharacterReplacementStore } from '../../stores/characterReplacementStore';
import { formatBytes } from '../../utils/characterReplacement/formatters';
import { getAcceptedExtensions } from '../../utils/characterReplacement/validation';
import { IMAGE_ACCEPT } from '../../types/characterReplacement';

interface ImageUploadZoneProps {
  disabled?: boolean;
}

export function ImageUploadZone({ disabled = false }: ImageUploadZoneProps) {
  const { referenceImage, clearImage, uploadLocalImage } = useImageUpload();
  const imageUploading = useCharacterReplacementStore((s) => s.imageUploading);
  const status = useCharacterReplacementStore((s) => s.status);
  const isUploading = imageUploading && !referenceImage;

  const handleFile = (file: File) => {
    void uploadLocalImage(file);
  };

  if (isUploading) {
    return (
      <Stack spacing={1.5}>
        <Skeleton variant="rounded" height={220} />
        <Typography variant="body2" color="text.secondary">
          Uploading reference image…
        </Typography>
      </Stack>
    );
  }

  if (referenceImage) {
    return (
      <PreviewShell
        onRemove={clearImage}
        onReplace={handleFile}
        replaceAccept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        isReplacing={imageUploading}
        disabled={
          disabled || status === 'generating' || status === 'processing'
        }
      >
        <Stack direction={{ xs: 'column', md: 'row' }}>
          <Box
            component="img"
            src={referenceImage.previewUrl}
            alt="Character reference"
            sx={{
              width: { xs: '100%', md: '42%' },
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <Stack spacing={1.5} sx={{ p: 2, flex: 1, justifyContent: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <ImageIcon color="primary" fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {referenceImage.file.name}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Chip size="small" label={formatBytes(referenceImage.sizeBytes)} />
              <Chip
                size="small"
                variant="outlined"
                label={referenceImage.mimeType}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Reference character image. Use Replace or drag a new image to swap characters before generating.
            </Typography>
          </Stack>
        </Stack>
      </PreviewShell>
    );
  }

  return (
    <FileDropZone
      title="Upload character reference"
      description={`Drag & drop or browse. ${getAcceptedExtensions(IMAGE_ACCEPT)} up to 10 MB.`}
      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
      disabled={disabled}
      onFileSelected={handleFile}
    />
  );
}
