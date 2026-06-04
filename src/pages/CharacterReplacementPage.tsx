import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppSelect } from '../components/AppSelect';
import { AdvancedSettingsPanel } from '../components/character-replacement/AdvancedSettingsPanel';
import { CharacterReplacementErrorBoundary } from '../components/character-replacement/ErrorBoundary';
import { GenerateButton } from '../components/character-replacement/GenerateButton';
import { GenerationProgressPanel } from '../components/character-replacement/GenerationProgressPanel';
import { ImageUploadZone } from '../components/character-replacement/ImageUploadZone';
import { PromptEditor } from '../components/character-replacement/PromptEditor';
import { VideoGallery } from '../components/character-replacement/VideoGallery';
import { VideoUploadZone } from '../components/character-replacement/VideoUploadZone';
import { getGeminiKeys } from '../api/geminiKeys';
import { getCharacterReplacementModels } from '../api/veoCharacterReplacement';
import { useCharacterReplacementGeneration } from '../hooks/character-replacement/useCharacterReplacementGeneration';
import { useCharacterReplacementStore } from '../stores/characterReplacementStore';

export function CharacterReplacementPageContent() {
  const keyId = useCharacterReplacementStore((s) => s.keyId);
  const model = useCharacterReplacementStore((s) => s.model);
  const setKeyId = useCharacterReplacementStore((s) => s.setKeyId);
  const setModel = useCharacterReplacementStore((s) => s.setModel);
  const sourceVideoAssetId = useCharacterReplacementStore(
    (s) => s.sourceVideoAssetId,
  );
  const referenceImageAssetId = useCharacterReplacementStore(
    (s) => s.referenceImageAssetId,
  );
  const prompt = useCharacterReplacementStore((s) => s.prompt);
  const gallery = useCharacterReplacementStore((s) => s.gallery);

  const {
    status,
    progress,
    progressMessage,
    estimatedSecondsRemaining,
    error,
    isBusy,
    generate,
    removeGalleryItem,
  } = useCharacterReplacementGeneration();

  const { data: keys = [], isLoading: keysLoading } = useQuery({
    queryKey: ['gemini-keys'],
    queryFn: getGeminiKeys,
  });

  const {
    data: modelsData,
    isLoading: modelsLoading,
    isError: modelsError,
  } = useQuery({
    queryKey: ['character-replacement-models', keyId],
    queryFn: () => getCharacterReplacementModels(keyId),
    enabled: Boolean(keyId),
  });

  const models = modelsData?.models ?? [];

  useEffect(() => {
    setModel('');
  }, [keyId, setModel]);

  const canGenerate =
    Boolean(keyId) &&
    Boolean(model) &&
    Boolean(sourceVideoAssetId) &&
    Boolean(referenceImageAssetId) &&
    Boolean(prompt.trim()) &&
    !isBusy;

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
        <SwapHorizIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          AI Character Replacement
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload a performance video and a character reference image. Google Veo replaces
        the performer while preserving choreography, camera work, and scene context.
      </Typography>

      {!keysLoading && keys.length === 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No Gemini API keys found.{' '}
          <Link component={RouterLink} to="/settings">
            Add a key on the Gemini Keys page
          </Link>{' '}
          to get started.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <FormControl fullWidth disabled={keysLoading || keys.length === 0}>
              <InputLabel id="cr-key-label">API key</InputLabel>
              <AppSelect
                labelId="cr-key-label"
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

            <FormControl
              fullWidth
              disabled={!keyId || modelsLoading || models.length === 0}
            >
              <InputLabel id="cr-model-label">Model</InputLabel>
              <AppSelect
                labelId="cr-model-label"
                label="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
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

            {modelsError && keyId && (
              <Alert severity="error">
                Failed to load video models for this key.
              </Alert>
            )}

            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Source video
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Dance, movement, or performance clip that defines motion and timing.
                </Typography>
                <VideoUploadZone disabled={!keyId} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Reference character
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Identity, wardrobe, and appearance to apply onto the performer.
                </Typography>
                <ImageUploadZone disabled={!keyId} />
              </Box>
            </Stack>

            <PromptEditor disabled={!keyId || isBusy} />

            <AdvancedSettingsPanel disabled={!keyId || isBusy} />

            <Box>
              <GenerateButton
                canGenerate={canGenerate}
                status={status}
                isBusy={isBusy}
                onGenerate={() => {
                  void generate();
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <GenerationProgressPanel
        status={status}
        progress={progress}
        progressMessage={progressMessage}
        estimatedSecondsRemaining={estimatedSecondsRemaining}
      />

      <VideoGallery
        gallery={gallery}
        status={status}
        onRemove={removeGalleryItem}
      />
    </Box>
  );
}

export function CharacterReplacementPage() {
  return (
    <CharacterReplacementErrorBoundary>
      <CharacterReplacementPageContent />
    </CharacterReplacementErrorBoundary>
  );
}
