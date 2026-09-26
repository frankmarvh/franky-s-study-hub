import {
  Bot,
  Check,
  Copy,
  User,
} from "lucide-react";

import {
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type {
  ChatMessage,
} from "@/types/chat";

interface Props {
  message: ChatMessage;
}

export default function AIMessage({
  message,
}: Props) {
  const isUser =
    message.role === "user";

  const [
    copied,
    setCopied,
  ] = useState(false);

  const copyMessage =
    async () => {
      try {
        await navigator.clipboard.writeText(
          message.content,
        );

        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(false);
          },
          1500,
        );
      } catch {
        setCopied(false);
      }
    };

  return (
    <div
      className={`flex gap-4 ${
        isUser
          ? "justify-end"
          : ""
      }`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Bot size={19} />
        </div>
      )}

      <div
        className={`group relative max-w-[88%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words text-sm leading-7 sm:text-base">
            {message.content}
          </div>
        ) : (
          <div className="franky-markdown">
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
              ]}
              components={{
                h1: ({
                  children,
                }) => (
                  <h1 className="mb-4 mt-6 text-2xl font-black">
                    {children}
                  </h1>
                ),

                h2: ({
                  children,
                }) => (
                  <h2 className="mb-3 mt-6 text-xl font-bold">
                    {children}
                  </h2>
                ),

                h3: ({
                  children,
                }) => (
                  <h3 className="mb-2 mt-5 text-lg font-bold">
                    {children}
                  </h3>
                ),

                p: ({
                  children,
                }) => (
                  <p className="my-3 leading-7">
                    {children}
                  </p>
                ),

                ul: ({
                  children,
                }) => (
                  <ul className="my-4 list-disc space-y-2 pl-6">
                    {children}
                  </ul>
                ),

                ol: ({
                  children,
                }) => (
                  <ol className="my-4 list-decimal space-y-2 pl-6">
                    {children}
                  </ol>
                ),

                blockquote: ({
                  children,
                }) => (
                  <blockquote className="my-4 border-l-4 border-blue-500 pl-4 text-slate-500 dark:text-slate-400">
                    {children}
                  </blockquote>
                ),

                a: ({
                  href,
                  children,
                }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline underline-offset-4"
                  >
                    {children}
                  </a>
                ),

                table: ({
                  children,
                }) => (
                  <div className="my-5 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                ),

                th: ({
                  children,
                }) => (
                  <th className="border border-slate-300 bg-slate-100 px-3 py-2 text-left dark:border-slate-700 dark:bg-slate-800">
                    {children}
                  </th>
                ),

                td: ({
                  children,
                }) => (
                  <td className="border border-slate-300 px-3 py-2 dark:border-slate-700">
                    {children}
                  </td>
                ),

                code: ({
                  className,
                  children,
                  ...props
                }) => {
                  const isBlock =
                    Boolean(
                      className,
                    );

                  if (
                    !isBlock
                  ) {
                    return (
                      <code
                        className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:bg-slate-800 dark:text-pink-400"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <code
                      className={`${className ?? ""} font-mono`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                pre: ({
                  children,
                }) => (
                  <pre className="my-5 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                    {children}
                  </pre>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        <button
          type="button"
          onClick={
            copyMessage
          }
          title="Copy response"
          className={`mt-3 flex items-center gap-1.5 text-xs ${
            isUser
              ? "text-blue-100"
              : "text-slate-500 hover:text-blue-500"
          }`}
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
