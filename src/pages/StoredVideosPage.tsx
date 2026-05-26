import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import MovieIcon from '@mui/icons-material/Movie';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  deleteStoredVideo,
  fetchStoredVideoBlob,
  getStoredVideos,
} from '../api/videoGeneration';
import type { StoredVideoItem } from '../types/videoGeneration';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function sourceLabel(video: StoredVideoItem): string {
  if (video.sourceType === 'combined') {
    return `Combined (${video.sceneCount ?? '?'} scenes)`;
  }
  return 'Single video';
}

const LAST_SCENE_PREVIEW_ID_KEY = 'pinterest-last-scene-video-id';

export function StoredVideosPage() {
  const queryClient = useQueryClient();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoadingId, setPreviewLoadingId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState('');

  const { data: videos = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['stored-videos'],
    queryFn: getStoredVideos,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStoredVideo,
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['stored-videos'] });

      if (previewId === deletedId) {
        if (previewUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewId(null);
        setPreviewUrl(null);
      }

      if (sessionStorage.getItem(LAST_SCENE_PREVIEW_ID_KEY) === deletedId) {
        sessionStorage.removeItem(LAST_SCENE_PREVIEW_ID_KEY);
      }
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePreview = async (video: StoredVideoItem) => {
    if (previewId === video.id && previewUrl) {
      return;
    }

    setPreviewError('');
    setPreviewLoadingId(video.id);

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPreviewId(null);

    try {
      const blob = await fetchStoredVideoBlob(video.id);
      const url = URL.createObjectURL(blob);
      setPreviewId(video.id);
      setPreviewUrl(url);
    } catch {
      setPreviewError('Could not load video preview.');
    } finally {
      setPreviewLoadingId(null);
    }
  };

  const handleDownload = async (video: StoredVideoItem) => {
    const blob = await fetchStoredVideoBlob(video.id);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `stored-video-${video.id.slice(0, 8)}.mp4`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ mb: 3, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
            Stored Videos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Videos saved after each successful generation. Older runs from before
            this feature are not listed.
          </Typography>
        </Box>
        <Button component={RouterLink} to="/video-generator" variant="outlined">
          Generate new video
        </Button>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Could not load stored videos. Restart the backend and try again.
        </Alert>
      )}

      {previewError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setPreviewError('')}>
          {previewError}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : videos.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <MovieIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No stored videos yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Generate a video in AI Video Generation. It will appear here
              automatically.
            </Typography>
            <Button component={RouterLink} to="/video-generator" variant="contained">
              Go to AI Video Generation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                      <Chip label={sourceLabel(video)} size="small" color="primary" />
                      <Chip label={formatBytes(video.sizeBytes)} size="small" variant="outlined" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(video.createdAt)}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block' }}
                    >
                      Model: {video.model} · ID: {video.id}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={
                        previewLoadingId === video.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <PlayArrowIcon />
                        )
                      }
                      disabled={previewLoadingId === video.id}
                      onClick={() => void handlePreview(video)}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => void handleDownload(video)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            'Delete this stored video? This cannot be undone.',
                          )
                        ) {
                          deleteMutation.mutate(video.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>

                {previewId === video.id && previewUrl && (
                  <Box
                    component="video"
                    src={previewUrl}
                    controls
                    sx={{
                      display: 'block',
                      width: '100%',
                      maxHeight: 480,
                      mt: 2,
                      borderRadius: 1,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {!isLoading && videos.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button size="small" onClick={() => void refetch()}>
            Refresh list
          </Button>
        </Box>
      )}
    </Box>
  );
}
