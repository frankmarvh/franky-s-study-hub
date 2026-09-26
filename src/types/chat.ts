export type ChatRole =
  | "user"
  | "assistant";

export interface Conversation {
  id: string;

  user_id: string;

  title: string;

  created_at: string;

  updated_at: string;
}

export interface ChatMessage {
  id: string;

  conversation_id: string;

  user_id: string;

  role: ChatRole;

  content: string;

  created_at: string;
}

export interface ChatResponse {
  success: boolean;

  conversation:
    Conversation;

  userMessage:
    ChatMessage;

  assistantMessage:
    ChatMessage;
}
