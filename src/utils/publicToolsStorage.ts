const STORAGE_KEY = 'public-gemini-api-key';

export function getStoredPublicApiKey(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setStoredPublicApiKey(apiKey: string): void {
  try {
    if (apiKey.trim()) {
      sessionStorage.setItem(STORAGE_KEY, apiKey.trim());
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}
