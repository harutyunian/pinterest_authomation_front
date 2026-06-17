import MovieIcon from '@mui/icons-material/Movie';
import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { FileDropZone, PreviewShell } from './FileDropZone';
import { useVideoUpload } from '../../hooks/character-replacement/useVideoUpload';
import { useCharacterReplacementStore } from '../../stores/characterReplacementStore';
import {
  formatBytes,
  formatDuration,
} from '../../utils/characterReplacement/formatters';
import { getAcceptedExtensions } from '../../utils/characterReplacement/validation';
import { VIDEO_ACCEPT } from '../../types/characterReplacement';

interface VideoUploadZoneProps {
  disabled?: boolean;
}

export function VideoUploadZone({ disabled = false }: VideoUploadZoneProps) {
  const { sourceVideo, clearVideo, uploadLocalVideo } = useVideoUpload();
  const videoUploading = useCharacterReplacementStore((s) => s.videoUploading);
  const status = useCharacterReplacementStore((s) => s.status);
  const isUploading = videoUploading && !sourceVideo;

  const handleFile = (file: File) => {
    void uploadLocalVideo(file);
  };

  if (isUploading) {
    return (
      <Stack spacing={1.5}>
        <Skeleton variant="rounded" height={220} />
        <Typography variant="body2" color="text.secondary">
          Uploading source video…
        </Typography>
      </Stack>
    );
  }

  if (sourceVideo) {
    return (
      <PreviewShell
        onRemove={clearVideo}
        onReplace={handleFile}
        replaceAccept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
        isReplacing={videoUploading}
        disabled={
          disabled || status === 'generating' || status === 'processing'
        }
      >
        <Stack direction={{ xs: 'column', md: 'row' }}>
          <Box
            component="video"
            src={sourceVideo.previewUrl}
            controls
            muted
            playsInline
            sx={{
              width: { xs: '100%', md: '58%' },
              aspectRatio: '16 / 9',
              bgcolor: 'black',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <Stack spacing={1.5} sx={{ p: 2, flex: 1, justifyContent: 'center' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <MovieIcon color="primary" fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {sourceVideo.file.name}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
              <Chip
                size="small"
                label={formatDuration(sourceVideo.durationSeconds)}
              />
              <Chip size="small" label={formatBytes(sourceVideo.sizeBytes)} />
              <Chip size="small" variant="outlined" label={sourceVideo.mimeType} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Source motion video. Longer clips are generated in 8-second segments to match the full performance.
            </Typography>
          </Stack>
        </Stack>
      </PreviewShell>
    );
  }

  return (
    <FileDropZone
      title="Upload source video"
      description={`Drag & drop or browse. ${getAcceptedExtensions(VIDEO_ACCEPT)} up to 500 MB.`}
      accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
      disabled={disabled}
      onFileSelected={handleFile}
    />
  );
}
