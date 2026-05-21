export interface PinterestConnectionStatus {
  connected: boolean;
}

export interface PinterestOAuthUrl {
  url: string;
}

export interface PinterestBoard {
  id: string;
  name: string;
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
}
