import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuthStore } from '../stores/useAuthStore';

export const trackExternalClick = (url: string, sourcePage?: string) => {
  const currentPath = sourcePage || window.location.pathname;
  // Fire and forget link click tracking
  apiClient.post('/analytics/link-click', { url, sourcePage: currentPath }).catch(() => {});
};

export const usePageTracking = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const currentActivityIdRef = useRef<string | null>(null);

  // ── 1. Page Enter / Exit Telemetry ──────────────────────────────────────────
  useEffect(() => {
    // Only track authenticated users (or skip if not logged in)
    if (!user) return;

    const pathname = location.pathname;
    let activityId: string | null = null;

    // Send page-enter immediately
    apiClient
      .post('/analytics/page-enter', { page: pathname })
      .then((res) => {
        if (res.data?.success && res.data?.activityId) {
          activityId = res.data.activityId;
          currentActivityIdRef.current = activityId;
        }
      })
      .catch(() => {});

    // Beacon / exit sender
    const sendExit = () => {
      const actId = activityId || currentActivityIdRef.current;
      if (!actId) return;

      const apiUrl = '/api/analytics/page-exit';
      const payload = JSON.stringify({ activityId: actId });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(apiUrl, blob);
      } else {
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', sendExit);

    return () => {
      sendExit();
      window.removeEventListener('beforeunload', sendExit);
    };
  }, [location.pathname, user]);

  // ── 2. Global Outbound Link Click Interceptor ─────────────────────────────────
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Check if it's an external URL (starts with http/https and doesn't match current host)
      if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          const urlObj = new URL(href);
          if (urlObj.origin !== window.location.origin) {
            trackExternalClick(href, location.pathname);
          }
        } catch {
          // Invalid URL format, ignore
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [location.pathname]);
};
