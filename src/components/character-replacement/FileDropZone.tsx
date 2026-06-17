import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DragEvent, ReactNode } from 'react';
import { useFileDrop } from '../../hooks/character-replacement/useFileDrop';

interface FileDropZoneProps {
  title: string;
  description: string;
  accept: string;
  disabled?: boolean;
  isLoading?: boolean;
  onFileSelected: (file: File) => void;
}

export function FileDropZone({
  title,
  description,
  accept,
  disabled = false,
  isLoading = false,
  onFileSelected,
}: FileDropZoneProps) {
  const { isDragging, dragHandlers } = useFileDrop({
    disabled: disabled || isLoading,
    onFiles: (files) => {
      const file = files[0];
      if (file) {
        onFileSelected(file);
      }
    },
  });

  return (
    <Box
      {...dragHandlers}
      sx={{
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: isDragging ? 'action.hover' : 'action.selected',
        p: 3,
        textAlign: 'center',
        opacity: disabled || isLoading ? 0.6 : 1,
        pointerEvents: disabled || isLoading ? 'none' : 'auto',
        transition: 'border-color 0.2s, background-color 0.2s',
      }}
    >
      {isLoading ? (
        <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">
            Uploading…
          </Typography>
        </Stack>
      ) : (
        <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
          <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Button component="label" variant="outlined" size="small">
            Browse files
            <input
              type="file"
              hidden
              accept={accept}
              disabled={disabled}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onFileSelected(file);
                }
                event.target.value = '';
              }}
            />
          </Button>
        </Stack>
      )}
    </Box>
  );
}

interface PreviewShellProps {
  onRemove: () => void;
  onReplace?: (file: File) => void;
  replaceAccept?: string;
  isReplacing?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function PreviewShell({
  onRemove,
  onReplace,
  replaceAccept,
  isReplacing = false,
  disabled,
  children,
}: PreviewShellProps) {
  const { isDragging, dragHandlers } = useFileDrop({
    disabled: disabled || isReplacing || !onReplace,
    onFiles: (files) => {
      const file = files[0];
      if (file && onReplace) {
        onReplace(file);
      }
    },
  });

  return (
    <Box
      {...(onReplace ? dragHandlers : {})}
      sx={{
        position: 'relative',
        border: '2px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        opacity: isReplacing ? 0.7 : 1,
        transition: 'border-color 0.2s, opacity 0.2s',
      }}
    >
      {!disabled && (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          {onReplace && (
            <Button
              component="label"
              variant="contained"
              size="small"
              disabled={isReplacing}
              sx={{ minWidth: 0 }}
            >
              {isReplacing ? 'Uploading…' : 'Replace'}
              <input
                type="file"
                hidden
                accept={replaceAccept}
                disabled={isReplacing}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    onReplace(file);
                  }
                  event.target.value = '';
                }}
              />
            </Button>
          )}
          <IconButton
            aria-label="Remove file"
            color="error"
            size="small"
            onClick={onRemove}
            disabled={isReplacing}
            sx={{
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
      {isReplacing && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.35)',
            zIndex: 2,
          }}
        >
          <CircularProgress size={32} sx={{ color: 'common.white' }} />
        </Box>
      )}
      {children}
    </Box>
  );
}

export function useDragHandlers(
  disabled: boolean,
  onFileSelected: (file: File) => void,
) {
  return useFileDrop({
    disabled,
    onFiles: (files) => {
      const file = files[0];
      if (file) {
        onFileSelected(file);
      }
    },
  });
}

export type { DragEvent };
