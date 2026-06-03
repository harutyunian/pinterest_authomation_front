import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Button, CircularProgress } from '@mui/material';
import type { GenerationStatus } from '../../types/characterReplacement';

interface GenerateButtonProps {
  canGenerate: boolean;
  status: GenerationStatus;
  isBusy: boolean;
  onGenerate: () => void;
}

export function GenerateButton({
  canGenerate,
  status,
  isBusy,
  onGenerate,
}: GenerateButtonProps) {
  const label =
    status === 'generating' || status === 'processing'
      ? 'Generating…'
      : status === 'uploading'
        ? 'Uploading…'
        : 'Generate replacement video';

  return (
    <Button
      type="button"
      variant="contained"
      startIcon={
        isBusy ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />
      }
      onClick={onGenerate}
      disabled={!canGenerate}
    >
      {label}
    </Button>
  );
}
