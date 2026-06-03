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
  disabled?: boolean;
  children: ReactNode;
}

export function PreviewShell({ onRemove, disabled, children }: PreviewShellProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {!disabled && (
        <IconButton
          aria-label="Remove file"
          color="error"
          size="small"
          onClick={onRemove}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
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
