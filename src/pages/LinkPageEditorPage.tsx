import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import {
  createLinkItem,
  deleteLinkItem,
  getMyLinkPage,
  reorderLinkItems,
  updateLinkItem,
  updateMyLinkPage,
} from '../api/linkPages';
import { AdminCard } from '../components/layout/AdminCard';
import { LinkPagePreview } from '../components/link-page/LinkPagePreview';
import { useAuthStore } from '../stores/authStore';
import type { LinkPageTheme, LinkPlatform } from '../types/linkPages';
import { LINK_PLATFORMS, LINK_THEMES } from '../types/linkPages';

export function LinkPageEditorPage() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['link-page', userId],
    queryFn: getMyLinkPage,
    enabled: Boolean(userId),
  });

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [slug, setSlug] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme, setTheme] = useState<LinkPageTheme>('midnight');
  const [published, setPublished] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newPlatform, setNewPlatform] = useState<LinkPlatform>('website');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setDisplayName(data.displayName);
      setBio(data.bio);
      setSlug(data.slug);
      setAvatarUrl(data.avatarUrl ?? '');
      setTheme(data.theme);
      setPublished(data.published);
    }
  }, [data]);

  const previewProfile = useMemo(
    () => ({
      displayName,
      bio,
      avatarUrl: avatarUrl || null,
      theme,
      links: data?.links ?? [],
    }),
    [displayName, bio, avatarUrl, theme, data?.links],
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['link-page', userId] });

  const saveProfileMutation = useMutation({
    mutationFn: updateMyLinkPage,
    onSuccess: () => {
      invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const addLinkMutation = useMutation({
    mutationFn: createLinkItem,
    onSuccess: () => {
      invalidate();
      setNewTitle('');
      setNewUrl('');
      setNewPlatform('website');
    },
  });

  const updateLinkMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateLinkItem>[1] }) =>
      updateLinkItem(id, payload),
    onSuccess: invalidate,
  });

  const deleteLinkMutation = useMutation({
    mutationFn: deleteLinkItem,
    onSuccess: invalidate,
  });

  const reorderMutation = useMutation({
    mutationFn: reorderLinkItems,
    onSuccess: invalidate,
  });

  const publicUrl = data?.publicUrl ?? `${window.location.origin}/l/${slug}`;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = () => {
    saveProfileMutation.mutate({
      displayName,
      bio,
      slug,
      avatarUrl: avatarUrl || undefined,
      theme,
      published,
    });
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    if (!data?.links) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= data.links.length) return;
    const orderedIds = data.links.map((l) => l.id);
    const [moved] = orderedIds.splice(index, 1);
    orderedIds.splice(nextIndex, 0, moved);
    reorderMutation.mutate(orderedIds);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return <Alert severity="error">Could not load your link page.</Alert>;
  }

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            My Link Page
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build your Linktree-style page and share one beautiful link everywhere.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={published ? 'Published' : 'Draft'}
            color={published ? 'success' : 'default'}
            size="small"
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyUrl}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNewIcon />}
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!published}
          >
            Preview live
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={2.5}>
            <AdminCard>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Public URL
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  label="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  helperText={`${window.location.origin}/l/${slug || 'your-slug'}`}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                    />
                  }
                  label="Published"
                  sx={{ ml: { sm: 1 }, whiteSpace: 'nowrap' }}
                />
              </Stack>
            </AdminCard>

            <AdminCard>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Profile
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                />
                <TextField
                  label="Avatar URL"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  fullWidth
                />
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Theme
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {LINK_THEMES.map((item) => (
                      <Button
                        key={item.value}
                        onClick={() => setTheme(item.value)}
                        variant={theme === item.value ? 'contained' : 'outlined'}
                        size="small"
                        sx={{
                          minWidth: 88,
                          background: theme === item.value ? item.preview : undefined,
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Stack>
                </Box>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={saveProfileMutation.isPending}
                >
                  {saveProfileMutation.isPending ? 'Saving…' : saved ? 'Saved ✓' : 'Save profile'}
                </Button>
                {saveProfileMutation.isError ? (
                  <Alert severity="error">Could not save profile. Check slug and fields.</Alert>
                ) : null}
              </Stack>
            </AdminCard>

            <AdminCard>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                <LinkIcon fontSize="small" color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Your links
                </Typography>
              </Stack>

              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {data.links.map((link, index) => (
                  <Box
                    key={link.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      opacity: link.isActive ? 1 : 0.55,
                    }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, flex: 1 }}>{link.title}</Typography>
                      <Tooltip title="Move up">
                        <span>
                          <IconButton
                            size="small"
                            disabled={index === 0 || reorderMutation.isPending}
                            onClick={() => moveLink(index, -1)}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Move down">
                        <span>
                          <IconButton
                            size="small"
                            disabled={index === data.links.length - 1 || reorderMutation.isPending}
                            onClick={() => moveLink(index, 1)}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Switch
                        size="small"
                        checked={link.isActive}
                        onChange={(e) =>
                          updateLinkMutation.mutate({
                            id: link.id,
                            payload: { isActive: e.target.checked },
                          })
                        }
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteLinkMutation.mutate(link.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {link.url}
                    </Typography>
                  </Box>
                ))}
                {!data.links.length ? (
                  <Typography variant="body2" color="text.secondary">
                    No links yet. Add your first social profile or website below.
                  </Typography>
                ) : null}
              </Stack>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Add link
              </Typography>
              <Stack spacing={1.5}>
                <TextField
                  label="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="My Instagram"
                  fullWidth
                />
                <TextField
                  label="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://instagram.com/you"
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    label="Platform"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as LinkPlatform)}
                  >
                    {LINK_PLATFORMS.map((p) => (
                      <MenuItem key={p.value} value={p.value}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={!newTitle || !newUrl || addLinkMutation.isPending}
                  onClick={() =>
                    addLinkMutation.mutate({
                      title: newTitle,
                      url: newUrl,
                      platform: newPlatform,
                    })
                  }
                >
                  Add link
                </Button>
              </Stack>
            </AdminCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box sx={{ position: { lg: 'sticky' }, top: 88 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
              Live preview
            </Typography>
            <LinkPagePreview profile={previewProfile} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
