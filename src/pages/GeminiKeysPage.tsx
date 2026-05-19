import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import {
  createGeminiKey,
  deleteGeminiKey,
  getGeminiKeys,
  updateGeminiKey,
  validateGeminiKey,
} from '../api/geminiKeys';
import type { GeminiKey } from '../types/geminiKey';

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }
  return fallback;
}

interface KeyFormState {
  name: string;
  apiKey: string;
}

const emptyForm: KeyFormState = { name: '', apiKey: '' };

export function GeminiKeysPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<GeminiKey | null>(null);
  const [form, setForm] = useState<KeyFormState>(emptyForm);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: keys = [], isLoading, isError } = useQuery({
    queryKey: ['gemini-keys'],
    queryFn: getGeminiKeys,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const name = form.name.trim();
      const apiKey = form.apiKey.trim();
      const needsValidation = !editingKey || Boolean(apiKey);

      if (needsValidation) {
        if (!apiKey) {
          throw new Error('API key is required');
        }
        await validateGeminiKey(apiKey);
      }

      if (editingKey) {
        return updateGeminiKey(editingKey.id, {
          name,
          ...(apiKey ? { apiKey } : {}),
        });
      }

      return createGeminiKey({ name, apiKey });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gemini-keys'] });
      closeDialog();
    },
    onError: (error) => {
      setFormError(
        getErrorMessage(error, 'Could not save key. Please try again.'),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGeminiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gemini-keys'] });
    },
  });

  const openCreateDialog = () => {
    setEditingKey(null);
    setForm(emptyForm);
    setFormError('');
    setShowApiKey(false);
    setDialogOpen(true);
  };

  const openEditDialog = (key: GeminiKey) => {
    setEditingKey(key);
    setForm({ name: key.name, apiKey: '' });
    setFormError('');
    setShowApiKey(false);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingKey(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = () => {
    setFormError('');
    if (!form.name.trim()) {
      setFormError('Name is required');
      return;
    }
    if (!editingKey && !form.apiKey.trim()) {
      setFormError('API key is required');
      return;
    }
    saveMutation.mutate();
  };

  const isSaving = saveMutation.isPending;

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
            <KeyIcon color="primary" />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Gemini API Keys
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Add and name multiple Gemini keys. Each key is verified with Google
            before it can be saved.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Add key
        </Button>
      </Stack>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Alert severity="error" sx={{ m: 2 }}>
              Failed to load Gemini keys.
            </Alert>
          )}

          {!isLoading && !isError && keys.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
              <KeyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">
                No Gemini keys yet. Click &quot;Add key&quot; to create one.
              </Typography>
            </Box>
          )}

          {keys.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>API Key</TableCell>
                    <TableCell>Added</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{key.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {key.maskedApiKey}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(key.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(key)}
                          aria-label="edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete key "${key.name}"?`,
                              )
                            ) {
                              deleteMutation.mutate(key.id);
                            }
                          }}
                          aria-label="delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingKey ? 'Edit Gemini key' : 'Add Gemini key'}
        </DialogTitle>
        <DialogContent>
          {isSaving && (
            <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
              Verifying API key with Google Gemini…
            </Alert>
          )}
          {formError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {formError}
            </Alert>
          )}
          <TextField
            label="Key name"
            placeholder="e.g. Production, Backup, Personal"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
          />
          <TextField
            label={editingKey ? 'New API key (leave blank to keep)' : 'API key'}
            type={showApiKey ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={form.apiKey}
            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
            placeholder="AIza..."
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowApiKey((v) => !v)}
                      edge="end"
                    >
                      {showApiKey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
