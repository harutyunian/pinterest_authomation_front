import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import type { GeneratedVideoItem, GenerationStatus } from '../../types/characterReplacement';

interface VideoGalleryProps {
  gallery: GeneratedVideoItem[];
  status: GenerationStatus;
  onRemove: (id: string) => void;
}

function formatCreatedAt(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function VideoGallery({ gallery, status, onRemove }: VideoGalleryProps) {
  const isGenerating =
    status === 'generating' || status === 'processing' || status === 'uploading';

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Generated videos
        </Typography>

        {isGenerating && gallery.length === 0 && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Skeleton variant="rounded" sx={{ flex: 1, aspectRatio: '16 / 9' }} />
            <Skeleton variant="rounded" sx={{ flex: 1, aspectRatio: '16 / 9' }} />
          </Stack>
        )}

        {!isGenerating && gallery.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Completed generations will appear here with preview and download options.
          </Typography>
        )}

        <Stack spacing={3}>
          {gallery.map((item) => (
            <Box
              key={item.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{
                  p: 2,
                  alignItems: { sm: 'center' },
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="subtitle2">
                    {formatCreatedAt(item.createdAt)}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip size="small" label={item.resolution} />
                    <Chip size="small" variant="outlined" label={item.mimeType} />
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    component="a"
                    href={item.downloadUrl}
                    download={`character-replacement-${item.jobId}.mp4`}
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                  >
                    Download
                  </Button>
                  <IconButton
                    aria-label="Remove video"
                    size="small"
                    onClick={() => onRemove(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <Box
                component="video"
                src={item.previewUrl}
                controls
                playsInline
                sx={{
                  display: 'block',
                  width: '100%',
                  maxHeight: 480,
                  bgcolor: 'black',
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ p: 2, display: 'block' }}
              >
                {item.prompt}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
