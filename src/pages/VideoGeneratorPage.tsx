import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  Link,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppSelect } from '../components/AppSelect';
import { getGeminiKeys } from '../api/geminiKeys';
import {
  combineVideos,
  fetchStoredVideoBlob,
  generateScene,
  generateVideo,
  getVideoModels,
} from '../api/videoGeneration';
import type {
  VideoCharacter,
  VideoCharacterInputMode,
  VideoGenerationMode,
  VideoPreviewResult,
} from '../types/videoGeneration';
import { fileToCharacterImage, toApiCharacter } from '../utils/characterImage';
import { normalizeVideoBlob } from '../utils/videoBlob';
import {
  loadVideoGeneratorDraft,
  saveVideoGeneratorDraft,
} from '../utils/videoGeneratorStorage';

const DEFAULT_CHARACTERS: VideoCharacter[] = [
  {
    name: 'Tatsuo',
    inputMode: 'description',
    description:
      'Japanese male, 35 years old, short black hair, slim build, glasses, gray shirt',
  },
  {
    name: 'Woman',
    inputMode: 'description',
    description:
      'Japanese female, 30 years old, long black hair, pale skin, simple casual clothes',
  },
];

const DEFAULT_SCENES = [
  'Beautiful Japanese woman staring at smartphone screen in dim apartment at night, blue light on face, cinematic close-up',
  'Tokyo city at night, rain falling, neon reflections on wet streets, moody atmosphere',
  'Japanese man Tatsuo living alone in small apartment, quiet evening, realistic lighting',
  'Close-up of refrigerator interior, sparse food items, cold blue light',
  'Japanese man Tatsuo sitting alone at kitchen table, eating quietly, melancholic mood',
  'Japanese man Tatsuo secretly installing tiny hidden camera in apartment corner, tense atmosphere',
  'Office environment in Tokyo, fluorescent lighting, workers at desks',
  'Security camera footage view, grainy black and white, timestamp overlay',
  'Woman quietly stepping out of closet, dramatic reveal, low light',
  'Tokyo police entering apartment, urgent movement, handheld camera style',
];

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }
  return fallback;
}

function createSessionId(): string {
  return crypto.randomUUID();
}

const LAST_SCENE_PREVIEW_ID_KEY = 'pinterest-last-scene-video-id';

function revokePreviewUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

function getInitialFormState() {
  const saved = loadVideoGeneratorDraft();
  if (saved) {
    return {
      mode: saved.mode,
      keyId: saved.keyId,
      model: saved.model,
      aspectRatio: saved.aspectRatio,
      durationSeconds: saved.durationSeconds,
      prompt: saved.prompt,
      characters:
        saved.characters.length > 0 ? saved.characters : DEFAULT_CHARACTERS,
      scenes: saved.scenes.length > 0 ? saved.scenes : DEFAULT_SCENES,
    };
  }

  return {
    mode: 'scene' as VideoGenerationMode,
    keyId: '',
    model: '',
    aspectRatio: '16:9' as const,
    durationSeconds: 6 as 4 | 5 | 6 | 8,
    prompt: '',
    characters: DEFAULT_CHARACTERS,
    scenes: DEFAULT_SCENES,
  };
}

