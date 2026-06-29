import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { MainLayout } from '../components/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PublicRoute } from '../components/PublicRoute';
import { PublicToolsLayout } from '../components/PublicToolsLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { GeminiKeysPage } from '../pages/GeminiKeysPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ImageGeneratorPage } from '../pages/ImageGeneratorPage';
import { StoredVideosPage } from '../pages/StoredVideosPage';
import { VideoGeneratorPage } from '../pages/VideoGeneratorPage';
import { CharacterReplacementPage } from '../pages/CharacterReplacementPage';
import { PinCreatorPage } from '../pages/PinCreatorPage';
import { TelegramSettingsPage } from '../pages/TelegramSettingsPage';
import { LoginPage } from '../pages/LoginPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { PublicImageGeneratorPage } from '../pages/PublicImageGeneratorPage';
import { WelcomePage } from '../pages/WelcomePage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />

      <Route element={<PublicToolsLayout />}>
        <Route path="/tools/image-generator" element={<PublicImageGeneratorPage />} />
      </Route>

      <Route element={<LegalPageLayout title="Политика конфиденциальности" />}>
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/gemini-keys" element={<GeminiKeysPage />} />
          <Route path="/pin-creator" element={<PinCreatorPage />} />
          <Route path="/telegram" element={<TelegramSettingsPage />} />
          <Route path="/image-generator" element={<ImageGeneratorPage />} />
          <Route path="/video-generator" element={<VideoGeneratorPage />} />
          <Route path="/character-replacement" element={<CharacterReplacementPage />} />
          <Route path="/stored-videos" element={<StoredVideosPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
