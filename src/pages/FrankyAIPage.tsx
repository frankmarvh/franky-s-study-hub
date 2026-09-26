import AIMessage from "@/components/AIMessage";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  Bot,
  BrainCircuit,
  LoaderCircle,
  Menu,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import AppHeader
  from "@/components/AppHeader";

import {
  deleteConversation,
  getConversationMessages,
  getConversations,
  sendChatMessage,
} from "@/services/chat";

import type {
  ChatMessage,
  Conversation,
} from "@/types/chat";

export default function FrankyAIPage() {
  const [
    conversations,
    setConversations,
  ] =
    useState<
      Conversation[]
    >([]);

  const [
    activeConversationId,
    setActiveConversationId,
  ] =
    useState<
      string | null
    >(null);

  const [
    messages,
    setMessages,
  ] =
    useState<
      ChatMessage[]
    >([]);

  const [
    input,
    setInput,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] =
    useState(true);

  const [
    sidebarOpen,
    setSidebarOpen,
  ] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    const initialize =
      async () => {
        try {
          const data =
            await getConversations();

          setConversations(
            data,
          );
        } catch (error) {
          console.error(
            error,
          );

          toast.error(
            "Unable to load conversation history.",
          );
        } finally {
          setHistoryLoading(
            false,
          );
        }
      };

    void initialize();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior:
        "smooth",
    });
  }, [
    messages,
    loading,
  ]);

  const openConversation =
    async (
      conversation:
        Conversation,
    ) => {
      try {
        setHistoryLoading(
          true,
        );

        setActiveConversationId(
          conversation.id,
        );

        const data =
          await getConversationMessages(
            conversation.id,
          );

        setMessages(
          data,
        );

        setSidebarOpen(
          false,
        );
      } catch (error) {
        console.error(
          error,
        );

        toast.error(
          "Unable to open conversation.",
        );
      } finally {
        setHistoryLoading(
          false,
        );
      }
    };

  const newChat =
    () => {
      setActiveConversationId(
        null,
      );

      setMessages([]);

      setInput("");

      setSidebarOpen(
        false,
      );
    };

  const handleSend =
    async (
      event?:
        FormEvent,
    ) => {
      event?.preventDefault();

      const message =
        input.trim();

      if (
        !message ||
        loading
      ) {
        return;
      }

      const temporaryMessage:
        ChatMessage =
        {
          id:
            `temporary-${Date.now()}`,

          conversation_id:
            activeConversationId ||
            "new",

          user_id:
            "current",

          role:
            "user",

          content:
            message,

          created_at:
            new Date()
              .toISOString(),
        };

      setMessages(
        (current) => [
          ...current,
          temporaryMessage,
        ],
      );

      setInput("");

      try {
        setLoading(true);

        const result =
          await sendChatMessage(
            message,
            activeConversationId ||
              undefined,
          );

        setActiveConversationId(
          result.conversation
            .id,
        );

        setMessages(
          (current) => {
            const withoutTemporary =
              current.filter(
                (item) =>
                  item.id !==
                  temporaryMessage.id,
              );

            return [
              ...withoutTemporary,
              result.userMessage,
              result.assistantMessage,
            ];
          },
        );

        setConversations(
          (
            current,
          ) => {
            const others =
              current.filter(
                (conversation) =>
                  conversation.id !==
                  result.conversation
                    .id,
              );

            return [
              result.conversation,
              ...others,
            ];
          },
        );
      } catch (error) {
        console.error(
          error,
        );

        setMessages(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                temporaryMessage.id,
            ),
        );

        setInput(
          message,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Franky's AI could not respond.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  const handleKeyDown =
    (
      event:
        KeyboardEvent<HTMLTextAreaElement>,
    ) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        void handleSend();
      }
    };

  const handleDelete =
    async (
      conversation:
        Conversation,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${conversation.title}"?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteConversation(
          conversation.id,
        );

        setConversations(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                conversation.id,
            ),
        );

        if (
          activeConversationId ===
          conversation.id
        ) {
          newChat();
        }

        toast.success(
          "Conversation deleted.",
        );
      } catch (error) {
        console.error(
          error,
        );

        toast.error(
          "Unable to delete conversation.",
        );
      }
    };

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white">
      <AppHeader />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 overflow-hidden">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() =>
              setSidebarOpen(
                false,
              )
            }
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}

        <aside
          className={`fixed bottom-0 left-0 top-0 z-40 w-72 border-r border-slate-800 bg-slate-950 pt-20 transition-transform lg:static lg:z-auto lg:block lg:translate-x-0 lg:pt-0 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="font-bold">
                Conversations
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(
                    false,
                  )
                }
              >
                <X
                  size={20}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={
                newChat
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 lg:mt-0"
            >
              <Plus
                size={18}
              />

              New Chat
            </button>

            <p className="mt-7 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recent
            </p>

            <div className="mt-3 flex-1 space-y-1 overflow-y-auto">
              {conversations.map(
                (
                  conversation,
                ) => (
                  <div
                    key={
                      conversation.id
                    }
                    className={`group flex items-center rounded-xl ${
                      activeConversationId ===
                      conversation.id
                        ? "bg-slate-800"
                        : "hover:bg-slate-900"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        void openConversation(
                          conversation,
                        )
                      }
                      className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
                    >
                      <MessageSquare
                        size={16}
                        className="shrink-0 text-slate-500"
                      />

                      <span className="truncate text-sm">
                        {
                          conversation.title
                        }
                      </span>
                    </button>

                    <button
                      type="button"
                      title="Delete conversation"
                      onClick={() =>
                        void handleDelete(
                          conversation,
                        )
                      }
                      className="mr-2 hidden rounded-md p-1.5 text-slate-500 hover:text-red-400 group-hover:block"
                    >
                      <Trash2
                        size={15}
                      />
                    </button>
                  </div>
                ),
              )}

              {!historyLoading &&
                conversations.length ===
                  0 && (
                  <p className="px-3 py-5 text-sm text-slate-600">
                    Your conversations
                    will appear here.
                  </p>
                )}
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-3 lg:hidden">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  true,
                )
              }
              className="rounded-lg border border-slate-700 p-2"
            >
              <Menu
                size={19}
              />
            </button>

            <span className="font-semibold">
              Franky's AI
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8">
            <div className="mx-auto max-w-4xl">
              {historyLoading &&
              activeConversationId ? (
                <div className="flex min-h-96 items-center justify-center">
                  <LoaderCircle className="h-9 w-9 animate-spin text-blue-500" />
                </div>
              ) : messages.length ===
                0 ? (
                <Welcome
                  onPrompt={(
                    prompt,
                  ) =>
                    setInput(
                      prompt,
                    )
                  }
                />
              ) : (
                <div className="space-y-8">
                  {messages.map(
                    (
                      message,
                    ) => (
                      <AIMessage
                        key={
                          message.id
                        }
                        message={
                          message
                        }
                      />
                    ),
                  )}

                  {loading && (
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                        <Bot
                          size={19}
                        />
                      </div>

                      <div className="rounded-2xl bg-slate-900 px-5 py-4 text-slate-400">
                        <div className="flex items-center gap-2">
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />

                          Franky's AI
                          is thinking...
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    ref={
                      bottomRef
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-950 p-4 sm:p-6">
            <form
              onSubmit={
                handleSend
              }
              className="mx-auto max-w-4xl"
            >
              <div className="flex items-end gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-3 focus-within:border-blue-500">
                <textarea
                  value={
                    input
                  }
                  onChange={(
                    event,
                  ) =>
                    setInput(
                      event.target
                        .value,
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  maxLength={
                    8000
                  }
                  rows={1}
                  placeholder="Ask Franky's AI anything about your studies..."
                  className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-2 py-3 outline-none placeholder:text-slate-600"
                />

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !input.trim()
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />
                  ) : (
                    <Send
                      size={19}
                    />
                  )}
                </button>
              </div>

              <p className="mt-2 text-center text-xs text-slate-600">
                Franky's AI can
                make mistakes.
                Verify important
                academic information.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Welcome({
  onPrompt,
}: {
  onPrompt: (
    prompt: string,
  ) => void;
}) {
  const prompts = [
    "Explain binary trees with a simple example.",

    "Teach me integration from the basics.",

    "Explain database normalization.",

    "Help me understand Newton's laws of motion.",
  ];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
        <BrainCircuit
          size={31}
        />
      </div>

      <h1 className="mt-6 text-4xl font-black">
        Franky's AI
      </h1>

      <p className="mt-3 max-w-xl leading-7 text-slate-400">
        Your AI study
        assistant. Ask for
        explanations, examples,
        revision help,
        programming guidance
        or learning resources.
      </p>

      <div className="mt-9 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {prompts.map(
          (
            prompt,
          ) => (
            <button
              key={
                prompt
              }
              type="button"
              onClick={() =>
                onPrompt(
                  prompt,
                )
              }
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left text-sm leading-6 text-slate-300 transition hover:border-blue-500/50 hover:bg-slate-900"
            >
              {prompt}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function Message({
  message,
}: {
  message:
    ChatMessage;
}) {
  const isUser =
    message.role ===
    "user";

  return (
    <div
      className={`flex gap-4 ${
        isUser
          ? "justify-end"
          : ""
      }`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600">
          <Bot
            size={19}
          />
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-800 bg-slate-900 text-slate-200"
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-sm leading-7 sm:text-base">
          {
            message.content
          }
        </div>
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800">
          <User
            size={18}
          />
        </div>
      )}
    </div>
  );
}
