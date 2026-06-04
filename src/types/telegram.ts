export interface TelegramChannelSettings {
  id: string;
  maskedBotToken: string;
  hasBotToken: boolean;
  channelId: string;
  enabled: boolean;
  scheduleEnabled: boolean;
  intervalHours: number;
  timezone: string;
  placeholderMessage: string;
  lastPostedAt: string | null;
  updatedAt: string;
  postsPerDay: number;
  postTimesLocal: string[];
}

export interface UpdateTelegramSettingsPayload {
  botToken?: string;
  channelId?: string;
  enabled?: boolean;
  scheduleEnabled?: boolean;
  intervalHours?: number;
  timezone?: string;
  placeholderMessage?: string;
}

export interface TelegramValidateResult {
  ok: boolean;
  bot: {
    id: number;
    username: string | null;
    firstName: string;
  };
  channel: {
    id: number;
    type: string;
    title: string | null;
    username: string | null;
  };
}

export interface TelegramPublishResult {
  messageId: number;
  text: string;
  postedAt: string;
}
