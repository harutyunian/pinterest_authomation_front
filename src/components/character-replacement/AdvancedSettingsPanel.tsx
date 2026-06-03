import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { AppSelect } from '../AppSelect';
import { useCharacterReplacementStore } from '../../stores/characterReplacementStore';
import type { OutputDuration, OutputResolution } from '../../types/characterReplacement';

interface AdvancedSettingsPanelProps {
  disabled?: boolean;
}

export function AdvancedSettingsPanel({ disabled = false }: AdvancedSettingsPanelProps) {
  const settings = useCharacterReplacementStore((s) => s.settings);
  const setSettings = useCharacterReplacementStore((s) => s.setSettings);

  return (
    <Accordion disableGutters sx={{ bgcolor: 'action.hover' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle2">Advanced settings</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Box>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Motion fidelity</Typography>
              <Typography variant="body2" color="text.secondary">
                {settings.motionFidelity}
              </Typography>
            </Stack>
            <Slider
              value={settings.motionFidelity}
              min={0}
              max={100}
              disabled={disabled}
              onChange={(_, value) =>
                setSettings({ motionFidelity: value as number })
              }
            />
          </Box>

          <Box>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Character consistency</Typography>
              <Typography variant="body2" color="text.secondary">
                {settings.characterConsistency}
              </Typography>
            </Stack>
            <Slider
              value={settings.characterConsistency}
              min={0}
              max={100}
              disabled={disabled}
              onChange={(_, value) =>
                setSettings({ characterConsistency: value as number })
              }
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={settings.backgroundPreservation}
                disabled={disabled}
                onChange={(e) =>
                  setSettings({ backgroundPreservation: e.target.checked })
                }
              />
            }
            label="Background preservation"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.facePreservation}
                disabled={disabled}
                onChange={(e) =>
                  setSettings({ facePreservation: e.target.checked })
                }
              />
            }
            label="Face preservation"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.cameraPreservation}
                disabled={disabled}
                onChange={(e) =>
                  setSettings({ cameraPreservation: e.target.checked })
                }
              />
            }
            label="Camera preservation"
          />

          <FormControl fullWidth disabled={disabled}>
            <InputLabel id="cr-duration-label">Output duration</InputLabel>
            <AppSelect
              labelId="cr-duration-label"
              label="Output duration"
              value={String(settings.outputDuration)}
              onChange={(e) =>
                setSettings({
                  outputDuration: Number(e.target.value) as OutputDuration,
                })
              }
            >
              {[4, 5, 6, 8, 10, 15].map((duration) => (
                <MenuItem key={duration} value={String(duration)}>
                  {duration} seconds
                </MenuItem>
              ))}
            </AppSelect>
          </FormControl>

          <FormControl fullWidth disabled={disabled} sx={{ gridColumn: { md: '1 / -1' } }}>
            <InputLabel id="cr-resolution-label">Resolution</InputLabel>
            <AppSelect
              labelId="cr-resolution-label"
              label="Resolution"
              value={settings.resolution}
              onChange={(e) =>
                setSettings({ resolution: e.target.value as OutputResolution })
              }
            >
              <MenuItem value="720p">720p</MenuItem>
              <MenuItem value="1080p">1080p</MenuItem>
              <MenuItem value="4K">4K</MenuItem>
            </AppSelect>
          </FormControl>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
