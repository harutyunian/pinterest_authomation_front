export interface GeminiKey {
  id: string;
  name: string;
  maskedApiKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGeminiKeyPayload {
  name: string;
  apiKey: string;
}

export interface UpdateGeminiKeyPayload {
  name?: string;
  apiKey?: string;
}
