import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeModeProvider } from './theme/ThemeModeProvider';
import { installPreventNativeFormReload } from './utils/preventNativeFormReload';
import './index.css';

installPreventNativeFormReload();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeModeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
