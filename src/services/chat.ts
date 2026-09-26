import {
  supabase,
} from "@/integrations/supabase/client";

import type {
  ChatMessage,
  ChatResponse,
  Conversation,
} from "@/types/chat";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "/api";

async function request(
  path: string,
  options:
    RequestInit = {},
) {
  const {
    data: {
      session,
    },
  } =
    await supabase.auth.getSession();

  if (
    !session?.access_token
  ) {
    throw new Error(
      "Your session has expired. Please sign in again.",
    );
  }

  const response =
    await fetch(
      `${API_URL}${path}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${session.access_token}`,

          ...options.headers,
        },
      },
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Request failed.",
    );
  }

  return data;
}

export async function sendChatMessage(
  message: string,
  conversationId?: string,
): Promise<ChatResponse> {
  return request(
    "/chat",
    {
      method: "POST",

      body:
        JSON.stringify({
          message,

          conversationId:
            conversationId ||
            null,
        }),
    },
  );
}

export async function getConversations():
Promise<Conversation[]> {
  const data =
    await request(
      "/chat/conversations",
    );

  return (
    data.conversations ??
    []
  ) as Conversation[];
}

export async function getConversationMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const data =
    await request(
      `/chat/conversations/${encodeURIComponent(
        conversationId,
      )}/messages`,
    );

  return (
    data.messages ??
    []
  ) as ChatMessage[];
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  await request(
    `/chat/conversations/${encodeURIComponent(
      conversationId,
    )}`,
    {
      method:
        "DELETE",
    },
  );
}
