import { TextField, Typography } from '@mui/material';
import { useCharacterReplacementStore } from '../../stores/characterReplacementStore';

interface PromptEditorProps {
  disabled?: boolean;
}

export function PromptEditor({ disabled = false }: PromptEditorProps) {
  const prompt = useCharacterReplacementStore((s) => s.prompt);
  const setPrompt = useCharacterReplacementStore((s) => s.setPrompt);

  return (
    <>
      <TextField
        label="Generation prompt"
        multiline
        minRows={8}
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={disabled}
        slotProps={{ htmlInput: { maxLength: 8000 } }}
        helperText={`${prompt.length}/8000 characters`}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
        Describe how the character should replace the performer.
      </Typography>
    </>
  );
}