export function VideoGeneratorPage() {
  const initialForm = useMemo(() => getInitialFormState(), []);

  const [mode, setMode] = useState<VideoGenerationMode>(initialForm.mode);
  const [keyId, setKeyId] = useState(initialForm.keyId);
  const [model, setModel] = useState(initialForm.model);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(
    initialForm.aspectRatio,
  );
  const [durationSeconds, setDurationSeconds] = useState<4 | 5 | 6 | 8>(
    initialForm.durationSeconds,
  );
  const [prompt, setPrompt] = useState(initialForm.prompt);
  const [characters, setCharacters] = useState<VideoCharacter[]>(
    initialForm.characters,
  );
  const [scenes, setScenes] = useState<string[]>(initialForm.scenes);
  const skipKeyIdResetRef = useRef(true);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<VideoPreviewResult | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressLabel, setProgressLabel] = useState('');
  const [progressValue, setProgressValue] = useState(0);

  const { data: keys = [], isLoading: keysLoading } = useQuery({
    queryKey: ['gemini-keys'],
    queryFn: getGeminiKeys,
  });

  const {
    data: modelsData,
    isLoading: modelsLoading,
    isError: modelsError,
  } = useQuery({
    queryKey: ['video-models', keyId],
    queryFn: () => getVideoModels(keyId),
    enabled: Boolean(keyId),
  });

  const models = modelsData?.models ?? [];

  const clearVideoPreview = () => {
    setVideoPreview((prev) => {
      if (prev?.previewUrl) {
        revokePreviewUrl(prev.previewUrl);
      }
      return null;
    });
  };

  const applyVideoPreview = (preview: VideoPreviewResult) => {
    setVideoPreview((prev) => {
      if (prev?.previewUrl) {
        revokePreviewUrl(prev.previewUrl);
      }
      previewUrlRef.current = preview.previewUrl;
      return preview;
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        revokePreviewUrl(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!videoPreview) {
      return;
    }
    resultCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [videoPreview]);

  useEffect(() => {
    const storedId = sessionStorage.getItem(LAST_SCENE_PREVIEW_ID_KEY);
    if (!storedId) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const rawBlob = await fetchStoredVideoBlob(storedId);
        const blob = await normalizeVideoBlob(rawBlob);
        if (cancelled) {
          return;
        }
        applyVideoPreview({
          previewUrl: URL.createObjectURL(blob),
          mimeType: blob.type || 'video/mp4',
          model: 'combined',
          downloadFilename: 'combined-video.mp4',
        });
      } catch {
        // ignore restore failures
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skipKeyIdResetRef.current) {
      skipKeyIdResetRef.current = false;
      return;
    }
    setModel('');
    clearVideoPreview();
    setErrorMessage('');
  }, [keyId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      saveVideoGeneratorDraft({
        mode,
        keyId,
        model,
        aspectRatio,
        durationSeconds,
        prompt,
        characters,
        scenes,
      });
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [
    mode,
    keyId,
    model,
    aspectRatio,
    durationSeconds,
    prompt,
    characters,
    scenes,
  ]);

  const canGenerate = useMemo(() => {
    if (!keyId || !model || isGenerating) return false;
    if (mode === 'just-video') return Boolean(prompt.trim());
    return scenes.some((s) => s.trim());
  }, [keyId, model, isGenerating, mode, prompt, scenes]);

  const handleGenerateJustVideo = async () => {
    setErrorMessage('');
    clearVideoPreview();
    setIsGenerating(true);
    setProgressLabel('Generating video…');
    setProgressValue(0);

    const apiCharacters = characters.map(toApiCharacter);

    try {
      const result = await generateVideo({
        keyId,
        model,
        prompt: prompt.trim(),
        aspectRatio,
        durationSeconds,
        characters: apiCharacters.length > 0 ? apiCharacters : undefined,
      });
      applyVideoPreview({
        previewUrl: `data:${result.mimeType};base64,${result.videoBase64}`,
        mimeType: result.mimeType,
        model: result.model,
        downloadFilename: 'generated-video.mp4',
      });
      setProgressValue(100);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Video generation failed. Please try again.'),
      );
    } finally {
      setIsGenerating(false);
      setProgressLabel('');
    }
  };

  const handleGenerateScenes = async () => {
    const validScenes = scenes
      .map((s) => s.trim())
      .filter(Boolean);

    if (validScenes.length === 0) {
      setErrorMessage('Add at least one scene prompt.');
      return;
    }

    setErrorMessage('');
    clearVideoPreview();
    setIsGenerating(true);
    setProgressValue(0);

    const sessionId = createSessionId();
    const apiCharacters = characters.map(toApiCharacter);

    const totalScenes = validScenes.length;
    let completedCount = 0;

    try {
      setProgressLabel(`Generating ${totalScenes} scenes in parallel…`);

      const sceneTasks = validScenes.map((prompt, sceneIndex) =>
        generateScene({
          keyId,
          model,
          sessionId,
          sceneIndex,
          prompt,
          characters: apiCharacters,
          aspectRatio,
          durationSeconds,
        }).then(() => {
          completedCount += 1;
          setProgressLabel(
            `Generated ${completedCount} of ${totalScenes} scenes…`,
          );
          setProgressValue(Math.round((completedCount / totalScenes) * 90));
        }),
      );

      await Promise.all(sceneTasks);

      setProgressLabel('Combining scenes into final video…');
      setProgressValue(95);

      const combined = await combineVideos({
        sessionId,
        expectedSceneCount: totalScenes,
      });
      sessionStorage.setItem(LAST_SCENE_PREVIEW_ID_KEY, combined.storedVideoId);
      setProgressLabel('Loading video preview…');
      setProgressValue(98);

      const rawBlob = await fetchStoredVideoBlob(combined.storedVideoId);
      const blob = await normalizeVideoBlob(rawBlob);
      applyVideoPreview({
        previewUrl: URL.createObjectURL(blob),
        mimeType: blob.type || combined.mimeType,
        model: combined.model,
        downloadFilename: 'combined-video.mp4',
      });
      setProgressValue(100);
    } catch (error) {
      const baseMessage = getErrorMessage(
        error,
        'Scene video generation failed. Please try again.',
      );
      setErrorMessage(
        `${baseMessage} Some scenes may still be running on the server; retry or reduce scene count if you hit rate limits.`,
      );
    } finally {
      setIsGenerating(false);
      setProgressLabel('');
    }
  };

  const handleGenerate = () => {
    if (mode === 'just-video') {
      void handleGenerateJustVideo();
      return;
    }
    void handleGenerateScenes();
  };

  const updateCharacter = (
    index: number,
    field: keyof VideoCharacter,
    value: string,
  ) => {
    setCharacters((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  };

  const setCharacterInputMode = (
    index: number,
    inputMode: VideoCharacterInputMode,
  ) => {
    setCharacters((prev) =>
      prev.map((c, i) => {
        if (i !== index) return c;
        if (inputMode === 'description') {
          return {
            name: c.name,
            inputMode,
            description: c.description ?? '',
          };
        }
        return {
          name: c.name,
          inputMode,
          imageBase64: c.imageBase64,
          imageMimeType: c.imageMimeType,
          imagePreviewUrl: c.imagePreviewUrl,
        };
      }),
    );
  };

  const handleCharacterPhotoUpload = async (
    index: number,
    file: File | null,
  ) => {
    if (!file) return;

    try {
      const { imageBase64, imageMimeType, previewUrl } =
        await fileToCharacterImage(file);
      setCharacters((prev) =>
        prev.map((c, i) =>
          i === index
            ? {
                ...c,
                inputMode: 'image',
                imageBase64,
                imageMimeType,
                imagePreviewUrl: previewUrl,
              }
            : c,
        ),
      );
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to load image.',
      );
    }
  };

  const addCharacter = () => {
    setCharacters((prev) => [
      ...prev,
      { name: '', inputMode: 'description', description: '' },
    ]);
  };

  const removeCharacter = (index: number) => {
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  };

  const updateScene = (index: number, value: string) => {
    setScenes((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  const addScene = () => {
    setScenes((prev) => [...prev, '']);
  };

  const removeScene = (index: number) => {
    setScenes((prev) => prev.filter((_, i) => i !== index));
  };

  const moveScene = (index: number, direction: -1 | 1) => {
    setScenes((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
        <MovieIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          AI Video Generation
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Generate short videos with Google Gemini Veo. Use Scene mode to create
        multiple chapters with consistent characters, or Just video for a single
        clip.
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/stored-videos">
          View all stored videos
        </Link>
      </Typography>

      {!keysLoading && keys.length === 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No Gemini API keys found.{' '}
          <Link component={RouterLink} to="/gemini-keys">
            Add a key on the Gemini Keys page
          </Link>{' '}
          to get started.
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <ToggleButtonGroup
              exclusive
              value={mode}
              onChange={(_, value: VideoGenerationMode | null) => {
                if (value) {
                  setMode(value);
                  clearVideoPreview();
                  setErrorMessage('');
                }
              }}
              size="small"
            >
              <ToggleButton value="scene">Scene mode</ToggleButton>
              <ToggleButton value="just-video">Just video</ToggleButton>
            </ToggleButtonGroup>

            <FormControl fullWidth disabled={keysLoading || keys.length === 0}>
              <InputLabel id="video-gen-key-label">API key</InputLabel>
              <AppSelect
                labelId="video-gen-key-label"
                label="API key"
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
              >
                {keys.map((key) => (
                  <MenuItem key={key.id} value={key.id}>
                    {key.name}
                  </MenuItem>
                ))}
              </AppSelect>
            </FormControl>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl
                fullWidth
                disabled={!keyId || modelsLoading || models.length === 0}
              >
                <InputLabel id="video-gen-model-label">Model</InputLabel>
                <AppSelect
                  labelId="video-gen-model-label"
                  label="Model"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    clearVideoPreview();
                  }}
                >
                  {modelsLoading && (
                    <MenuItem value="" disabled>
                      Loading models…
                    </MenuItem>
                  )}
                  {!modelsLoading &&
                    models.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.displayName}
                      </MenuItem>
                    ))}
                </AppSelect>
              </FormControl>

              <FormControl fullWidth disabled={!keyId}>
                <InputLabel id="video-gen-aspect-label">Aspect ratio</InputLabel>
                <AppSelect
                  labelId="video-gen-aspect-label"
                  label="Aspect ratio"
                  value={aspectRatio}
                  onChange={(e) =>
                    setAspectRatio(e.target.value as '16:9' | '9:16')
                  }
                >
                  <MenuItem value="16:9">16:9 (landscape)</MenuItem>
                  <MenuItem value="9:16">9:16 (portrait)</MenuItem>
                </AppSelect>
              </FormControl>

              <FormControl fullWidth disabled={!keyId}>
                <InputLabel id="video-gen-duration-label">Duration</InputLabel>
                <AppSelect
                  labelId="video-gen-duration-label"
                  label="Duration"
                  value={durationSeconds}
                  onChange={(e) =>
                    setDurationSeconds(
                      Number(e.target.value) as 4 | 5 | 6 | 8,
                    )
                  }
                >
                  <MenuItem value={4}>4 seconds</MenuItem>
                  <MenuItem value={5}>5 seconds</MenuItem>
                  <MenuItem value={6}>6 seconds</MenuItem>
                  <MenuItem value={8}>8 seconds</MenuItem>
                </AppSelect>
              </FormControl>
            </Stack>

            {modelsError && keyId && (
              <Alert severity="error">
                Failed to load video models for this key.
              </Alert>
            )}

            <Box>
              <Stack
                direction="row"
                sx={{
                  mb: 1.5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Characters / Personas
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addCharacter}
                  disabled={!keyId}
                >
                  Add character
                </Button>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Write a description or upload a photo. Mention character names in
                your scene or video prompt to use their reference images (up to 3
                per scene).
              </Typography>
              <Stack spacing={2}>
                {characters.map((character, index) => (
                  <Card key={`character-${index}`} variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          sx={{ alignItems: { sm: 'center' } }}
                        >
                          <TextField
                            label="Name"
                            value={character.name}
                            onChange={(e) =>
                              updateCharacter(index, 'name', e.target.value)
                            }
                            sx={{ minWidth: 140 }}
                            disabled={!keyId}
                            helperText="Use this name in prompts"
                          />
                          <ToggleButtonGroup
                            exclusive
                            size="small"
                            value={character.inputMode}
                            onChange={(_, value: VideoCharacterInputMode | null) => {
                              if (value) setCharacterInputMode(index, value);
                            }}
                            disabled={!keyId}
                          >
                            <ToggleButton value="description">
                              Write description
                            </ToggleButton>
                            <ToggleButton value="image">Upload photo</ToggleButton>
                          </ToggleButtonGroup>
                          <IconButton
                            aria-label="Remove character"
                            onClick={() => removeCharacter(index)}
                            disabled={!keyId}
                            sx={{ ml: 'auto' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>

                        {character.inputMode === 'description' ? (
                          <TextField
                            label="Description"
                            value={character.description ?? ''}
                            onChange={(e) =>
                              updateCharacter(
                                index,
                                'description',
                                e.target.value,
                              )
                            }
                            fullWidth
                            multiline
                            minRows={2}
                            disabled={!keyId}
                          />
                        ) : (
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ alignItems: { sm: 'center' } }}
                          >
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<PhotoCameraIcon />}
                              disabled={!keyId}
                            >
                              {character.imagePreviewUrl
                                ? 'Change photo'
                                : 'Upload photo'}
                              <input
                                type="file"
                                hidden
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] ?? null;
                                  void handleCharacterPhotoUpload(index, file);
                                  e.target.value = '';
                                }}
                              />
                            </Button>
                            {character.imagePreviewUrl && (
                              <Box
                                component="img"
                                src={character.imagePreviewUrl}
                                alt={character.name || 'Character reference'}
                                sx={{
                                  width: 120,
                                  height: 120,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: 1,
                                  borderColor: 'divider',
                                }}
                              />
                            )}
                            <Typography variant="body2" color="text.secondary">
                              JPEG, PNG, or WebP up to 10 MB. Mention &quot;
                              {character.name || 'character name'}&quot; in your
                              prompt to apply this look.
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            <Divider />

            {mode === 'just-video' ? (
              <TextField
                label="Prompt"
                placeholder="Describe the video you want to generate…"
                multiline
                minRows={4}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={!keyId}
                slotProps={{ htmlInput: { maxLength: 4000 } }}
                helperText={`${prompt.length}/4000`}
              />
            ) : (
              <Box>
                  <Stack
                    direction="row"
                    sx={{
                      mb: 1.5,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Scenes
                    </Typography>
                    <Button size="small" startIcon={<AddIcon />} onClick={addScene}>
                      Add scene
                    </Button>
                  </Stack>
                  <Stack spacing={2}>
                    {scenes.map((scene, index) => (
                      <Stack
                        key={`scene-${index}`}
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'flex-start' }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ minWidth: 28, pt: 1.5 }}
                        >
                          {index + 1}.
                        </Typography>
                        <TextField
                          label={`Scene ${index + 1} prompt`}
                          value={scene}
                          onChange={(e) => updateScene(index, e.target.value)}
                          fullWidth
                          multiline
                          minRows={2}
                          disabled={!keyId}
                          slotProps={{ htmlInput: { maxLength: 4000 } }}
                        />
                        <Stack direction="column" spacing={0.5}>
                          <IconButton
                            aria-label="Move scene up"
                            size="small"
                            onClick={() => moveScene(index, -1)}
                            disabled={index === 0 || !keyId}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="Move scene down"
                            size="small"
                            onClick={() => moveScene(index, 1)}
                            disabled={index === scenes.length - 1 || !keyId}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="Remove scene"
                            size="small"
                            onClick={() => removeScene(index)}
                            disabled={!keyId}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
            )}

            <Box>
              <Button
                type="button"
                variant="contained"
                startIcon={
                  isGenerating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AutoAwesomeIcon />
                  )
                }
                onClick={handleGenerate}
                disabled={!canGenerate}
              >
                {isGenerating
                  ? 'Generating…'
                  : mode === 'scene'
                    ? 'Generate & combine scenes'
                    : 'Generate video'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {isGenerating && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography color="text.secondary">
                {progressLabel ||
                  'Generating video… This may take several minutes per scene.'}
              </Typography>
              <LinearProgress
                variant={progressValue > 0 ? 'determinate' : 'indeterminate'}
                value={progressValue}
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {videoPreview && !isGenerating && (
        <Card ref={resultCardRef}>
          <CardContent>
            <Stack
              direction="row"
              sx={{
                mb: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Result
              </Typography>
              <Button
                component="a"
                href={videoPreview.previewUrl}
                download={videoPreview.downloadFilename}
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </Stack>
            <Box
              component="video"
              src={videoPreview.previewUrl}
              controls
              sx={{
                display: 'block',
                maxWidth: '100%',
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Model: {videoPreview.model}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
