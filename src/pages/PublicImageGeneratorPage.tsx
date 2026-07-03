import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ConvertButton } from '../components/ytmp3/ConvertButton';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { generatePublicImage, getPublicImageModels } from '../api/publicTools';
import { AppSelect } from '../components/AppSelect';
import { AdminCard } from '../components/layout/AdminCard';
import type { GeneratedImage } from '../types/imageGeneration';
import {
  getStoredPublicApiKey,
  setStoredPublicApiKey,
} from '../utils/publicToolsStorage';

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }
  return fallback;
}

export function PublicImageGeneratorPage() {
  const [apiKey, setApiKey] = useState(getStoredPublicApiKey);
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const trimmedApiKey = apiKey.trim();
  const hasApiKey = Boolean(trimmedApiKey);

  const {
    data: modelsData,
    isLoading: modelsLoading,
    isError: modelsError,
  } = useQuery({
    queryKey: ['public-image-models', trimmedApiKey],
    queryFn: () => getPublicImageModels(trimmedApiKey),
    enabled: hasApiKey,
    retry: 1,
  });

  const models = modelsData?.models ?? [];

  useEffect(() => {
    setModel('');
    setGeneratedImage(null);
    setErrorMessage('');
  }, [trimmedApiKey]);

  const generateMutation = useMutation({
    mutationFn: generatePublicImage,
    onSuccess: (result) => {
      setGeneratedImage(result);
      setErrorMessage('');
    },
    onError: (error) => {
      setErrorMessage(
        getErrorMessage(error, 'Image generation failed. Please try again.'),
      );
    },
  });

  const canGenerate =
    hasApiKey &&
    Boolean(model) &&
    Boolean(prompt.trim()) &&
    !generateMutation.isPending;

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setStoredPublicApiKey(value);
  };

  const handleGenerate = () => {
    setErrorMessage('');
    generateMutation.mutate({
      apiKey: trimmedApiKey,
      model,
      prompt: prompt.trim(),
    });
  };

  const downloadHref = generatedImage
    ? `data:${generatedImage.mimeType};base64,${generatedImage.imageBase64}`
    : undefined;

  const downloadFilename = generatedImage
    ? `generated-image.${generatedImage.mimeType.split('/')[1] ?? 'png'}`
    : 'generated-image.png';

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Free tool — no login required. Paste your{' '}
          <Link href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
            Gemini API key
          </Link>
          ; it is kept only in this browser tab.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <AdminCard>
            <Stack spacing={3}>
              <TextField
                label="Gemini API key"
                type="password"
                placeholder="AIza..."
                fullWidth
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                helperText="Stored in sessionStorage for this tab only"
              />

              <FormControl fullWidth disabled={!hasApiKey || modelsLoading || models.length === 0}>
                <InputLabel id="public-image-gen-model-label">Model</InputLabel>
                <AppSelect
                  labelId="public-image-gen-model-label"
                  label="Model"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setGeneratedImage(null);
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

              {modelsError && hasApiKey && (
                <Alert severity="error">
                  Could not load models. Check your API key and try again.
                </Alert>
              )}

              <TextField
                label="Prompt"
                placeholder="Describe the image you want to generate…"
                multiline
                minRows={4}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={!hasApiKey}
                slotProps={{ htmlInput: { maxLength: 2000 } }}
                helperText={`${prompt.length}/2000`}
              />

              <Box>
                <ConvertButton
                  type="button"
                  startIcon={
                    generateMutation.isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AutoAwesomeIcon />
                    )
                  }
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                >
                  {generateMutation.isPending ? 'Generating…' : 'Generate'}
                </ConvertButton>
              </Box>

              <Alert severity="info" sx={{ mt: 1 }}>
                Want Pinterest automation and saved keys?{' '}
                <Link component={RouterLink} to="/login">
                  Sign in
                </Link>
              </Alert>
            </Stack>
          </AdminCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {generateMutation.isPending && (
            <AdminCard>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: 'center', justifyContent: 'center', py: 4 }}
              >
                <CircularProgress />
                <Typography color="text.secondary">
                  Generating image… This may take up to a minute.
                </Typography>
              </Stack>
            </AdminCard>
          )}

          {generatedImage && !generateMutation.isPending && (
            <AdminCard>
              <Stack
                direction="row"
                sx={{
                  mb: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Generated image
                </Typography>
                <Button
                  component="a"
                  href={downloadHref}
                  download={downloadFilename}
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              </Stack>
              <Box
                component="img"
                src={downloadHref}
                alt="Generated"
                sx={{
                  display: 'block',
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Model: {generatedImage.model}
              </Typography>
            </AdminCard>
          )}

          {!generateMutation.isPending && !generatedImage && !errorMessage && (
            <AdminCard>
              <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
                Your generated images will appear here. Add your API key, enter a prompt, and click
                Generate.
              </Typography>
            </AdminCard>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
