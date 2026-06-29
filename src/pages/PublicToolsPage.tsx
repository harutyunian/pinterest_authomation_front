import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { publicTools } from '../config/publicToolsConfig';

export function PublicToolsPage() {
  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Free online tools
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
          Use AI tools without signing in. Your API keys stay in your browser session and are
          never saved on our servers.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {publicTools.map((tool) => (
          <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                opacity: tool.available ? 1 : 0.6,
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={tool.available ? tool.path : '#'}
                disabled={!tool.available}
                sx={{ height: '100%', alignItems: 'stretch' }}
              >
                <CardContent sx={{ height: '100%' }}>
                  <Stack spacing={2} sx={{ height: '100%' }}>
                    <Box sx={{ color: 'primary.main' }}>{tool.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {tool.title}
                        </Typography>
                        {!tool.available && (
                          <Chip label="Soon" size="small" variant="outlined" />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {tool.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
