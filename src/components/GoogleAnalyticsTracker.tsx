import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../analytics/gtag';

export function GoogleAnalyticsTracker() {
  const location = useLocation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    trackPageView(path);
  }, [location]);

  return null;
}
