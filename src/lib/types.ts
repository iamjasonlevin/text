export type StoredMessage = {
  id: string;
  text: string;
  mediaUrl: string | null;
  sentAt: string;
  service: string;
  replyToId: string | null;
  sendStyle: string | null;
};

export type PublicMessage = StoredMessage & {
  mediaKind: "image" | "video" | "audio" | "file" | null;
};

export type SendblueWebhookPayload = {
  content?: string | null;
  media_url?: string | null;
  is_outbound?: boolean | null;
  status?: string | null;
  message_handle?: string | null;
  date_sent?: string | null;
  date_updated?: string | null;
  from_number?: string | null;
  to_number?: string | null;
  number?: string | null;
  service?: string | null;
  send_style?: string | null;
  sendblue_number?: string | null;
  message_type?: string | null;
  reply_to?: { message_handle?: string | null } | null;
};

export type SendblueListResponse = {
  status?: string;
  data?: SendblueWebhookPayload[];
  pagination?: {
    hasMore?: boolean;
    limit?: number;
    offset?: number;
    total?: number;
  };
};
