import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function FrankyChat({ tall = false }: { tall?: boolean }) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      console.error(error);
      toast.error("Franky's AI couldn't answer that just now. Please try again.");
    },
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function submit() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    void sendMessage({ text });
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-glass p-5 ring-1 ring-black/5 backdrop-blur-xl animate-rise">
      <div className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />

      <div className="relative mb-4 flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-lg bg-foreground font-display text-sm font-bold text-background">
          F
        </div>
        <div>
          <p className="font-display text-sm font-semibold tracking-tight">Franky's AI</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Online · no text limit
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`relative space-y-3 overflow-y-auto pr-1 ${tall ? "max-h-[55vh]" : "max-h-[360px]"}`}
      >
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-pretty text-foreground">
          Hi! I'm Franky's AI. Ask me anything about your subjects and I'll pull together what you
          need.
        </div>

        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          if (!text) return null;
          return message.role === "user" ? (
            <div
              key={message.id}
              className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-foreground px-3.5 py-2.5 text-sm whitespace-pre-wrap text-pretty text-background"
            >
              {text}
            </div>
          ) : (
            <div
              key={message.id}
              className="max-w-[85%] space-y-2 rounded-2xl rounded-tl-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-pretty text-foreground [&_a]:text-primary [&_a]:underline [&_code]:font-mono [&_code]:text-[12px] [&_h1]:font-display [&_h1]:font-semibold [&_h2]:font-display [&_h2]:font-semibold [&_h3]:font-display [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_strong]:font-semibold"
            >
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          );
        })}

        {busy ? (
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-muted-foreground">
            <span className="block h-1.5 w-20 overflow-hidden rounded-full bg-border">
              <span className="block h-full w-2/3 bg-primary animate-sweep" />
            </span>
          </div>
        ) : null}
      </div>

      {user ? (
        <div className="relative mt-4 rounded-xl border border-border bg-surface p-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={3}
            placeholder="Type as much as you like — there's no character limit…"
            className="min-h-[72px] w-full resize-y bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">Unlimited length</span>
            <button
              onClick={submit}
              disabled={busy || input.trim().length === 0}
              className="rounded-lg bg-primary px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-50"
            >
              {busy ? "Thinking" : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative mt-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-sm text-pretty text-muted-foreground">
            Create a free account to chat with Franky's AI — as many messages as you want.
          </p>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="mt-3 inline-block rounded-lg bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-foreground/85"
          >
            Create free account
          </Link>
        </div>
      )}
    </div>
  );
}
