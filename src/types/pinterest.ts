export interface PinterestConnectionStatus {
  connected: boolean;
  configured: boolean;
  apiMode?: 'sandbox' | 'production';
  apiBase?: string;
}

export interface PinterestOAuthUrl {
  url: string;
}

export type BoardPrivacy = 'PUBLIC' | 'PROTECTED' | 'SECRET';

export interface PinterestBoard {
  id: string;
  name: string;
  privacy?: BoardPrivacy;
}

export interface PinterestBoardsResponse {
  boards: PinterestBoard[];
}

export interface PublishPinPayload {
  boardId: string;
  title: string;
  description: string;
  imageBase64: string;
  mimeType: string;
  link?: string;
}

export interface PublishPinResponse {
  pinId: string;
  link: string;
  apiMode?: 'sandbox' | 'production';
  apiBase?: string;
  boardName?: string;
  boardPrivacy?: BoardPrivacy;
}
