import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import PinIcon from '@mui/icons-material/PushPin';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  LinearProgress,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { getGeminiKeys } from '../api/geminiKeys';
import {
  createPinterestBoard,
  disconnectPinterest,
  getBoards,
  getConnection,
  getOAuthUrl,
  publishPin,
} from '../api/pinterest';
import { generateIdeas, generatePin } from '../api/pinterestContent';
import type { GeneratedPin } from '../types/pinterestContent';

const BOARD_STORAGE_KEY = 'pin-creator-pinterest-board-id';

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }
  return fallback;
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function PinCreatorPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyId, setKeyId] = useState('');
  const [boardId, setBoardId] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [generatedPin, setGeneratedPin] = useState<GeneratedPin | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [publishedLink, setPublishedLink] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: connection, isLoading: connectionLoading } = useQuery({
    queryKey: ['pinterest-connection'],
    queryFn: getConnection,
  });

  const { data: boardsData, isLoading: boardsLoading, isError: boardsError, error: boardsQueryError } = useQuery({
    queryKey: ['pinterest-boards', connection?.apiMode],
    queryFn: getBoards,
    enabled: connection?.connected === true,
    retry: 1,
  });

  const connectMutation = useMutation({
    mutationFn: getOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      setErrorMessage(
        getErrorMessage(error, 'Failed to start Pinterest connection.'),
      );
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: disconnectPinterest,
    onSuccess: () => {
      setBoardId('');
      setPublishedLink(null);
      queryClient.invalidateQueries({ queryKey: ['pinterest-connection'] });
      queryClient.invalidateQueries({ queryKey: ['pinterest-boards'] });
    },
    onError: (error) => {
      setErrorMessage(
        getErrorMessage(error, 'Failed to disconnect Pinterest account.'),
      );
    },
  });

  const createBoardMutation = useMutation({
    mutationFn: () => createPinterestBoard('Home Decor Pins'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinterest-boards'] });
      setSuccessMessage('Sandbox board created. Select it below to publish pins.');
      setErrorMessage('');
    },
    onError: (error) => {
      setErrorMessage(
        getErrorMessage(error, 'Failed to create Pinterest board.'),
      );
    },
  });

  const publishMutation = useMutation({
    mutationFn: publishPin,
    onSuccess: (data) => {
      setPublishedLink(data.link);
      setSuccessMessage('Pin published to Pinterest.');
      setErrorMessage('');
    },
    onError: (error) => {
      setErrorMessage(
        getErrorMessage(error, 'Failed to publish pin to Pinterest.'),
      );
    },
  });

  useEffect(() => {
    const pinterest = searchParams.get('pinterest');
    if (pinterest === 'connected') {
      setSuccessMessage('Pinterest account connected successfully.');
      queryClient.invalidateQueries({ queryKey: ['pinterest-connection'] });
      queryClient.invalidateQueries({ queryKey: ['pinterest-boards'] });
      searchParams.delete('pinterest');
      searchParams.delete('message');
      setSearchParams(searchParams, { replace: true });
    } else if (pinterest === 'error') {
      const message = searchParams.get('message');
      setErrorMessage(message ?? 'Pinterest connection failed.');
      searchParams.delete('pinterest');
      searchParams.delete('message');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient]);

  useEffect(() => {
    const boards = boardsData?.boards ?? [];
    if (boards.length === 0) return;
    setBoardId((current) => {
      if (current && boards.some((b) => b.id === current)) return current;
      const stored = localStorage.getItem(BOARD_STORAGE_KEY);
      if (stored && boards.some((b) => b.id === stored)) return stored;
      return boards[0].id;
    });
  }, [boardsData]);

  const handleBoardChange = (id: string) => {
    setBoardId(id);
    localStorage.setItem(BOARD_STORAGE_KEY, id);
  };

  const { data: keys = [], isLoading: keysLoading } = useQuery({
    queryKey: ['gemini-keys'],
    queryFn: getGeminiKeys,
  });

  const ideasMutation = useMutation({
    mutationFn: generateIdeas,
    onSuccess: (data) => {
      setIdeas(data.ideas);
      setSelectedTitle(null);
      setGeneratedPin(null);
      setErrorMessage('');
    },
    onError: (error) => {
      setErrorMessage(
        getErrorMessage(error, 'Failed to generate title ideas. Try again.'),
      );
    },
  });

  const pinMutation = useMutation({
    mutationFn: generatePin,
    onSuccess: (data) => {
      setGeneratedPin(data);
      setErrorMessage('');
    },
    onError: (error) => {
      setErrorMessage(
        getErrorMessage(error, 'Failed to generate pin content. Try again.'),
      );
    },
  });

  const handleGenerateIdeas = () => {
    setErrorMessage('');
    ideasMutation.mutate({ keyId, count: 8 });
  };

  const handleSelectTitle = (title: string) => {
    if (!keyId || pinMutation.isPending) return;
    setSelectedTitle(title);
    setGeneratedPin(null);
    setErrorMessage('');
    pinMutation.mutate({ keyId, title });
  };

  const handlePickAnother = () => {
    setSelectedTitle(null);
    setGeneratedPin(null);
    setErrorMessage('');
  };

  const handleCopy = async (field: string, text: string) => {
    await copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadHref = generatedPin
    ? `data:${generatedPin.image.mimeType};base64,${generatedPin.image.imageBase64}`
    : undefined;

  const downloadFilename = generatedPin
    ? `pinterest-pin.${generatedPin.image.mimeType.split('/')[1] ?? 'png'}`
    : 'pinterest-pin.png';

  const hashtagsText = generatedPin
    ? generatedPin.hashtags.map((h) => `#${h}`).join(' ')
    : '';

  const handlePostToPinterest = () => {
    if (!generatedPin || !boardId) return;
    setPublishedLink(null);
    setSuccessMessage('');
    const descriptionWithHashtags = hashtagsText
      ? `${generatedPin.description}\n\n${hashtagsText}`
      : generatedPin.description;
    publishMutation.mutate({
      boardId,
      title: generatedPin.title,
      description: descriptionWithHashtags,
      imageBase64: generatedPin.image.imageBase64,
      mimeType: generatedPin.image.mimeType,
    });
  };

  const boards = boardsData?.boards ?? [];
  const selectedBoard = boards.find((b) => b.id === boardId);
  const isSecretBoard =
    selectedBoard?.privacy === 'SECRET' ||
    selectedBoard?.privacy === 'PROTECTED';
  const isConfigured = connection?.configured !== false;
  const isConnected = connection?.connected === true;
  const isProduction = connection?.apiMode === 'production';

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
        <PinIcon color="primary" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Pin Creator — Home Decor
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Generate Pinterest title ideas for the home decor niche, then click a
        title to create description, hashtags, and a vertical pin image. Nothing
        is saved to the database.
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
          {publishedLink && (
            <>
              {' '}
              <Link href={publishedLink} target="_blank" rel="noopener noreferrer">
                View on Pinterest
              </Link>
            </>
          )}
        </Alert>
      )}

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
          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Pinterest account
              </Typography>
              {connectionLoading ? (
                <CircularProgress size={20} />
              ) : (
                <Chip
                  size="small"
                  label={isConnected ? 'Connected' : 'Not connected'}
                  color={isConnected ? 'success' : 'default'}
                />
              )}
            </Stack>
            {!isConfigured && !connectionLoading && (
              <Alert severity="warning">
                Pinterest API credentials are not set on the server. Add{' '}
                <code>PINTEREST_APP_ID</code> and <code>PINTEREST_APP_SECRET</code>{' '}
                to the VPS <code>/opt/pinterest/.env</code>, then restart the API
                container.
              </Alert>
            )}
            {isConfigured && connection?.apiMode === 'sandbox' && (
              <Alert severity="info">
                Pinterest <strong>Trial</strong> mode: pins are created via the API
                sandbox (test environment). After Standard access is approved, set{' '}
                <code>PINTEREST_USE_SANDBOX=false</code> on the server, restart the
                API, then Disconnect and Connect Pinterest again.
              </Alert>
            )}
            {isConfigured && isConnected && isProduction && (
              <Alert severity="success">
                Production mode: pins publish to your real Pinterest account via{' '}
                <code>api.pinterest.com</code>.
              </Alert>
            )}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {!isConnected && isConfigured && (
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#E60023', '&:hover': { bgcolor: '#ad081b' } }}
                  disabled={connectionLoading || connectMutation.isPending}
                  onClick={() => connectMutation.mutate()}
                >
                  {connectMutation.isPending ? 'Redirecting…' : 'Connect Pinterest'}
                </Button>
              )}
              {isConnected && (
                <Button
                  variant="outlined"
                  color="inherit"
                  disabled={disconnectMutation.isPending}
                  onClick={() => disconnectMutation.mutate()}
                >
                  {disconnectMutation.isPending ? 'Disconnecting…' : 'Disconnect'}
                </Button>
              )}
            </Stack>
            {boardsError && isConnected && (
              <Alert severity="error">
                {getErrorMessage(
                  boardsQueryError,
                  'Failed to load Pinterest boards.',
                )}{' '}
                Try Disconnect → Connect again. If you changed{' '}
                <code>PINTEREST_USE_SANDBOX</code> on the server, reconnect after the API
                restarts.
              </Alert>
            )}
            {isConnected && !boardsLoading && !boardsError && boards.length === 0 && (
              <Alert severity="warning">
                {connection?.apiMode === 'sandbox' ? (
                  <Stack spacing={1.5}>
                    <Typography variant="body2">
                      Sandbox accounts start with <strong>no boards</strong> — your live
                      boards on pinterest.com (e.g. Europe) are not copied here. Create a
                      test board via the API, then publish pins to it.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={createBoardMutation.isPending}
                      onClick={() => createBoardMutation.mutate()}
                      startIcon={
                        createBoardMutation.isPending ? (
                          <CircularProgress size={16} />
                        ) : undefined
                      }
                    >
                      {createBoardMutation.isPending
                        ? 'Creating board…'
                        : 'Create sandbox board'}
                    </Button>
                  </Stack>
                ) : (
                  <>
                    No boards found on your Pinterest account. Create a board on
                    Pinterest first, then refresh this page.
                  </>
                )}
              </Alert>
            )}
            {isConnected && boards.length > 0 && (
              <FormControl
                fullWidth
                disabled={boardsLoading || publishMutation.isPending}
              >
                <InputLabel id="pin-creator-board-label">Pinterest board</InputLabel>
                <Select
                  labelId="pin-creator-board-label"
                  label="Pinterest board"
                  value={boardId}
                  onChange={(e) => handleBoardChange(e.target.value)}
                >
                  {boards.map((board) => (
                    <MenuItem key={board.id} value={board.id}>
                      {board.name}
                      {board.privacy && board.privacy !== 'PUBLIC'
                        ? ` (${board.privacy === 'SECRET' ? 'Secret' : 'Protected'})`
                        : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {isConnected && isSecretBoard && (
              <Alert severity="warning">
                The selected board is <strong>{selectedBoard?.privacy?.toLowerCase()}</strong>.
                Pins on secret/protected boards are only visible to you (or invited
                collaborators), not to everyone on Pinterest. Choose a <strong>public</strong>{' '}
                board for normal visibility.
              </Alert>
            )}
            {isConnected && boardsLoading && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Loading boards…
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <FormControl fullWidth disabled={keysLoading || keys.length === 0}>
              <InputLabel id="pin-creator-key-label">API key</InputLabel>
              <Select
                labelId="pin-creator-key-label"
                label="API key"
                value={keyId}
                onChange={(e) => {
                  setKeyId(e.target.value);
                  setIdeas([]);
                  setSelectedTitle(null);
                  setGeneratedPin(null);
                }}
              >
                {keys.map((key) => (
                  <MenuItem key={key.id} value={key.id}>
                    {key.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={
                ideasMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
              onClick={handleGenerateIdeas}
              disabled={!keyId || ideasMutation.isPending || pinMutation.isPending}
            >
              {ideasMutation.isPending ? 'Generating ideas…' : 'Generate title ideas'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {ideasMutation.isPending && (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={72} />
          ))}
        </Stack>
      )}

      {ideas.length > 0 && !ideasMutation.isPending && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Title ideas — click one to generate full pin
          </Typography>
          <Stack spacing={1.5}>
            {ideas.map((title) => (
              <Card
                key={title}
                variant="outlined"
                sx={{
                  borderColor:
                    selectedTitle === title ? 'primary.main' : 'divider',
                  borderWidth: selectedTitle === title ? 2 : 1,
                }}
              >
                <CardActionArea
                  onClick={() => handleSelectTitle(title)}
                  disabled={pinMutation.isPending}
                >
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {pinMutation.isPending && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: 'center', justifyContent: 'center', py: 4 }}
            >
              <CircularProgress />
              <Typography color="text.secondary">
                Generating description, hashtags, and image for &ldquo;
                {selectedTitle}&rdquo;… This may take up to two minutes.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {generatedPin && !pinMutation.isPending && (
        <Card>
          {publishMutation.isPending && (
            <>
              <LinearProgress />
              <Alert severity="info" sx={{ borderRadius: 0 }}>
                Removing metadata and preparing image for upload…
              </Alert>
            </>
          )}
          <CardContent>
            <Stack
              direction="row"
              sx={{
                mb: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Generated pin
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={handlePickAnother}>
                  Pick another idea
                </Button>
                <Button
                  component="a"
                  href={downloadHref}
                  download={downloadFilename}
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                >
                  Download image
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ bgcolor: '#E60023', '&:hover': { bgcolor: '#ad081b' } }}
                  disabled={
                    !isConnected ||
                    !boardId ||
                    publishMutation.isPending
                  }
                  onClick={handlePostToPinterest}
                  startIcon={
                    publishMutation.isPending ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : undefined
                  }
                >
                  {publishMutation.isPending
                    ? 'Processing image & publishing…'
                    : 'Post to Pinterest'}
                </Button>
              </Stack>
            </Stack>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Title
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {generatedPin.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => handleCopy('description', generatedPin.description)}
              >
                {copiedField === 'description' ? 'Copied' : 'Copy'}
              </Button>
            </Stack>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {generatedPin.description}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Hashtags
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => handleCopy('hashtags', hashtagsText)}
              >
                {copiedField === 'hashtags' ? 'Copied' : 'Copy'}
              </Button>
            </Stack>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {hashtagsText}
            </Typography>

            <Box
              component="img"
              src={downloadHref}
              alt={generatedPin.title}
              sx={{
                display: 'block',
                maxWidth: 400,
                width: '100%',
                height: 'auto',
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                mb: 1,
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block' }}
            >
              Text model: {generatedPin.textModel} · Image model:{' '}
              {generatedPin.image.model}
            </Typography>
            {publishedLink && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Published.{' '}
                <Link href={publishedLink} target="_blank" rel="noopener noreferrer">
                  View pin on Pinterest
                </Link>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
