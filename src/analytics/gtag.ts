export const GA_MEASUREMENT_ID = 'G-XM8F0TF5Z6';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(path: string, title?: string) {
  if (typeof window.gtag !== 'function') {
    return;
  }

  const pagePath = path.startsWith('/') ? path : `/${path}`;
  const pageTitle = title?.trim() || document.title;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: `${window.location.origin}${pagePath}`,
  });
}
