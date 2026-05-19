export interface ImageModel {
  id: string;
  displayName: string;
}

export interface ImageModelsResponse {
  models: ImageModel[];
}

export interface GenerateImagePayload {
  keyId: string;
  model: string;
  prompt: string;
}

export interface GeneratedImage {
  mimeType: string;
  imageBase64: string;
  model: string;
}
