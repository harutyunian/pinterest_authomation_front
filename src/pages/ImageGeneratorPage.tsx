import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { generateImage, getImageModels } from '../api/imageGeneration';
import { getGeminiKeys } from '../api/geminiKeys';
import type { GeneratedImage } from '../types/imageGeneration';

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }
  return fallback;
}

export function ImageGeneratorPage() {
  const [keyId, setKeyId] = useState('');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState('');

  const { data: keys = [], isLoading: keysLoading } = useQuery({
    queryKey: ['gemini-keys'],
    queryFn: getGeminiKeys,
  });

  const {
    data: modelsData,
    isLoading: modelsLoading,
    isError: modelsError,
  } = useQuery({
    queryKey: ['image-models', keyId],
    queryFn: () => getImageModels(keyId),
    enabled: Boolean(keyId),
  });

  const models = modelsData?.models ?? [];

  useEffect(() => {
    setModel('');
    setGeneratedImage(null);
    setErrorMessage('');
  }, [keyId]);

  const generateMutation = useMutation({
    mutationFn: generateImage,
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
    Boolean(keyId) &&
    Boolean(model) &&
    Boolean(prompt.trim()) &&
    !generateMutation.isPending;

  const handleGenerate = () => {
    setErrorMessage('');
    generateMutation.mutate({
      keyId,
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
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
        <ImageIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Generate Image
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a Gemini API key and model, describe your image, and generate it
        with Google Gemini. Images are not saved to the database.
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
            <FormControl fullWidth disabled={keysLoading || keys.length === 0}>
              <InputLabel id="image-gen-key-label">API key</InputLabel>
              <Select
                labelId="image-gen-key-label"
                label="API key"
                value={keyId}
                onChange={(e) => setKeyId(e.target.value)}
              >
                {keys.map((key) => (
                  <MenuItem key={key.id} value={key.id}>
                    {key.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              disabled={!keyId || modelsLoading || models.length === 0}
            >
              <InputLabel id="image-gen-model-label">Model</InputLabel>
              <Select
                labelId="image-gen-model-label"
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
              </Select>
            </FormControl>

            {modelsError && keyId && (
              <Alert severity="error">
                Failed to load image models for this key.
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
              disabled={!keyId}
              slotProps={{ htmlInput: { maxLength: 2000 } }}
              helperText={`${prompt.length}/2000`}
            />

            <Box>
              <Button
                variant="contained"
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

      {generateMutation.isPending && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {generatedImage && !generateMutation.isPending && (
        <Card>
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
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Model: {generatedImage.model}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
