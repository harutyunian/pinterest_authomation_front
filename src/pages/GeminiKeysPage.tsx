import { Navigate } from 'react-router-dom';

/** Legacy route — redirects to Settings hub */
export function GeminiKeysPage() {
  return <Navigate to="/settings" replace />;
}
