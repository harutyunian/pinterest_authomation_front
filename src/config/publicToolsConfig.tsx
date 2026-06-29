import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { ReactNode } from 'react';

export type PublicTool = {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
  available: boolean;
};

export const publicTools: PublicTool[] = [
  {
    id: 'image-generator',
    title: 'AI Image Generator',
    description:
      'Generate images with Google Gemini. Bring your own API key — no account required.',
    path: '/tools/image-generator',
    icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />,
    available: true,
  },
];
