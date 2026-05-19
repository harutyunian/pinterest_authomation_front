import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { MainLayout } from '../components/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PublicRoute } from '../components/PublicRoute';
import { DashboardPage } from '../pages/DashboardPage';
import { GeminiKeysPage } from '../pages/GeminiKeysPage';
import { LoginPage } from '../pages/LoginPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/gemini-keys" element={<GeminiKeysPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
