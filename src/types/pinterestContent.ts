export interface GenerateIdeasPayload {
  keyId: string;
  count?: number;
}

export interface IdeasResponse {
  ideas: string[];
  textModel: string;
}

export interface GeneratePinPayload {
  keyId: string;
  title: string;
  imageModel?: string;
}

export interface GeneratedPinImage {
  mimeType: string;
  imageBase64: string;
  model: string;
}

export interface GeneratedPin {
  title: string;
  description: string;
  hashtags: string[];
  imagePrompt: string;
  textModel: string;
  image: GeneratedPinImage;
}
