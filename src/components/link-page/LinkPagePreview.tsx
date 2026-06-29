import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Stack, Typography } from '@mui/material';
import type { LinkItem, LinkPageTheme, LinkProfile } from '../../types/linkPages';
import { LINK_PLATFORMS } from '../../types/linkPages';

const THEME_ACCENTS: Record<LinkPageTheme, string> = {
  midnight: '#e60023',
  rose: '#ff4d6d',
  ocean: '#3ec6ff',
  sunset: '#ff8c42',
  ember: '#ffb347',
};

const THEME_BACKGROUNDS: Record<LinkPageTheme, string> = {
  midnight: 'linear-gradient(160deg, #0d1012, #171b1f)',
  rose: 'linear-gradient(160deg, #1a0b10, #3b1020)',
  ocean: 'linear-gradient(160deg, #07131f, #0d2a3f)',
  sunset: 'linear-gradient(160deg, #1f1028, #4a1f2f)',
  ember: 'linear-gradient(160deg, #1a1008, #3a1f0d)',
};

function platformLabel(platform: string) {
  return LINK_PLATFORMS.find((p) => p.value === platform)?.label ?? 'Link';
}

function PreviewLink({ link, accent }: { link: LinkItem; accent: string }) {
  if (!link.isActive) return null;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: 1,
        p: 1.25,
        borderRadius: 2,
        bgcolor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
          display: 'grid',
          placeItems: 'center',
          fontSize: 14,
          fontWeight: 700,
          bgcolor: link.platform === 'website' ? accent : 'rgba(255,255,255,0.12)',
        }}
      >
        {link.platform === 'instagram' ? '📷' : link.platform === 'pinterest' ? '📌' : '🔗'}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#fff' }} noWrap>
          {link.title}
        </Typography>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase' }}>
          {platformLabel(link.platform)}
        </Typography>
      </Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>→</Typography>
    </Box>
  );
}

type Props = {
  profile: Pick<LinkProfile, 'displayName' | 'bio' | 'avatarUrl' | 'theme' | 'links'>;
};

export function LinkPagePreview({ profile }: Props) {
  const accent = THEME_ACCENTS[profile.theme];
  const activeLinks = profile.links.filter((l) => l.isActive);

  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
      }}
    >
      <Box
        sx={{
          background: THEME_BACKGROUNDS[profile.theme],
          p: 3,
          minHeight: 520,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 320,
            p: 2.5,
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Stack spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
            {profile.avatarUrl ? (
              <Box
                component="img"
                src={profile.avatarUrl}
                alt=""
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255,255,255,0.15)',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 28,
                  color: '#fff',
                  background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.2))`,
                }}
              >
                {profile.displayName.trim().charAt(0).toUpperCase() || '?'}
              </Box>
            )}
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 22, textAlign: 'center' }}>
              {profile.displayName || 'Your name'}
            </Typography>
            {profile.bio ? (
              <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, textAlign: 'center' }}>
                {profile.bio}
              </Typography>
            ) : null}
          </Stack>

          <Stack spacing={1}>
            {activeLinks.length ? (
              activeLinks.map((link) => <PreviewLink key={link.id} link={link} accent={accent} />)
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', py: 2, fontSize: 14 }}>
                Add links to see them here
              </Typography>
            )}
          </Stack>

          <Typography
            sx={{
              mt: 2,
              textAlign: 'center',
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            Powered by my2ls <OpenInNewIcon sx={{ fontSize: 12 }} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
